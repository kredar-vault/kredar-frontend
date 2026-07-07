'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  title: string;
}

interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarItem[];
}

interface DocsSidebarProps {
  groups: SidebarGroup[];
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export default function DocsSidebar({ groups, activeSection, setActiveSection }: DocsSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    groups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {}),
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <aside className="w-full md:w-60 flex-shrink-0 bg-[#0c1e13] rounded-md md:sticky md:top-24 max-h-[calc(100vh-100px)] overflow-y-auto select-none scrollbar-thin p-4">
      <div className="space-y-4">
        {groups.map((group) => {
          const isExpanded = expandedGroups[group.id] !== false;

          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-white/90 uppercase tracking-wider hover:text-[#3ddc84] transition-colors"
              >
                <span>{group.title}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isExpanded && (
                <nav className="pl-2.5 space-y-0.5 border-l border-white/10 ml-1">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors',
                          isActive
                            ? 'bg-[#0f8b4b]/20 text-[#3ddc84] font-semibold'
                            : 'text-white/50 hover:bg-white/5 hover:text-white/90',
                        )}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export type { SidebarItem, SidebarGroup };
