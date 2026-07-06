import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo tài khoản quản trị',
  description: 'Tạo tài khoản quản trị WinKey bằng Clerk.'
};

export default function SignUpViewPage() {
  return (
    <div className='flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8'>
      <div className='w-full max-w-md'>
        <ClerkSignUpForm />
      </div>
    </div>
  );
}
