'use client';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { TransactionItem } from '@/api/transactions/types';
import { cn } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: TransactionItem[];
  onRowClick: (tx: any) => void;
  statusColors: Record<string, string>;
}

const INCOMING_STATUSES = ['reconciled', 'overpaid', 'underpaid'];
const FAILED_STATUSES = ['failed', 'reversed'];

function getDirection(tx: TransactionItem): 'in' | 'out' {
  const narration = (tx.narration || '').toLowerCase();
  const status = (tx.status || '').toLowerCase();

  if (narration.includes('transfer from') || INCOMING_STATUSES.includes(status)) return 'in';
  if (narration.includes('transfer to') || FAILED_STATUSES.includes(status)) return 'out';
  return 'in';
}

function getLabel(tx: TransactionItem, direction: 'in' | 'out'): string {
  if (tx.narration) return tx.narration;
  if (tx.customerName)
    return direction === 'in'
      ? `Transfer from ${tx.customerName}`
      : `Transfer to ${tx.customerName}`;
  return direction === 'in' ? 'Payment Received' : 'Transfer Sent';
}

function formatDateTime(tx: TransactionItem): string {
  const dateStr = tx.date || '';
  const timeStr = tx.time || '';
  if (!dateStr) return 'Unknown';

  try {
    const d = new Date(dateStr);
    const month = d.toLocaleString('en-NG', { month: 'short' });
    const day = d.getDate();
    const n = day % 10;
    const suffix =
      n === 1 && day !== 11
        ? 'st'
        : n === 2 && day !== 12
          ? 'nd'
          : n === 3 && day !== 13
            ? 'rd'
            : 'th';
    return `${month} ${day}${suffix}${timeStr ? ', ' + timeStr : ''}`;
  } catch {
    return dateStr;
  }
}

export default function TransactionsTable({ transactions, onRowClick }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl p-6 border border-[#f0f4f1]/60 shadow-sm">
        <h3 className="text-lg font-bold text-[#081b10] tracking-tight mb-6">Transactions</h3>
        <div className="py-16 text-center text-sm text-gray-400">No transactions found</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-50">
        {transactions.map((tx) => {
          const direction = getDirection(tx);
          const label = getLabel(tx, direction);
          const dateTime = formatDateTime(tx);
          const isFailed = FAILED_STATUSES.includes((tx.status || '').toLowerCase());
          const isPending = (tx.status || '').toLowerCase() === 'pending';

          return (
            <div
              key={tx.id}
              onClick={() => onRowClick(tx)}
              className="flex items-center gap-4 py-3.5 cursor-pointer hover:bg-gray-50/60 px-2 rounded-xl transition-all"
            >
              {/* Direction icon */}
              {direction === 'in' ? (
                <div className="w-10 h-10 rounded-full bg-[#effaf2] flex items-center justify-center text-[#0f8b4b] flex-shrink-0">
                  <ArrowDownLeft size={18} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <ArrowUpRight size={18} />
                </div>
              )}

              {/* Label + date */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#081b10] truncate">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{dateTime}</p>
              </div>

              {/* Amount + status badge */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    isFailed
                      ? 'text-red-500 line-through'
                      : direction === 'in'
                        ? 'text-[#0f8b4b]'
                        : 'text-gray-900',
                  )}
                >
                  {direction === 'in' && !isFailed ? '+' : ''}
                  {tx.amount}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    isFailed
                      ? 'text-red-600 bg-red-50'
                      : isPending
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-[#0f8b4b] bg-[#effaf2]',
                  )}
                >
                  {isFailed ? 'Failed' : isPending ? 'Pending' : 'Successful'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
