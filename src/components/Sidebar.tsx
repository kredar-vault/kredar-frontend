'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import KredarLogo from './KredarLogo';
import SidebarNavList from './SidebarNavList';
import LogoutConfirmModal from './auth/LogoutConfirmModal';
import { cn } from '@/lib/utils';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getCurrentUser, clearAuthCookies } from '@/lib/cookies';

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/balances', label: 'Balances', icon: Wallet },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

const bottomNavItems = [
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

  const { data: profile } = useTenantProfile();

  const getInitials = () => {
    if (profile?.businessName) {
      return profile.businessName.substring(0, 2).toUpperCase();
    }
    const user = getCurrentUser();
    if (user && user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'ME';
  };

  const getDisplayName = () => {
    return profile?.businessName || 'Merchant';
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="h-full flex flex-col bg-white">
      {/* Brand logo header */}
      <div
        className={cn(
          'px-6 py-6 border-b border-[#f0f4f1] flex items-center justify-between',
          isCollapsed && 'px-4 justify-center',
        )}
      >
        <KredarLogo hideText={isCollapsed} />
      </div>

      {/* Navigation List area */}
      <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Main Links */}
          <SidebarNavList
            items={mainNavItems}
            isCollapsed={isCollapsed}
            loading={loading}
            isActive={isActive}
            onItemClick={handleItemClick}
          />

          {/* Bottom Settings/Help Links */}
          <div className="pt-4 border-t border-[#f0f4f1]">
            <SidebarNavList
              items={bottomNavItems}
              isCollapsed={isCollapsed}
              loading={loading}
              isActive={isActive}
              onItemClick={handleItemClick}
            />
          </div>
        </div>

        {/* User profile block + Logout */}
        <div className="space-y-3 pt-6 border-t border-[#f0f4f1] mt-auto">
          {/* Profile Card */}
          <div
            className={cn(
              'flex items-center gap-3 px-2 py-1.5',
              isCollapsed && 'justify-center px-0',
            )}
          >
            <div className="w-9 h-9 rounded-full bg-[#ebebeb] flex items-center justify-center font-bold text-[#081b10] text-sm flex-shrink-0 border border-[#d8e1da] uppercase">
              {getInitials()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#081b10] truncate">{getDisplayName()}</p>
                <p className="text-xs text-[#667085] font-medium truncate">Merchant Account</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[#45504b] hover:bg-[#fff0f0] hover:text-red-600 transition-colors',
              isCollapsed && 'justify-center px-0',
            )}
            title={isCollapsed ? 'Log out' : undefined}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="font-medium">Log out</span>}
          </button>

          {/* Desktop Toggle collapse trigger arrow */}
          <div className="hidden lg:block pt-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="flex items-center justify-center gap-2 px-3 py-2 w-full text-left rounded-xl text-xs text-[#45504b] hover:bg-[#f7faf6] transition-colors border border-[#ebebeb]"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              {!isCollapsed && <span className="font-semibold">Collapse</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Sidebar Drawer backdrop overlay ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      {/* ── Mobile Sidebar Panel ── */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#d8e1da] transition-transform duration-200 ease-in-out lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>

      {/* ── Desktop Permanent Sidebar Panel ── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-[#d8e1da] min-h-screen transition-all duration-200 ease-in-out flex-shrink-0',
          isCollapsed ? 'w-20' : 'w-64',
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
