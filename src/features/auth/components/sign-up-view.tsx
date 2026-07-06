import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Link from 'next/link';
import { InteractiveGridPattern } from './interactive-grid';

export const metadata: Metadata = {
  title: 'Tạo tài khoản quản trị',
  description: 'Tạo tài khoản quản trị WinKey bằng Clerk.'
};

export default function SignUpViewPage() {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col p-10 lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-sidebar' />
        <div className='text-sidebar-foreground relative z-20 flex items-center text-lg font-medium'>
          WinKey Workspace
        </div>
        <InteractiveGridPattern
          className='mask-[radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[0%] h-full skew-y-12'
        />
        <div className='text-sidebar-foreground relative z-20 mt-auto space-y-3'>
          <h2 className='text-3xl font-semibold'>Tạo tài khoản cho đội vận hành</h2>
          <p className='text-sidebar-foreground/80 max-w-md text-sm leading-6'>
            Dùng trang này khi cần mời thêm quản trị viên, nhân sự bán hàng hoặc chăm sóc khách hàng vào hệ thống WinKey.
          </p>
        </div>
      </div>

      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='space-y-2 text-center'>
            <p className='text-muted-foreground text-sm'>Tạo tài khoản mới</p>
            <h1 className='text-3xl font-semibold tracking-tight'>WinKey Admin</h1>
          </div>

          <ClerkSignUpForm />

          <p className='text-muted-foreground px-8 text-center text-sm'>
            Đã có tài khoản?{' '}
            <Link href='/auth/sign-in' className='underline underline-offset-4'>
              Đăng nhập tại đây
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
