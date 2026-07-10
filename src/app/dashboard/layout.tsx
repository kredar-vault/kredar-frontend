'use client';

import { ReactNode, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import ProfileCompletionBanner from '@/components/features/dashboard/profilebanner';
import { useTenantProfile } from '@/api/tenant/hooks';
import BusinessTypeModal from '@/components/features/dashboard/BusinessTypemodal';
import { getPendingBusinessType } from '@/lib/cookies';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: profile, isLoading: profileLoading } = useTenantProfile();

  const needsBusinessType =
    !profileLoading && profile && !profile.businessType && !getPendingBusinessType();

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
      {needsBusinessType && <BusinessTypeModal />}
    </div>
  );
}
