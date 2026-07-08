import React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  orderId: number;
  customerName: string;
  totalAmount: number;
  items: { name?: string; title?: string; quantity?: number }[];
}

export const OrderConfirmationEmail = ({
  orderId,
  customerName,
  totalAmount,
  items,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Đơn hàng #{orderId} của bạn đã được ghi nhận</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Xác nhận đơn hàng</Heading>
          <Text style={text}>Xin chào {customerName || 'bạn'},</Text>
          <Text style={text}>
            Cảm ơn bạn đã đặt hàng tại WinKey. Đơn hàng <strong>#{orderId}</strong> của bạn đang ở trạng thái chờ thanh toán.
          </Text>
          <Hr style={hr} />
          <Section>
            <Text style={subheading}>Chi tiết đơn hàng:</Text>
            {items.map((item, index) => (
              <Text key={index} style={text}>
                - {item.name || item.title} (x{item.quantity || 1})
              </Text>
            ))}
          </Section>
          <Hr style={hr} />
          <Text style={text}>
            Tổng thanh toán: <strong>{totalAmount.toLocaleString('vi-VN')} đ</strong>
          </Text>
          <Text style={text}>
            Vui lòng thực hiện thanh toán theo hướng dẫn trên website hoặc liên hệ hỗ trợ nếu cần.
          </Text>
          <Text style={footer}>Trân trọng,<br/>Đội ngũ WinKey</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 20px',
};

const subheading = {
  color: '#333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '16px 20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  margin: '32px 20px 0',
};
