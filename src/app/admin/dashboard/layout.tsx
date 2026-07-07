'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f7faf6] flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto min-w-0">
          <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
