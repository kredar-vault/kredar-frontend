'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

export default function DashboardMetrics() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.get('/transactions');
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
    },
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 h-24 animate-pulse"
          >
            <div className="h-3 bg-gray-100 rounded w-28" />
            <div className="h-6 bg-gray-100 rounded w-20 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter((tx: any) => {
    const txDate = tx.createdAt || tx.date || '';
    return txDate.startsWith(todayStr);
  });

  const totalPaymentsToday = todayTransactions.reduce(
    (sum: number, tx: any) => sum + (tx.amount || 0),
    0,
  );
  const pendingTransactions = transactions.filter(
    (tx: any) => (tx.status || '').toLowerCase() === 'pending',
  ).length;
  const exceptions = transactions.filter((tx: any) =>
    ['failed', 'underpaid', 'reversed'].includes((tx.status || '').toLowerCase()),
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Total Payments Today */}
      <div className="bg-gradient-to-br from-[#0a2e1f] to-[#041910] border border-[#0a2e1f] rounded-2xl p-5 flex flex-col gap-1 text-white">
        <span className="text-xs font-medium text-white/60">Total payments today</span>
        <div className="flex items-baseline justify-between gap-2 mt-1">
          <span className="text-2xl font-bold">{formatCurrency(totalPaymentsToday)}</span>
          <div className="flex items-center gap-1 text-[#66c987] text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-md border border-white/5">
            <TrendingUp size={10} />
            <span>+{todayTransactions.length}</span>
          </div>
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-400">Pending transactions</span>
        <span className="text-2xl font-bold text-gray-900 mt-1">{pendingTransactions}</span>
      </div>

      {/* Exceptions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-400">Exceptions</span>
        <span className="text-2xl font-bold text-gray-900 mt-1">{exceptions}</span>
      </div>
    </div>
  );
}
