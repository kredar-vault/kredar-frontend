'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface SidebarNavListProps {
  items: NavItem[];
  isCollapsed: boolean;
  loading: boolean;
  isActive: (href: string, exact?: boolean) => boolean;
  onItemClick?: () => void;
}

export default function SidebarNavList({
  items,
  isCollapsed,
  loading,
  isActive,
  onItemClick,
}: SidebarNavListProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-150',
              isCollapsed && 'justify-center px-0',
              active
                ? 'bg-[#0a2e1f] text-white font-medium shadow-sm'
                : 'text-[#45504b] hover:bg-[#f7faf6] hover:text-[#081b10]',
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {loading ? (
              <div className="w-5 h-5 rounded bg-gray-200 animate-pulse flex-shrink-0" />
            ) : (
              <item.icon size={18} className={active ? 'text-[#0f8b4b]' : 'text-[#45504b]'} />
            )}

            {!isCollapsed && (
              <span className="flex-1 truncate">
                {loading ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                ) : (
                  item.label
                )}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
