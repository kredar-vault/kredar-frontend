'use client';

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

// Mock chart data for Incoming/Outgoing transactions
const chartData = [
  { name: 'Jan', Incoming: 1500, Outgoing: 4300 },
  { name: 'Feb', Incoming: 3200, Outgoing: 3000 },
  { name: 'Mar', Incoming: 2500, Outgoing: 3500 },
  { name: 'Apr', Incoming: 2200, Outgoing: 5000 },
  { name: 'May', Incoming: 4500, Outgoing: 7500 },
  { name: 'Jun', Incoming: 5000, Outgoing: 6200 },
  { name: 'Jul', Incoming: 7800, Outgoing: 3800 },
  { name: 'Aug', Incoming: 6800, Outgoing: 2400 },
  { name: 'Sep', Incoming: 9000, Outgoing: 2200 },
  { name: 'Oct', Incoming: 6500, Outgoing: 4500 },
  { name: 'Nov', Incoming: 3800, Outgoing: 3800 },
  { name: 'Dec', Incoming: 4800, Outgoing: 2200 },
];

export default function TransactionFlowChart() {
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 10000]}
              ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-[#d8e1da] shadow-md text-xs font-bold text-[#081b10]">
                      5,000
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
      </div>
    </div>
  );
}
