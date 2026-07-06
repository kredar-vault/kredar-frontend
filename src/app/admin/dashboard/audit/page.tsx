'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

type AuditEntry = {
  id: string;
  adminEmail: string;
  action: string;
  targetTenantId?: string;
  detail?: string;
  createdAt: string;
};

const ACTION_COLORS: Record<string, string> = {
  ApproveOnboarding: 'bg-green-100 text-green-700',
  RejectOnboarding: 'bg-red-100 text-red-700',
  SuspendTenant: 'bg-red-100 text-red-700',
  UnsuspendTenant: 'bg-gray-100 text-gray-600',
  RequestMoreInfo: 'bg-orange-100 text-orange-700',
  ForceReconcile: 'bg-blue-100 text-blue-700',
  ReverseTransaction: 'bg-purple-100 text-purple-700',
};

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ total: number; items: AuditEntry[] }>({ total: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi
      .audit(undefined, page)
      .then((d) => setData(d as { total: number; items: AuditEntry[] }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Audit Log</h1>
        <p className="text-sm text-[#45504b] mt-1">All admin actions on the platform</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#f0f4f1]">
          <span className="text-sm font-semibold text-[#081b10]">{data.total} entries</span>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-[#d8e1da] bg-[#f7faf6]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Admin</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Action</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Tenant</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Detail</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">When</th>
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
              : data.items.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#f0f4f1] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-5 py-4 text-[#081b10] font-medium">{entry.adminEmail}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#45504b]">
                      {entry.targetTenantId ? entry.targetTenantId.slice(0, 8) + '…' : '—'}
                    </td>
                    <td className="px-5 py-4 text-[#45504b] max-w-[200px] truncate">
                      {entry.detail ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[#45504b]">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#45504b]">
                  No audit entries yet.
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
