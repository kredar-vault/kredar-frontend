'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Menu, ChevronDown, Check, Search, Sparkles } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getCurrentUser } from '@/lib/cookies';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onToggleMobile?: () => void;
}

type Notif = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function DashboardNavbar({ onToggleMobile }: NavbarProps) {
  const [fallbackEmail, setFallbackEmail] = useState('account@kredar.com');
  const { data: profile } = useTenantProfile();
  const [showNotifs, setShowNotifs] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const userObj = getCurrentUser();
    if (userObj?.email) setFallbackEmail(userObj.email);
  }, []);

  // Poll unread count every 15 seconds
  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => {
      const r = await api.get('/notifications?unread=true&take=1');
      return r.data.data?.unreadCount ?? 0;
    },
    refetchInterval: 15_000,
  });
  const unreadCount: number = unreadData ?? 0;

  // Full list — also refreshes every 15s
  const { data: notifsData, isLoading: notifsLoading } = useQuery({
    queryKey: ['notifications-list'],
    queryFn: async () => {
      const r = await api.get('/notifications?take=20');
      return (r.data.data?.items ?? []) as Notif[];
    },
    refetchInterval: 15_000,
  });
  const notifs: Notif[] = notifsData ?? [];

  const openNotifs = () => setShowNotifs((v) => !v);

  const markAllRead = () => {
    api.patch('/notifications/read', {}).then(() => {
      qc.setQueryData(['notifications-unread'], 0);
      qc.setQueryData(['notifications-list'], (old: Notif[] | undefined) =>
        (old ?? []).map((x) => ({ ...x, isRead: true })),
      );
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const businessName = profile?.businessName || profile?.legalName || 'Kredar Merchant';

  const getInitials = () => {
    if (profile?.businessName) return profile.businessName.substring(0, 2).toUpperCase();
    return fallbackEmail.substring(0, 2).toUpperCase();
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <header className="h-14 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center px-4 sm:px-6 justify-between sticky top-0 z-30 select-none selection:bg-[#006C49]/10">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {onToggleMobile && (
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-1.5 hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-700 transition-all active:scale-95 flex-shrink-0"
            aria-label="Open navigation sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Added Command Search Bar Interface Element */}
        <div className="relative w-full max-w-xs hidden sm:block group">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006C49] transition-colors"
          />
          <input
            type="text"
            placeholder="Search transactions, links..."
            className="w-full h-8 pl-9 pr-8 bg-gray-50/50 hover:bg-gray-50 text-xs rounded-lg border border-gray-200/80 focus:border-[#006C49]/40 focus:bg-white focus:outline-hidden transition-all placeholder:text-gray-400"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 pointer-events-none h-4 selection:bg-transparent px-1.5 text-[9px] font-medium text-gray-400 bg-white border border-gray-200 rounded-sm shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {/* Workspace Display Pill */}
        <div className="hidden md:flex flex-col text-right pr-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-end gap-1">
            <Sparkles size={8} className="text-[#006C49]" /> Current Workspace
          </span>
          <span className="text-xs font-bold text-gray-900 mt-0.5">{businessName}</span>
        </div>

        <div className="h-4 w-px bg-gray-200 hidden md:block" />

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={openNotifs}
            className={cn(
              'relative w-8 h-8 rounded-lg border flex items-center justify-center transition-all group',
              showNotifs
                ? 'border-[#006C49]/40 bg-[#006C49]/5 text-[#006C49]'
                : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50',
            )}
            aria-label="View notifications"
          >
            <Bell size={15} className="transition-transform group-hover:rotate-12" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#006C49] text-white text-[8px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-9 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] text-[#006C49] font-bold hover:text-[#005237] transition-colors"
                  >
                    <Check size={11} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifsLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="px-4 py-3 space-y-1.5">
                      <div className="h-3 bg-gray-50 rounded animate-pulse w-24" />
                      <div className="h-2.5 bg-gray-50 rounded animate-pulse w-40" />
                    </div>
                  ))
                ) : notifs.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell size={18} className="text-gray-300 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-2.5 transition-colors',
                        n.isRead
                          ? 'opacity-70 hover:opacity-100'
                          : 'bg-[#006C49]/5/20 bg-emerald-50/20',
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#006C49] flex-shrink-0" />
                        )}
                        <div className={!n.isRead ? '' : 'ml-3.5'}>
                          <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-1 font-medium">
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-gray-200" />

        {/* Profile User Action Menu Block */}
        <button className="flex items-center gap-2 text-left p-0.5 rounded-lg hover:bg-gray-50 transition-colors group">
          <div className="w-7 h-7 rounded-lg bg-[#006C49] text-white flex items-center justify-center text-xs font-bold shadow-xs uppercase transition-transform group-hover:scale-[0.97]">
            {getInitials()}
          </div>
          <div className="hidden sm:flex flex-col pr-0.5">
            <span className="text-xs font-bold text-gray-900 max-w-[120px] truncate leading-none">
              {businessName}
            </span>
            <span className="text-[9px] text-gray-400 font-medium max-w-[120px] truncate mt-1 leading-none">
              {fallbackEmail}
            </span>
          </div>
          <ChevronDown
            size={12}
            className="text-gray-400 group-hover:text-gray-700 transition-colors hidden sm:block ml-0.5"
          />
        </button>
      </div>
    </header>
  );
}
