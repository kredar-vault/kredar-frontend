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
import SidebarNavList from './SidebarNavList';
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

interface NavSection {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: NavItem[];
  basePath: string;
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

const developerSection: NavSection = {
  label: 'Developer',
  icon: Code2,
  basePath: '/dashboard/developer',
  items: [
    { href: '/dashboard/developer/api-explorer', label: 'API Playground', icon: Globe },
    { href: '/dashboard/developer/webhooks', label: 'Webhooks', icon: Webhook },
  ],
};

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
    if (user?.email) {
      setFallbackEmail(user.email);
    }
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = () => {
    if (profile?.businessName) {
      return profile.businessName.substring(0, 2).toUpperCase();
    }
    if (fallbackEmail) {
      return fallbackEmail.substring(0, 2).toUpperCase();
    }
    return 'ME';
  };

  const getDisplayName = () => {
    return profile?.businessName || profile?.legalName || 'Merchant';
  };

  const handleItemClick = (href: string) => {
    onCloseMobile();
    if (pathname !== href && onNavigate) {
      onNavigate();
    }
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

  const sidebarContent = (
    <div className="h-full flex bg-white overflow-hidden p-3 gap-2 border-r border-gray-100">
      {/* ── Left Green Capsule Icon Strip ── */}
      <div className="w-12 bg-[#006C49] rounded-full flex flex-col items-center flex-shrink-0 justify-between py-4">
        {/* Top nav icons — main + developer */}
        <div className="w-full flex flex-col items-center pt-16 space-y-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onCloseMobile()}
                className="relative flex items-center justify-center w-full h-[30px]"
              >
                {active && <div className="absolute left-0 w-0.5 h-3.5 bg-white rounded-r-sm" />}
                <item.icon
                  size={16}
                  className={cn(
                    'transition-colors',
                    active ? 'text-white' : 'text-white/60 hover:text-white',
                  )}
                />
              </Link>
            );
          })}

          {/* Thin divider before developer icons */}
          <div className="w-6 border-t border-white/10 my-1" />

          {developerSection.items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onCloseMobile()}
                className="relative flex items-center justify-center w-full h-[30px]"
                title={item.label}
              >
                {active && <div className="absolute left-0 w-0.5 h-3.5 bg-white rounded-r-sm" />}
                <item.icon
                  size={16}
                  className={cn(
                    'transition-colors',
                    active ? 'text-white' : 'text-white/60 hover:text-white',
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom — Settings / Help icons */}
        <div className="w-full flex flex-col items-center mb-6 space-y-1">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onCloseMobile()}
                className="relative flex items-center justify-center w-full h-[30px]"
              >
                {active && <div className="absolute left-0 w-0.5 h-3.5 bg-white rounded-r-sm" />}
                <item.icon
                  size={16}
                  className={cn(
                    'transition-colors',
                    active ? 'text-white' : 'text-white/60 hover:text-white',
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col justify-between bg-white min-w-0">
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Brand logo header */}
            <div className="h-[44px] flex items-center justify-start pl-1 mt-6">
              <KredarLogo hideText={isCollapsed} />
            </div>

            {/* Main Upper Links */}
            <div className="mt-3">
              <SidebarNavList
                items={mainNavItems}
                isCollapsed={isCollapsed}
                loading={loading}
                isActive={isActive}
                onItemClick={handleItemClick}
              />
            </div>
          </div>

          {/* Lower Group pushed completely to bottom layout block */}
          <div>
            {/* Developer section */}
            <div className="mb-2">
              {!isCollapsed && (
                <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  Developer
                </p>
              )}
              <nav className="space-y-1">
                {developerSection.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleItemClick(item.href)}
                      className={cn(
                        'flex items-center gap-2 px-3 rounded-xl text-xs transition-all duration-150 h-[30px]',
                        isCollapsed && 'justify-center px-2',
                        active
                          ? 'bg-[#0a2e1f] text-white font-semibold'
                          : 'text-[#45504b] hover:bg-[#f7faf6] hover:text-[#081b10]',
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon size={13} className="flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Divider between Developer and Settings */}
            <div className="border-t border-gray-100 my-3" />

            {/* Settings / Help */}
            <div className="mb-3">
              <SidebarNavList
                items={bottomNavItems}
                isCollapsed={isCollapsed}
                loading={loading}
                isActive={isActive}
                onItemClick={handleItemClick}
              />
            </div>

            {/* Profile block */}
            <div className="space-y-1.5 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-3 px-2 py-1">
                {/* Fully Rounded Profile Disc with Pink Theme */}
                <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center font-bold text-white text-[10px] flex-shrink-0 shadow-sm uppercase">
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

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 w-full px-3 py-2 mt-2 rounded-xl text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={14} />
                {!isCollapsed && <span className="font-semibold">Log out</span>}
              </button>

              {/* Toggle Trigger */}
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
    </div>
  );

  return (
    <>
      {/* ── Mobile Drawer Backdrop ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      {/* ── Fixed Mobile Sidebar Panel ── */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-60 bg-white transition-transform duration-200 ease-in-out lg:hidden h-screen',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>

      {/* ── Fixed Desktop Sidebar Panel ── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white h-screen sticky top-0 transition-all duration-200 ease-in-out flex-shrink-0',
          isCollapsed ? 'w-20' : 'w-60',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        isLoggingOut={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
