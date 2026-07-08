import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const responseData = { ...order };
    if (responseData.payment_status !== 'paid') {
      delete responseData.license_key;
    }

    return NextResponse.json({
      success: true,
      order: responseData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Get order error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
