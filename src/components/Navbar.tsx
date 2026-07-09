'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Menu, ChevronDown, Check } from 'lucide-react';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getCurrentUser } from '@/lib/cookies';
import { api } from '@/lib/api';

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
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifsLoaded, setNotifsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userObj = getCurrentUser();
    if (userObj?.email) setFallbackEmail(userObj.email);
  }, []);

  useEffect(() => {
    api
      .get('/notifications?unread=true&take=1')
      .then((r) => setUnreadCount(r.data.data?.unreadCount ?? 0))
      .catch(() => {});
  }, []);

  const openNotifs = () => {
    setShowNotifs((v) => !v);
    if (!notifsLoaded) {
      api
        .get('/notifications?take=20')
        .then((r) => {
          setNotifs(r.data.data?.items ?? []);
          setUnreadCount(r.data.data?.unreadCount ?? 0);
          setNotifsLoaded(true);
        })
        .catch(() => setNotifsLoaded(true));
    }
  };

  const markAllRead = () => {
    api
      .patch('/notifications/read', {})
      .then(() => {
        setNotifs((n) => n.map((x) => ({ ...x, isRead: true })));
        setUnreadCount(0);
      })
      .catch(() => {});
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
    <header className="h-16 border-b border-[#eef2ef] bg-white/80 backdrop-blur-md flex items-center px-4 sm:px-8 justify-between sticky top-0 z-30 selection:bg-[#006C49]/10">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {onToggleMobile && (
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 hover:bg-[#f4faf7] border border-[#d8e1da] rounded-xl text-[#030A05] transition-all active:scale-95"
            aria-label="Open navigation sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="hidden sm:block">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Workspace
          </p>
          <p className="text-xs font-bold text-[#030A05] mt-0.5">{businessName}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={openNotifs}
            className="relative w-9 h-9 rounded-xl border border-[#d8e1da] flex items-center justify-center text-gray-500 hover:text-[#030A05] hover:bg-[#f4faf7] hover:border-[#006C49]/20 transition-all group"
            aria-label="View notifications"
          >
            <Bell size={16} className="transition-transform group-hover:rotate-12" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-[#006C49] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-[#e8ede9] rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f4f1]">
                <span className="text-sm font-bold text-[#030A05]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-[#006C49] font-semibold hover:text-[#004d30] transition-colors"
                  >
                    <Check size={11} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#f0f4f1]">
                {!notifsLoaded ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="px-4 py-3 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-48" />
                    </div>
                  ))
                ) : notifs.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell size={20} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div key={n.id} className={`px-4 py-3 ${n.isRead ? '' : 'bg-[#f7faf6]'}`}>
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#006C49] flex-shrink-0" />
                        )}
                        <div className={!n.isRead ? '' : 'ml-3.5'}>
                          <p className="text-xs font-semibold text-[#030A05]">{n.title}</p>
                          <p className="text-xs text-[#45504b] mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 text-left p-1 rounded-xl hover:bg-[#f4faf7]/60 transition-colors group">
          <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold tracking-wider shadow-sm transition-transform group-hover:scale-95">
            {getInitials()}
          </div>
          <div className="hidden md:flex flex-col pr-1">
            <span className="text-xs font-bold text-[#030A05] max-w-[140px] truncate">
              {businessName}
            </span>
            <span className="text-[10px] text-gray-400 max-w-[140px] truncate mt-0.5">
              {fallbackEmail}
            </span>
          </div>
          <ChevronDown
            size={14}
            className="text-gray-400 group-hover:text-[#030A05] transition-colors hidden md:block"
          />
        </button>
      </div>
    </header>
  );
}
