'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

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
            className="bg-white border border-[#eef2ef] rounded-md p-5 h-28 flex flex-col justify-between  animate-pulse"
          >
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-7 bg-gray-100 rounded w-20 mt-2" />
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

  // Mock mini-sparkline data for that luxury premium feel
  const sparklineData = [
    { v: 30 },
    { v: 45 },
    { v: 35 },
    { v: 60 },
    { v: 40 },
    { v: 70 },
    { v: 65 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Total Payments Premium Capsule */}
      <div className="bg-gradient-to-br from-[#0a2e1f] to-[#041910] rounded-md p-5 text-white flex items-center justify-between h-28  border border-[#0a2e1f] relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="flex flex-col justify-between h-full z-10">
          <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">
            Total payments today
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight">
              {formatCurrency(totalPaymentsToday)}
            </span>
            <div className="flex items-center gap-0.5 text-[#66c987] text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-md">
              <TrendingUp size={10} />
              <span>+{todayTransactions.length}</span>
            </div>
          </div>
        </div>
        <div className="w-24 h-12 absolute bottom-2 right-4 opacity-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="greenSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66c987" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#66c987" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#66c987"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#greenSpark)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="bg-white border border-[#eef2ef] rounded-md p-5 flex items-center justify-between h-28  relative overflow-hidden">
        <div className="flex flex-col justify-between h-full z-10">
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-widest">
            Pending transactions
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl font-bold text-[#081b10] tracking-tight">
              {pendingTransactions}
            </span>
            <button className="flex items-center gap-1 text-[#ea580c] text-[11px] font-bold bg-[#fff7ed] px-2.5 py-0.5 rounded-md border border-[#ffedd5] hover:bg-[#ffedda] transition-colors">
              <AlertTriangle size={11} />
              <span>Review</span>
            </button>
          </div>
        </div>
        <div className="w-24 h-12 absolute bottom-2 right-4 opacity-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{ v: 20 }, { v: 30 }, { v: 25 }, { v: 40 }, { v: 30 }, { v: 35 }]}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#ea580c"
                strokeWidth={1.5}
                fill="none"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exceptions */}
      <div className="bg-white border border-[#eef2ef] rounded-md p-5 flex items-center justify-between h-28  relative overflow-hidden">
        <div className="flex flex-col justify-between h-full z-10">
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-widest">
            Exceptions
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl font-bold text-[#081b10] tracking-tight">{exceptions}</span>
            <button className="flex items-center gap-1 text-[#4f46e5] text-[11px] font-bold bg-[#f5f3ff] px-2.5 py-0.5 rounded-md border border-[#ddd6fe] hover:bg-[#ede9fe] transition-colors">
              <AlertCircle size={11} />
              <span>Fix logs</span>
            </button>
          </div>
        </div>
        <div className="w-24 h-12 absolute bottom-2 right-4 opacity-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{ v: 40 }, { v: 20 }, { v: 50 }, { v: 30 }, { v: 60 }, { v: 45 }]}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#4f46e5"
                strokeWidth={1.5}
                fill="none"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
