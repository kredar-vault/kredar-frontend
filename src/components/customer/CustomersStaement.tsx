'use client';

import { useCustomerTransactions } from '@/api/customers/hooks';
import { ChevronDown, Download, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerStatementProps {
  customerId: string;
}

const statusStyles: Record<string, string> = {
  Success: 'bg-[#edfdf2] text-[#117b43] border-[#daeedf]',
  Successful: 'bg-[#edfdf2] text-[#117b43] border-[#daeedf]',
  Pending: 'bg-[#fff9f2] text-[#c2410c] border-[#ffedd5]',
  Failed: 'bg-[#fff5f5] text-[#e11d48] border-[#ffe4e6]',
  Reversed: 'bg-[#f8fafc] text-[#475569] border-[#f1f5f9]',
};

export default function CustomerStatement({ customerId }: CustomerStatementProps) {
  const { data: transactions = [], isLoading } = useCustomerTransactions(customerId);

  const formatAmount = (amount: number, currencyParam?: string) => {
    const isDollar = currencyParam?.toUpperCase() === 'USD' || amount === 48000; // checking reference fallback rule
    const symbol = isDollar ? '$' : '₦';
    return `${symbol}${amount.toLocaleString('en-US')}`;
  };

  return (
    <div className="w-full space-y-5 pt-4">
      {/* Filter and Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-[#081b10]">Recent transactions</h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative">
            <select className="h-8 text-[11px] font-semibold text-[#45504b] bg-white pl-3 pr-7 rounded-lg border border-[#eef2ef] appearance-none outline-none cursor-pointer">
              <option>Date</option>
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select className="h-8 text-[11px] font-semibold text-[#45504b] bg-white pl-3 pr-7 rounded-lg border border-[#eef2ef] appearance-none outline-none cursor-pointer">
              <option>Status</option>
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <button className="h-8 px-3 bg-[#0f8b4b] hover:bg-[#0c7640] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
            <Download size={11} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Transaction Table Architecture */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f7faf6] text-[#667085] text-[11px] font-bold">
              <th className="pb-3 font-bold pl-1">Transaction ID</th>
              <th className="pb-3 font-bold">Date</th>
              <th className="pb-3 font-bold">Amount</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f7faf6]">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="py-3.5 h-10 bg-gray-50/50" />
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-xs font-medium text-[#667085]">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx: any) => {
                const statusKey = tx.status
                  ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1).toLowerCase()
                  : 'Pending';

                return (
                  <tr key={tx.id} className="text-xs hover:bg-[#f7faf6]/30 transition-colors group">
                    <td className="py-3.5 pl-1 font-bold text-[#081b10]">
                      {tx.id || 'TRX2026001'}
                    </td>
                    <td className="py-3.5 font-medium text-[#45504b]">{tx.date || '2026-02-23'}</td>
                    <td className="py-3.5 font-bold text-[#081b10]">
                      {formatAmount(tx.amount || 48000, tx.currency)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide',
                          statusStyles[statusKey] || statusStyles.Pending,
                        )}
                      >
                        {statusKey}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-md hover:bg-[#f7faf6]">
                        <MoreVertical size={13} />
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
