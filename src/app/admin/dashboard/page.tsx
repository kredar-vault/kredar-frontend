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

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .summary()
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = summary
    ? [
        {
          label: 'Total Tenants',
          value: summary.totalTenants,
          icon: Users,
          color: '#0f8b4b',
          href: '/admin/dashboard/tenants',
        },
        {
          label: 'Pending KYB Review',
          value: summary.pendingReview,
          icon: AlertTriangle,
          color: '#ea580c',
          href: '/admin/dashboard/tenants?status=UnderReview',
        },
        {
          label: 'Reconciled',
          value: summary.reconciled,
          icon: CheckCircle2,
          color: '#0f8b4b',
          href: '/admin/dashboard/reconciliation',
        },
        {
          label: 'Underpaid',
          value: summary.underpaid,
          icon: RefreshCw,
          color: '#ca8a04',
          href: '/admin/dashboard/reconciliation?bucket=underpaid',
        },
        {
          label: 'Overpaid',
          value: summary.overpaid,
          icon: RefreshCw,
          color: '#7c3aed',
          href: '/admin/dashboard/reconciliation?bucket=overpaid',
        },
        {
          label: 'Failed Transactions',
          value: summary.failed,
          icon: Webhook,
          color: '#dc2626',
          href: '/admin/dashboard/reconciliation?bucket=failed',
        },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Admin Overview</h1>
        <p className="text-sm text-[#45504b] mt-1">Platform health and KYB review queue</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[120px] animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(({ label, value, icon: Icon, color, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#45504b]">{label}</span>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-3xl font-bold text-[#081b10] tracking-tight mt-2">{value}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
