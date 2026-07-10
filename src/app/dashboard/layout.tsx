'use client';

import { ReactNode, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import ProfileCompletionBanner from '@/components/features/dashboard/profilebanner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-100/70 flex">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex flex-1 min-w-0 flex-col">
        <Navbar onToggleMobile={() => setIsMobileOpen((prev) => !prev)} />

        <main
          onClick={() => {
            if (isMobileOpen) setIsMobileOpen(false);
          }}
          className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8"
        >
          <div className="mx-auto w-full max-w-[1440px]">
            <AuthGuard>
              <ProfileCompletionBanner />
              {children}
            </AuthGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
