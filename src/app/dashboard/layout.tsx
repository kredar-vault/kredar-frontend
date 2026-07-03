'use client';

import { ReactNode, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex relative overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out">
        {/* Top Navbar */}
        <Navbar onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="p-6 flex-1">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
