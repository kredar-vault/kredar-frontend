'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';

type Tenant = {
  id?: string;
  tenantId?: string;
  status?: string;
  submittedAt?: string;
  tenant?: { id: string; email: string; businessName?: string; isSuspended?: boolean };
};

const STATUS_OPTIONS = ['', 'Pending', 'UnderReview', 'MoreInfoRequired', 'Approved', 'Rejected'];

const STATUS_COLORS: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  UnderReview: 'bg-yellow-100 text-yellow-700',
  MoreInfoRequired: 'bg-orange-100 text-orange-700',
  Pending: 'bg-gray-100 text-gray-600',
};

function TenantsContent() {
  const searchParams = useSearchParams();
  const defaultStatus = searchParams.get('status') ?? '';
  const [status, setStatus] = useState(defaultStatus);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi
      .tenants(status || undefined)
      .then((data) => setTenants(data as Tenant[]))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#081b10]">Tenants & KYB</h1>
          <p className="text-sm text-[#45504b] mt-1">Review onboarding applications</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-[#d8e1da] rounded-lg px-3 py-2 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s}
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
        <table className="w-full text-sm">
          <thead className="border-b border-[#d8e1da] bg-[#f7faf6]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Business</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#45504b]">
                Submitted
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
              : tenants.map((t) => {
                  const tenantId = t.tenant?.id ?? t.tenantId ?? t.id ?? '';
                  const email = t.tenant?.email ?? '—';
                  const business = t.tenant?.businessName ?? '—';
                  const st = (t.status ?? 'Unknown') as string;
                  const submitted = t.submittedAt
                    ? new Date(t.submittedAt).toLocaleDateString()
                    : '—';
                  return (
                    <tr
                      key={tenantId}
                      className="border-b border-[#f0f4f1] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-[#081b10]">{business}</td>
                      <td className="px-5 py-4 text-[#45504b]">{email}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[st] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {st}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#45504b]">{submitted}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/dashboard/tenants/${tenantId}`}
                          className="text-xs font-semibold text-[#0f8b4b] hover:underline"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            {!loading && tenants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#45504b]">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  return (
    <Suspense>
      <TenantsContent />
    </Suspense>
  );
}
