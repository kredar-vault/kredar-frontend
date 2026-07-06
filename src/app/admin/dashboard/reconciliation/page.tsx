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

const BUCKETS = ['', 'underpaid', 'overpaid', 'reversed', 'failed', 'pending'];

const STATUS_COLORS: Record<string, string> = {
  Reconciled: 'bg-green-100 text-green-700',
  Underpaid: 'bg-yellow-100 text-yellow-700',
  Overpaid: 'bg-purple-100 text-purple-700',
  Reversed: 'bg-gray-100 text-gray-600',
  Failed: 'bg-red-100 text-red-700',
  Pending: 'bg-blue-100 text-blue-700',
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
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [bucket, page]);

  const forceReconcile = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.forceReconcile(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setActionLoading('');
    }
  };

  const reverse = async (id: string) => {
    setActionLoading(`rev-${id}`);
    try {
      await adminApi.reverse(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#081b10]">Reconciliation</h1>
          <p className="text-sm text-[#45504b] mt-1">Review and resolve transaction exceptions</p>
        </div>
        <select
          value={bucket}
          onChange={(e) => {
            setBucket(e.target.value);
            setPage(1);
          }}
          className="border border-[#d8e1da] rounded-lg px-3 py-2 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30"
        >
          {BUCKETS.map((b) => (
            <option key={b} value={b}>
              {b || 'All'}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#f0f4f1] flex justify-between items-center">
          <span className="text-sm font-semibold text-[#081b10]">{data.total} transactions</span>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-[#d8e1da] bg-[#f7faf6]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">
                Reference
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Created</th>
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
              : data.items.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-[#f0f4f1] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-[#45504b]">
                      {tx.reference ?? tx.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#081b10]">
                      {tx.amountNaira != null ? `₦${tx.amountNaira.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[tx.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#45504b]">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => forceReconcile(tx.id)}
                          disabled={!!actionLoading}
                          title="Force reconcile"
                          className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors disabled:opacity-40"
                        >
                          {actionLoading === tx.id ? '…' : <CheckCircle2 size={15} />}
                        </button>
                        <button
                          onClick={() => reverse(tx.id)}
                          disabled={!!actionLoading}
                          title="Reverse"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-40"
                        >
                          {actionLoading === `rev-${tx.id}` ? '…' : <RotateCcw size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#45504b]">
                  No transactions found.
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
              className="text-sm text-[#45504b] disabled:opacity-40 hover:text-[#081b10]"
            >
              ← Prev
            </button>
            <span className="text-sm text-[#45504b]">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.items.length < 50}
              className="text-sm text-[#45504b] disabled:opacity-40 hover:text-[#081b10]"
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
