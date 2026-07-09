'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ExternalLink,
  Edit2,
  Filter,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  Reconciled: { label: 'Matched', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Overpaid: { label: 'Matched', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Underpaid: { label: 'Needs Review', class: 'text-amber-600 bg-amber-50' },
  Pending: { label: 'Needs Review', class: 'text-amber-600 bg-amber-50' },
  Failed: { label: 'Failed', class: 'text-red-600 bg-red-50' },
  Reversed: { label: 'Ignored', class: 'text-gray-500 bg-gray-100' },
};

const STATUS_DOT: Record<string, string> = {
  Reconciled: 'bg-[#0f8b4b]',
  Overpaid: 'bg-[#0f8b4b]',
  Underpaid: 'bg-amber-500',
  Pending: 'bg-amber-500',
  Failed: 'bg-red-500',
  Reversed: 'bg-gray-400',
};

function maskAccount(acct?: string) {
  if (!acct) return '—';
  if (acct.length <= 4) return acct;
  return `**** ${acct.slice(-4)}`;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n);

type PendingAction = { type: 'match' | 'ignore'; id: string };

export default function ReconciliationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [matchCustomerId, setMatchCustomerId] = useState('');
  const [matchNote, setMatchNote] = useState('');
  const [ignoreReason, setIgnoreReason] = useState('');
  const qc = useQueryClient();

  const statusParam =
    statusFilter === 'matched'
      ? 'Reconciled'
      : statusFilter === 'review'
        ? 'Pending'
        : statusFilter === 'unmatched'
          ? 'Reversed'
          : undefined;

  const { data: stats } = useQuery({
    queryKey: ['reconciliation-stats'],
    queryFn: async () => {
      const r = await api.get('/reconciliation/stats');
      return r.data?.data ?? {};
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['reconciliation', page, statusParam],
    queryFn: async () => {
      let url = `/reconciliation?page=${page}&pageSize=20`;
      if (statusParam) url += `&status=${statusParam}`;
      const r = await api.get(url);
      return r.data?.data ?? { items: [], total: 0 };
    },
  });

  const transactions: any[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const filtered = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.reference ?? '').toLowerCase().includes(q) ||
      (t.narration ?? '').toLowerCase().includes(q) ||
      (t.dedicatedAccountNumber ?? '').includes(q)
    );
  });

  const matchMutation = useMutation({
    mutationFn: ({ id, customerId, note }: { id: string; customerId: string; note: string }) =>
      api.post(`/reconciliation/${id}/match`, { customerId, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reconciliation'] });
      qc.invalidateQueries({ queryKey: ['reconciliation-stats'] });
      setPendingAction(null);
      setMatchCustomerId('');
      setMatchNote('');
    },
  });

  const ignoreMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.post(`/reconciliation/${id}/ignore`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reconciliation'] });
      qc.invalidateQueries({ queryKey: ['reconciliation-stats'] });
      setPendingAction(null);
      setIgnoreReason('');
    },
  });

  const statCards = [
    {
      label: 'Matched',
      value: stats?.matched ?? 0,
      sub: stats?.successRate != null ? `${stats.successRate}%` : '',
      subClass: 'text-[#0f8b4b] bg-[#effaf2]',
      desc: 'Fully reconciled transactions',
      icon: <CheckCircle2 size={22} className="text-[#0f8b4b]" />,
    },
    {
      label: 'Needs Review',
      value: stats?.pendingReview ?? 0,
      sub: (stats?.pendingReview ?? 0) > 0 ? 'Critical' : 'Clear',
      subClass:
        (stats?.pendingReview ?? 0) > 0
          ? 'text-amber-600 bg-amber-50'
          : 'text-[#0f8b4b] bg-[#effaf2]',
      desc: 'Requires immediate attention',
      icon: <AlertTriangle size={22} className="text-amber-500" />,
    },
    {
      label: 'Unmatched',
      value: stats?.failedMatches ?? 0,
      sub: 'Pending',
      subClass: 'text-gray-500 bg-gray-100',
      desc: 'Waiting for data feed',
      icon: <XCircle size={22} className="text-gray-400" />,
    },
    {
      label: 'Success Rate',
      value: stats?.successRate != null ? `${stats.successRate}%` : '—',
      sub: '',
      subClass: '',
      desc: 'vs all transactions',
      icon: <TrendingUp size={22} className="text-[#0f8b4b]" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Reconciliation</h1>
          <p className="text-xs text-[#45504b] mt-0.5">
            Match and verify incoming transactions against expected payments
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#f0f4f1] rounded-2xl p-5 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              {s.icon}
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
              </p>
              {s.sub && (
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s.subClass)}>
                  {s.sub}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 flex-wrap gap-3">
          <h2 className="text-sm font-bold text-gray-900">Transactions</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search reference, narration..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 w-52"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter size={13} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 text-gray-600"
              >
                <option value="all">All</option>
                <option value="matched">Matched</option>
                <option value="review">Needs Review</option>
                <option value="unmatched">Ignored / Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Status', 'Customer', 'Account', 'Reference', 'Amount', 'Date', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((tx: any) => {
                  const statusInfo = STATUS_MAP[tx.status] ?? {
                    label: tx.status,
                    class: 'text-gray-500 bg-gray-100',
                  };
                  const dot = STATUS_DOT[tx.status] ?? 'bg-gray-300';
                  const isMatched = ['Reconciled', 'Overpaid'].includes(tx.status);
                  const needsReviewItem = ['Underpaid', 'Pending'].includes(tx.status);
                  const customerName = tx.customerId ? 'Linked' : 'Unknown';

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg',
                            statusInfo.class,
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dot)} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap text-xs">
                        {tx.narration || customerName}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {maskAccount(tx.dedicatedAccountNumber)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap font-mono">
                        {tx.reference || '—'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap tabular-nums">
                        {fmt(tx.amount ?? 0)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleDateString('en-NG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {isMatched ? (
                            <button
                              onClick={() =>
                                window.open(`/dashboard/transactions?ref=${tx.reference}`, '_blank')
                              }
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                              title="View details"
                            >
                              <ExternalLink size={14} />
                            </button>
                          ) : needsReviewItem ? (
                            <button
                              onClick={() => {
                                setPendingAction({ type: 'match', id: tx.id });
                              }}
                              className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-500 transition-colors"
                              title="Match to customer"
                            >
                              <Edit2 size={14} />
                            </button>
                          ) : null}
                          {!isMatched && (
                            <button
                              onClick={() => setPendingAction({ type: 'ignore', id: tx.id })}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                              title="Ignore transaction"
                            >
                              <AlertTriangle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      {pendingAction?.type === 'match' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Match to Customer</h3>
              <button
                onClick={() => setPendingAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Customer ID
                </label>
                <input
                  type="text"
                  placeholder="Enter customer UUID"
                  value={matchCustomerId}
                  onChange={(e) => setMatchCustomerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Note (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Confirmed via email"
                  value={matchNote}
                  onChange={(e) => setMatchNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!matchCustomerId || matchMutation.isPending}
                  onClick={() =>
                    matchMutation.mutate({
                      id: pendingAction.id,
                      customerId: matchCustomerId,
                      note: matchNote,
                    })
                  }
                  className="flex-1 py-2 rounded-xl bg-[#0f8b4b] text-white text-xs font-semibold hover:bg-[#0a7040] disabled:opacity-50 transition-colors"
                >
                  {matchMutation.isPending ? 'Matching…' : 'Confirm Match'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ignore Modal */}
      {pendingAction?.type === 'ignore' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Ignore Transaction</h3>
              <button
                onClick={() => setPendingAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                This transaction will be marked as reversed/ignored.
              </p>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Duplicate, test transaction"
                  value={ignoreReason}
                  onChange={(e) => setIgnoreReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={ignoreMutation.isPending}
                  onClick={() =>
                    ignoreMutation.mutate({ id: pendingAction.id, reason: ignoreReason })
                  }
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {ignoreMutation.isPending ? 'Ignoring…' : 'Ignore'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
