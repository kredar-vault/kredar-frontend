'use client';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Customer } from '@/api/customers/types';
import { useGenerateVirtualAccount } from '@/api/customers/hooks';
import CustomerAvatar from './avatar';

interface CustomerSummaryCardProps {
  customer: Customer;
}

export default function CustomerSummaryCard({ customer }: CustomerSummaryCardProps) {
  const formattedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  const generateDva = useGenerateVirtualAccount();

  const handleGenerateDva = async () => {
    try {
      await generateDva.mutateAsync(customer.id);
      toast.success('Dedicated account provisioned — refresh to see the account number.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to provision dedicated account.');
    }
  };

  return (
    <div className="bg-white rounded-md border border-[#EAECF0] p-6  mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} size={72} />

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[#101828] truncate">
            {customer.fullName || `${customer.firstName} ${customer.lastName}`}
          </h2>

          <div className="mt-3 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <div>
              <p className="text-[#667085] text-xs font-medium">Date created</p>
              <p className="text-[#101828] font-medium mt-1">Joined {formattedDate}</p>
            </div>

            <div>
              <p className="text-[#667085] text-xs font-medium">Dedicated account</p>
              {customer.dedicatedAccountNumber ? (
                <p className="text-[#101828] font-medium mt-1">{customer.dedicatedAccountNumber}</p>
              ) : (
                <button
                  onClick={handleGenerateDva}
                  disabled={generateDva.isPending}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f8b4b] hover:text-[#0c703c] disabled:opacity-60 transition-colors"
                >
                  {generateDva.isPending ? <Loader2 size={12} className="animate-spin" /> : null}
                  {generateDva.isPending ? 'Provisioning…' : 'Link DVA'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
