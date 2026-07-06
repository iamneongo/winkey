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
    <div className='relative min-h-[100dvh] overflow-hidden bg-background text-foreground'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%)]' />
      <div className='relative mx-auto grid min-h-[100dvh] w-full max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:px-8 lg:py-10'>
        <section className='relative hidden min-h-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 text-white lg:flex lg:flex-col lg:justify-between'>
          <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_38%),radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_36%)]' />
          <InteractiveGridPattern
            className='mask-[radial-gradient(560px_circle_at_38%_28%,white,transparent)] opacity-60'
            squaresClassName='stroke-white/10'
          />

          <div className='relative z-10 flex items-center gap-3 px-8 pt-8'>
            <div className='h-10 w-10 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm' />
            <div>
              <p className='text-sm font-medium text-white/70'>WinKey.vn</p>
              <h2 className='text-2xl font-semibold tracking-tight'>WinKey Workspace</h2>
            </div>
          </div>

          <div className='relative z-10 space-y-6 px-8 pb-10'>
            <div className='inline-flex w-fit rounded-full border border-white/15 bg-white/6 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white/70'>
              Mời thành viên mới
            </div>
            <div className='space-y-4'>
              <h1 className='max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight'>
                Tạo tài khoản mới cho đội vận hành WinKey.
              </h1>
              <p className='max-w-lg text-base leading-7 text-white/72'>
                Dùng trang này để thêm quản trị viên, bán hàng hoặc chăm sóc khách hàng vào cùng
                một workspace Clerk.
              </p>
            </div>
            <div className='grid max-w-xl grid-cols-3 gap-3'>
              {[
                ['Quyền rõ ràng', 'Quản lý thành viên qua organization'],
                ['Đồng bộ team', 'Dùng chung với admin portal'],
                ['Bảo mật tốt', 'Xác thực và phiên theo Clerk']
              ].map(([title, description]) => (
                <div key={title} className='rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-sm'>
                  <div className='text-sm font-semibold text-white'>{title}</div>
                  <div className='mt-1 text-xs leading-5 text-white/62'>{description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='mx-auto flex w-full max-w-[460px] flex-col justify-center lg:max-w-none'>
          <div className='mb-6 space-y-3 text-center lg:text-left'>
            <p className='text-sm font-medium text-muted-foreground'>Tạo tài khoản mới</p>
            <h1 className='text-4xl font-semibold tracking-tight'>WinKey Admin</h1>
            <p className='text-muted-foreground mx-auto max-w-md text-sm leading-6 lg:mx-0'>
              Form Clerk vẫn được giữ nguyên, chỉ làm lại lớp giao diện bao ngoài để sáng sủa,
              cân đối và dễ nhìn hơn.
            </p>
          </div>

          <div className='rounded-[28px] border border-border/70 bg-card/96 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur'>
            <div className='rounded-[22px] bg-background px-2 py-2 sm:px-3'>
              <ClerkSignUpForm />
            </div>
          </div>

          <p className='text-muted-foreground mt-6 text-center text-sm leading-6 lg:text-left'>
            Đã có tài khoản?{' '}
            <Link href='/auth/sign-in' className='font-medium underline underline-offset-4'>
              Đăng nhập tại đây
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
