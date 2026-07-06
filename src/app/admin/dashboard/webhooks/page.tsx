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
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  const retry = async (id: string) => {
    setRetrying(id);
    try {
      await adminApi.retryWebhook(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Retry failed');
    } finally {
      setRetrying('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Failed Webhooks</h1>
        <p className="text-sm text-[#45504b] mt-1">Retry failed webhook deliveries</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#f0f4f1]">
          <span className="text-sm font-semibold text-[#081b10]">
            {data.total} failed deliveries
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-[#d8e1da] bg-[#f7faf6]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">URL</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Attempts</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">
                Last Attempt
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#f0f4f1]">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.items.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-[#f0f4f1] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-[#45504b]">
                      {d.id.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-4 text-[#45504b] max-w-[240px] truncate">
                      {d.url ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[#081b10]">{d.attempts ?? '—'}</td>
                    <td className="px-5 py-4 text-[#45504b]">
                      {d.lastAttemptAt ? new Date(d.lastAttemptAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => retry(d.id)}
                        disabled={!!retrying}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#0f8b4b] hover:underline disabled:opacity-40 ml-auto"
                      >
                        <RefreshCw size={13} className={retrying === d.id ? 'animate-spin' : ''} />
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#45504b]">
                  No failed webhook deliveries.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {data.total > 50 && (
          <div className="px-5 py-4 border-t border-[#f0f4f1] flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-[#45504b] disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-[#45504b]">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.items.length < 50}
              className="text-sm text-[#45504b] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
