'use client';

import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  Download,
  Upload,
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Webhook,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutList,
  Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TransactionDetailsDrawer from '@/components/features/transactions/TransactionDetailsDrawer';
import TransactionsTable from '@/components/features/transactions/TransactionsTable';
import TransactionsFilters from '@/components/features/transactions/TransactionsFilters';
import { TransactionItem } from '@/api/transactions/types';
import { useCustomerMap } from '@/api/customers/useCustomerMao';
import { cn } from '@/lib/utils';

// ── Activity timeline helpers ──────────────────────────────────
const ACT_TYPE_LABELS: Record<string, string> = {
  pay_in: 'Payment Received',
  pay_out: 'Transfer Sent',
  webhook: 'Webhook Event',
};

const ACT_TYPE_BG: Record<string, string> = {
  pay_in: 'bg-[#effaf2]',
  pay_out: 'bg-blue-50',
  webhook: 'bg-purple-50',
};

const ACT_TYPE_ICON: Record<string, React.ReactNode> = {
  pay_in: <ArrowDownLeft size={14} className="text-[#0f8b4b]" />,
  pay_out: <ArrowUpRight size={14} className="text-blue-500" />,
  webhook: <Webhook size={14} className="text-purple-500" />,
};

const actStatusBadge = (status: string) => {
  const s = (status ?? '').toLowerCase();
  if (['reconciled', 'succeeded', 'delivered', 'overpaid'].includes(s))
    return (
      <span className="text-[10px] font-semibold text-[#0f8b4b] bg-[#effaf2] px-2 py-0.5 rounded-full">
        Success
      </span>
    );
  if (['failed', 'deadletter', 'reversed'].includes(s))
    return (
      <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        Failed
      </span>
    );
  return (
    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
      Pending
    </span>
  );
};
// ──────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function TransactionsPage() {
  const [view, setView] = useState<'ledger' | 'timeline'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [actPage, setActPage] = useState(1);
  const [evTypeFilter, setEvTypeFilter] = useState('all');
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

  // Activity timeline queries — only fetched when Timeline view is active
  const { data: actStats } = useQuery({
    queryKey: ['activity-stats'],
    queryFn: async () => {
      const r = await api.get('/activity/stats');
      return r.data?.data ?? {};
    },
    enabled: view === 'timeline',
  });

  const { data: actData, isLoading: actLoading } = useQuery({
    queryKey: ['activity-feed', actPage],
    queryFn: async () => {
      const r = await api.get(`/activity?page=${actPage}&pageSize=30`);
      return r.data?.data ?? { items: [], total: 0 };
    },
    enabled: view === 'timeline',
    refetchInterval: 30_000,
  });

  const handleRowClick = (tx: TransactionItem) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
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

  const filteredTransactions = mappedTransactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

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
  const exceptions = transactions.filter((tx: any) =>
    ['failed', 'underpaid', 'reversed'].includes((tx.status || '').toLowerCase()),
  ).length;

  // Activity derived state
  const allActItems: any[] = actData?.items ?? [];
  const actItems =
    evTypeFilter === 'all' ? allActItems : allActItems.filter((e) => e.type === evTypeFilter);
  const actTotal: number = actData?.total ?? 0;
  const actTotalPages = Math.max(1, Math.ceil(actTotal / 30));

  const actStatCards = [
    {
      label: 'Total Events',
      value: actStats?.total ?? 0,
      icon: <Activity size={15} />,
      color: 'text-gray-600 bg-gray-50',
    },
    {
      label: 'Pay-ins',
      value: actStats?.payIns ?? 0,
      icon: <ArrowDownLeft size={15} />,
      color: 'text-[#0f8b4b] bg-[#effaf2]',
    },
    {
      label: 'Pay-outs',
      value: actStats?.payOuts ?? 0,
      icon: <ArrowUpRight size={15} />,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      label: 'Webhook Events',
      value: actStats?.webhookEvents ?? 0,
      icon: <Webhook size={15} />,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      label: 'Last 7 Days',
      value: (actStats?.last7Days?.payIns ?? 0) + (actStats?.last7Days?.payOuts ?? 0),
      icon: <TrendingUp size={15} />,
      color: 'text-[#0f8b4b] bg-[#effaf2]',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Transactions</h1>
          <p className="text-xs text-[#45504b] mt-0.5">
            {view === 'ledger'
              ? 'Monitor, search, and validate ecosystem transaction operations'
              : 'One timeline for every important business event'}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => setView('ledger')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              view === 'ledger'
                ? 'bg-white text-[#081b10] shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <LayoutList size={12} />
            Ledger
          </button>
          <button
            onClick={() => setView('timeline')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              view === 'timeline'
                ? 'bg-white text-[#081b10] shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <Clock size={12} />
            Timeline
          </button>
        </div>
      </div>

      {/* ── LEDGER VIEW ─────────────────────────────────────────── */}
      {view === 'ledger' &&
        (isLoading ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div className="bg-white border border-[#f0f4f1] rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-8 bg-gray-50 rounded-xl w-full" />
              <div className="h-40 bg-gray-50 rounded-xl w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#f0f4f1] shadow-sm flex items-start justify-between transition-all hover:border-[#0f8b4b]/30">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Total Today
                  </p>
                  <p className="text-xl font-bold text-gray-900 tracking-tight">
                    {formatCurrency(totalPaymentsToday)}
                  </p>
                  <p className="text-[11px] text-[#0f8b4b] font-medium flex items-center gap-1">
                    <TrendingUp size={12} />
                    {todayTransactions.length} settled item
                    {todayTransactions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-[#0f8b4b]/5 text-[#0f8b4b]">
                  <TrendingUp size={16} />
                </div>
              </div>

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

              <div className="bg-white rounded-2xl p-4 border border-[#f0f4f1] shadow-sm flex items-start justify-between transition-all hover:border-[#0f8b4b]/30">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Pay-in
                  </p>
                  <p className="text-xl font-bold text-gray-900 tracking-tight">
                    {formatCurrency(insights?.totalCollected ?? 0)}
                  </p>
                  <p className="text-[11px] text-[#0f8b4b] font-medium">Total collected via DVA</p>
                </div>
                <div className="p-2 rounded-xl bg-[#0f8b4b]/5 text-[#0f8b4b]">
                  <Download size={16} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#f0f4f1] shadow-sm flex items-start justify-between transition-all hover:border-blue-200">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Pay-out
                  </p>
                  <p className="text-xl font-bold text-gray-900 tracking-tight">
                    {formatCurrency(insights?.totalTransferred ?? 0)}
                  </p>
                  <p className="text-[11px] text-blue-500 font-medium">
                    Total withdrawn via transfer
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                  <Upload size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#f0f4f1]/80 rounded-2xl p-6 shadow-sm space-y-6">
              <TransactionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <TransactionsTable
                transactions={filteredTransactions}
                onRowClick={handleRowClick}
                statusColors={statusColors}
              />
            </div>
          </>
        ))}

      {/* ── TIMELINE VIEW ───────────────────────────────────────── */}
      {view === 'timeline' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {actStatCards.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[#f0f4f1] rounded-2xl p-4 shadow-sm"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center mb-3',
                    s.color,
                  )}
                >
                  {s.icon}
                </div>
                <p className="text-xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 gap-3 flex-wrap">
              <h2 className="text-sm font-bold text-gray-900">Event Timeline</h2>
              <div className="flex items-center gap-2">
                <Filter size={13} className="text-gray-400" />
                <select
                  value={evTypeFilter}
                  onChange={(e) => {
                    setEvTypeFilter(e.target.value);
                    setActPage(1);
                  }}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 text-gray-600"
                >
                  <option value="all">All Events</option>
                  <option value="pay_in">Pay-ins</option>
                  <option value="pay_out">Pay-outs</option>
                  <option value="webhook">Webhooks</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {actLoading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-40" />
                      <div className="h-3 bg-gray-100 rounded w-28" />
                    </div>
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>
                ))
              ) : actItems.length === 0 ? (
                <div className="py-16 text-center text-sm text-gray-400">
                  <Activity size={32} className="mx-auto mb-3 text-gray-200" />
                  No events found
                </div>
              ) : (
                actItems.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div
                      className={cn(
                        'p-2 rounded-xl flex-shrink-0',
                        ACT_TYPE_BG[ev.type] ?? 'bg-gray-50',
                      )}
                    >
                      {ACT_TYPE_ICON[ev.type] ?? <Activity size={14} className="text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {ACT_TYPE_LABELS[ev.type] ?? ev.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{ev.description}</p>
                    </div>
                    {ev.amountNaira != null && (
                      <p className="text-sm font-bold text-gray-900 tabular-nums shrink-0">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                        }).format(ev.amountNaira)}
                      </p>
                    )}
                    <div className="shrink-0">{actStatusBadge(ev.status)}</div>
                    <p className="text-[10px] text-gray-400 tabular-nums shrink-0 hidden sm:block">
                      {new Date(ev.occurredAt).toLocaleString('en-NG', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {actTotalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
                <button
                  onClick={() => setActPage((p) => Math.max(1, p - 1))}
                  disabled={actPage === 1}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-xs text-gray-400">
                  Page {actPage} of {actTotalPages}
                </span>
                <button
                  onClick={() => setActPage((p) => Math.min(actTotalPages, p + 1))}
                  disabled={actPage === actTotalPages}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
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
