'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Users,
  ArrowLeftRight,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  CalendarRange,
  Code2,
  Globe,
  Webhook,
  GitMerge,
  Building2,
  Activity,
  Bell,
} from 'lucide-react';
import KredarLogo from './KredarLogo';
import LogoutConfirmModal from './auth/LogoutConfirmModal';
import { cn } from '@/lib/utils';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getCurrentUser, clearAuthCookies } from '@/lib/cookies';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/balances', label: 'Balances', icon: Wallet },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/dashboard/reconciliation', label: 'Reconciliation', icon: GitMerge },
  { href: '/dashboard/operations', label: 'Operations', icon: Building2 },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity },
  { href: '/dashboard/inbox', label: 'Inbox', icon: Bell },
  { href: '/dashboard/sub-merchants', label: 'Sub-merchants', icon: Store },
  { href: '/dashboard/billing', label: 'Billing', icon: CalendarRange },
];

const developerItems: NavItem[] = [
  { href: '/dashboard/developer/api-explorer', label: 'API Playground', icon: Globe },
  { href: '/dashboard/developer/webhooks', label: 'Webhooks', icon: Webhook },
];

const bottomNavItems: NavItem[] = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/help', label: 'Help', icon: HelpCircle },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigate?: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [fallbackEmail, setFallbackEmail] = useState('');

  const { data: profile } = useTenantProfile();

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.email) setFallbackEmail(user.email);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = () => {
    if (profile?.businessName) return profile.businessName.substring(0, 2).toUpperCase();
    if (fallbackEmail) return fallbackEmail.substring(0, 2).toUpperCase();
    return 'ME';
  };

  const getDisplayName = () => profile?.businessName || profile?.legalName || 'Merchant';

  const handleItemClick = (href: string) => {
    onCloseMobile();
    if (pathname !== href && onNavigate) onNavigate();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      clearAuthCookies();
      router.replace('/auth/login');
    }, 1200);
  };

  // Each row: icon lives in the 48px green-pill zone, text in the white zone.
  // Using a single <Link> per row guarantees icon and label are always aligned.
  const NavRow = ({
    item,
    active,
    iconSize = 16,
  }: {
    item: NavItem;
    active: boolean;
    iconSize?: number;
  }) => (
    <Link
      href={item.href}
      onClick={() => handleItemClick(item.href)}
      title={isCollapsed ? item.label : undefined}
      className="relative flex items-center h-[30px] w-full"
    >
      {/* Active indicator on the left edge of the green pill */}
      {active && <div className="absolute left-0 w-0.5 h-3.5 bg-white rounded-r-sm z-10" />}

      {/* Icon zone — sits over the green pill */}
      <div className="w-12 flex-shrink-0 flex items-center justify-center z-10">
        <item.icon
          size={iconSize}
          className={cn(
            'transition-colors',
            active ? 'text-white' : 'text-white/60 hover:text-white',
          )}
        />
      </div>

      {/* Text zone — white area to the right */}
      {!isCollapsed && (
        <div
          className={cn(
            'flex-1 flex items-center px-2 h-full rounded-xl text-xs transition-all duration-150',
            active
              ? 'bg-[#0a2e1f] text-white font-semibold'
              : 'text-[#45504b] hover:bg-[#f7faf6] hover:text-[#081b10]',
          )}
        >
          {loading ? (
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          ) : (
            <span className="truncate">{item.label}</span>
          )}
        </div>
      )}
    </Link>
  );

  const sidebarContent = (
    // Outer wrapper: relative so the green pill can be absolute inside
    <div className="h-full relative bg-white overflow-hidden border-r border-gray-100">
      {/* ── Green capsule pill — absolutely behind the icon column ── */}
      <div className="absolute left-3 top-3 bottom-3 w-12 bg-[#006C49] rounded-full pointer-events-none" />

      {/* ── Single-column content ── */}
      <div className="relative h-full flex flex-col p-3">
        {/* Logo — offset right past the pill */}
        <div className="h-[44px] flex items-center mt-6 pl-[56px] flex-shrink-0">
          <KredarLogo hideText={isCollapsed} />
        </div>

        {/* Main nav — scrollable middle zone */}
        <nav className="mt-3 space-y-1 flex-1">
          {mainNavItems.map((item) => (
            <NavRow key={item.href} item={item} active={isActive(item.href, item.exact)} />
          ))}
        </nav>

        {/* Bottom group */}
        <div>
          {/* Developer section */}
          <div className="mb-2">
            {!isCollapsed && (
              <p className="pl-[56px] mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Developer
              </p>
            )}
            <nav className="space-y-1">
              {developerItems.map((item) => (
                <NavRow key={item.href} item={item} active={isActive(item.href)} iconSize={15} />
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="ml-[56px] border-t border-gray-100 my-3" />

          {/* Settings / Help */}
          <div className="mb-3">
            <nav className="space-y-1">
              {bottomNavItems.map((item) => (
                <NavRow key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </nav>
          </div>

          {/* Profile block */}
          <div className="space-y-1.5 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center font-bold text-white text-[10px] flex-shrink-0 shadow-sm uppercase ml-[10px]">
                {getInitials()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#030A05] truncate">{getDisplayName()}</p>
                  <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                    {fallbackEmail || 'Merchant Account'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 w-full px-3 py-2 mt-2 rounded-xl text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors pl-[14px]"
            >
              <LogOut size={14} />
              {!isCollapsed && <span className="font-semibold">Log out</span>}
            </button>

            <div className="hidden lg:block pt-1">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex items-center justify-center gap-2 px-3 py-1.5 w-full text-left rounded-xl text-[10px] text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
              >
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                {!isCollapsed && <span className="font-semibold">Collapse</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-60 bg-white transition-transform duration-200 ease-in-out lg:hidden h-screen',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>

      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white h-screen sticky top-0 transition-all duration-200 ease-in-out flex-shrink-0',
          isCollapsed ? 'w-20' : 'w-60',
        )}
      >
        {sidebarContent}
      </aside>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        isLoggingOut={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
