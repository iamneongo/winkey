import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'WinKey Admin | Đăng nhập',
  description: 'Đăng nhập vào khu quản trị WinKey.'
};

export default async function Page() {
  return <SignInViewPage />;
}
