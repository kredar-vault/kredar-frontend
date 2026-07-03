'use client';

import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItem {
  id: string;
  date: string;
  amount: string;
  status: string;
  reference?: string;
  fee?: string;
  currency?: string;
  method?: string;
  time?: string;
  customerName?: string;
  accountNumber?: string;
  narration?: string;
  expectedAmount?: string;
  receivedAmount?: string;
  difference?: string;
}

interface TransactionsTableProps {
  transactions: TransactionItem[];
  onRowClick: (tx: TransactionItem) => void;
  statusColors: Record<string, string>;
}

export default function TransactionsTable({
  transactions,
  onRowClick,
  statusColors,
}: TransactionsTableProps) {
  return (
    <div className="space-y-4">
      {/* Transactions Table list */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
              <th className="pb-3 font-semibold">Transaction ID</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => onRowClick(tx)}
                className="text-sm hover:bg-[#f7faf6]/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 font-bold text-[#081b10]">{tx.id}</td>
                <td className="py-3.5 text-[#45504b] font-medium">{tx.date}</td>
                <td className="py-3.5 font-bold text-[#081b10]">{tx.amount}</td>
                <td className="py-3.5">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                      statusColors[tx.status],
                    )}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="text-[#45504b] hover:text-[#081b10] p-1.5 rounded-lg hover:bg-[#f3f4f6]">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center pt-6 pb-2">
        <nav className="flex items-center gap-1 text-sm font-semibold text-[#45504b]">
          <button className="px-3 py-1.5 rounded-lg hover:bg-[#f7faf6] transition-colors">
            Previous
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#0f8b4b]/10 text-[#0f8b4b]">1</button>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">2</button>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">3</button>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">4</button>
          <span className="px-2">...</span>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">10</button>
          <button className="px-3 py-1.5 rounded-lg hover:bg-[#f7faf6] transition-colors">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
export type { TransactionItem };
