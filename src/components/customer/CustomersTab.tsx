'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Customer } from '@/api/customers/types';
import CustomerHeader from './customerheader';
import CustomerProfile from './CustomerProfile';
import CustomerStatement from './CustomersStaement';
import CustomerNotes from './CustomerNotes';
import Button from '../features/landing/Button';

interface CustomerTabsProps {
  customer: Customer;
}

type Tab = 'statement' | 'profile' | 'notes';

const VALID_TABS: Tab[] = ['statement', 'profile', 'notes'];

export default function CustomerTabs({ customer }: CustomerTabsProps) {
  const searchParams = useSearchParams();
  const paramTab = searchParams.get('tab') as Tab | null;
  const initialTab: Tab = paramTab && VALID_TABS.includes(paramTab) ? paramTab : 'statement';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* 2. Navigation Content Workspace Box Card */}
      <div className="bg-white border border-[#eef2ef] rounded-2xl p-6 shadow-sm">
        {/* Bordered minimal dynamic sub-tabs switcher line line */}
        <div className="flex gap-6 border-b border-[#eef2ef] mb-6">
          <Button
            onClick={() => setActiveTab('statement')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'statement' ? 'text-[#0f8b4b]' : 'text-[#667085] hover:text-[#081b10]'
            }`}
          >
            Recent transactions
            {activeTab === 'statement' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f8b4b] rounded-full" />
            )}
          </Button>

          <Button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'profile' ? 'text-[#0f8b4b]' : 'text-[#667085] hover:text-[#081b10]'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f8b4b] rounded-full" />
            )}
          </Button>

          <Button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'notes' ? 'text-[#0f8b4b]' : 'text-[#667085] hover:text-[#081b10]'
            }`}
          >
            Notes
            {activeTab === 'notes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f8b4b] rounded-full" />
            )}
          </Button>
        </div>

        {/* Tab Context Container Routing render flow view */}
        <div>
          {activeTab === 'profile' ? (
            <CustomerProfile customer={customer} />
          ) : activeTab === 'notes' ? (
            <CustomerNotes customerId={customer.id} />
          ) : (
            <CustomerStatement customerId={customer.id} />
          )}
        </div>
      </div>
    </div>
  );
}
