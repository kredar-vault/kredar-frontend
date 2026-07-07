import '@/app/globals.css';
import { ReactNode } from 'react';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import { GeistSans } from 'geist/font/sans';
import { Lexend_Zetta, Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const lexendZetta = Lexend_Zetta({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lexend-zetta',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'KREDAR — Fintech Infrastructure',
  description: 'B2B fintech infrastructure frontend',
  icons: {
    icon: '/images/logo-icon.ico',
    shortcut: '/images/logo-icon.ico',
    apple: '/images/logo-icon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${lexendZetta.variable} ${inter.variable}`}>
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              width: '100%',
              maxWidth: '100vw',
              background: '#081b10',
              color: '#ffffff',
              border: '1px solid #1f2e26',
            },
          }}
          style={{ width: '60%', margin: 'auto' }}
        />
      </body>
    </html>
  );
}
