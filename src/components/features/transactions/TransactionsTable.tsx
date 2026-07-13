'use client';

import { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionItem } from '@/api/transactions/types';
import { cn } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: TransactionItem[];
  onRowClick: (tx: any) => void;
  statusColors: Record<string, string>;
}

const INCOMING_STATUSES = ['reconciled', 'overpaid', 'underpaid'];
const FAILED_STATUSES = ['failed', 'reversed'];
const PAGE_SIZE = 20;

function getDirection(tx: TransactionItem): 'in' | 'out' {
  if (tx.direction) return tx.direction;
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl p-6 border border-[#f0f4f1]/60 shadow-sm">
        <h3 className="text-lg font-bold text-[#081b10] tracking-tight mb-6">Transactions</h3>
        <div className="py-16 text-center text-sm text-gray-400">No transactions found</div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-50">
        {paged.map((tx) => {
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

              {/* Label + date + customer/account */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#081b10] truncate">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{dateTime}</p>
              </div>

              {/* Customer name */}
              <div className="hidden sm:block w-40 flex-shrink-0 min-w-0">
                <p className="text-sm text-[#081b10] truncate">{tx.customerName || '—'}</p>
              </div>

              {/* Account number */}
              <div className="hidden md:block w-36 flex-shrink-0 min-w-0">
                <p className="text-xs text-gray-500 tabular-nums truncate">
                  {tx.accountNumber || '—'}
                </p>
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
                  {direction === 'in' && !isFailed ? '+' : direction === 'out' ? '-' : ''}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-4 mt-2 border-t border-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#081b10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages} · {transactions.length} records
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#081b10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
