import '../styles/globals.css';
import { ReactNode } from 'react';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import { GeistSans } from 'geist/font/sans';
import { Lexend_Zetta, Inter } from 'next/font/google';

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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${lexendZetta.variable} ${inter.variable}`}>
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
