import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import React from 'react';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { PaymentSuccessEmail } from '@/emails/PaymentSuccessEmail';
import { AffiliateWelcomeEmail } from '@/emails/AffiliateWelcomeEmail';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ template: string }> }) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { template } = await params;

  let component;

  switch (template) {
    case 'order-confirmation':
      component = React.createElement(OrderConfirmationEmail, {
        orderId: 1001,
        customerName: 'Nguyễn Văn A',
        totalAmount: 250000,
        items: [{ title: 'Windows 11 Pro', quantity: 1 }]
      });
      break;
    case 'payment-success':
      component = React.createElement(PaymentSuccessEmail, {
        orderId: 1001,
        customerName: 'Nguyễn Văn A',
        totalAmount: 250000,
        licenseKey: 'XXXXX-YYYYY-ZZZZZ-AAAAA-BBBBB',
        productName: 'Windows 11 Pro'
      });
      break;
    case 'affiliate-welcome':
      component = React.createElement(AffiliateWelcomeEmail, {
        customerName: 'Nguyễn Văn A',
        referralCode: 'NGUYENVA'
      });
      break;
    default:
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const html = await render(component);

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
