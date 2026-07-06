import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập quản trị',
  description: 'Đăng nhập vào khu quản trị WinKey bằng Clerk.'
};

export default function SignInViewPage() {
  return (
    <div className='flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8'>
      <div className='w-full max-w-md'>
        <ClerkSignInForm />
      </div>
    </div>
  );
}
