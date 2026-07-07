'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import { Users, AlertTriangle, RefreshCw, Webhook, CheckCircle2 } from 'lucide-react';

type Summary = {
  reconciled: number;
  underpaid: number;
  overpaid: number;
  reversed: number;
  failed: number;
  totalTenants: number;
  pendingReview: number;
};

const metrics = (s: Summary) => [
  {
    label: 'Total Tenants',
    value: s.totalTenants,
    icon: Users,
    accent: '#0f8b4b',
    bg: '#effaf2',
    href: '/admin/dashboard/tenants',
  },
  {
    label: 'Pending KYB',
    value: s.pendingReview,
    icon: AlertTriangle,
    accent: '#ea580c',
    bg: '#fff7ed',
    href: '/admin/dashboard/tenants?status=UnderReview',
  },
  {
    label: 'Reconciled',
    value: s.reconciled,
    icon: CheckCircle2,
    accent: '#0f8b4b',
    bg: '#effaf2',
    href: '/admin/dashboard/reconciliation',
  },
  {
    label: 'Underpaid',
    value: s.underpaid,
    icon: RefreshCw,
    accent: '#ca8a04',
    bg: '#fefce8',
    href: '/admin/dashboard/reconciliation?bucket=underpaid',
  },
  {
    label: 'Overpaid',
    value: s.overpaid,
    icon: RefreshCw,
    accent: '#7c3aed',
    bg: '#f5f3ff',
    href: '/admin/dashboard/reconciliation?bucket=overpaid',
  },
  {
    label: 'Failed',
    value: s.failed,
    icon: Webhook,
    accent: '#dc2626',
    bg: '#fef2f2',
    href: '/admin/dashboard/reconciliation?bucket=failed',
  },
];

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .summary()
      .then(setSummary)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-[#0a1f16] rounded-2xl px-7 py-6 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
            Admin Portal
          </p>
          <h1 className="text-white text-2xl font-bold">Platform Overview</h1>
          <p className="text-white/40 text-sm mt-1">Health metrics and KYB review queue</p>
        </div>
        {summary && (
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-white/40 text-xs">Tenants</p>
              <p className="text-white text-2xl font-bold">{summary.totalTenants}</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right">
              <p className="text-white/40 text-xs">Pending KYB</p>
              <p
                className={`text-2xl font-bold ${summary.pendingReview > 0 ? 'text-orange-400' : 'text-white'}`}
              >
                {summary.pendingReview}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metric grid */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#d8e1da] rounded-2xl p-5 h-[108px] animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics(summary).map(({ label, value, icon: Icon, accent, bg, href }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#c5d6cc] transition-all"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg }}
                >
                  <Icon size={17} style={{ color: accent }} />
                </div>
                <span
                  className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: accent }}
                >
                  View →
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[28px] font-bold text-[#081b10] leading-none">{value}</p>
                <p className="text-xs text-[#45504b] font-medium mt-1">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
