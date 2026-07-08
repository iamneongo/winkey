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

interface PaymentSuccessEmailProps {
  orderId: number;
  customerName: string;
  totalAmount: number;
  licenseKey: string;
  productName: string;
}

export const PaymentSuccessEmail = ({
  orderId,
  customerName,
  totalAmount,
  licenseKey,
  productName,
}: PaymentSuccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thanh toán thành công đơn hàng #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thanh toán thành công</Heading>
          <Text style={text}>Xin chào {customerName || 'bạn'},</Text>
          <Text style={text}>
            Cảm ơn bạn đã mua hàng tại WinKey. Đơn hàng <strong>#{orderId}</strong> trị giá {totalAmount.toLocaleString('vi-VN')} đ của bạn đã được thanh toán thành công.
          </Text>
          <Hr style={hr} />
          <Section>
            <Text style={subheading}>Sản phẩm: {productName}</Text>
            {licenseKey ? (
              <div style={keyContainer}>
                <Text style={keyLabel}>License Key của bạn:</Text>
                <Text style={keyValue}>{licenseKey}</Text>
              </div>
            ) : (
              <Text style={text}>
                Sản phẩm của bạn đang được xử lý. Vui lòng kiểm tra lại trong tài khoản sau.
              </Text>
            )}
          </Section>
          <Hr style={hr} />
          <Text style={text}>
            Hướng dẫn kích hoạt: Vui lòng truy cập trang Hướng dẫn sử dụng trên website WinKey để xem chi tiết cách cài đặt và nhập mã kích hoạt.
          </Text>
          <Text style={footer}>Trân trọng,<br/>Đội ngũ WinKey</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentSuccessEmail;

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

const keyContainer = {
  backgroundColor: '#f8fafc',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 20px',
  border: '1px solid #e2e8f0',
};

const keyLabel = {
  color: '#64748b',
  fontSize: '14px',
  marginBottom: '8px',
};

const keyValue = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0',
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
