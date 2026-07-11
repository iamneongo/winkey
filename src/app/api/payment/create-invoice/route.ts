import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { onePayClient } from '@/lib/onepay';
import type { OnePayInvoiceResponse } from '@/lib/onepay/types';

export const runtime = 'nodejs';

/** Build the VietQR image URL from an invoice, validating the VA fields OnePay must return. */
function buildQrUrl(invoice: OnePayInvoiceResponse): string {
  const { va_bank, va_number, amount, description } = invoice;
  if (!va_bank || !va_number || amount == null) {
    throw new Error('OnePay invoice response is missing VA info (va_bank / va_number / amount).');
  }
  return (
    `https://img.vietqr.io/image/${va_bank}-${va_number}-compact.png` +
    `?amount=${amount}&addInfo=${encodeURIComponent(description ?? '')}`
  );
}

/** Fetch the QR image and return it as a base64 data URL. Verifies the response before reading. */
async function fetchQrImage(qrUrl: string): Promise<string> {
  const res = await fetch(qrUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch VietQR image (HTTP ${res.status}).`);
  }
  const buffer = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
}

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

    // Idempotency: if an invoice already exists for this order, return the existing
    // one instead of creating a duplicate — safe for retries after a QR-fetch failure.
    if (order.onepay_invoice_reference) {
      const invoice = await onePayClient.getInvoiceStatus(
        order.onepay_user_reference,
        order.onepay_invoice_reference
      );
      const qrImage = await fetchQrImage(buildQrUrl(invoice));

      return NextResponse.json({
        qrImage,
        invoiceId: invoice.invoice_reference,
        userReference: invoice.user_reference,
        amount: invoice.amount
      });
    }

    const timestamp = Date.now();
    const userRef = `WK-ORD-${orderId}-${timestamp}`;
    const invoiceRef = `INV-${orderId}-${timestamp}`;
    const totalAmount = Number(order.total_amount);
    const description = `Thanh toan don hang ${orderId}`;

    const invoice = await onePayClient.createUserAndInvoice(userRef, invoiceRef, totalAmount, description);

    // Persist the invoice reference before fetching the QR image so a later
    // QR-fetch failure can be retried idempotently (existing-invoice branch above).
    await db.query(
      `UPDATE orders SET
        onepay_user_reference = $1,
        onepay_invoice_reference = $2
       WHERE id = $3`,
      [userRef, invoiceRef, orderId]
    );

    const qrImage = await fetchQrImage(buildQrUrl(invoice));

    return NextResponse.json({
      qrImage,
      invoiceId: invoice.invoice_reference,
      userReference: invoice.user_reference,
      amount: invoice.amount
    });
  } catch (error) {
    console.error('OnePay Create Invoice Error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    const errorDetails = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Không thể tạo thanh toán, vui lòng thử lại',
        // Only surface internal error details outside production (never secrets/raw provider payloads).
        ...(isDev ? { details: errorDetails } : {})
      },
      { status: 502 }
    );
  }
}
