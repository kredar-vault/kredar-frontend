'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';
import TransactionDetailsDrawer from '@/components/features/transactions/TransactionDetailsDrawer';
import TransactionsTable, {
  TransactionItem,
} from '@/components/features/transactions/TransactionsTable';
import TransactionsFilters from '@/components/features/transactions/TransactionsFilters';
import { transactionsData } from '@/components/features/transactions/mockTransactions';

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (tx: TransactionItem) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  const filteredTransactions = transactionsData.filter((t) =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#081b10]">Transactions</h1>
          <p className="text-sm text-[#45504b] mt-1">
            Monitor, search, and manage all payment transactions
          </p>
        </div>
      </div>

      {loading ? (
        /* SKELETAL LOADING STATE */
        <>
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

          {/* Skeletons: Table */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-full" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-[#f0f4f1] last:border-0"
                >
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
        </>
      ) : (
        /* ACTUAL RENDERED CONTENTS */
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

          {/* Filter and Table Card */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
            <TransactionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <TransactionsTable
              transactions={filteredTransactions}
              onRowClick={handleRowClick}
              statusColors={statusColors}
            />
          </div>
        </>
      )}

      {/* Transaction Details Slider Drawer */}
      <TransactionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
