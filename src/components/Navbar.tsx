'use client';

import { useEffect, useState } from 'react';
import { Bell, Menu, ChevronDown } from 'lucide-react';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getCurrentUser } from '@/lib/cookies';

interface NavbarProps {
  onToggleMobile?: () => void;
}

export default function DashboardNavbar({ onToggleMobile }: NavbarProps) {
  const [fallbackEmail, setFallbackEmail] = useState('account@kredar.com');
  const { data: profile } = useTenantProfile();

  useEffect(() => {
    const userObj = getCurrentUser();
    if (userObj?.email) {
      setFallbackEmail(userObj.email);
    }
  }, []);

  const businessName = profile?.businessName || profile?.legalName || 'Kredar Merchant';

  const getInitials = () => {
    if (profile?.businessName) {
      return profile.businessName.substring(0, 2).toUpperCase();
    }
    return fallbackEmail.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-[#eef2ef] bg-white/80 backdrop-blur-md flex items-center px-4 sm:px-8 justify-between sticky top-0 z-30 selection:bg-[#006C49]/10">
      {/* LEFT SECTION: MOBILE TOGGLE & CONTEXT */}
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

      {/* RIGHT SECTION: NOTIFICATIONS & PROFILE */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl border border-[#d8e1da] flex items-center justify-center text-gray-500 hover:text-[#030A05] hover:bg-[#f4faf7] hover:border-[#006C49]/20 transition-all group"
          aria-label="View notifications"
        >
          <Bell size={16} className="transition-transform group-hover:rotate-12" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#006C49]" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* User Profile Trigger */}
        <button className="flex items-center gap-2.5 text-left p-1 rounded-xl hover:bg-[#f4faf7]/60 transition-colors group">
          {/* Initials Avatar - Pink Themed */}
          <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold tracking-wider shadow-sm transition-transform group-hover:scale-95">
            {getInitials()}
          </div>

          {/* Business Details */}
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
