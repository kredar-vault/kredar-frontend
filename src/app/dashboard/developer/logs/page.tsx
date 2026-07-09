'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Webhook,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['activity', page],
    queryFn: async () => {
      const res = await api.get(`/activity?page=${page}&pageSize=30`);
      return res.data?.data ?? { items: [], total: 0 };
    },
  });

  const items: any[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 30));

  const typeIcon = (type: string) => {
    if (type === 'pay_in') return <ArrowDownLeft size={14} className="text-[#0f8b4b]" />;
    if (type === 'pay_out') return <ArrowUpRight size={14} className="text-blue-500" />;
    return <Webhook size={14} className="text-purple-500" />;
  };

  const typeColor = (type: string) => {
    if (type === 'pay_in') return 'bg-[#effaf2]';
    if (type === 'pay_out') return 'bg-blue-50';
    return 'bg-purple-50';
  };

  const statusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (['reconciled', 'succeeded', 'delivered'].includes(s))
      return (
        <span className="text-[10px] font-semibold text-[#0f8b4b] bg-[#effaf2] px-2 py-0.5 rounded-full">
          Success
        </span>
      );
    if (['failed', 'deadletter'].includes(s))
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Activity Logs</h1>
        <p className="text-xs text-[#45504b] mt-0.5">Unified timeline of all platform events</p>
      </div>

      <div className="bg-white border border-[#f0f4f1] rounded-2xl p-6 shadow-sm space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !items.length ? (
          <div className="py-16 text-center text-sm text-gray-400">
            <Activity size={32} className="mx-auto mb-3 text-gray-300" />
            No activity yet
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-4 py-3 hover:bg-gray-50/50 px-2 rounded-xl transition-colors"
              >
                <div className={cn('p-2 rounded-xl', typeColor(ev.type))}>{typeIcon(ev.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 truncate">{ev.description}</p>
                </div>
                {ev.amountNaira != null && (
                  <p className="text-sm font-bold text-gray-800 tabular-nums">
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
