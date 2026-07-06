import KBar from '@/components/kbar';
import { ClerkConfigAlert } from '@/components/clerk-config-alert';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@clerk/nextjs/server';
import { isClerkConfigured } from '@/lib/clerk-env';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'WinKey Admin Dashboard',
  description: 'WinKey Administrator Panel',
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return (
      <ClerkConfigAlert
        title='Khu quản trị chưa sẵn sàng'
        description='Thiếu biến môi trường Clerk nên WinKey chưa thể xác thực người dùng quản trị.'
      />
    );
  }

  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin');
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <InfobarProvider defaultOpen={false}>
            {children}
            <InfoSidebar side='right' />
          </InfobarProvider>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
