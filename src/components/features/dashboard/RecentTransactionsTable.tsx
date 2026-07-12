'use client';

import { useState, Fragment } from 'react'; // 1. Added Fragment import
import { ChevronDown, Calendar, CreditCard, FileText } from 'lucide-react';
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
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

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

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="bg-white border border-[#eef2ef] rounded-md p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#081b10]">Recent transactions</h3>
          <p className="text-[11px] text-[#667085] font-medium mt-0.5">
            Real-time dynamic verification stream (Click rows to expand)
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
        <table className="min-w-[560px] w-full text-left border-collapse">
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
                const txId = tx.id || tx.reference || Math.random().toString();
                const txName =
                  tx.narration || tx.name || tx.customer?.name || tx.customerName || 'Anonymous';
                const txAvatar =
                  tx.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${txName}`;
                const txDate = tx.date || tx.createdAt?.split('T')[0] || 'Today';
                const txStatus = tx.status || 'Pending';
                const mappedStatus =
                  txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();
                const statusClass = statusColors[mappedStatus] || statusColors['Pending'];
                const isExpanded = expandedRowId === txId;

                const amountStr = new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: tx.currency || 'NGN',
                  minimumFractionDigits: 0,
                }).format(tx.amount || 0);

                return (
                  // 2. Fixed: Wrap with explicit keyed Fragment component
                  <Fragment key={txId}>
                    <tr
                      onClick={() => toggleRow(txId)}
                      className={cn(
                        'text-xs transition-colors group cursor-pointer select-none',
                        isExpanded ? 'bg-[#f7faf6]/50' : 'hover:bg-[#f7faf6]/30',
                      )}
                    >
                      <td className="py-3.5 flex items-center gap-3">
                        <img
                          src={txAvatar}
                          alt=""
                          className="w-8 h-8 rounded-md object-cover border border-[#eef2ef] bg-[#f7faf6]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-[#081b10] text-xs">{txName}</span>
                          <span className="text-[10px] text-[#667085] font-medium">
                            Ref: TXN-{String(txId).substring(0, 6)}
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
                      <td className="py-3.5 text-right pr-2">
                        <ChevronDown
                          size={14}
                          className={cn(
                            'text-gray-400 ml-auto transition-transform duration-200',
                            isExpanded && 'rotate-180 text-gray-700',
                          )}
                        />
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[#fcfdfe]">
                        <td colSpan={5} className="p-4 border-l-2 border-[#117b43]">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-[#45504b]">
                            <div className="flex items-start gap-2">
                              <FileText size={14} className="text-gray-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">
                                  Full Reference ID
                                </p>
                                <p className="font-mono text-gray-800 mt-0.5 break-all">{txId}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <CreditCard size={14} className="text-gray-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">
                                  Target Account
                                </p>
                                <p className="text-gray-800 mt-0.5 font-medium">
                                  {tx.dedicatedAccountNumber || '—'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar size={14} className="text-gray-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">
                                  Narration Log
                                </p>
                                <p className="text-gray-800 mt-0.5 italic">
                                  "{tx.narration || 'No processing remarks provided.'}"
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
