import type { Metadata } from 'next';
import { Providers }  from '../components/providers';
import { BottomNav }     from '../components/layout/BottomNav';
import { GlobalFooter } from '../components/layout/GlobalFooter';
import { LumenProvider } from '../components/ui/LumenMode';
import '../styles/globals.css';

export const metadata: Metadata = {
  title:       { default: 'Querencia', template: '%s — Querencia' },
  description: 'Nope · Cùi Bắp · LàNo · Tools — Một hệ sinh thái, một tài khoản.',
  themeColor:  '#4a7c59',
  icons: {
    icon:  [
      { url: '/favicon.ico',  sizes: '32x32' },
      { url: '/favicon.svg',  type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <LumenProvider>
            <main style={{ minHeight: '100vh' }}>{children}</main>
            <GlobalFooter />
            <BottomNav />
          </LumenProvider>
        </Providers>
      </body>
    </html>
  );
}
