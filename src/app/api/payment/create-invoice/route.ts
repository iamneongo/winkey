import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildSepayPaymentCode, buildSepayQrUrl, isSepayConfigured } from '@/lib/sepay';

export const runtime = 'nodejs';

/**
 * Create (or resume) the payment QR for an order.
 *
 * Payments run through SePay: the customer transfers to the shop's bank
 * account with the memo `WINKEY<orderId>`; SePay's webhook
 * (/api/payment/sepay-webhook) then marks the order as paid. The QR is
 * derived deterministically from the order, so this endpoint is idempotent —
 * retrying never creates anything new.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = rows[0];

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status !== 'pending') {
      return NextResponse.json({ error: 'Order is not pending payment' }, { status: 400 });
    }

    if (!isSepayConfigured()) {
      console.error('SePay is not configured (missing SEPAY_BANK_ACCOUNT / SEPAY_BANK_CODE).');
      return NextResponse.json(
        {
          error:
            'Máy chủ chưa cấu hình thanh toán SePay (thiếu SEPAY_BANK_ACCOUNT / SEPAY_BANK_CODE). Vui lòng liên hệ quản trị viên.'
        },
        { status: 500 }
      );
    }

    const totalAmount = Number(order.total_amount);
    const paymentCode = buildSepayPaymentCode(Number(orderId));
    const qrImage = buildSepayQrUrl(Number(orderId), totalAmount);

    // Record the provider + payment reference for admin traceability.
    // (Reuses the existing reference column; safe to re-run on retries.)
    await db.query(
      `UPDATE orders SET
        payment_provider = 'sepay',
        onepay_invoice_reference = $1
       WHERE id = $2`,
      [paymentCode, orderId]
    );

    return NextResponse.json({
      qrImage,
      invoiceId: paymentCode,
      amount: totalAmount
    });
  } catch (error) {
    console.error('SePay create payment QR error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    const errorDetails = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Không thể tạo thanh toán, vui lòng thử lại',
        ...(isDev ? { details: errorDetails } : {})
      },
      { status: 502 }
    );
  }
}
