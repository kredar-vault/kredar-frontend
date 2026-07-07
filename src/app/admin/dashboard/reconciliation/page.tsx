'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import { CheckCircle2, RotateCcw } from 'lucide-react';

type Tx = {
  id: string;
  status: string;
  amountNaira?: number;
  createdAt?: string;
  reference?: string;
  tenantId?: string;
};

const BUCKETS = [
  { value: '', label: 'All' },
  { value: 'underpaid', label: 'Underpaid' },
  { value: 'overpaid', label: 'Overpaid' },
  { value: 'reversed', label: 'Reversed' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]',
    Underpaid: 'bg-amber-50 text-amber-700 border-amber-100',
    Overpaid: 'bg-violet-50 text-violet-700 border-violet-100',
    Reversed: 'bg-[#f7faf6] text-[#45504b] border-[#d8e1da]',
    Failed: 'bg-red-50 text-red-700 border-red-100',
    Pending: 'bg-blue-50 text-blue-700 border-blue-100',
  };
  return map[s] ?? 'bg-[#f7faf6] text-[#45504b] border-[#d8e1da]';
};

function ReconciliationContent() {
  const searchParams = useSearchParams();
  const defaultBucket = searchParams.get('bucket') ?? '';
  const [bucket, setBucket] = useState(defaultBucket);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ total: number; items: Tx[] }>({ total: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const load = () => {
    setLoading(true);
    adminApi
      .reconciliation(bucket || undefined, page)
      .then((d) => setData(d as { total: number; items: Tx[] }))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [bucket, page]);

  const forceReconcile = async (txId: string) => {
    setActionLoading(txId);
    try {
      await adminApi.forceReconcile(txId);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setActionLoading('');
    }
  };

  const reverse = async (txId: string) => {
    setActionLoading(`rev-${txId}`);
    try {
      await adminApi.reverse(txId);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#081b10]">Reconciliation</h1>
          <p className="text-sm text-[#45504b] mt-0.5">Review and resolve transaction exceptions</p>
        </div>
        <select
          value={bucket}
          onChange={(e) => {
            setBucket(e.target.value);
            setPage(1);
          }}
          className="border border-[#d8e1da] bg-white rounded-xl px-3 py-2 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors flex-shrink-0"
        >
          {BUCKETS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f4f1] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#081b10]">
            {data.total} transaction{data.total !== 1 ? 's' : ''}
          </span>
          {bucket && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(bucket.charAt(0).toUpperCase() + bucket.slice(1))}`}
            >
              {bucket.charAt(0).toUpperCase() + bucket.slice(1)}
            </span>
          )}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4f1] bg-[#f7faf6]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Reference
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Amount
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Date
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
              : data.items.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f7faf6]/70 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#45504b]">
                      {tx.reference ?? tx.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#081b10]">
                      {tx.amountNaira != null ? `₦${tx.amountNaira.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(tx.status)}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#45504b]">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => forceReconcile(tx.id)}
                          disabled={!!actionLoading}
                          title="Force reconcile"
                          className="p-2 rounded-lg hover:bg-[#effaf2] text-[#0f8b4b] transition-colors disabled:opacity-40"
                        >
                          {actionLoading === tx.id ? (
                            <span className="text-xs">…</span>
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                        </button>
                        <button
                          onClick={() => reverse(tx.id)}
                          disabled={!!actionLoading}
                          title="Reverse"
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-40"
                        >
                          {actionLoading === `rev-${tx.id}` ? (
                            <span className="text-xs">…</span>
                          ) : (
                            <RotateCcw size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm text-[#45504b]">
                  No transactions found.
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

export default function ReconciliationPage() {
  return (
    <Suspense>
      <ReconciliationContent />
    </Suspense>
  );
}
