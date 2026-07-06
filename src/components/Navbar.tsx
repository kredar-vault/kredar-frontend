'use client';

import { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { getCurrentUser } from '@/lib/cookies';

interface UserData {
  email: string;
  businessName?: string;
}

interface NavbarProps {
  onToggleMobile?: () => void;
}

export default function Navbar({ onToggleMobile }: NavbarProps) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userObj = getCurrentUser();
    if (userObj) {
      setUser(userObj);
    }
  }, []);

  return (
    <header className="h-16 bg-transparent flex items-center px-4 sm:px-6 justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu toggle */}
        {onToggleMobile && (
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-1.5 hover:bg-[#f7faf6] border border-[#d8e1da] rounded-lg text-[#45504b] transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg border border-[#d8e1da] flex items-center justify-center text-[#45504b] hover:bg-[#f7faf6] transition-colors">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
