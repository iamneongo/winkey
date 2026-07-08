import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { PaymentSuccessEmail } from '@/emails/PaymentSuccessEmail';
import { AffiliateWelcomeEmail } from '@/emails/AffiliateWelcomeEmail';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
const fromEmail = process.env.EMAIL_FROM || 'noreply@winkey.vn';

export async function sendOrderConfirmation(email: string, customerName: string, orderId: number, totalAmount: number, items: { name?: string; title?: string; quantity?: number }[]) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Mocking email send for order confirmation.');
    return;
  }
  
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Xác nhận đơn hàng #${orderId}`,
      react: React.createElement(OrderConfirmationEmail, {
        orderId,
        customerName,
        totalAmount,
        items
      })
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

export async function sendPaymentSuccess(email: string, customerName: string, orderId: number, totalAmount: number, licenseKey: string, productName: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Mocking email send for payment success.');
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Thanh toán thành công đơn hàng #${orderId}`,
      react: React.createElement(PaymentSuccessEmail, {
        orderId,
        customerName,
        totalAmount,
        licenseKey,
        productName
      })
    });
  } catch (error) {
    console.error('Failed to send payment success email:', error);
  }
}

export async function sendAffiliateWelcome(email: string, customerName: string, referralCode: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Mocking email send for affiliate welcome.');
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Chào mừng Cộng tác viên WinKey`,
      react: React.createElement(AffiliateWelcomeEmail, {
        customerName,
        referralCode
      })
    });
  } catch (error) {
    console.error('Failed to send affiliate welcome email:', error);
  }
}
