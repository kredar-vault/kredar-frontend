'use client';

import { ArrowRight, ArrowLeft } from 'lucide-react';

import { TransactionItem } from '@/api/transactions/types';
import CustomerIdentityCard from '@/components/ui/CustomerIdentityCard';

interface TransactionsTableProps {
  transactions: TransactionItem[];
  onRowClick: (tx: any) => void;
  statusColors: Record<string, string>;
}

export default function TransactionsTable({ transactions, onRowClick }: TransactionsTableProps) {
  const getTransactionIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'reconciled':
        return (
          <div className="w-10 h-10 rounded-full bg-[#0f8b4b]/10 flex items-center justify-center text-[#0f8b4b]">
            <ArrowLeft size={18} />
          </div>
        );
      case 'failed':
        return (
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <ArrowRight size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"></div>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-[#f0f4f1]/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#081b10] tracking-tight">Recent transactions</h3>
        <button className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">
          Recent
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.map((tx) => {
          const subtitleInfo = tx.date || tx.createdAt || 'Just now';

          return (
            <div
              key={tx.id}
              onClick={() => onRowClick(tx)}
              className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50/60 px-2 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                {getTransactionIcon(tx.status)}
                <div className="space-y-1">
                  <CustomerIdentityCard
                    customerId={tx.customerId}
                    customerName={tx.customerName}
                    dedicatedAccountNumber={tx.accountNumber}
                  />
                  <p className="text-xs text-gray-400">{subtitleInfo}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-900">
                  {typeof tx.amount === 'number' ? `₦${tx.amount.toLocaleString()}` : tx.amount}
                </span>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  :
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100">
        <button className="text-xs font-semibold px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors">
          Previous
        </button>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg bg-[#0f8b4b]/10 text-[#0f8b4b] text-xs font-bold">
            1
          </button>
          <button className="w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50">
            2
          </button>
          <button className="w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50">
            3
          </button>
        </div>
        <button className="text-xs font-semibold px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}
