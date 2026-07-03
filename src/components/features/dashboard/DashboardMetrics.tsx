'use client';

import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Total Payments (Dark Theme) */}
      <div className="bg-[#0a2e1f] rounded-2xl p-6 text-white flex flex-col justify-between min-h-[140px] shadow-sm">
        <span className="text-sm font-medium text-white/70">Total payments today</span>
        <div className="mt-2 flex flex-col gap-2">
          <span className="text-3xl font-bold tracking-tight">₦540,000</span>
          <div className="flex items-center gap-1.5 text-[#66c987] text-xs font-semibold">
            <TrendingUp size={14} />
            <span>18% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Card 2: Pending Transactions */}
      <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
        <span className="text-sm font-medium text-[#45504b]">Pending transactions</span>
        <div className="mt-2 flex flex-col gap-2">
          <span className="text-3xl font-bold text-[#081b10] tracking-tight">2</span>
          <button className="flex items-center gap-1 text-[#ea580c] text-xs font-semibold hover:underline mt-1 w-max">
            <AlertTriangle size={14} />
            <span>Review now</span>
          </button>
        </div>
      </div>

      {/* Card 3: Exceptions */}
      <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
        <span className="text-sm font-medium text-[#45504b]">Exceptions</span>
        <div className="mt-2 flex flex-col gap-2">
          <span className="text-3xl font-bold text-[#081b10] tracking-tight">5</span>
          <button className="flex items-center gap-1 text-[#4f46e5] text-xs font-semibold hover:underline mt-1 w-max">
            <AlertCircle size={14} />
            <span>Action required</span>
          </button>
        </div>
      </div>
    </div>
  );
}
