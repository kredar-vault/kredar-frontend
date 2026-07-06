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
import { cn } from '@/lib/utils';

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
    <aside className="hidden lg:flex flex-col bg-white border-r border-[#d8e1da] w-60 min-h-screen flex-shrink-0">
      {/* Header */}
      <div className="px-6 py-6 border-b border-[#f0f4f1] flex items-center gap-2">
        <ShieldCheck size={20} className="text-[#0f8b4b]" />
        <span className="font-bold text-[#081b10] text-lg tracking-tight">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <a
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive(href, exact)
                ? 'bg-[#f0faf5] text-[#0f8b4b] font-semibold'
                : 'text-[#45504b] hover:bg-[#f7faf6]',
            )}
          >
            <Icon size={17} />
            {label}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#f0f4f1]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[#45504b] hover:bg-[#fff0f0] hover:text-red-600 transition-colors"
        >
          <LogOut size={17} />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
