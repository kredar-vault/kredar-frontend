'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  RefreshCw,
  Webhook,
  ScrollText,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/dashboard/tenants', label: 'Tenants / KYB', icon: Users },
  { href: '/admin/dashboard/reconciliation', label: 'Reconciliation', icon: RefreshCw },
  { href: '/admin/dashboard/webhooks', label: 'Failed Webhooks', icon: Webhook },
  { href: '/admin/dashboard/audit', label: 'Audit Log', icon: ScrollText },
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
    <aside className="hidden lg:flex flex-col bg-[#0a1f16] w-56 min-h-screen flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#0f8b4b] rounded-lg flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={15} className="text-white" />
        </div>
        <span className="text-white font-bold text-base tracking-tight">Kredar Admin</span>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#0f8b4b] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-white/50'} />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <LogOut size={16} />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
