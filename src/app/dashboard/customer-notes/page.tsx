'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { StickyNote, Search, Flag, Clock, ChevronRight, Loader2 } from 'lucide-react';

import { api } from '@/lib/api';
import { Customer } from '@/api/customers/types';
import { useCustomers } from '@/api/customers/hooks';

interface Note {
  id: string;
  content: string;
  createdByEmail: string;
  createdAt: string;
}

interface EnrichedNote extends Note {
  customer: Customer;
  isHighPriority: boolean;
  isFollowUp: boolean;
}

const HIGH_PRIORITY_KEYWORDS = [
  'urgent',
  'important',
  'critical',
  'asap',
  'high priority',
  'escalate',
  'blocked',
  'immediate',
];
const FOLLOW_UP_KEYWORDS = [
  'follow up',
  'follow-up',
  'followup',
  'call back',
  'reach out',
  'check in',
  'remind',
  'callback',
];

function classifyNote(content: string) {
  const lower = content.toLowerCase();
  return {
    isHighPriority: HIGH_PRIORITY_KEYWORDS.some((kw) => lower.includes(kw)),
    isFollowUp: FOLLOW_UP_KEYWORDS.some((kw) => lower.includes(kw)),
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', { dateStyle: 'medium' });
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-[#0a2e1f]">{value}</p>
        <p className="text-xs text-[#667085] font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function CustomerNotesPage() {
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'followup'>('all');

  const { data: customers = [], isLoading: customersLoading } = useCustomers();

  const noteQueries = useQueries({
    queries: customers.map((c) => ({
      queryKey: ['customer-notes', c.id],
      queryFn: async (): Promise<Note[]> => {
        const res = await api.get(`/customers/${c.id}/notes`);
        return res.data?.data ?? [];
      },
      staleTime: 60_000,
    })),
  });

  const isLoadingNotes = noteQueries.some((q) => q.isLoading);

  const allNotes: EnrichedNote[] = useMemo(() => {
    const enriched: EnrichedNote[] = [];
    customers.forEach((customer, i) => {
      const notes: Note[] = noteQueries[i]?.data ?? [];
      notes.forEach((note) => {
        enriched.push({ ...note, customer, ...classifyNote(note.content) });
      });
    });
    return enriched.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [customers, noteQueries]);

  const totalNotes = allNotes.length;
  const highPriorityCount = allNotes.filter((n) => n.isHighPriority).length;
  const followUpCount = allNotes.filter((n) => n.isFollowUp).length;

  const filtered = useMemo(() => {
    let result = allNotes;

    if (filterPriority === 'high') result = result.filter((n) => n.isHighPriority);
    else if (filterPriority === 'followup') result = result.filter((n) => n.isFollowUp);

    if (filterCustomer) result = result.filter((n) => n.customer.id === filterCustomer);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.content.toLowerCase().includes(q) ||
          (n.customer.fullName || `${n.customer.firstName} ${n.customer.lastName}`)
            .toLowerCase()
            .includes(q) ||
          n.createdByEmail.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allNotes, search, filterCustomer, filterPriority]);

  const isLoading = customersLoading || isLoadingNotes;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0a2e1f]">Customer Notes</h1>
        <p className="text-sm text-[#667085] mt-0.5">Activity feed across all customers</p>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<StickyNote size={20} className="text-[#0f8b4b]" />}
          label="Total Notes"
          value={totalNotes}
          color="bg-[#ecfdf3]"
        />
        <StatCard
          icon={<Flag size={20} className="text-[#B42318]" />}
          label="High Priority"
          value={highPriorityCount}
          color="bg-[#FEF3F2]"
        />
        <StatCard
          icon={<Clock size={20} className="text-[#B54708]" />}
          label="Follow-ups"
          value={followUpCount}
          color="bg-[#FFFAEB]"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes or customers..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#eaecf0] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/25 focus:border-[#0f8b4b] text-[#101828] placeholder:text-[#667085]"
          />
        </div>

        <select
          value={filterCustomer}
          onChange={(e) => setFilterCustomer(e.target.value)}
          className="text-sm rounded-xl border border-[#eaecf0] px-3 py-2 text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/25 focus:border-[#0f8b4b] bg-white"
        >
          <option value="">All customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName || `${c.firstName} ${c.lastName}`}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          {(['all', 'high', 'followup'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterPriority === p
                  ? 'bg-[#0f8b4b] text-white'
                  : 'bg-[#f5f8f6] text-[#344054] hover:bg-[#e9f5ee]'
              }`}
            >
              {p === 'all' ? 'All' : p === 'high' ? 'High Priority' : 'Follow-ups'}
            </button>
          ))}
        </div>
      </div>

      {/* Notes feed */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-[#667085]">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading notes…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <StickyNote size={32} className="mx-auto mb-3 text-[#d0d5dd]" />
            <p className="text-sm text-[#667085]">
              {allNotes.length === 0
                ? 'No notes have been added yet.'
                : 'No notes match your filters.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#f2f4f7]">
            {filtered.map((note) => {
              const name =
                note.customer.fullName || `${note.customer.firstName} ${note.customer.lastName}`;
              return (
                <li key={note.id} className="px-5 py-4 hover:bg-[#fafafa] transition-colors group">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#ecfdf3] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#0f8b4b]">
                        {(note.customer.firstName?.[0] ?? '?').toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/dashboard/customers/${note.customer.id}?tab=notes`}
                          className="text-sm font-semibold text-[#101828] hover:text-[#0f8b4b] transition-colors"
                        >
                          {name}
                        </Link>
                        {note.isHighPriority && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FEF3F2] text-[#B42318] text-[10px] font-semibold">
                            <Flag size={9} />
                            High Priority
                          </span>
                        )}
                        {note.isFollowUp && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FFFAEB] text-[#B54708] text-[10px] font-semibold">
                            <Clock size={9} />
                            Follow-up
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#344054] mt-1 leading-relaxed line-clamp-3">
                        {note.content}
                      </p>
                      <p className="text-[11px] text-[#98a2b3] mt-1.5">
                        {note.createdByEmail} · {timeAgo(note.createdAt)}
                      </p>
                    </div>

                    {/* Link to customer notes tab */}
                    <Link
                      href={`/dashboard/customers/${note.customer.id}?tab=notes`}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#667085] hover:bg-[#f2f4f7] transition-all flex-shrink-0"
                      title="View in customer profile"
                    >
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer count */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-xs text-center text-[#98a2b3]">
          Showing {filtered.length} of {totalNotes} note{totalNotes !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
