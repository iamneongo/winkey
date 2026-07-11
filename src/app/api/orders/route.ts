import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';
import { orderCreateSchema } from '@/lib/api-schemas';
import { createNotification } from '@/lib/notifications';
import { sendOrderConfirmation } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await ensureDatabaseReady();
    const rawBody = await req.json();
    const parseResult = orderCreateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { customer, items, total, referral_code, clerk_id } = parseResult.data;

    let affiliateId: number | null = null;
    let customerId: number | null = null;

    // 1. Resolve customer — priority: clerk_id > email > create new
    const nameParts = (customer.name ?? '').trim().split(' ');
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const email = customer.email ?? '';

    // 1. Resolve customer
    if (clerk_id) {
      // Check by clerk_id first
      const { rows: clerkRows } = await db.query<{ id: number }>(
        'SELECT id FROM customers WHERE clerk_id = $1',
        [clerk_id]
      );

      if (clerkRows.length > 0) {
        customerId = clerkRows[0].id;
      } else {
        // clerk_id not found, check by email
        const { rows: emailRows } = await db.query<{ id: number }>(
          'SELECT id FROM customers WHERE email = $1',
          [email]
        );
        if (emailRows.length > 0) {
          customerId = emailRows[0].id;
          await db.query(
            `UPDATE customers SET clerk_id = $1, updated_at = NOW() WHERE id = $2`,
            [clerk_id, customerId]
          );
        } else {
          // Neither found, create new
          const { rows } = await db.query<{ id: number }>(
            `INSERT INTO customers (clerk_id, first_name, last_name, email)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [clerk_id, firstName, lastName, email]
          );
          customerId = rows[0].id;
        }
      }
    } else if (email) {
      // Guest: check by email
      const { rows: emailRows } = await db.query<{ id: number }>(
        'SELECT id FROM customers WHERE email = $1',
        [email]
      );
      if (emailRows.length > 0) {
        customerId = emailRows[0].id;
      } else {
        const { rows } = await db.query<{ id: number }>(
          `INSERT INTO customers (clerk_id, first_name, last_name, email)
           VALUES (NULL, $1, $2, $3) RETURNING id`,
          [firstName, lastName, email]
        );
        customerId = rows[0].id;
      }
    }

    // 2. Resolve affiliate
    if (referral_code) {
      const { rows } = await db.query<{ id: number; commission_rate: string }>(
        'SELECT id, commission_rate FROM affiliates WHERE referral_code = $1',
        [referral_code]
      );
      if (rows.length > 0) {
        affiliateId = rows[0].id;
      }
    }

    // 3. Create Order
    const { rows: orderRows } = await db.query<{ id: number }>(
      `INSERT INTO orders (
         customer_id,
         affiliate_id,
         total_amount,
         items,
         customer_name,
         customer_email,
         customer_phone,
         delivery_method,
         shipping_address
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        customerId,
        affiliateId,
        total,
        JSON.stringify(items),
        customer.name.trim(),
        email,
        customer.phone.trim(),
        customer.deliveryMethod,
        customer.shippingAddress?.trim() || null
      ]
    );

    const orderId = orderRows[0].id;

    // 4. Create Commission if affiliate exists
    if (affiliateId) {
      const { rows: affRows } = await db.query<{ commission_rate: string }>(
        'SELECT commission_rate FROM affiliates WHERE id = $1',
        [affiliateId]
      );
      if (affRows.length > 0) {
        const rate = parseFloat(affRows[0].commission_rate);
        const commissionAmount = (total * rate) / 100;

        await db.query(
          `INSERT INTO commissions (affiliate_id, order_id, amount) VALUES ($1, $2, $3)`,
          [affiliateId, orderId, commissionAmount]
        );
      }
    }

    await createNotification({
      type: 'new_order',
      title: `Đơn hàng mới #${orderId}`,
      body: `Khách hàng ${email} vừa đặt đơn hàng trị giá ${total.toLocaleString('vi-VN')} đ.`,
      refId: orderId,
      refType: 'order'
    });

    // fire and forget
    sendOrderConfirmation(email, firstName + ' ' + lastName, orderId, total, items);

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
