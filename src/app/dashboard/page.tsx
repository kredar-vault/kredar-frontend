'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import DashboardMetrics from '@/components/features/dashboard/DashboardMetrics';
import TransactionFlowChart from '@/components/features/dashboard/TransactionFlowChart';
import RecentTransactionsTable from '@/components/features/dashboard/RecentTransactionsTable';
import Button from '@/components/features/landing/Button';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Overview</h1>
          <p className="text-xs text-[#45504b] mt-0.5">
            Welcome. Here's an overview of your account today
          </p>
        </div>
        <Button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0f8b4b] text-white text-xs font-semibold hover:bg-[#0a7040] transition-colors self-start sm:self-auto">
          <Download size={14} />
          Export
        </Button>
      </div>

      {/* SKELETAL LOADING STATE MATCHING ACTUAL STRUCTURE */}
      {loading ? (
        <div className="space-y-6">
          {/* Skeleton: DashboardMetrics (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 h-24 flex flex-col justify-between animate-pulse"
              >
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-7 bg-gray-100 rounded w-20 mt-2" />
              </div>
            ))}
          </div>

          {/* Skeleton: Graph Component */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 h-[380px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-100 rounded animate-pulse w-40" />
              <div className="h-8 bg-gray-100 rounded animate-pulse w-24" />
            </div>
            <div className="h-[260px] bg-gray-50 rounded-xl animate-pulse w-full" />
          </div>

          {/* Skeleton: RecentTransactionsTable */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-36" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-48" />
              </div>
              <div className="h-8 bg-gray-100 rounded animate-pulse w-20" />
            </div>
            <div className="overflow-x-auto pt-2">
              <div className="min-w-[560px] w-full space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3.5 border-b border-gray-50"
                  >
                    <div className="flex items-center gap-3 w-1/4">
                      <div className="w-8 h-8 rounded-md bg-gray-100 animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                        <div className="h-2 bg-gray-100 rounded animate-pulse w-16" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-12" />
                    <div className="h-5 bg-gray-100 rounded-md animate-pulse w-16" />
                    <div className="h-5 bg-gray-100 rounded w-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ACTUAL RENDERED CONTENTS */
        <>
          <DashboardMetrics />
          <TransactionFlowChart />
          <RecentTransactionsTable />
        </>
      )}
    </div>
  );
}
