'use client';

import { ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#edfdf2] text-[#117b43] border-[#daeedf]',
  Overpaid: 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]',
  Failed: 'bg-[#fff5f5] text-[#e11d48] border-[#ffe4e6]',
  Pending: 'bg-[#fff9f2] text-[#c2410c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefdf0] text-[#a16207] border-[#fef9c3]',
  Reversed: 'bg-[#f8fafc] text-[#475569] border-[#f1f5f9]',
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
    <div className="bg-white border border-[#eef2ef] rounded-md p-6  space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#081b10]">Recent transactions</h3>
          <p className="text-[11px] text-[#667085] font-medium mt-0.5">
            Real-time dynamic verification stream
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="h-8 text-[11px] font-semibold text-[#45504b] bg-[#f7faf6] pl-3 pr-7 rounded-lg border border-[#eef2ef] appearance-none cursor-pointer outline-none">
              <option>Status</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f7faf6] text-[#667085] text-[11px] font-bold uppercase tracking-wider">
              <th className="pb-3 font-bold">Customer Details</th>
              <th className="pb-3 font-bold">Execution Date</th>
              <th className="pb-3 font-bold">Settled Amount</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 font-bold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f7faf6]">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-gray-100" />
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-100 rounded w-24" />
                      <div className="h-2 bg-gray-100 rounded w-16" />
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </td>
                  <td className="py-4">
                    <div className="h-3 bg-gray-100 rounded w-12" />
                  </td>
                  <td className="py-4">
                    <div className="h-5 bg-gray-100 rounded-md w-16" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="h-5 bg-gray-100 rounded w-5 ml-auto" />
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-xs font-medium text-[#667085]">
                  No records matching ledger criteria found.
                </td>
              </tr>
            ) : (
              transactions.slice(0, 7).map((tx: any) => {
                const txName = tx.name || tx.customer?.name || tx.customerName || 'Anonymous';
                const txAvatar =
                  tx.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${txName}`;
                const txDate = tx.date || tx.createdAt?.split('T')[0] || 'Today';
                const txStatus = tx.status || 'Pending';
                const mappedStatus =
                  txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();
                const statusClass = statusColors[mappedStatus] || statusColors['Pending'];

                const amountStr = new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: tx.currency || 'NGN',
                  minimumFractionDigits: 0,
                }).format(tx.amount || 0);

                return (
                  <tr key={tx.id} className="text-xs hover:bg-[#f7faf6]/30 transition-colors group">
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={txAvatar}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover border border-[#eef2ef] bg-[#f7faf6]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#081b10] text-xs">{txName}</span>
                        <span className="text-[10px] text-[#667085] font-medium">
                          Ref: TXN-{String(tx.id || '').substring(0, 6)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 font-medium text-[#45504b]">{txDate}</td>
                    <td className="py-3.5 font-bold text-[#081b10] text-xs">{amountStr}</td>
                    <td className="py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide',
                          statusClass,
                        )}
                      >
                        {mappedStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-lg hover:bg-[#f7faf6]">
                        <MoreVertical size={14} />
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
