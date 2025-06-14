import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ReactQueryProvider } from '@/app/providers';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Jaehai Opslog',
  description: 'Jaehai Blog & Resume',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <main>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
