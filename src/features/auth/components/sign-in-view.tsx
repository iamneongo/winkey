import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Link from 'next/link';
import { InteractiveGridPattern } from './interactive-grid';

export const metadata: Metadata = {
  title: 'Đăng nhập quản trị',
  description: 'Đăng nhập vào khu quản trị WinKey bằng Clerk.'
};

export default function SignInViewPage() {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col p-10 lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-sidebar' />
        <div className='text-sidebar-foreground relative z-20 flex items-center text-lg font-medium'>
          WinKey Admin
        </div>
        <InteractiveGridPattern
          className='mask-[radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[0%] h-full skew-y-12'
        />
        <div className='text-sidebar-foreground relative z-20 mt-auto space-y-3'>
          <h2 className='text-3xl font-semibold'>Khu quản trị WinKey</h2>
          <p className='text-sidebar-foreground/80 max-w-md text-sm leading-6'>
            Quản lý catalog, người dùng nội bộ, nội dung storefront và các yêu cầu hỗ trợ khách hàng trên cùng một hệ thống.
          </p>
        </div>
      </div>

      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='space-y-2 text-center'>
            <p className='text-muted-foreground text-sm'>Đăng nhập để vào khu quản trị</p>
            <h1 className='text-3xl font-semibold tracking-tight'>WinKey Admin</h1>
          </div>

          <ClerkSignInForm />

          <p className='text-muted-foreground px-8 text-center text-sm'>
            Sau khi đăng nhập thành công, bạn sẽ được chuyển thẳng về{' '}
            <Link href='/admin' className='underline underline-offset-4'>
              khu quản trị WinKey
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
