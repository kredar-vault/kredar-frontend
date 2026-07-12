'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Bell,
  CheckCheck,
  Check,
  CreditCard,
  ShieldCheck,
  Wallet,
  Webhook,
  Info,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PaymentReceived: {
    label: 'Payment',
    icon: <CreditCard size={14} />,
    color: 'bg-[#effaf2] text-[#0f8b4b]',
  },
  PaymentFailed: {
    label: 'Payment',
    icon: <CreditCard size={14} />,
    color: 'bg-red-50 text-red-500',
  },
  TransferCompleted: {
    label: 'Transfer',
    icon: <Wallet size={14} />,
    color: 'bg-blue-50 text-blue-500',
  },
  TransferFailed: {
    label: 'Transfer',
    icon: <Wallet size={14} />,
    color: 'bg-red-50 text-red-500',
  },
  TransferInitiated: {
    label: 'Transfer',
    icon: <Wallet size={14} />,
    color: 'bg-blue-50 text-blue-500',
  },
  OnboardingApproved: {
    label: 'KYC',
    icon: <ShieldCheck size={14} />,
    color: 'bg-[#effaf2] text-[#0f8b4b]',
  },
  OnboardingRejected: {
    label: 'KYC',
    icon: <ShieldCheck size={14} />,
    color: 'bg-red-50 text-red-500',
  },
  OnboardingSubmitted: {
    label: 'KYC',
    icon: <ShieldCheck size={14} />,
    color: 'bg-amber-50 text-amber-500',
  },
  WebhookEndpointAdded: {
    label: 'Webhook',
    icon: <Webhook size={14} />,
    color: 'bg-purple-50 text-purple-500',
  },
};

const getMeta = (type: string) =>
  TYPE_META[type] ?? {
    label: 'System',
    icon: <Info size={14} />,
    color: 'bg-gray-100 text-gray-500',
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

export default function InboxPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['inbox', filter],
    queryFn: async () => {
      const r = await api.get(`/inbox?${filter === 'unread' ? 'unread=true&' : ''}take=50`);
      return r.data?.data ?? { items: [], unreadCount: 0 };
    },
    refetchInterval: 15_000,
  });

  const items: any[] = data?.items ?? [];
  const unreadCount: number = data?.unreadCount ?? 0;

  const markOne = useMutation({
    mutationFn: (id: string) => api.patch(`/inbox/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const markAll = useMutation({
    mutationFn: () => api.patch('/inbox/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const categories = ['all', 'unread'] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Inbox</h1>
          <p className="text-xs text-[#45504b] mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e8ede9] text-xs font-semibold text-[#081b10] hover:bg-[#f7faf6] disabled:opacity-50 transition-colors"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
              filter === c
                ? 'bg-white text-[#081b10] shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {c}
            {c === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-[#0f8b4b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-64" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <Bell size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">No notifications</p>
            <p className="text-xs text-gray-300 mt-1">
              {filter === 'unread' ? 'All caught up!' : "You'll see alerts here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((n: any) => {
              const meta = getMeta(n.type);
              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-4 px-5 py-4 transition-colors group',
                    !n.isRead ? 'bg-[#f9fdfb]' : 'hover:bg-gray-50/50',
                  )}
                >
                  <div className={cn('p-2 rounded-xl flex-shrink-0 mt-0.5', meta.color)}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                          {!n.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0f8b4b] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="text-[10px] text-gray-400 tabular-nums">
                          {timeAgo(n.createdAt)}
                        </p>
                        {!n.isRead && (
                          <button
                            onClick={() => markOne.mutate(n.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#0f8b4b] transition-all"
                            title="Mark as read"
                          >
                            <Check size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        meta.color,
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
