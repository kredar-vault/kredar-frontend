'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Turn off layout navigation loading state when route transition is complete
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex relative overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onNavigate={() => setIsNavigating(true)}
      />

      {/* Main content wrapper */}
      <div
        onClick={() => {
          if (isMobileOpen) setIsMobileOpen(false);
        }}
        className="flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out"
      >
        {/* Top Navbar */}
        <Navbar onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="p-6 flex-1">
          {isNavigating ? (
            <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-48" />
                  <div className="h-4 bg-gray-200 rounded w-64" />
                </div>
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>

              {/* Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[140px] flex flex-col justify-between shadow-sm"
                  >
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-8 bg-gray-200 rounded w-24 mt-2" />
                    <div className="h-4 bg-gray-200 rounded w-28 mt-2" />
                  </div>
                ))}
              </div>

              {/* Table/Graph Skeleton */}
              <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="space-y-2.5 pt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2.5 border-b border-[#f0f4f1] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <AuthGuard>{children}</AuthGuard>
          )}
        </main>
      </div>
    </div>
  );
}
