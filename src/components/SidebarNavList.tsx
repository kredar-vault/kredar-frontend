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
    <nav className="space-y-3">
      {items.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onItemClick?.(item.href)}
            className={cn(
              'flex items-center gap-3 px-3.5 rounded-md text-xs transition-all duration-150 h-9',
              isCollapsed && 'justify-center px-0',
              active
                ? 'bg-white/15 text-white font-medium shadow-xs border border-white/5'
                : 'text-emerald-100/70 hover:bg-white/5 hover:text-white',
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              <Icon size={16} strokeWidth={1.75} />
            </div>

            {!isCollapsed && (
              <span className="flex-1 truncate tracking-wide">
                {loading ? (
                  <div
                    className={cn(
                      'h-2.5 rounded animate-pulse w-20',
                      active ? 'bg-white/20' : 'bg-white/10',
                    )}
                  />
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
