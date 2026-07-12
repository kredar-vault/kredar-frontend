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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  Webhook,
  GitMerge,
  Bell,
  TrendingUp,
} from 'lucide-react';
import LogoutConfirmModal from './auth/LogoutConfirmModal';
import { cn } from '@/lib/utils';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getCurrentUser, clearAuthCookies } from '@/lib/cookies';
import KredarLogo from './KredarLogo';
import Button from './features/landing/Button';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
  hiddenFor?: string[];
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/balances', label: 'Balances', icon: Wallet },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/dashboard/reconciliation', label: 'Reconciliation', icon: GitMerge },
  { href: '/dashboard/activity', label: 'Activity', icon: Bell },
];

const developerItems: NavItem[] = [
  { href: '/dashboard/developer/api-explorer', label: 'API Playground', icon: Globe },
  { href: '/dashboard/developer/webhooks', label: 'Webhooks', icon: Webhook },
];

const bottomNavItems: NavItem[] = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
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

  // ── Formatted initials to lowercase ──
  const getInitials = () => {
    if (profile?.businessName) return profile.businessName.substring(0, 2).toLowerCase();
    if (fallbackEmail) return fallbackEmail.substring(0, 2).toLowerCase();
    return 'me';
  };

  // ── Swapped out fallback 'Merchant' string to 'Incomplete Profile' ──
  const getDisplayName = () => profile?.businessName || profile?.legalName || 'Incomplete Profile';

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
      className={cn(
        'flex items-center w-full group relative transition-all duration-150 h-8 my-0.5 rounded-full',
        isCollapsed ? 'justify-center px-0' : 'px-3.5',
        active
          ? 'bg-white/10 text-white shadow-sm font-bold'
          : 'text-white/75 hover:bg-white/10 hover:text-white',
      )}
    >
      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
        <item.icon size={iconSize} />
      </div>

      {!isCollapsed && (
        <div className="flex-1 pl-3 text-xs tracking-wide truncate">
          {loading ? (
            <div
              className={cn(
                'h-2 rounded animate-pulse w-20',
                active ? 'bg-[#006C49]/20' : 'bg-white/20',
              )}
            />
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      )}
    </Link>
  );

  const sidebarContent = (
    <div className="h-full w-full p-3 flex flex-col justify-between select-none bg-white">
      <div className="h-full w-full bg-[#006C49] text-white flex flex-col rounded-br-2xl rounded-bl-2xl rounded-tl-2xl rounded-tr-[40px] shadow-sm overflow-hidden p-3 justify-between relative">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="mb-4 mt-1">
            <KredarLogo />
          </div>

          <div
            className="flex-1 overflow-y-auto space-y-4 pr-0.5 pt-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `div::-webkit-scrollbar { display: none !important; }`,
              }}
            />

            {/* Segment 1 */}
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => (
                <NavRow key={item.href} item={item} active={isActive(item.href, item.exact)} />
              ))}
            </nav>

            {/* Segment 2 */}
            <div className="pt-3 border-t border-white/10">
              {!isCollapsed && (
                <p className="pl-3 mb-1 text-[8px] font-bold uppercase tracking-widest text-white/40">
                  Developer
                </p>
              )}
              <nav className="space-y-0.5">
                {developerItems.map((item) => (
                  <NavRow key={item.href} item={item} active={isActive(item.href)} />
                ))}
              </nav>
            </div>

            {/* Segment 3 */}
            <div className="pt-3 border-t border-white/10">
              {!isCollapsed && (
                <p className="pl-3 mb-1 text-[8px] font-bold uppercase tracking-widest text-white/40">
                  Management
                </p>
              )}
              <nav className="space-y-0.5">
                {bottomNavItems.map((item) => (
                  <NavRow key={item.href} item={item} active={isActive(item.href)} />
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Lower Account Identity Anchor */}
        <div className="pt-3 border-t border-white/10 space-y-2 flex-shrink-0">
          <div
            className={cn(
              'flex items-center gap-2.5 py-1 px-1 rounded-full bg-white/10 border border-white/5',
              isCollapsed ? 'justify-center' : 'pl-1 pr-3',
            )}
          >
            {/* ── Pink background with default lowercase text configuration ── */}
            <div className="w-7 h-7 rounded-full bg-pink-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-xs">
              {getInitials()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate leading-tight">
                  {getDisplayName()}
                </p>
                <p className="text-[8px] text-white/60 font-medium truncate leading-none mt-0.5">
                  {fallbackEmail}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={cn(
              'flex items-center gap-2.5 w-full h-8 rounded-full text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors',
              isCollapsed ? 'justify-center' : 'px-3.5',
            )}
          >
            <LogOut size={14} />
            {!isCollapsed && <span className="font-semibold">Log out</span>}
          </button>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                'flex items-center justify-center gap-1.5 h-6 w-full rounded-full text-[9px] text-white/50 hover:bg-white/10 hover:text-white transition-colors border border-white/10',
                isCollapsed ? 'px-0' : 'px-2',
              )}
            >
              {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
              {!isCollapsed && <span className="font-semibold">Collapse View</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-52 transition-transform duration-200 ease-in-out lg:hidden h-screen flex',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>

      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-200 ease-in-out flex-shrink-0',
          isCollapsed ? 'w-[72px]' : 'w-56',
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
