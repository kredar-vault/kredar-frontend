'use client';

import { Customer } from '@/api/customers/types';
import CustomerAvatar from './avatar';

interface CustomerHeaderProps {
  customer: Customer;
}

export default function CustomerHeader({ customer }: CustomerHeaderProps) {
  const formattedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="bg-white border border-[#eef2ef] rounded-2xl p-6 shadow-sm flex items-center gap-5">
      {/* Swapped out the img tag for your native initials avatar */}
      <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} size={80} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#081b10] tracking-tight">
          {customer.firstName} {customer.lastName}
        </h2>
        <div className="flex gap-12 text-xs">
          <div className="space-y-1">
            <p className="text-[#667085] font-medium">Date created</p>
            <p className="font-bold text-[#081b10]">Joined {formattedDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#667085] font-medium">Dedicated account</p>
            <p className="font-bold text-[#081b10] font-mono tracking-tight">
              {customer.dedicatedAccountNumber || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
