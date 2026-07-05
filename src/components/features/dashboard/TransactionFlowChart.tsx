import { ChevronDown, Filter } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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

  // Setup monthly buckets
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
    const dateObj = new Date(txDate);
    const monthIndex = dateObj.getMonth();
    if (monthIndex >= 0 && monthIndex < 12) {
      const amount = tx.amount || 0;
      const type = (tx.type || '').toLowerCase();
      // Outgoing is identified by transfers or payouts
      const isOutgoing = type.includes('transfer') || type.includes('payout');
      if (isOutgoing) {
        chartData[monthIndex].Outgoing += amount;
      } else {
        chartData[monthIndex].Incoming += amount;
      }
    }
  });

  return (
    <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#081b10]">Transaction flow</h3>

        <div className="flex items-center gap-3">
          {/* Date Select Dropdown */}
          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-32 border-[#d8e1da]">
              <option>Date</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          {/* Filter Toggle */}
          <button className="h-9 px-3 border border-[#d8e1da] rounded-lg text-xs font-semibold flex items-center gap-1.5 text-[#45504b] hover:bg-[#f7faf6]">
            <Filter size={14} />
            <span>Filters</span>
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Recharts chart area */}
      <div className="h-[320px] w-full">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#45504b', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#45504b', fontSize: 11 }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `₦${(value / 1000).toFixed(0)}k`;
                  }
                  return `₦${value}`;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 rounded-lg border border-[#d8e1da] shadow-md text-xs font-semibold text-[#081b10] space-y-1">
                        {payload.map((entry) => (
                          <p key={entry.name} style={{ color: entry.color }}>
                            {entry.name}:{' '}
                            {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(entry.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="square"
                iconSize={10}
                formatter={(value) => (
                  <span className="text-xs text-[#45504b] font-medium ml-1 mr-4">{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="Incoming"
                stroke="#0f8b4b"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#0f8b4b', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="Outgoing"
                stroke="#10422a"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#10422a', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
