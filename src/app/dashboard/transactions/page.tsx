'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Search, Download } from 'lucide-react';
import TransactionDetailsDrawer from '@/components/features/transactions/TransactionDetailsDrawer';
import { TransactionItem } from '@/api/transactions/types';
import { useCustomerMap } from '@/api/customers/useCustomerMao';
import Button from '@/components/features/landing/Button';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  Successful: { label: 'Successful', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Failed: { label: 'Failed', class: 'text-red-600 bg-red-50' },
  Pending: { label: 'Pending', class: 'text-amber-600 bg-amber-50' },
  Overpaid: { label: 'Overpaid', class: 'text-blue-600 bg-blue-50' },
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const { customerMap } = useCustomerMap();

  const { data: insights } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await api.get('/insights');
      return res.data?.data ?? res.data ?? {};
    },
  });

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

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;
    const headers = [
      'Transaction ID',
      'Date',
      'Customer Name',
      'Account Number',
      'Amount',
      'Status',
    ];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.customerName || '',
      t.accountNumber || '',
      t.amount,
      t.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (val: number, currency: string = 'NGN') =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const mappedTransactions: TransactionItem[] = transactions.map((tx: any) => {
    const dateStr = tx.date || tx.createdAt?.split('T')[0] || '';
    const formattedAmount = formatCurrency(tx.amount || 0, tx.currency);
    const txStatus = tx.status || 'Pending';
    const mappedStatus = txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();

    return {
      id: tx.id || tx.transactionId || '',
      date: dateStr,
      amount: formattedAmount,
      status: mappedStatus,
      reference: tx.paymentReference || tx.reference || '',
      fee: formatCurrency(tx.fee || 0, tx.currency),
      currency: tx.currency || 'NGN',
      method: tx.paymentMethod || tx.method || 'Bank Transfer',
      time: tx.time || '',
      customerId: tx.customerId || '',
      customerName:
        customerMap.get(tx.customerId)?.fullName || tx.customer?.name || tx.customerName || null,
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

  const filteredTransactions = mappedTransactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter((tx: any) =>
    (tx.createdAt || tx.date || '').startsWith(todayStr),
  );
  const totalPaymentsToday = todayTransactions.reduce(
    (sum: number, tx: any) => sum + (tx.amount || 0),
    0,
  );
  const pendingTransactions = transactions.filter(
    (tx: any) => (tx.status || '').toLowerCase() === 'pending',
  ).length;
  const failedTransactions = transactions.filter((tx: any) =>
    ['failed', 'reversed'].includes((tx.status || '').toLowerCase()),
  ).length;

  const statCards = [
    { label: 'Total payments today', value: formatCurrency(totalPaymentsToday) },
    { label: 'Pending transactions', value: pendingTransactions },
    { label: 'Failed transactions', value: failedTransactions },
    { label: 'Pay-in', value: formatCurrency(insights?.totalCollected ?? 0) },
    { label: 'Pay-out', value: formatCurrency(insights?.totalTransferred ?? 0) },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 mt-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Transactions</h1>
        <p className="text-xs text-[#45504b] mt-0.5">
          Monitor, search, and manage all payment transactions
        </p>
      </div>

      {/* Unified Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 h-24 animate-pulse flex flex-col gap-2"
              >
                <div className="h-3 bg-gray-100 rounded w-20" />
                <div className="h-6 bg-gray-100 rounded w-28" />
              </div>
            ))
          : statCards.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1"
              >
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
      </div>

      {/* Filters Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by TRX ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0f8b4b] w-56 text-gray-700 bg-white"
            />
          </div>

          <div className="relative flex items-center">
            <select className="appearance-none text-xs border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none text-gray-600 bg-white min-w-[100px]">
              <option>Date</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </span>
          </div>

          <div className="relative flex items-center">
            <select className="appearance-none text-xs border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none text-gray-600 bg-white min-w-[100px]">
              <option>Currency</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </span>
          </div>

          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none text-xs border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none text-gray-600 bg-white min-w-[110px]"
            >
              <option value="all">Status</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="overpaid">Overpaid</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </span>
          </div>
        </div>

        <Button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0f8b4b] hover:bg-[#0a7040] rounded-xl text-xs font-semibold text-white transition-colors self-start md:self-auto"
        >
          <Download size={13} /> Export
        </Button>
      </div>

      {/* Styled Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                {['Transaction ID', 'Date', 'Amount', 'Status'].map((h, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-6 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const statusInfo = STATUS_MAP[tx.status] || {
                    label: tx.status,
                    class: 'text-gray-500 bg-gray-100',
                  };
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/40 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(tx)}
                    >
                      {/* Fixed: changed custom py-4.5 to supported native py-4 */}
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap font-mono text-xs max-w-xs truncate">
                        {tx.id}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap tabular-nums">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
