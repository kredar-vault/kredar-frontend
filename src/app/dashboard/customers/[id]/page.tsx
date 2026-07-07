'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useCustomer } from '@/api/customers/hooks';
import CustomerSummaryCard from '@/components/customer/SummaryCard';
import CustomerTabs from '@/components/customer/CustomersTab';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CustomerDetailsPage({ params }: PageProps) {
  const { id } = use(params);

  const { data: customer, isLoading, isError } = useCustomer(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-[#F2F4F7]" />

        <div className="h-40 animate-pulse rounded-md bg-[#F2F4F7]" />

        <div className="h-[500px] animate-pulse rounded-md bg-[#F2F4F7]" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center">
        <h2 className="text-2xl font-semibold text-[#101828]">Customer not found</h2>

        <Link
          href="/dashboard/customers"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0F8B4B] px-5 py-3 text-sm font-medium text-white hover:bg-[#0C7640]"
        >
          <ArrowLeft size={18} />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#475467] transition hover:text-[#101828]"
      >
        <ArrowLeft size={18} />
        Back to Customers
      </Link>

      <CustomerSummaryCard customer={customer} />

      <CustomerTabs customer={customer} />
    </div>
  );
}
