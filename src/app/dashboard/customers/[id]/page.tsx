'use client';

import { use, useState } from 'react';
import { MoreVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CustomerSummaryCard, { Customer } from '@/components/features/customers/CustomerSummaryCard';
import CustomerTabs from '@/components/features/customers/CustomerTabs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

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

  const { data: customerData, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const res = await api.get(`/customers/${id}`);
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });

  const { data: rawTransactions = [], isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['customer-transactions', id],
    queryFn: async () => {
      const res = await api.get(`/customers/${id}/transactions`);
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
    },
    enabled: !!id,
  });

  const loading = isCustomerLoading || isTransactionsLoading;

  // Map backend customer info safely to layout structure
  const customer: Customer = {
    id: customerData?.id || customerData?.customerId || id || '',
    name:
      customerData?.name ||
      customerData?.fullName ||
      `${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim() ||
      'Anonymous',
    email: customerData?.email || '',
    phone: customerData?.phone || customerData?.phoneNumber || '',
    status: customerData?.status || 'Pending',
    registrationDate:
      customerData?.registrationDate || customerData?.createdAt?.split('T')[0] || '',
    avatar:
      customerData?.avatar ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&auto=format&q=80',
  };

  // Map transactions safely
  const transactions = rawTransactions.map((tx: any) => {
    const txStatus = tx.status || 'Pending';
    const mappedStatus = txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: tx.currency || 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    };

    return {
      id: tx.id || tx.transactionId || '',
      date: tx.date || tx.createdAt?.split('T')[0] || '',
      amount: typeof tx.amount === 'number' ? formatCurrency(tx.amount) : tx.amount || '₦0',
      status: mappedStatus,
    };
  });

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
        </>
      ) : (
        /* ACTUAL RENDERED CONTENTS */
        <>
          <CustomerSummaryCard customer={customer} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <CustomerTabs customer={customer} />
            </div>

            <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-3">
                <h3 className="text-base font-bold text-[#081b10]">Customer transactions</h3>
                <span className="text-xs text-[#45504b] font-medium">History</span>
              </div>

              <div className="divide-y divide-[#f0f4f1]">
                {transactions.length === 0 ? (
                  <p className="text-xs text-center py-6 text-[#45504b]">No transactions found.</p>
                ) : (
                  transactions.slice(0, 5).map((tx: any) => (
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
                            statusColors[tx.status] || statusColors['Pending'],
                          )}
                        >
                          {tx.status}
                        </span>
                        <button className="text-[#45504b] hover:text-[#081b10] p-1">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
