'use client';

import { use, useState, useEffect } from 'react';
import { MoreVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CustomerSummaryCard, { Customer } from '@/components/features/customers/CustomerSummaryCard';
import CustomerTabs from '@/components/features/customers/CustomerTabs';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Mock Transactions data for the customer
const transactionsData = [
  { id: 'TRX2026002', date: '2026-02-23', amount: '$48,000', status: 'Reconciled' },
  { id: 'TRX2026003', date: '2026-02-19', amount: '$48,000', status: 'Overpaid' },
  { id: 'TRX2026004', date: '2026-02-17', amount: '₦45,750', status: 'Failed' },
  { id: 'TRX2026005', date: '2026-02-16', amount: '₦100,000', status: 'Reconciled' },
  { id: 'TRX2026006', date: '2026-02-15', amount: '$48,000', status: 'Pending' },
  { id: 'TRX2026007', date: '2026-02-11', amount: '₦35,200', status: 'Overpaid' },
  { id: 'TRX2026008', date: '2026-02-10', amount: '₦250,000', status: 'Reconciled' },
  { id: 'TRX2026009', date: '2026-02-10', amount: '₦30,500', status: 'Failed' },
  { id: 'TRX2026010', date: '2026-02-09', amount: '₦25,150', status: 'Underpaid' },
  { id: 'TRX2026011', date: '2026-02-08', amount: '₦20,000', status: 'Reversed' },
];

// Status styling mapping
const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function CustomerDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mocked Customer Info based on id
  const customer: Customer = {
    id: id || 'CUST-3920-18',
    name: 'Chinonso Okeke',
    email: 'chinonso.okeke@gmail.com',
    phone: '+234 812 345 6789',
    status: 'Verified',
    registrationDate: '2026-02-23',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&auto=format&q=80',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Back to customers list */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#45504b] hover:text-[#081b10] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to customers
        </Link>
      </div>

      {loading ? (
        /* SKELETAL LOADING STATE */
        <>
          {/* Skeleton: Summary Header Card */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
          </div>

          {/* Skeletons: Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6 bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4 border-b border-[#f0f4f1] pb-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3.5 bg-gray-200 rounded animate-pulse w-24" />
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
              <div className="space-y-3 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-[#f0f4f1] last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ACTUAL RENDERED CONTENTS */
        <>
          {/* Summary Profile Header Card */}
          <CustomerSummaryCard customer={customer} />

          {/* Grid tabs detail panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left side: subtabs */}
            <div className="lg:col-span-2 space-y-6">
              <CustomerTabs customer={customer} />
            </div>

            {/* Right side: Transactions list history for the customer */}
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-3">
                <h3 className="text-base font-bold text-[#081b10]">Customer transactions</h3>
                <span className="text-xs text-[#45504b] font-medium">History</span>
              </div>

              <div className="divide-y divide-[#f0f4f1]">
                {transactionsData.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-[#081b10]">{tx.id}</p>
                      <p className="text-[11px] text-[#45504b] font-medium mt-0.5">{tx.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#081b10]">{tx.amount}</span>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                          statusColors[tx.status],
                        )}
                      >
                        {tx.status}
                      </span>
                      <button className="text-[#45504b] hover:text-[#081b10] p-1">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
