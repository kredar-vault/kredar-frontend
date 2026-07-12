'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Download, Search, ChevronLeft, ChevronRight, X, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomerMap } from '@/api/customers/useCustomerMao';
import CustomerIdentityCard from '@/components/ui/CustomerIdentityCard';
import Button from '@/components/features/landing/Button';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  Reconciled: { label: 'Successful', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Overpaid: { label: 'Successful', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Underpaid: { label: 'Pending', class: 'text-amber-600 bg-amber-50' },
  Pending: { label: 'Pending', class: 'text-amber-600 bg-amber-50' },
  Failed: { label: 'Failed', class: 'text-red-600 bg-red-50' },
  Reversed: { label: 'Failed', class: 'text-gray-500 bg-gray-100' },
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
  const { customerMap } = useCustomerMap();

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
    { label: 'Matched', value: stats?.matched ?? 0 },
    { label: 'Needs Review', value: stats?.pendingReview ?? 0 },
    { label: 'Unmatched', value: stats?.failedMatches ?? 0 },
    { label: 'Success Rate', value: stats?.successRate != null ? `${stats.successRate}%` : '—' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 mt-4">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Reconciliation</h1>
        <p className="text-xs text-[#45504b] mt-0.5">
          Match and verify incoming transactions against expected payments
        </p>
      </div>

      {/* Unified Stat Cards (No Icons, No Shadows, Title Case) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1"
          >
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by TRX ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none text-xs border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none text-gray-600 bg-white min-w-[110px]"
            >
              <option value="all">Status</option>
              <option value="matched">Matched</option>
              <option value="review">Needs Review</option>
              <option value="unmatched">Ignored / Failed</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </span>
          </div>
        </div>

        <Button className="flex items-center gap-1.5 px-4 py-2 bg-[#0f8b4b] hover:bg-[#0a7040] rounded-xl text-xs font-semibold text-white transition-colors self-start md:self-auto">
          <Download size={13} /> Export
        </Button>
      </div>

      {/* Styled Data Table Container */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                {[
                  'Transaction ID',
                  'Customer',
                  'Account',
                  'Reference',
                  'Amount',
                  'Date',
                  'Status',
                  '',
                ].map((h, idx) => (
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
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-6 py-4.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((tx: any) => {
                  const statusInfo = STATUS_MAP[tx.status] ?? {
                    label: tx.status,
                    class: 'text-gray-500 bg-gray-100',
                  };
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4.5 font-medium text-gray-900 whitespace-nowrap">
                        {tx.id ? `TRX${tx.id.slice(0, 7)}` : '—'}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <CustomerIdentityCard
                          customerId={tx.customerId}
                          customerName={customerMap.get(tx.customerId)?.fullName}
                          dedicatedAccountNumber={tx.dedicatedAccountNumber}
                        />
                      </td>
                      <td className="px-6 py-4.5 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {maskAccount(tx.dedicatedAccountNumber)}
                      </td>
                      <td className="px-6 py-4.5 text-gray-500 text-xs whitespace-nowrap font-mono">
                        {tx.reference || '—'}
                      </td>
                      <td className="px-6 py-4.5 font-medium text-gray-900 whitespace-nowrap tabular-nums">
                        {fmt(tx.amount ?? 0)}
                      </td>
                      <td className="px-6 py-4.5 text-gray-500 text-xs whitespace-nowrap">
                        {tx.createdAt ? new Date(tx.createdAt).toISOString().split('T')[0] : '—'}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full',
                            statusInfo.class,
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setPendingAction({ type: 'match', id: tx.id })}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40 font-medium"
            >
              <ChevronLeft size={14} /> Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                {page}
              </span>
              <span className="text-xs text-gray-400 font-medium">of {totalPages}</span>
            </div>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40 font-medium"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      {pendingAction?.type === 'match' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Match to Customer</h3>
              <Button
                onClick={() => setPendingAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </Button>
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
                <Button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
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
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ignore Modal */}
      {pendingAction?.type === 'ignore' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Ignore Transaction</h3>
              <Button
                onClick={() => setPendingAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </Button>
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
                <Button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  disabled={ignoreMutation.isPending}
                  onClick={() =>
                    ignoreMutation.mutate({ id: pendingAction.id, reason: ignoreReason })
                  }
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {ignoreMutation.isPending ? 'Ignoring…' : 'Ignore'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
