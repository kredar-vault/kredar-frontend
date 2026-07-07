'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CustomerForm from '@/components/customer/CustomersForms';

export default function NewCustomerPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#475467] transition hover:text-[#101828]"
        >
          <ArrowLeft size={18} />
          Back to Customers
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#101828]">Create Customer</h1>

        <p className="mt-1 text-sm text-[#667085]">
          Register a customer and automatically generate a dedicated account.
        </p>
      </div>

      <CustomerForm />
    </div>
  );
}
