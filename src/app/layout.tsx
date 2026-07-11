import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { DEFAULT_THEME, THEMES } from '@/components/themes/theme.config';
import ThemeProvider from '@/components/themes/theme-provider';
import { isClerkConfigured } from '@/lib/clerk-env';
import { Arimo, Geist_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import { ReferralTracker } from './components/ReferralTracker';
import '../styles/globals.css';
import Script from 'next/script';

const arimo = Arimo({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  metadataBase: new URL('https://winkey.vn'),
  title: {
    default: 'WinKey - Bản quyền Windows & Office chính hãng',
    template: '%s | WinKey'
  },
  description:
    'Mua bản quyền Windows 11, Windows 10, Office 2021, Office 365 chính hãng giá tốt. Kích hoạt online vĩnh viễn, bảo hành trọn đời, giao key nhanh qua email.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://winkey.vn',
    siteName: 'WinKey.vn',
    title: 'WinKey - Bản quyền Windows & Office chính hãng',
    description:
      'Mua bản quyền Windows 11, Windows 10, Office 2021, Office 365 chính hãng giá tốt. Kích hoạt online vĩnh viễn, bảo hành trọn đời.',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WinKey - Bản quyền Windows & Office chính hãng',
    description: 'Mua bản quyền Windows 11, Windows 10, Office 2021, Office 365 chính hãng giá tốt.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isValidTheme = THEMES.some((t) => t.value === activeThemeValue);
  const themeToApply = isValidTheme ? activeThemeValue! : DEFAULT_THEME;
  const clerkEnabled = isClerkConfigured();

  return (
    <html lang='vi' suppressHydrationWarning data-theme={themeToApply}>
      <body className={`${arimo.variable} ${geistMono.variable} bg-background overflow-x-hidden overscroll-none font-sans antialiased`}>
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            forcedTheme='light'
            enableSystem={false}
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={themeToApply} clerkEnabled={clerkEnabled}>
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
        {/*
          beforeInteractive scripts must live in the root layout's <body> (not <head>).
          Placing it in <head> made React client-render a raw <script>, triggering the
          "Encountered a script tag while rendering React component" console error.
        */}
        <Script
          id="theme-color-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </body>
    </html>
  );
}
