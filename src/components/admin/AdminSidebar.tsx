'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, RefreshCw, Webhook, ScrollText, LogOut } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
};
type Section = { label: string; items: NavItem[] };

import React from 'react';
import Button from '../features/landing/Button';

const sections: Section[] = [
  {
    label: 'PORTAL',
    items: [{ href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { href: '/admin/dashboard/tenants', label: 'Tenants / KYB', icon: Users },
      { href: '/admin/dashboard/reconciliation', label: 'Reconciliation', icon: RefreshCw },
    ],
  },
  {
    label: 'MONITORING',
    items: [
      { href: '/admin/dashboard/webhooks', label: 'Failed Webhooks', icon: Webhook },
      { href: '/admin/dashboard/audit', label: 'Audit Log', icon: ScrollText },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    localStorage.removeItem('kredar_admin_token');
    router.replace('/admin/login');
  };

  return (
    <aside className="hidden lg:flex flex-col bg-white w-64 min-h-screen flex-shrink-0 border-r border-[#e8ede9]">
      {/* Logo */}
      <div className="px-6 py-5">
        <KredarLogo />
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-4 space-y-5 mt-2">
        {sections.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10px] font-bold text-[#9ca3a8] tracking-widest uppercase px-3 mb-1.5">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <a
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#0a2e1f] text-white'
                        : 'text-[#45504b] hover:text-[#081b10] hover:bg-[#f0f4f1]'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-white' : 'text-[#8c9c94]'} />
                    {itemLabel}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom card */}
      <div className="p-4">
        <div className="bg-[#0a2e1f] rounded-2xl p-4 text-white">
          <div className="w-7 h-7 bg-[#0f8b4b] rounded-lg flex items-center justify-center mb-3">
            <img src="/images/Vector(1).png" alt="K" className="w-4 h-4" />
          </div>
          <p className="font-bold text-sm">Kredar Admin</p>
          <p className="text-white/50 text-xs mt-1 leading-relaxed">
            Full control over your platform
          </p>
          <Button
            onClick={handleLogout}
            className="mt-3 w-full bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut size={12} />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}
