'use client';

import { Customer } from '@/api/customers/types';

interface CustomerProfileProps {
  customer: Customer;
}

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  // Parsing phone parts cleanly if available
  const rawPhone = customer.phoneNumber || '';
  const countryCode = rawPhone.startsWith('+234') ? '+234' : '';
  const displayPhone = countryCode ? rawPhone.replace('+234', '').trim() : rawPhone;

  return (
    <div className="w-full pt-4 space-y-10">
      {/* Row 1: Names, Bank Info, & Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#081b10]">Account name</h4>
          <p className="text-xs font-medium text-[#667085]">
            {customer.firstName} {customer.lastName}
          </p>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#081b10]">Bank</h4>
          <p className="text-xs font-medium text-[#667085]">{customer.bankName || 'Nombank MFB'}</p>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#081b10]">Dedicated account</h4>
          <p className="text-xs font-medium text-[#667085] font-mono">
            {customer.dedicatedAccountNumber || '—'}
          </p>
        </div>
      </div>

      {/* Row 2: Phone Data & Emails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#081b10]">Country code</h4>
            <p className="text-xs font-medium text-[#667085]">{countryCode || '+234'}</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#081b10]">Phone number</h4>
            <p className="text-xs font-medium text-[#667085]">{displayPhone}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#081b10]">Email</h4>
          <p className="text-xs font-medium text-[#667085] break-all">{customer.email}</p>
        </div>
      </div>
    </div>
  );
}
