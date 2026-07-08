'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';

type Tenant = {
  tenantId: string;
  email: string;
  businessName?: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  onboardingStatus: string;
  submittedAt?: string;
};

const STATUS_OPTIONS = [
  '',
  'NotStarted',
  'Pending',
  'UnderReview',
  'MoreInfoRequired',
  'Approved',
  'Rejected',
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    Approved: 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]',
    Rejected: 'bg-red-50 text-red-700 border-red-100',
    UnderReview: 'bg-amber-50 text-amber-700 border-amber-100',
    MoreInfoRequired: 'bg-orange-50 text-orange-700 border-orange-100',
    Pending: 'bg-[#f7faf6] text-[#45504b] border-[#d8e1da]',
    NotStarted: 'bg-gray-50 text-gray-400 border-gray-200',
  };
  return map[s] ?? 'bg-[#f7faf6] text-[#45504b] border-[#d8e1da]';
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    NotStarted: 'Not Started',
    UnderReview: 'Under Review',
    MoreInfoRequired: 'More Info Required',
  };
  return map[s] ?? s;
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#081b10]">Tenants & KYB</h1>
            {!loading && (
              <span className="text-sm font-semibold text-[#0f8b4b] bg-[#effaf2] px-2.5 py-0.5 rounded-full">
                {tenants.length}
              </span>
            )}
          </div>
          <p className="text-sm text-[#45504b] mt-0.5">
            All registered accounts and onboarding status
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-[#d8e1da] bg-white rounded-xl px-3 py-2 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors flex-shrink-0"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
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
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4f1] bg-[#f7faf6]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Account
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Email
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Onboarding
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Verified
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Joined
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-28" />
                      </div>
                    </td>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-12 ml-auto" />
                    </td>
                  </tr>
                ))
              : tenants.map((t) => {
                  const display = t.businessName ?? t.email.split('@')[0];
                  const joined = new Date(t.createdAt).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  return (
                    <tr key={t.tenantId} className="hover:bg-[#f7faf6]/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#effaf2] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#0f8b4b]">
                              {initials(display)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#081b10]">{display}</p>
                            {t.isSuspended && (
                              <span className="text-[10px] font-semibold text-red-600">
                                Suspended
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#45504b]">{t.email}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(t.onboardingStatus)}`}
                        >
                          {statusLabel(t.onboardingStatus)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            t.isVerified
                              ? 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]'
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}
                        >
                          {t.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#45504b]">{joined}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/dashboard/tenants/${t.tenantId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f8b4b] hover:text-[#0c703c] transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            {!loading && tenants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <p className="text-sm text-[#45504b]">No tenants found for this filter.</p>
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
