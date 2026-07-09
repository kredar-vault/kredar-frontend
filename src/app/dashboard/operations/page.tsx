'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  Users,
  Wallet,
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n);

const statusIcon = (status: string) => {
  const s = status?.toLowerCase();
  if (['reconciled', 'succeeded', 'overpaid'].includes(s))
    return <CheckCircle2 size={14} className="text-[#0f8b4b]" />;
  if (['failed', 'reversed'].includes(s)) return <XCircle size={14} className="text-red-500" />;
  return <AlertTriangle size={14} className="text-amber-500" />;
};

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (['reconciled', 'succeeded', 'overpaid'].includes(s))
    return (
      <span className="text-[10px] font-semibold text-[#0f8b4b] bg-[#effaf2] px-2 py-0.5 rounded-full">
        {status}
      </span>
    );
  if (['failed', 'reversed'].includes(s))
    return (
      <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        {status}
      </span>
    );
  return (
    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
      {status}
    </span>
  );
};

export default function OperationsPage() {
  const { data: overview, isLoading: ovLoading } = useQuery({
    queryKey: ['operations-overview'],
    queryFn: async () => {
      const r = await api.get('/operations/overview');
      return r.data?.data ?? {};
    },
    refetchInterval: 30_000,
  });

  const { data: recent = [], isLoading: recLoading } = useQuery({
    queryKey: ['operations-recent'],
    queryFn: async () => {
      const r = await api.get('/operations/recent');
      return r.data?.data ?? [];
    },
    refetchInterval: 30_000,
  });

  const cards = [
    {
      label: 'Total Customers',
      value: overview?.totalCustomers?.toLocaleString() ?? '—',
      icon: <Users size={18} className="text-[#0f8b4b]" />,
      bg: 'bg-[#effaf2]',
      href: '/dashboard/customers',
    },
    {
      label: 'Active DVAs',
      value: overview?.activeDvas?.toLocaleString() ?? '—',
      icon: <Wallet size={18} className="text-blue-500" />,
      bg: 'bg-blue-50',
      href: '/dashboard/balances',
    },
    {
      label: "Today's Volume",
      value: overview?.todayVolume != null ? fmt(overview.todayVolume) : '—',
      icon: <TrendingUp size={18} className="text-purple-500" />,
      bg: 'bg-purple-50',
      href: '/dashboard/transactions',
    },
    {
      label: 'Pending Transfers',
      value: overview?.pendingTransfers?.toLocaleString() ?? '—',
      icon: <Clock size={18} className="text-amber-500" />,
      bg: 'bg-amber-50',
      href: '/dashboard/balances',
    },
    {
      label: 'Settlement Balance',
      value: overview?.settlementBalance != null ? fmt(overview.settlementBalance) : '—',
      icon: <Activity size={18} className="text-[#0f8b4b]" />,
      bg: 'bg-[#effaf2]',
      href: '/dashboard/balances',
    },
  ];

  const quickActions = [
    { label: 'Create Customer', icon: <Plus size={14} />, href: '/dashboard/customers/new' },
    { label: 'Send Money', icon: <Send size={14} />, href: '/dashboard/balances' },
    { label: 'Reconcile', icon: <RefreshCw size={14} />, href: '/dashboard/reconciliation' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Operations</h1>
          <p className="text-xs text-[#45504b] mt-0.5">
            Real-time operational overview of your business
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e8ede9] text-xs font-semibold text-[#081b10] hover:bg-[#f7faf6] transition-colors"
            >
              {a.icon}
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-[#f0f4f1] rounded-2xl p-5 shadow-sm hover:border-[#0f8b4b]/20 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {c.label}
              </p>
              <div className={cn('p-2 rounded-xl', c.bg)}>{c.icon}</div>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#081b10] tracking-tight">
              {ovLoading ? (
                <span className="inline-block h-7 w-24 bg-gray-100 rounded animate-pulse" />
              ) : (
                c.value
              )}
            </p>
          </Link>
        ))}
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0f8b4b] animate-pulse" />
            <h2 className="text-sm font-bold text-gray-900">Live Activity</h2>
          </div>
          <Link
            href="/dashboard/activity"
            className="text-[11px] font-semibold text-[#0f8b4b] hover:text-[#0a7040] transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {recLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-28" />
                </div>
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
              </div>
            ))
          ) : recent.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No recent activity</div>
          ) : (
            recent.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div
                  className={cn(
                    'p-2 rounded-xl flex-shrink-0',
                    item.type === 'transaction' ? 'bg-[#effaf2]' : 'bg-blue-50',
                  )}
                >
                  {item.type === 'transaction' ? (
                    <ArrowDownLeft size={14} className="text-[#0f8b4b]" />
                  ) : (
                    <ArrowUpRight size={14} className="text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.narration ||
                      (item.type === 'transaction' ? 'Payment received' : 'Transfer sent')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString('en-NG', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                {item.amount != null && (
                  <p className="text-sm font-bold text-gray-900 tabular-nums">{fmt(item.amount)}</p>
                )}
                <div>{statusIcon(item.status)}</div>
                {statusBadge(item.status)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
