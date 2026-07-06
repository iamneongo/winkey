import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập quản trị',
  description: 'Đăng nhập vào khu quản trị WinKey bằng Clerk.'
};

export default function SignInViewPage() {
  return (
    <div className='grid min-h-[100dvh] place-items-center bg-background px-4 py-8'>
      <div className='flex w-full max-w-md justify-center [&_.cl-rootBox]:mx-auto [&_.cl-rootBox]:w-full [&_.cl-cardBox]:w-full [&_.cl-card]:mx-auto'>
        <ClerkSignInForm />
      </div>
    </div>
  );
}
