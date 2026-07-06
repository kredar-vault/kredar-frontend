'use client';

import { useState } from 'react';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TransactionDetailsDrawer from '@/components/features/transactions/TransactionDetailsDrawer';
import TransactionsTable, {
  TransactionItem,
} from '@/components/features/transactions/TransactionsTable';
import TransactionsFilters from '@/components/features/transactions/TransactionsFilters';

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

  // Helper to format currency dynamically based on transaction currency
  const formatCurrency = (val: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Map backend transaction items to TransactionItem structure safely
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

  // Compute metrics dynamically from the live transactions list
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Transactions</h1>
        <p className="text-sm text-[#45504b] mt-1">
          Monitor, search, and manage all payment transactions
        </p>
      </div>

      {isLoading ? (
        /* SKELETAL LOADING STATE */
        <>
          {/* Skeletons: Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[140px] flex flex-col justify-between shadow-sm animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-8 bg-gray-200 rounded w-24 mt-2" />
                <div className="h-4 bg-gray-200 rounded w-28 mt-2" />
              </div>
            ))}
          </div>

          {/* Skeletons: Table */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-full" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-[#f0f4f1] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded-full w-24" />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ACTUAL RENDERED CONTENTS */
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0a2e1f] rounded-2xl p-6 text-white flex flex-col justify-between min-h-[140px] shadow-sm">
              <span className="text-sm font-medium text-white/70">Total payments today</span>
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-3xl font-bold tracking-tight">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalPaymentsToday)}
                </span>
                <div className="flex items-center gap-1.5 text-[#66c987] text-xs font-semibold">
                  <TrendingUp size={14} />
                  <span>
                    {todayTransactions.length} transaction
                    {todayTransactions.length !== 1 ? 's' : ''} today
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">Pending transactions</span>
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-3xl font-bold text-[#081b10] tracking-tight">
                  {pendingTransactions}
                </span>
                <button className="flex items-center gap-1 text-[#ea580c] text-xs font-semibold hover:underline mt-1 w-max">
                  <AlertTriangle size={14} />
                  <span>Review now</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">Exceptions</span>
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-3xl font-bold text-[#081b10] tracking-tight">
                  {exceptions}
                </span>
                <button className="flex items-center gap-1 text-[#4f46e5] text-xs font-semibold hover:underline mt-1 w-max">
                  <AlertCircle size={14} />
                  <span>Action required</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter and Table Card */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
            <TransactionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <TransactionsTable
              transactions={filteredTransactions}
              onRowClick={handleRowClick}
              statusColors={statusColors}
            />
          </div>
        </>
      )}

      {/* Transaction Details Slider Drawer */}
      <TransactionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
