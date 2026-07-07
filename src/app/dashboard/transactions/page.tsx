'use client';

import { useState } from 'react';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TransactionDetailsDrawer from '@/components/features/transactions/TransactionDetailsDrawer';
import TransactionsTable from '@/components/features/transactions/TransactionsTable';
import TransactionsFilters from '@/components/features/transactions/TransactionsFilters';

// Explicitly define TransactionItem interface locally to resolve the TS import error
export interface TransactionItem {
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

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

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

  const handleRowClick = (tx: TransactionItem) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  const formatCurrency = (val: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const mappedTransactions: TransactionItem[] = transactions.map((tx: any) => {
    const dateStr = tx.date || tx.createdAt?.split('T')[0] || '';
    const formattedAmount = formatCurrency(tx.amount || 0, tx.currency);
    const txStatus = tx.status || 'Pending';
    const mappedStatus = txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();

    const timeStr =
      tx.time ||
      (tx.createdAt
        ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '');

    return {
      id: tx.id || tx.transactionId || '',
      date: dateStr,
      amount: formattedAmount,
      status: mappedStatus,
      reference: tx.paymentReference || tx.reference || '',
      fee: new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: tx.currency || 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(tx.fee || 0),
      currency: tx.currency || 'NGN',
      method: tx.paymentMethod || tx.method || 'Bank Transfer',
      time: timeStr,
      customerName: tx.customer?.name || tx.customerName || 'Anonymous',
      accountNumber: tx.dedicatedAccountNumber || tx.accountNumber || '',
      narration: tx.narration || '',
      expectedAmount: formatCurrency(tx.expectedAmount || tx.amount || 0, tx.currency),
      receivedAmount: formatCurrency(
        (tx.status?.toLowerCase() === 'failed' ? 0 : tx.amount) || 0,
        tx.currency,
      ),
      difference: formatCurrency(
        Math.max(
          0,
          (tx.expectedAmount || tx.amount || 0) -
            (tx.status?.toLowerCase() === 'failed' ? 0 : tx.amount || 0),
        ),
        tx.currency,
      ),
    };
  });

  const filteredTransactions = mappedTransactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Compute live local summary stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter((tx: any) => {
    const txDate = tx.createdAt || tx.date || '';
    return txDate.startsWith(todayStr);
  });

  const totalPaymentsToday = todayTransactions.reduce(
    (sum: number, tx: any) => sum + (tx.amount || 0),
    0,
  );

  const pendingTransactions = transactions.filter((tx: any) => {
    const status = (tx.status || '').toLowerCase();
    return status === 'pending';
  }).length;

  const exceptions = transactions.filter((tx: any) => {
    const status = (tx.status || '').toLowerCase();
    return ['failed', 'underpaid', 'reversed'].includes(status);
  }).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Transactions</h1>
          <p className="text-xs text-[#45504b] mt-0.5">
            Monitor, search, and validate ecosystem transaction operations
          </p>
        </div>
      </div>

      {isLoading ? (
        <>
          {/* Micro Card Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#f0f4f1] rounded-2xl p-4 h-24 flex items-center justify-between animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-20" />
                  <div className="h-6 bg-gray-100 rounded w-28" />
                  <div className="h-2 bg-gray-100 rounded w-16" />
                </div>
                <div className="w-8 h-8 rounded-xl bg-gray-50" />
              </div>
            ))}
          </div>

          {/* Table Container Skeleton */}
          <div className="bg-white border border-[#f0f4f1] rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="h-8 bg-gray-50 rounded-xl w-full" />
            <div className="h-40 bg-gray-50 rounded-xl w-full" />
          </div>
        </>
      ) : (
        <>
          {/* Slick Compact Metric Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="bg-white rounded-2xl p-4 border border-[#f0f4f1] shadow-sm flex items-start justify-between transition-all hover:border-[#0f8b4b]/30">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Total Today
                </p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalPaymentsToday)}
                </p>
                <p className="text-[11px] text-[#0f8b4b] font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  {todayTransactions.length} settled item{todayTransactions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-[#0f8b4b]/5 text-[#0f8b4b]">
                <TrendingUp size={16} />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-2xl p-4 border border-[#f0f4f1] shadow-sm flex items-start justify-between transition-all hover:border-[#ea580c]/30">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Pending
                </p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  {pendingTransactions}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">Requires approval sync</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle size={16} />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-2xl p-4 border border-[#f0f4f1] shadow-sm flex items-start justify-between transition-all hover:border-rose-200">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Exceptions
                </p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">{exceptions}</p>
                <p className="text-[11px] text-gray-400 font-medium">Failed or underpaid drops</p>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle size={16} />
              </div>
            </div>
          </div>

          {/* Filtering and Table Container */}
          <div className="bg-white border border-[#f0f4f1]/80 rounded-2xl p-6 shadow-sm space-y-6">
            <TransactionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <TransactionsTable
              transactions={filteredTransactions}
              onRowClick={handleRowClick}
              statusColors={statusColors}
            />
          </div>
        </>
      )}

      <TransactionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
