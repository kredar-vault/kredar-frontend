'use client';

import { ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function RecentTransactionsTable() {
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

  return (
    <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#081b10]">Recent transactions</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-28 border-[#d8e1da]">
              <option>Date</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-28 border-[#d8e1da]">
              <option>Currency</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-28 border-[#d8e1da]">
              <option>Status</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="h-4 bg-gray-200 rounded w-28" />
                  </td>
                  <td className="py-3.5">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </td>
                  <td className="py-3.5">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </td>
                  <td className="py-3.5">
                    <div className="h-5 bg-gray-200 rounded-full w-20" />
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="h-6 bg-gray-200 rounded w-6 ml-auto" />
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#45504b]">
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              transactions.slice(0, 10).map((tx: any) => {
                const txId = tx.id || '';
                const txName = tx.name || tx.customer?.name || tx.customerName || 'Anonymous';
                const txAvatar =
                  tx.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80';
                const txDate = tx.date || tx.createdAt?.split('T')[0] || '';
                const txStatus = tx.status || 'Pending';

                const formatCurrency = (val: number) => {
                  return new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: tx.currency || 'NGN',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(val);
                };

                const amountStr =
                  typeof tx.amount === 'number' ? formatCurrency(tx.amount) : tx.amount;

                // Format status matching statusColors keys
                const mappedStatus =
                  txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();
                const statusClass = statusColors[mappedStatus] || statusColors['Pending'];

                return (
                  <tr key={txId} className="text-sm hover:bg-[#f7faf6]/40 transition-colors">
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={txAvatar}
                        alt={txName}
                        className="w-8 h-8 rounded-full object-cover border border-[#ebebeb]"
                      />
                      <span className="font-semibold text-[#081b10]">{txName}</span>
                    </td>
                    <td className="py-3.5 text-[#45504b]">{txDate}</td>
                    <td className="py-3.5 font-semibold text-[#081b10]">{amountStr}</td>
                    <td className="py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                          statusClass,
                        )}
                      >
                        {mappedStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-lg hover:bg-[#f3f4f6]">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
