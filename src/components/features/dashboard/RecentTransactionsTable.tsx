'use client';

import { ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock transactions list
const recentTransactions = [
  {
    id: 1,
    name: 'Fatima Abubakar',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-23',
    amount: '$48,000',
    status: 'Reconciled',
  },
  {
    id: 2,
    name: 'Oluwaseun Adebayo',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-19',
    amount: '$48,000',
    status: 'Overpaid',
  },
  {
    id: 3,
    name: 'Emeka Nwosu',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-17',
    amount: '₦45,750',
    status: 'Failed',
  },
  {
    id: 4,
    name: 'Ifeanyi Nwachukwu',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-16',
    amount: '₦100,000',
    status: 'Reconciled',
  },
  {
    id: 5,
    name: 'Ngozi Eze',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-15',
    amount: '$48,000',
    status: 'Pending',
  },
  {
    id: 6,
    name: 'Zainab Ibrahim',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-11',
    amount: '₦35,200',
    status: 'Overpaid',
  },
  {
    id: 7,
    name: 'Bola Ogunleye',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-10',
    amount: '₦250,000',
    status: 'Reconciled',
  },
  {
    id: 8,
    name: 'Tunde Adeyemi',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-10',
    amount: '₦30,500',
    status: 'Failed',
  },
  {
    id: 9,
    name: 'Amina Bello',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-09',
    amount: '₦25,150',
    status: 'Underpaid',
  },
  {
    id: 10,
    name: 'Chijioke Okafor',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80',
    date: '2026-02-08',
    amount: '₦20,000',
    status: 'Reversed',
  },
];

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function RecentTransactionsTable() {
  return (
    <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#081b10]">Recent transactions</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-28 border-[#d8e1da]">
              <option>Date</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-28 border-[#d8e1da]">
              <option>Currency</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select className="kredar-select h-9 text-xs pl-3 pr-8 w-28 border-[#d8e1da]">
              <option>Status</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="text-sm hover:bg-[#f7faf6]/40 transition-colors">
                <td className="py-3.5 flex items-center gap-3">
                  <img
                    src={tx.avatar}
                    alt={tx.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#ebebeb]"
                  />
                  <span className="font-semibold text-[#081b10]">{tx.name}</span>
                </td>
                <td className="py-3.5 text-[#45504b]">{tx.date}</td>
                <td className="py-3.5 font-semibold text-[#081b10]">{tx.amount}</td>
                <td className="py-3.5">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                      statusColors[tx.status],
                    )}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-lg hover:bg-[#f3f4f6]">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
