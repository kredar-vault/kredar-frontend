'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  Reconciled: { label: 'Matched', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Overpaid: { label: 'Matched', class: 'text-[#0f8b4b] bg-[#effaf2]' },
  Underpaid: { label: 'Needs Review', class: 'text-amber-600 bg-amber-50' },
  Pending: { label: 'Needs Review', class: 'text-amber-600 bg-amber-50' },
  Failed: { label: 'Failed', class: 'text-red-600 bg-red-50' },
  Reversed: { label: 'Unmatched', class: 'text-gray-500 bg-gray-100' },
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

export default function ReconciliationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions-reconciliation'],
    queryFn: async () => {
      const res = await api.get('/transactions');
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
    },
  });

  const { data: insights } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await api.get('/insights');
      return res.data?.data ?? res.data ?? {};
    },
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(n);

  const matched = transactions.filter((t: any) => ['Reconciled', 'Overpaid'].includes(t.status));
  const needsReview = transactions.filter((t: any) => ['Underpaid', 'Pending'].includes(t.status));
  const unmatched = transactions.filter((t: any) => ['Reversed', 'Failed'].includes(t.status));
  const successRate = transactions.length
    ? ((matched.length / transactions.length) * 100).toFixed(1)
    : '0.0';

  const filtered = transactions.filter((t: any) => {
    const matchesSearch =
      !search ||
      (t.narration ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (t.reference ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (t.customer?.name ?? '').toLowerCase().includes(search.toLowerCase());

    const mappedLabel = STATUS_MAP[t.status]?.label ?? '';
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'matched' && mappedLabel === 'Matched') ||
      (statusFilter === 'review' && mappedLabel === 'Needs Review') ||
      (statusFilter === 'unmatched' && (mappedLabel === 'Unmatched' || mappedLabel === 'Failed'));

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: 'Matched',
      value: matched.length.toLocaleString(),
      sub: `${transactions.length ? Math.round((matched.length / transactions.length) * 100) : 0}%`,
      subClass: 'text-[#0f8b4b] bg-[#effaf2]',
      desc: 'Completed this period',
      icon: <CheckCircle2 size={22} className="text-[#0f8b4b]" />,
    },
    {
      label: 'Needs Review',
      value: needsReview.length.toLocaleString(),
      sub: needsReview.length > 0 ? 'Critical' : 'Clear',
      subClass:
        needsReview.length > 0 ? 'text-amber-600 bg-amber-50' : 'text-[#0f8b4b] bg-[#effaf2]',
      desc: 'Requires immediate attention',
      icon: <AlertTriangle size={22} className="text-amber-500" />,
    },
    {
      label: 'Unmatched',
      value: unmatched.length.toLocaleString(),
      sub: 'Pending',
      subClass: 'text-gray-500 bg-gray-100',
      desc: 'Waiting for data feed',
      icon: <XCircle size={22} className="text-gray-400" />,
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white border border-[#f0f4f1] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#f0f4f1] rounded-2xl p-5 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                {s.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                {s.sub && (
                  <span
                    className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s.subClass)}
                  >
                    {s.sub}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900">Recent Transactions</h2>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 w-48"
              />
            </div>
            {/* Filter */}
            <div className="flex items-center gap-1">
              <Filter size={13} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 text-gray-600"
              >
                <option value="all">All</option>
                <option value="matched">Matched</option>
                <option value="review">Needs Review</option>
                <option value="unmatched">Unmatched / Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[
                  'Status',
                  'Customer',
                  'Account',
                  'Reference',
                  'Amount',
                  'Date',
                  'Matched By',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !filtered.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">
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
                  const matchedBy = isMatched ? 'Auto-rule' : null;

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
                      <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                        {tx.narration || tx.customer?.name || 'Anonymous'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {maskAccount(tx.dedicatedAccountNumber)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
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
                        {matchedBy ? (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                            {matchedBy}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isMatched ? (
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                            <ExternalLink size={14} />
                          </button>
                        ) : needsReviewItem ? (
                          <button className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-500 transition-colors">
                            <Edit2 size={14} />
                          </button>
                        ) : (
                          <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                            <AlertTriangle size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
