'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Webhook,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WebhooksPage() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['webhook-stats'],
    queryFn: async () => {
      const res = await api.get('/webhooks/logs/stats');
      return res.data?.data ?? {};
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['webhook-logs', page],
    queryFn: async () => {
      const res = await api.get(`/webhooks/logs?page=${page}&pageSize=20`);
      return res.data?.data ?? { items: [], total: 0 };
    },
  });

  const retry = useMutation({
    mutationFn: (id: string) => api.post(`/webhooks/logs/${id}/retry`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhook-logs'] });
      qc.invalidateQueries({ queryKey: ['webhook-stats'] });
    },
  });

  const items: any[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const statusIcon = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return <CheckCircle2 size={14} className="text-[#0f8b4b]" />;
    if (s === 'failed' || s === 'deadletter') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-amber-500" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Webhooks</h1>
        <p className="text-xs text-[#45504b] mt-0.5">
          Monitor webhook delivery attempts and retry failures
        </p>
      </div>

      <div className="bg-white border border-[#f0f4f1] rounded-2xl p-6 shadow-sm space-y-6">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'Total',
                value: stats.total,
                icon: <Webhook size={14} />,
                color: 'text-gray-600',
              },
              {
                label: 'Delivered',
                value: stats.delivered,
                icon: <CheckCircle2 size={14} />,
                color: 'text-[#0f8b4b]',
              },
              {
                label: 'Failed',
                value: stats.failed,
                icon: <XCircle size={14} />,
                color: 'text-red-500',
              },
              {
                label: 'Pending',
                value: stats.pending,
                icon: <Clock size={14} />,
                color: 'text-amber-500',
              },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <span className={s.color}>{s.icon}</span>
                <div>
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-lg font-bold text-gray-900">{s.value ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !items.length ? (
          <div className="py-16 text-center text-sm text-gray-400">
            <AlertTriangle size={32} className="mx-auto mb-3 text-gray-300" />
            No webhook deliveries yet
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 py-3 hover:bg-gray-50/50 px-2 rounded-xl transition-colors"
              >
                {statusIcon(d.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{d.eventType}</p>
                  {d.lastError && (
                    <p className="text-[11px] text-red-400 truncate">{d.lastError}</p>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 tabular-nums hidden sm:block">
                  {d.attempts} attempt{d.attempts !== 1 ? 's' : ''}
                </span>
                {d.lastStatusCode && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      d.lastStatusCode < 300
                        ? 'bg-[#effaf2] text-[#0f8b4b]'
                        : 'bg-red-50 text-red-600',
                    )}
                  >
                    {d.lastStatusCode}
                  </span>
                )}
                <p className="text-[10px] text-gray-400 tabular-nums shrink-0 hidden md:block">
                  {new Date(d.createdAt).toLocaleString('en-NG', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </p>
                {(d.status?.toLowerCase() === 'failed' ||
                  d.status?.toLowerCase() === 'deadletter') && (
                  <button
                    onClick={() => retry.mutate(d.id)}
                    disabled={retry.isPending}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
                    title="Retry"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
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
