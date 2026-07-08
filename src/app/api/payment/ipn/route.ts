import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySignature } from '@/lib/onepay/signing';
import { onePayClient } from '@/lib/onepay';
import type { Pool } from 'pg';
import { createNotification } from '@/lib/notifications';
import { sendPaymentSuccess } from '@/lib/email';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const headersObj: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    const secretKey = process.env.ONEPAY_SECRET_KEY;
    const clientId = process.env.ONEPAY_CLIENT_ID;

    if (!secretKey || !clientId) {
      console.error('[IPN] Missing ONEPAY configuration');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const isVerified = verifySignature({
      method: request.method,
      url: request.url,
      body: rawBody,
      receivedHeaders: headersObj,
      secretKey,
      clientId,
    });

    if (!isVerified) {
      console.error('[IPN] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const { fund_transfer_id, bank_txn_ref, invoice, user } = payload;
    const amount = Number(invoice?.amount);

    if (!fund_transfer_id || !user?.reference) {
      console.error('[IPN] Invalid payload structure');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 2. Check idempotent
    const checkTxResult = await db.query('SELECT id FROM payment_transactions WHERE fund_transfer_id = $1', [fund_transfer_id]);
    if (checkTxResult.rows.length > 0) {
      console.log(`[IPN] Already processed fund_transfer_id=${fund_transfer_id}`);
      return NextResponse.json({ message: 'Idempotent response' });
    }

    const client = await (db as unknown as Pool).connect();

    try {
      await client.query('BEGIN');

      // 3. Find order
      const orderRes = await client.query('SELECT * FROM orders WHERE onepay_user_reference = $1 FOR UPDATE', [user.reference]);
      const order = orderRes.rows[0];

      if (!order) {
        throw new Error(`Order not found for user_reference=${user.reference}`);
      }

      // 4. Check amount
      if (Number(order.total_amount) !== amount) {
        throw new Error(`Amount mismatch. Order total=${order.total_amount}, IPN amount=${amount}`);
      }

      // 5. INSERT payment_transactions
      await client.query(
        `INSERT INTO payment_transactions (order_id, fund_transfer_id, bank_txn_ref, amount, raw_payload) 
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, fund_transfer_id, bank_txn_ref, amount, JSON.stringify(payload)]
      );

      // 6. UPDATE orders SET payment_status = 'paid', paid_at = NOW()
      await client.query(
        `UPDATE orders SET payment_status = 'paid', paid_at = NOW() WHERE id = $1`,
        [order.id]
      );

      // 7. Gán license key (Task 07 logic)
      // Extract first item to find product_id (Assuming 1 product per order in current implementation flow based on earlier context)
      // Wait, let's parse items from order.items
      const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      let productId = null;
      if (Array.isArray(orderItems) && orderItems.length > 0 && orderItems[0].id) {
        productId = orderItems[0].id;
      }

      if (productId) {
        const keyRes = await client.query(
          `SELECT id FROM license_keys WHERE product_id = $1 AND status = 'available' LIMIT 1 FOR UPDATE SKIP LOCKED`,
          [productId]
        );

        if (keyRes.rows.length > 0) {
          const keyId = keyRes.rows[0].id;
          await client.query(
            `UPDATE license_keys SET status = 'used', order_id = $1, assigned_at = NOW() WHERE id = $2`,
            [order.id, keyId]
          );
          await client.query(
            `UPDATE orders SET license_key_id = $1 WHERE id = $2`,
            [keyId, order.id]
          );
        } else {
          // No keys available
          await createNotification({
            type: 'low_key_stock',
            title: `Hết key sản phẩm`,
            body: `Không còn key cho sản phẩm ID ${productId} để giao cho đơn hàng #${order.id}.`,
            refId: order.id,
            refType: 'order'
          });
        }
      }

      // 8. Handle Affiliate Commission
      if (order.affiliate_id) {
        const commissionRate = 10; // Default 10%
        const commission = amount * (commissionRate / 100);

        await client.query(
          `UPDATE affiliates SET balance = balance + $1 WHERE id = $2`,
          [commission, order.affiliate_id]
        );

        // Find existing commission row or insert? Wait, the catalog getCommissions says we have commissions table.
        // Assuming create order didn't create commission row, we insert it here, or update if it exists.
        // We will just INSERT for simplicity because `orders` insert doesn't seem to insert commissions.
        const existingComm = await client.query(`SELECT id FROM commissions WHERE order_id = $1`, [order.id]);
        if (existingComm.rows.length === 0) {
           await client.query(
            `INSERT INTO commissions (affiliate_id, order_id, amount, status) VALUES ($1, $2, $3, 'approved')`,
            [order.affiliate_id, order.id, commission]
          );
        } else {
           await client.query(
            `UPDATE commissions SET status = 'approved' WHERE order_id = $1`,
            [order.id]
          );
        }
      }

      await createNotification({
        type: 'order_paid',
        title: `Đơn hàng #${order.id} đã thanh toán`,
        body: `Thanh toán thành công ${amount.toLocaleString('vi-VN')} đ.`,
        refId: order.id,
        refType: 'order'
      });

      // Fetch customer details for email
      const customerRes = await client.query('SELECT first_name, last_name, email FROM customers WHERE id = $1', [order.customer_id]);
      const customer = customerRes.rows[0];

      let assignedLicenseKey = '';
      if (order.license_key_id) {
        const keyRes2 = await client.query('SELECT key_value FROM license_keys WHERE id = $1', [order.license_key_id]);
        if (keyRes2.rows.length > 0) assignedLicenseKey = keyRes2.rows[0].key_value;
      }

      const productName = (Array.isArray(orderItems) && orderItems.length > 0) ? (orderItems[0].name || orderItems[0].title) : 'Sản phẩm';

      if (customer && customer.email) {
        sendPaymentSuccess(customer.email, customer.first_name + ' ' + customer.last_name, order.id, amount, assignedLicenseKey, productName);
      }

      await client.query('COMMIT');

      // 9. Disable VA
      try {
        await onePayClient.disableUser(user.reference);
      } catch (e) {
        console.error(`[IPN] Failed to disable VA for user ${user.reference}:`, e);
      }

      console.log(`[IPN] Processed successfully for order ${order.id}`);

      return NextResponse.json({ message: 'Success' });
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[IPN] Process error:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
