'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f5f5f5] flex">
        <AdminSidebar />
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
