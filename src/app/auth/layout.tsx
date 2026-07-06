import { Metadata } from 'next';
import { ClerkConfigAlert } from '@/components/clerk-config-alert';
import { isClerkConfigured } from '@/lib/clerk-env';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return (
      <ClerkConfigAlert
        title='Chưa thể mở trang đăng nhập'
        description='WinKey đang dùng Clerk cho khu quản trị. Hãy cấu hình đầy đủ key trước khi đăng nhập hoặc tạo tài khoản admin.'
      />
    );
  }

  return children;
}
