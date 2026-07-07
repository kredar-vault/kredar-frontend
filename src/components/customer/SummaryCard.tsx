'use client';

import { Customer } from '@/api/customers/types';
import CustomerAvatar from './avatar';

interface CustomerSummaryCardProps {
  customer: Customer;
}

export default function CustomerSummaryCard({ customer }: CustomerSummaryCardProps) {
  const formattedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="bg-white rounded-md border border-[#EAECF0] p-6  mb-6">
      <div className="flex items-center gap-5">
        <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} size={72} />

        <div>
          <h2 className="text-2xl font-bold text-[#101828]">
            {customer.fullName || `${customer.firstName} ${customer.lastName}`}
          </h2>

          <div className="mt-4 flex gap-12 text-sm">
            <div>
              <p className="text-[#667085] text-xs font-medium">Date created</p>
              <p className="text-[#101828] font-medium mt-1">Joined {formattedDate}</p>
            </div>

            <div>
              <p className="text-[#667085] text-xs font-medium">Dedicated account</p>
              <p className="text-[#101828] font-medium mt-1">
                {customer.dedicatedAccountNumber || '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
