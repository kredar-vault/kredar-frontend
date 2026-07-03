'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import DashboardMetrics from '@/components/features/dashboard/DashboardMetrics';
import TransactionFlowChart from '@/components/features/dashboard/TransactionFlowChart';
import RecentTransactionsTable from '@/components/features/dashboard/RecentTransactionsTable';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#081b10]">Overview</h1>
          <p className="text-sm text-[#45504b] mt-1">
            Welcome. Here's an overview of your account today
          </p>
        </div>
        <button className="kredar-btn-primary flex items-center gap-2 h-10 px-4 text-xs font-semibold">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* SKELETAL LOADING STATE */}
      {loading ? (
        <div className="space-y-6">
          {/* Skeletons: Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[140px] flex flex-col justify-between shadow-sm"
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24 mt-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28 mt-2" />
              </div>
            ))}
          </div>

          {/* Skeleton: Graph */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm h-[380px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            </div>
            <div className="h-[260px] bg-gray-100 rounded-xl animate-pulse w-full" />
          </div>

          {/* Skeleton: Table */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
                </div>
              ))}
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
