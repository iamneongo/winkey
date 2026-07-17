import { NextRequest, NextResponse } from 'next/server';
import type { Pool } from 'pg';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';
import { sendPaymentSuccess } from '@/lib/email';
import { extractOrderIdFromTransaction, isValidSepayWebhookAuth } from '@/lib/sepay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Payload SePay sends for each bank transaction (see docs.sepay.vn). */
type SepayWebhookPayload = {
  id?: number;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  code?: string | null;
  content?: string | null;
  transferType?: 'in' | 'out';
  transferAmount?: number;
  referenceCode?: string | null;
  description?: string | null;
};

/** Resolve the products.id for the first order item (items store the product slug). */
async function resolveProductDbId(
  client: { query: Pool['query'] },
  item: { product_id?: unknown; id?: unknown } | undefined
): Promise<number | null> {
  const raw = item?.product_id ?? item?.id;
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string' || raw.length === 0) return null;
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);

  const res = await client.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [raw]);
  return res.rows[0]?.id ?? null;
}

export async function POST(request: NextRequest) {
  try {
    if (!isValidSepayWebhookAuth(request.headers.get('authorization'))) {
      console.error('[SePay] Invalid webhook API key');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await request.json()) as SepayWebhookPayload;

    // Only incoming transfers can pay for orders.
    if (payload.transferType !== 'in') {
      return NextResponse.json({ success: true, message: 'Ignored (not an incoming transfer)' });
    }

    const amount = Number(payload.transferAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    const orderId = extractOrderIdFromTransaction({
      code: payload.code,
      content: payload.content
    });

    if (!orderId) {
      // Not a WinKey order payment — acknowledge so SePay doesn't retry.
      console.log('[SePay] No order code found in transaction content:', payload.content);
      return NextResponse.json({ success: true, message: 'No matching order code' });
    }

    // Idempotency: each SePay transaction is processed at most once.
    const fundTransferId = `sepay-${payload.id ?? payload.referenceCode ?? `${orderId}-${amount}`}`;
    const existingTx = await db.query(
      'SELECT id FROM payment_transactions WHERE fund_transfer_id = $1',
      [fundTransferId]
    );
    if (existingTx.rows.length > 0) {
      console.log(`[SePay] Already processed transaction ${fundTransferId}`);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    const client = await (db as unknown as Pool).connect();

    try {
      await client.query('BEGIN');

      const orderRes = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
      const order = orderRes.rows[0];

      if (!order) {
        await client.query('ROLLBACK');
        console.error(`[SePay] Order #${orderId} not found`);
        return NextResponse.json({ success: false, message: 'Order not found' });
      }

      if (order.payment_status === 'paid') {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: true, message: 'Order already paid' });
      }

      const orderTotal = Number(order.total_amount);
      if (amount < orderTotal) {
        // Underpayment: record nothing as paid, but alert the admin.
        await client.query('ROLLBACK');
        console.error(
          `[SePay] Amount mismatch for order #${orderId}: expected ${orderTotal}, received ${amount}`
        );
        await createNotification({
          type: 'order_failed',
          title: `Thanh toán thiếu cho đơn #${orderId}`,
          body: `Khách chuyển ${amount.toLocaleString('vi-VN')} đ nhưng đơn cần ${orderTotal.toLocaleString('vi-VN')} đ (ref: ${payload.referenceCode ?? 'n/a'}).`,
          refId: Number(orderId),
          refType: 'order'
        });
        return NextResponse.json({ success: false, message: 'Amount mismatch' });
      }

      // 1. Record the transaction
      await client.query(
        `INSERT INTO payment_transactions (order_id, fund_transfer_id, bank_txn_ref, amount, raw_payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, fundTransferId, payload.referenceCode ?? null, amount, JSON.stringify(payload)]
      );

      // 2. Mark the order paid
      await client.query(
        `UPDATE orders SET payment_status = 'paid', payment_provider = 'sepay', paid_at = NOW() WHERE id = $1`,
        [order.id]
      );

      // 3. Assign a license key for the purchased product
      const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      const firstItem = Array.isArray(orderItems) ? orderItems[0] : undefined;
      const productId = await resolveProductDbId(client, firstItem);

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
          await client.query(`UPDATE orders SET license_key_id = $1 WHERE id = $2`, [keyId, order.id]);
          order.license_key_id = keyId;
        } else {
          await createNotification({
            type: 'low_key_stock',
            title: `Hết key sản phẩm`,
            body: `Không còn key cho sản phẩm ID ${productId} để giao cho đơn hàng #${order.id}.`,
            refId: order.id,
            refType: 'order'
          });
        }
      }

      // 4. Approve the affiliate commission (created at order time) and credit balance
      if (order.affiliate_id) {
        const commRes = await client.query(
          `SELECT id, amount, status FROM commissions WHERE order_id = $1`,
          [order.id]
        );

        let commissionAmount: number;
        if (commRes.rows.length > 0) {
          commissionAmount = Number(commRes.rows[0].amount);
          if (commRes.rows[0].status !== 'approved' && commRes.rows[0].status !== 'paid') {
            await client.query(`UPDATE commissions SET status = 'approved' WHERE order_id = $1`, [
              order.id
            ]);
            await client.query(`UPDATE affiliates SET balance = balance + $1 WHERE id = $2`, [
              commissionAmount,
              order.affiliate_id
            ]);
          }
        } else {
          const rateRes = await client.query(
            `SELECT commission_rate FROM affiliates WHERE id = $1`,
            [order.affiliate_id]
          );
          const rate = Number(rateRes.rows[0]?.commission_rate ?? 10);
          commissionAmount = (orderTotal * rate) / 100;
          await client.query(
            `INSERT INTO commissions (affiliate_id, order_id, amount, status) VALUES ($1, $2, $3, 'approved')`,
            [order.affiliate_id, order.id, commissionAmount]
          );
          await client.query(`UPDATE affiliates SET balance = balance + $1 WHERE id = $2`, [
            commissionAmount,
            order.affiliate_id
          ]);
        }
      }

      await createNotification({
        type: 'order_paid',
        title: `Đơn hàng #${order.id} đã thanh toán`,
        body: `Thanh toán thành công ${amount.toLocaleString('vi-VN')} đ qua SePay.`,
        refId: order.id,
        refType: 'order'
      });

      // 5. Payment-success email (with license key when assigned)
      const customerRes = await client.query(
        'SELECT first_name, last_name, email FROM customers WHERE id = $1',
        [order.customer_id]
      );
      const customer = customerRes.rows[0];

      let assignedLicenseKey = '';
      if (order.license_key_id) {
        const keyRes2 = await client.query('SELECT key_value FROM license_keys WHERE id = $1', [
          order.license_key_id
        ]);
        if (keyRes2.rows.length > 0) assignedLicenseKey = keyRes2.rows[0].key_value;
      }

      const productName =
        Array.isArray(orderItems) && orderItems.length > 0
          ? orderItems[0].name || orderItems[0].title
          : 'Sản phẩm';

      if (customer && customer.email) {
        sendPaymentSuccess(
          customer.email,
          `${customer.first_name} ${customer.last_name}`,
          order.id,
          amount,
          assignedLicenseKey,
          productName
        );
      }

      await client.query('COMMIT');

      console.log(`[SePay] Order #${order.id} marked as paid (tx ${fundTransferId})`);
      return NextResponse.json({ success: true });
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SePay] Webhook error:', msg);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
