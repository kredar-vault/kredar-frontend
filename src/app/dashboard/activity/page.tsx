'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Webhook,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  pay_in: 'Payment Received',
  pay_out: 'Transfer Sent',
  webhook: 'Webhook Event',
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  pay_in: <ArrowDownLeft size={14} className="text-[#0f8b4b]" />,
  pay_out: <ArrowUpRight size={14} className="text-blue-500" />,
  webhook: <Webhook size={14} className="text-purple-500" />,
};

const TYPE_BG: Record<string, string> = {
  pay_in: 'bg-[#effaf2]',
  pay_out: 'bg-blue-50',
  webhook: 'bg-purple-50',
};

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
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

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: stats } = useQuery({
    queryKey: ['activity-stats'],
    queryFn: async () => {
      const r = await api.get('/activity/stats');
      return r.data?.data ?? {};
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['activity-feed', page],
    queryFn: async () => {
      const r = await api.get(`/activity?page=${page}&pageSize=30`);
      return r.data?.data ?? { items: [], total: 0 };
    },
    refetchInterval: 30_000,
  });

  const allItems: any[] = data?.items ?? [];
  const items = typeFilter === 'all' ? allItems : allItems.filter((e) => e.type === typeFilter);
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 30));

  const statCards = [
    {
      label: 'Total Events',
      value: stats?.total ?? 0,
      icon: <Activity size={15} />,
      color: 'text-gray-600 bg-gray-50',
    },
    {
      label: 'Pay-ins',
      value: stats?.payIns ?? 0,
      icon: <ArrowDownLeft size={15} />,
      color: 'text-[#0f8b4b] bg-[#effaf2]',
    },
    {
      label: 'Pay-outs',
      value: stats?.payOuts ?? 0,
      icon: <ArrowUpRight size={15} />,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      label: 'Webhook Events',
      value: stats?.webhookEvents ?? 0,
      icon: <Webhook size={15} />,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      label: 'Last 7 Days',
      value: (stats?.last7Days?.payIns ?? 0) + (stats?.last7Days?.payOuts ?? 0),
      icon: <TrendingUp size={15} />,
      color: 'text-[#0f8b4b] bg-[#effaf2]',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Business Activity</h1>
        <p className="text-xs text-[#45504b] mt-0.5">
          One timeline for every important business event
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-[#f0f4f1] rounded-2xl p-4 shadow-sm">
            <div
              className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', s.color)}
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

      {/* Timeline */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 gap-3 flex-wrap">
          <h2 className="text-sm font-bold text-gray-900">Event Timeline</h2>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
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
          {isLoading ? (
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
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              <Activity size={32} className="mx-auto mb-3 text-gray-200" />
              No events found
            </div>
          ) : (
            items.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div
                  className={cn('p-2 rounded-xl flex-shrink-0', TYPE_BG[ev.type] ?? 'bg-gray-50')}
                >
                  {TYPE_ICON[ev.type] ?? <Activity size={14} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {TYPE_LABELS[ev.type] ?? ev.title}
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
                <div className="shrink-0">{statusBadge(ev.status)}</div>
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
    </div>
  );
}
