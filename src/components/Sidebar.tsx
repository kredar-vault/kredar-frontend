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
        'flex items-center w-full group relative py-1.5 pl-4 transition-all duration-150',
        active
          ? 'bg-white text-[#006C49] rounded-l-full font-bold shadow-sm'
          : 'text-white/75 hover:text-white hover:bg-white/5 rounded-l-full',
      )}
    >
      {/* Curved Cutouts for White Background Extension */}
      {active && (
        <>
          <div className="absolute right-0 -top-3 w-3 h-3 bg-white pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-[#006C49] after:rounded-br-full" />
          <div className="absolute right-0 -bottom-3 w-3 h-3 bg-white pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-[#006C49] after:rounded-tr-full" />
        </>
      )}

      {/* Icon Wrapper */}
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
        <item.icon size={iconSize} />
      </div>

      {/* Label Text */}
      {!isCollapsed && (
        <div className="flex-1 flex items-center pl-2.5 pr-2 text-xs transition-all duration-150">
          {loading ? (
            <div
              className={cn(
                'h-2.5 rounded animate-pulse w-20',
                active ? 'bg-gray-200' : 'bg-white/20',
              )}
            />
          ) : (
            <span className="truncate">{item.label}</span>
          )}
        </div>
      )}
    </Link>
  );

  const sidebarContent = (
    <div className="h-full relative bg-[#006C49] text-white flex flex-col pt-3 pb-3 pl-3 pr-0 border-r border-transparent selection:bg-transparent justify-between select-none">
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header — Fixed layout style to show authentic colors */}
        <div
          className={cn(
            'flex items-center flex-shrink-0 mb-3 mt-1',
            isCollapsed ? 'justify-center pr-3' : 'pl-4',
          )}
        >
          <KredarLogo hideText={isCollapsed} />
        </div>

        {/* Navigation Wrapper with Bulletproof Hidden Scrollbar */}
        <div
          className="flex-1 overflow-y-auto pr-0 space-y-1 pt-6"
          style={{
            scrollbarWidth: 'none' /* Firefox */,
            msOverflowStyle: 'none' /* IE/Edge */,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Webkit scrollbar cleaner wrapper hook */}
          <style
            dangerouslySetInnerHTML={{
              __html: `div::-webkit-scrollbar { display: none !important; }`,
            }}
          />

          {/* BLOCK 1: Core Navigation */}
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavRow key={item.href} item={item} active={isActive(item.href, item.exact)} />
            ))}
          </nav>

          {/* BLOCK 2: Developers */}
          <div className="pt-1.5 border-t border-white/10">
            {!isCollapsed && (
              <p className="pl-4 mb-1 text-[8px] font-bold uppercase tracking-widest text-white/40">
                Developer
              </p>
            )}
            <nav className="space-y-0.5">
              {developerItems.map((item) => (
                <NavRow key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </nav>
          </div>

          {/* BLOCK 3: Support */}
          <div className="pt-1.5 border-t border-white/10">
            {!isCollapsed && (
              <p className="pl-4 mb-1 text-[8px] font-bold uppercase tracking-widest text-white/40">
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

      {/* Footer / Profile block */}
      <div className="pt-2 border-t border-white/10 space-y-1 flex-shrink-0 pr-3">
        <div
          className={cn('flex items-center gap-2 py-0.5', isCollapsed ? 'justify-center' : 'px-2')}
        >
          <div className="w-7 h-7 rounded-full bg-white text-[#006C49] flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm uppercase">
            {getInitials()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {getDisplayName()}
              </p>
              <p className="text-[9px] text-white/50 font-medium truncate leading-none mt-0.5">
                {fallbackEmail || 'Merchant Account'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={cn(
            'flex items-center gap-2.5 w-full h-7 rounded-lg text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors',
            isCollapsed ? 'justify-center' : 'px-2',
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
              'flex items-center justify-center gap-1.5 h-6 w-full text-left rounded-lg text-[9px] text-white/40 hover:bg-white/5 hover:text-white transition-colors border border-white/10',
              isCollapsed ? 'px-0' : 'px-2',
            )}
          >
            {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
            {!isCollapsed && <span className="font-semibold">Collapse</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-52 bg-[#006C49] transition-transform duration-200 ease-in-out lg:hidden h-screen',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-[#006C49] h-screen sticky top-0 transition-all duration-200 ease-in-out flex-shrink-0',
          isCollapsed ? 'w-14' : 'w-52',
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
