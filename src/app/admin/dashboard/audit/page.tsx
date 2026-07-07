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

const actionBadge = (action: string) => {
  const map: Record<string, string> = {
    ApproveOnboarding: 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]',
    RejectOnboarding: 'bg-red-50 text-red-700 border-red-100',
    SuspendTenant: 'bg-red-50 text-red-700 border-red-100',
    UnsuspendTenant: 'bg-[#f7faf6] text-[#45504b] border-[#d8e1da]',
    RequestMoreInfo: 'bg-orange-50 text-orange-700 border-orange-100',
    ForceReconcile: 'bg-blue-50 text-blue-700 border-blue-100',
    ReverseTransaction: 'bg-violet-50 text-violet-700 border-violet-100',
  };
  return map[action] ?? 'bg-[#f7faf6] text-[#45504b] border-[#d8e1da]';
};

const formatAction = (a: string) => a.replace(/([A-Z])/g, ' $1').trim();

const adminInitial = (email: string) => email?.[0]?.toUpperCase() ?? '?';

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
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#081b10]">Audit Log</h1>
        <p className="text-sm text-[#45504b] mt-0.5">All admin actions on the platform</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f4f1]">
          <span className="text-sm font-semibold text-[#081b10]">
            {data.total} entr{data.total !== 1 ? 'ies' : 'y'}
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4f1] bg-[#f7faf6]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Admin
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Action
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Tenant
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Detail
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                When
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                      </div>
                    </td>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.items.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#f7faf6]/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#effaf2] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#0f8b4b]">
                            {adminInitial(entry.adminEmail)}
                          </span>
                        </div>
                        <span className="text-[#081b10] font-medium text-xs">
                          {entry.adminEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${actionBadge(entry.action)}`}
                      >
                        {formatAction(entry.action)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#45504b]">
                      {entry.targetTenantId ? entry.targetTenantId.slice(0, 8) + '…' : '—'}
                    </td>
                    <td className="px-5 py-4 text-[#45504b] text-xs max-w-[180px] truncate">
                      {entry.detail ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[#45504b] text-xs whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm text-[#45504b]">
                  No audit entries yet.
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
