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
  onItemClick?: (href: string) => void;
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
            onClick={() => onItemClick?.(item.href)}
            className={cn(
              'flex items-center px-3 rounded-xl text-xs transition-all duration-150 h-[30px]',
              isCollapsed && 'justify-center px-2',
              active
                ? 'bg-[#0a2e1f] text-white font-semibold'
                : 'text-[#45504b] hover:bg-[#f7faf6] hover:text-[#081b10]',
            )}
            title={isCollapsed ? item.label : undefined}
          >
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
