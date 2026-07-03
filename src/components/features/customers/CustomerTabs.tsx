'use client';

import { useState } from 'react';
import { ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Customer } from './CustomerSummaryCard';

interface CustomerTabsProps {
  customer: Customer;
}

export default function CustomerTabs({ customer }: CustomerTabsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'logs' | 'kyc'>('general');

  return (
    <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-6">
      {/* Sub tabs list triggers */}
      <div className="border-b border-[#f0f4f1] flex gap-8">
        {(['general', 'logs', 'kyc'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3.5 text-sm font-bold border-b-2 transition-all capitalize relative top-[1px]',
              activeTab === tab
                ? 'border-[#0f8b4b] text-[#0f8b4b]'
                : 'border-transparent text-[#45504b] hover:text-[#081b10]',
            )}
          >
            {tab === 'general'
              ? 'General information'
              : tab === 'logs'
                ? 'Audit logs'
                : 'KYC Documents'}
          </button>
        ))}
      </div>

      {/* ── Sub Tab 1: General Information ── */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl pt-2">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#45504b] uppercase tracking-wider block">
              Customer Name
            </span>
            <span className="text-sm font-bold text-[#081b10] block">{customer.name}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#45504b] uppercase tracking-wider block">
              Email Address
            </span>
            <span className="text-sm font-bold text-[#081b10] block">{customer.email}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#45504b] uppercase tracking-wider block">
              Phone Number
            </span>
            <span className="text-sm font-bold text-[#081b10] block">{customer.phone}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#45504b] uppercase tracking-wider block">
              Customer Reference ID
            </span>
            <span className="text-sm font-bold text-mono text-[#081b10] block">{customer.id}</span>
          </div>
        </div>
      )}

      {/* ── Sub Tab 2: Audit Logs ── */}
      {activeTab === 'logs' && (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
                <th className="pb-3 font-semibold">Event</th>
                <th className="pb-3 font-semibold">IP Address</th>
                <th className="pb-3 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f1] text-sm text-[#081b10] font-medium">
              <tr>
                <td className="py-3.5">Dedicated Virtual Account Assigned</td>
                <td className="py-3.5 text-[#45504b]">192.168.1.42</td>
                <td className="py-3.5 text-[#45504b]">2026-02-23 14:32pm</td>
              </tr>
              <tr>
                <td className="py-3.5">Customer record initialized</td>
                <td className="py-3.5 text-[#45504b]">192.168.1.1</td>
                <td className="py-3.5 text-[#45504b]">2026-02-23 10:15am</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Sub Tab 3: KYC Documents Table ── */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-32">
                <select className="kredar-select h-9 text-xs pl-3 pr-8 w-full border-[#d8e1da]">
                  <option>Status</option>
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Overpaid</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
                />
              </div>
            </div>
            <button className="kredar-btn-primary h-9 px-4 text-xs font-semibold">Export</button>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
                  <th className="pb-3 font-semibold">Document type</th>
                  <th className="pb-3 font-semibold">Date uploaded</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                <tr className="text-sm font-medium hover:bg-[#f7faf6]/40 transition-colors">
                  <td className="py-3.5 text-[#081b10] font-bold">Government ID</td>
                  <td className="py-3.5 text-[#45504b]">2026-02-23</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]">
                      Verified
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
                <tr className="text-sm font-medium hover:bg-[#f7faf6]/40 transition-colors">
                  <td className="py-3.5 text-[#081b10] font-bold">Proof of Address</td>
                  <td className="py-3.5 text-[#45504b]">2026-02-15</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]">
                      Pending
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
                <tr className="text-sm font-medium hover:bg-[#f7faf6]/40 transition-colors">
                  <td className="py-3.5 text-[#081b10] font-bold">Profile Image</td>
                  <td className="py-3.5 text-[#45504b]">2026-02-11</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]">
                      Overpaid
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#45504b] hover:text-[#081b10] p-1 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
