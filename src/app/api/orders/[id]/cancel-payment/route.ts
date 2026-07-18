import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * User pressed "Hủy thanh toán" on the QR screen.
 *
 * This cancels the PAYMENT attempt (payment_status: pending -> cancelled), not
 * the order record itself — the order stays visible in admin/customer history.
 * If money still arrives later, the SePay webhook will mark the order as paid,
 * so no real payment can be lost by cancelling here.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, error: 'Invalid order ID' }, { status: 400 });
    }

    // Only a pending payment can be cancelled — never touch paid/failed orders.
    const { rows } = await db.query<{ id: number; payment_status: string; total_amount: string }>(
      `UPDATE orders
       SET payment_status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND payment_status = 'pending'
       RETURNING id, payment_status, total_amount`,
      [orderId]
    );

    if (rows.length === 0) {
      const existing = await db.query<{ payment_status: string }>(
        'SELECT payment_status FROM orders WHERE id = $1',
        [orderId]
      );
      if (existing.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      if (existing.rows[0].payment_status === 'cancelled') {
        // Idempotent: already cancelled.
        return NextResponse.json({ success: true, status: 'cancelled' });
      }
      return NextResponse.json(
        { success: false, error: 'Order is not pending payment' },
        { status: 409 }
      );
    }

    await createNotification({
      type: 'order_cancelled',
      title: `Đơn hàng #${orderId} đã hủy thanh toán`,
      body: `Khách hàng đã bấm hủy thanh toán cho đơn trị giá ${Number(rows[0].total_amount).toLocaleString('vi-VN')} đ.`,
      refId: orderId,
      refType: 'order'
    });

    return NextResponse.json({ success: true, status: 'cancelled' });
  } catch (error: unknown) {
    console.error('Cancel payment error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
