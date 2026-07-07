'use client';

import { ChevronDown, Filter } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function TransactionFlowChart() {
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

  const chartData = [
    { name: 'Jan', Incoming: 0, Outgoing: 0 },
    { name: 'Feb', Incoming: 0, Outgoing: 0 },
    { name: 'Mar', Incoming: 0, Outgoing: 0 },
    { name: 'Apr', Incoming: 0, Outgoing: 0 },
    { name: 'May', Incoming: 0, Outgoing: 0 },
    { name: 'Jun', Incoming: 0, Outgoing: 0 },
    { name: 'Jul', Incoming: 0, Outgoing: 0 },
    { name: 'Aug', Incoming: 0, Outgoing: 0 },
    { name: 'Sep', Incoming: 0, Outgoing: 0 },
    { name: 'Oct', Incoming: 0, Outgoing: 0 },
    { name: 'Nov', Incoming: 0, Outgoing: 0 },
    { name: 'Dec', Incoming: 0, Outgoing: 0 },
  ];

  transactions.forEach((tx: any) => {
    const txDate = tx.createdAt || tx.date;
    if (!txDate) return;
    const monthIndex = new Date(txDate).getMonth();
    if (monthIndex >= 0 && monthIndex < 12) {
      const amount = tx.amount || 0;
      const isOutgoing =
        (tx.type || '').toLowerCase().includes('transfer') ||
        (tx.type || '').toLowerCase().includes('payout');
      if (isOutgoing) chartData[monthIndex].Outgoing += amount;
      else chartData[monthIndex].Incoming += amount;
    }
  });

  return (
    <div className="bg-white border border-[#eef2ef] rounded-md p-6  space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#081b10]">Transaction flow</h3>
          <p className="text-[11px] text-[#667085] font-medium mt-0.5">
            Analytics breakdown for your ledger flow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="h-8 text-[11px] font-semibold text-[#45504b] bg-[#f7faf6] pl-3 pr-7 rounded-lg border border-[#eef2ef] appearance-none cursor-pointer outline-none">
              <option>This Year</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <button className="h-8 px-2.5 bg-white border border-[#eef2ef] rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-[#45504b] hover:bg-[#f7faf6] transition-colors">
            <Filter size={12} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full">
        {isLoading ? (
          <div className="w-full h-full bg-[#f7faf6]/60 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f8b4b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f8b4b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f4f1" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#667085', fontSize: 10, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#667085', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(v) => (v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl border border-[#eef2ef] shadow-md text-xs space-y-1.5 font-medium">
                        {payload.map((entry: any) => (
                          <p key={entry.name} style={{ color: entry.color }}>
                            {entry.name}:{' '}
                            {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              minimumFractionDigits: 0,
                            }).format(entry.value)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="Incoming"
                stroke="#0f8b4b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incomeGrad)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Outgoing"
                stroke="#10422a"
                strokeWidth={2}
                fill="none"
                dot={false}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
