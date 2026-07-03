'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function BalancesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Balances</h1>
        <p className="text-sm text-[#45504b] mt-1">Monitor your funds here</p>
      </div>

      {loading ? (
        /* SKELETAL LOADING STATE */
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-8 shadow-sm max-w-4xl space-y-6">
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-28" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-28" />
          </div>
        </div>
      ) : (
        /* Available Balance highlight Card */
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-8 shadow-sm max-w-4xl space-y-6">
          <div className="relative pl-6">
            {/* Vertical green line indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f8b4b] rounded-full" />

            <div className="space-y-2">
              <span className="text-sm font-semibold text-[#45504b]">Available Balance</span>
              <div className="text-4xl font-bold text-[#081b10] tracking-tight">₦250,000</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Deposit Button (Green) */}
            <button className="kredar-btn-primary flex items-center gap-2 h-10 px-5 text-sm font-semibold">
              <Plus size={16} />
              Deposit
            </button>

            {/* Withdraw Button (Black/Dark Green) */}
            <button className="bg-[#0a2e1f] hover:bg-[#061c13] text-white flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold transition-colors">
              <Minus size={16} />
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
