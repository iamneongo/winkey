import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { onePayClient } from '@/lib/onepay';

export const runtime = 'nodejs';

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

    // Check idempotency
    if (order.onepay_invoice_reference) {
      // Return existing QR and info
      const invoice = await onePayClient.getInvoiceStatus(order.onepay_user_reference, order.onepay_invoice_reference);
      const qrUrl = `https://img.vietqr.io/image/${invoice.va_bank}-${invoice.va_number}-compact.png?amount=${invoice.amount}&addInfo=${invoice.description}`;
      const qrImageRes = await fetch(qrUrl);
      const qrBuffer = await qrImageRes.arrayBuffer();
      const qrImage = `data:image/png;base64,${Buffer.from(qrBuffer).toString('base64')}`;
      
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

    await db.query(
      `UPDATE orders SET 
        onepay_user_reference = $1, 
        onepay_invoice_reference = $2 
       WHERE id = $3`,
      [userRef, invoiceRef, orderId]
    );

    const qrUrl = `https://img.vietqr.io/image/${invoice.va_bank}-${invoice.va_number}-compact.png?amount=${invoice.amount}&addInfo=${invoice.description}`;
    const qrImageRes = await fetch(qrUrl);
    const qrBuffer = await qrImageRes.arrayBuffer();
    const qrImage = `data:image/png;base64,${Buffer.from(qrBuffer).toString('base64')}`;

    return NextResponse.json({
      qrImage,
      invoiceId: invoice.invoice_reference,
      userReference: invoice.user_reference,
      amount: invoice.amount
    });

  } catch (error) {
    console.error('OnePay Create Invoice Error:', error);
    const errorDetails = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Không thể tạo thanh toán, vui lòng thử lại', details: errorDetails }, { status: 502 });
  }
}
