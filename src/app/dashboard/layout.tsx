import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Providers from '@/components/layout/providers';
import ThemeProvider from '@/components/themes/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { DEFAULT_THEME, THEMES } from '@/components/themes/theme.config';
import '@/styles/theme.css';

export const metadata: Metadata = {
  title: 'WinKey Admin Dashboard',
  description: 'WinKey Administrator Panel',
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isValidTheme = THEMES.some((t) => t.value === activeThemeValue);
  const themeToApply = isValidTheme ? activeThemeValue! : DEFAULT_THEME;

  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <Providers activeThemeValue={themeToApply}>
          <Toaster />
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
        </Providers>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
