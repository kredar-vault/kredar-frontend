'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { RefreshCw } from 'lucide-react';

type Delivery = {
  id: string;
  status: string;
  url?: string;
  attempts?: number;
  createdAt?: string;
  lastAttemptAt?: string;
};

export default function WebhooksPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ total: number; items: Delivery[] }>({ total: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState('');

  const load = () => {
    setLoading(true);
    adminApi
      .failedWebhooks(page)
      .then((d) => setData(d as { total: number; items: Delivery[] }))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  const retry = async (deliveryId: string) => {
    setRetrying(deliveryId);
    try {
      await adminApi.retryWebhook(deliveryId);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Retry failed');
    } finally {
      setRetrying('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#081b10]">Failed Webhooks</h1>
        <p className="text-sm text-[#45504b] mt-0.5">Retry failed webhook deliveries</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f4f1] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#081b10]">
            {data.total} failed deliver{data.total !== 1 ? 'ies' : 'y'}
          </span>
          {data.total > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-100">
              Action required
            </span>
          )}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4f1] bg-[#f7faf6]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                ID
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Endpoint URL
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Attempts
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Last Attempt
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.items.map((d) => (
                  <tr key={d.id} className="hover:bg-[#f7faf6]/70 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#45504b]">
                      {d.id.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-4 text-[#45504b] max-w-[220px] truncate">
                      {d.url ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-100">
                        {d.attempts ?? 0}×
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#45504b] text-xs">
                      {d.lastAttemptAt
                        ? new Date(d.lastAttemptAt).toLocaleString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => retry(d.id)}
                        disabled={!!retrying}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#0f8b4b] hover:text-[#0c703c] disabled:opacity-40 transition-colors ml-auto"
                      >
                        <RefreshCw size={13} className={retrying === d.id ? 'animate-spin' : ''} />
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium text-[#081b10]">All deliveries successful</p>
                  <p className="text-xs text-[#45504b] mt-1">No failed webhooks to show.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {data.total > 50 && (
          <div className="px-5 py-4 border-t border-[#f0f4f1] flex items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm font-medium text-[#45504b] disabled:opacity-40 hover:text-[#081b10] transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-[#45504b]">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.items.length < 50}
              className="text-sm font-medium text-[#45504b] disabled:opacity-40 hover:text-[#081b10] transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
