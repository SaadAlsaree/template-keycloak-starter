import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/fonts';
import { DEFAULT_THEME } from '@/components/themes/theme.config';
import ThemeProvider from '@/components/themes/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import '../styles/globals.css';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Diwan Platform',
  description: 'Diwan postal trading platform',
  icons: {
    icon: '/logoINSS.png'
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const themeToApply = activeThemeValue || DEFAULT_THEME;
  const session = await auth();

  return (
    <html
      suppressHydrationWarning
      data-theme={themeToApply}
      className={fontVariables}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Set meta theme color
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                
                // Suppress specific annoying third-party development logs
                const originalLog = console.log;
                const originalInfo = console.info;
                console.log = function(...args) {
                  if (typeof args[0] === 'string' && (args[0].includes('i18next is maintained') || args[0].includes('locize') || args[0].includes('[HMR]'))) return;
                  originalLog.apply(console, args);
                };
                console.info = function(...args) {
                  if (typeof args[0] === 'string' && (args[0].includes('React DevTools') || args[0].includes('[HMR]'))) return;
                  originalInfo.apply(console, args);
                };
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-x-hidden overscroll-none font-sans antialiased'
        )}
      >
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <SessionProvider session={session}>
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
                {children}
              </Providers>
            </ThemeProvider>
          </NuqsAdapter>
        </SessionProvider>
      </body>
    </html>
  );
}
