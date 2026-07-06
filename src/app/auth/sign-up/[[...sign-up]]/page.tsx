import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'WinKey Admin | Tạo tài khoản',
  description: 'Tạo tài khoản quản trị WinKey.'
};

export default async function Page() {
  return <SignUpViewPage />;
}
