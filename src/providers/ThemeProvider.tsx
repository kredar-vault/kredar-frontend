'use client';
import { ReactNode } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-surface text-kredar-900">{children}</div>;
}
