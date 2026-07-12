import '@/app/globals.css';
import { ReactNode } from 'react';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
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
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="bg-[#F8FAF8] text-[#081B10] antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>

        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: '#081B10',
              color: '#FFFFFF',
              border: '1px solid #1F2E26',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
