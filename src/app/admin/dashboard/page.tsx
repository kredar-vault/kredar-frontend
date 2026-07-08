'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import { Users, AlertTriangle, CheckCircle2, XCircle, Search, Bell } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

type Summary = {
  reconciled: number;
  underpaid: number;
  overpaid: number;
  reversed: number;
  failed: number;
  totalTenants: number;
  pendingReview: number;
};

const PIE_COLORS = ['#0a2e1f', '#169E5C', '#d1fae5'];

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .summary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statCards = summary
    ? [
        {
          label: 'Total Tenants',
          value: summary.totalTenants,
          sub: 'Registered accounts',
          icon: Users,
          dark: true,
          href: '/admin/dashboard/tenants',
        },
        {
          label: 'Pending KYB',
          value: summary.pendingReview,
          sub: 'Awaiting review',
          icon: AlertTriangle,
          accent: '#ea580c',
          bg: '#fff7ed',
          href: '/admin/dashboard/tenants?status=UnderReview',
        },
        {
          label: 'Reconciled',
          value: summary.reconciled,
          sub: 'Successfully matched',
          icon: CheckCircle2,
          accent: '#0f8b4b',
          bg: '#effaf2',
          href: '/admin/dashboard/reconciliation',
        },
        {
          label: 'Failed',
          value: summary.failed,
          sub: 'Needs attention',
          icon: XCircle,
          accent: '#dc2626',
          bg: '#fef2f2',
          href: '/admin/dashboard/reconciliation?bucket=failed',
        },
      ]
    : [];

  const barData = summary
    ? [
        { name: 'Reconciled', value: summary.reconciled, fill: '#0f8b4b' },
        { name: 'Underpaid', value: summary.underpaid, fill: '#ca8a04' },
        { name: 'Overpaid', value: summary.overpaid, fill: '#7c3aed' },
        { name: 'Failed', value: summary.failed, fill: '#dc2626' },
        { name: 'Reversed', value: summary.reversed, fill: '#0284c7' },
      ]
    : [];

  const pieData = summary
    ? [
        { name: 'Pending KYB', value: Math.max(summary.pendingReview, 0) },
        {
          name: 'Active',
          value: Math.max(summary.totalTenants - summary.pendingReview, 0),
        },
      ]
    : [];

  const reconciliationRows = summary
    ? [
        { label: 'Underpaid', value: summary.underpaid, color: '#ca8a04', bg: '#fefce8' },
        { label: 'Overpaid', value: summary.overpaid, color: '#7c3aed', bg: '#f5f3ff' },
        { label: 'Reversed', value: summary.reversed, color: '#0284c7', bg: '#eff6ff' },
        { label: 'Failed', value: summary.failed, color: '#dc2626', bg: '#fef2f2' },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#081b10]">Platform Overview</h1>
          <p className="text-sm text-[#8c9c94] mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-9 h-9 bg-white rounded-xl border border-[#e8ede9] flex items-center justify-center text-[#45504b] hover:border-[#0f8b4b] transition-colors">
            <Search size={15} />
          </button>
          <button className="w-9 h-9 bg-white rounded-xl border border-[#e8ede9] flex items-center justify-center text-[#45504b] hover:border-[#0f8b4b] transition-colors">
            <Bell size={15} />
          </button>
          <div className="flex items-center gap-2.5 bg-white border border-[#e8ede9] rounded-xl px-3 py-2">
            <div className="w-7 h-7 bg-[#0a2e1f] rounded-lg flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div>
              <p className="text-xs font-semibold text-[#081b10] leading-none">Admin</p>
              <p className="text-[10px] text-[#8c9c94] mt-0.5">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: left content + right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Left */}
        <div className="space-y-6">
          {/* 4 stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {statCards.map(({ label, value, sub, icon: Icon, dark, accent, bg, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-2xl p-5 relative overflow-hidden block hover:opacity-90 transition-opacity"
                style={{ background: dark ? '#0a2e1f' : bg }}
              >
                {dark && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 60%)',
                    }}
                  />
                )}
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: dark ? 'rgba(255,255,255,0.12)' : '#fff' }}
                  >
                    <Icon size={18} style={{ color: dark ? '#fff' : accent }} />
                  </div>
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: dark ? 'rgba(255,255,255,0.55)' : '#8c9c94' }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-3xl font-bold mt-1 leading-none"
                    style={{ color: dark ? '#fff' : '#081b10' }}
                  >
                    {value.toLocaleString()}
                  </p>
                  <p
                    className="text-[11px] mt-2"
                    style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9ca3a8' }}
                  >
                    {sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8ede9]">
            <div className="mb-5">
              <h2 className="text-base font-bold text-[#081b10]">Reconciliation Overview</h2>
              <p className="text-xs text-[#8c9c94] mt-0.5">Transaction status breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={36} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#8c9c94' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8c9c94' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 10,
                    border: '1px solid #e8ede9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                  cursor={{ fill: '#f5f4ef' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Pie chart */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8ede9]">
            <h2 className="text-base font-bold text-[#081b10]">Tenant Status</h2>
            <p className="text-xs text-[#8c9c94] mt-0.5 mb-2">KYB review breakdown</p>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 10,
                    border: '1px solid #e8ede9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-xs text-[#45504b]">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#081b10]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reconciliation breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8ede9]">
            <h2 className="text-base font-bold text-[#081b10]">Bucket Summary</h2>
            <p className="text-xs text-[#8c9c94] mt-0.5 mb-4">Reconciliation buckets</p>
            <div className="space-y-3">
              {reconciliationRows.map(({ label, value, color, bg }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: bg }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    </div>
                    <span className="text-xs font-medium text-[#45504b]">{label}</span>
                  </div>
                  <span className="text-xs font-bold text-[#081b10]">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
