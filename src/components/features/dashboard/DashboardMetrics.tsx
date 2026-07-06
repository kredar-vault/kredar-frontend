'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[140px] flex flex-col justify-between shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-24 mt-2" />
            <div className="h-4 bg-gray-200 rounded w-28 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate metrics based on live transactions list
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTransactions = transactions.filter((tx: any) => {
    const txDate = tx.createdAt || tx.date || '';
    return txDate.startsWith(todayStr);
  });

  const totalPaymentsToday = todayTransactions.reduce(
    (sum: number, tx: any) => sum + (tx.amount || 0),
    0,
  );

  const pendingTransactions = transactions.filter((tx: any) => {
    const status = (tx.status || '').toLowerCase();
    return status === 'pending';
  }).length;

  const exceptions = transactions.filter((tx: any) => {
    const status = (tx.status || '').toLowerCase();
    return ['failed', 'underpaid', 'reversed'].includes(status);
  }).length;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Total Payments (Dark Theme) */}
      <div className="bg-[#0a2e1f] rounded-2xl p-6 text-white flex flex-col justify-between min-h-[140px] shadow-sm">
        <span className="text-sm font-medium text-white/70">Total payments today</span>
        <div className="mt-2 flex flex-col gap-2">
          <span className="text-3xl font-bold tracking-tight">
            {formatCurrency(totalPaymentsToday)}
          </span>
          <div className="flex items-center gap-1.5 text-[#66c987] text-xs font-semibold">
            <TrendingUp size={14} />
            <span>
              {todayTransactions.length} transaction{todayTransactions.length !== 1 ? 's' : ''}{' '}
              today
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Pending Transactions */}
      <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
        <span className="text-sm font-medium text-[#45504b]">Pending transactions</span>
        <div className="mt-2 flex flex-col gap-2">
          <span className="text-3xl font-bold text-[#081b10] tracking-tight">
            {pendingTransactions}
          </span>
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
          <span className="text-3xl font-bold text-[#081b10] tracking-tight">{exceptions}</span>
          <button className="flex items-center gap-1 text-[#4f46e5] text-xs font-semibold hover:underline mt-1 w-max">
            <AlertCircle size={14} />
            <span>Action required</span>
          </button>
        </div>
      </div>
    </div>
  );
}
