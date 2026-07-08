import React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Text,
} from '@react-email/components';

interface AffiliateWelcomeEmailProps {
  customerName: string;
  referralCode: string;
}

export const AffiliateWelcomeEmail = ({
  customerName,
  referralCode,
}: AffiliateWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Chào mừng bạn đến với chương trình Cộng tác viên WinKey</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Xin chào Cộng tác viên mới</Heading>
          <Text style={text}>Xin chào {customerName || 'bạn'},</Text>
          <Text style={text}>
            Chúc mừng bạn đã đăng ký thành công chương trình Cộng tác viên của WinKey.
          </Text>
          
          <div style={keyContainer}>
            <Text style={keyLabel}>Mã giới thiệu của bạn là:</Text>
            <Text style={keyValue}>{referralCode}</Text>
          </div>

          <Text style={text}>
            Bạn có thể dùng mã này để chia sẻ cho khách hàng. Khi khách hàng mua sản phẩm với mã này, bạn sẽ nhận được hoa hồng theo chính sách hiện hành (mặc định 10%).
          </Text>
          
          <Text style={footer}>Trân trọng,<br/>Đội ngũ WinKey</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AffiliateWelcomeEmail;

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

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  margin: '32px 20px 0',
};
