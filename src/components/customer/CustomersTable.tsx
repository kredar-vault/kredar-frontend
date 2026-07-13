'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { Customer } from '@/api/customers/types';
import { useGenerateVirtualAccount } from '@/api/customers/hooks';
import CustomerAvatar from './avatar';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import Button from '../features/landing/Button';

function NoteCountBadge({ customerId }: { customerId: string }) {
  const { data: count } = useQuery<number>({
    queryKey: ['customer-notes-count', customerId],
    queryFn: async () => {
      const res = await api.get(`/customers/${customerId}/notes`);
      return (res.data?.data ?? []).length;
    },
    staleTime: 60_000,
  });

  if (!count) return null;
  return (
    <Link
      href={`/dashboard/customers/${customerId}?tab=notes`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#edfdf2] text-[#117b43] text-[10px] font-bold border border-[#daeedf] hover:bg-[#daeedf] transition-colors"
      title={`${count} note${count !== 1 ? 's' : ''}`}
    >
      <StickyNote size={10} />
      {count}
    </Link>
  );
}

interface CustomersTableProps {
  customers: Customer[];
}

const statusStyles: Record<string, string> = {
  Active: 'bg-[#edfdf2] text-[#117b43] border-[#daeedf]',
  Pending: 'bg-[#fff9f2] text-[#c2410c] border-[#ffedd5]',
  Inactive: 'bg-[#f8fafc] text-[#475569] border-[#f1f5f9]',
  Restricted: 'bg-[#fff5f5] text-[#e11d48] border-[#ffe4e6]',
};

const PAGE_SIZE = 15;

export default function CustomersTable({ customers }: CustomersTableProps) {
  const generateVirtualAcc = useGenerateVirtualAccount();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [customers]);

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  const paged = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!customers.length) {
    return (
      <div className="bg-white border border-[#eef2ef] rounded-md p-10 text-center text-xs font-medium text-[#667085]">
        No records matching ledger criteria found.
      </div>
    );
  }

  const handleCreateVirtualAccount = async (id: string) => {
    try {
      await generateVirtualAcc.mutateAsync(id);
      toast.success('Virtual account created successfully!');
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || 'Failed to create virtual account.');
    }
  };

  return (
    <div className="bg-white border border-[#eef2ef] rounded-md p-6 space-y-5">
      <div className="overflow-x-auto">
        <table className="min-w-[560px] w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f7faf6] text-[#667085] text-[11px] font-bold uppercase tracking-wider">
              <th className="pb-3 font-bold">Customer</th>
              <th className="pb-3 font-bold">Email</th>
              <th className="pb-3 font-bold">Dedicated Account</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 font-bold">Created</th>
              <th className="pb-3 font-bold text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f7faf6]">
            {paged.map((customer) => {
              const currentStatus = customer.status || 'Pending';
              const mappedStatus =
                currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase();
              const statusClass = statusStyles[mappedStatus] || statusStyles['Pending'];

              return (
                <tr
                  key={customer.id}
                  className="text-xs hover:bg-[#f7faf6]/30 transition-colors group"
                >
                  {/* Customer Block */}
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md object-cover border border-[#eef2ef] bg-[#f7faf6] flex items-center justify-center overflow-hidden">
                      <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#081b10] text-xs">
                          {customer.fullName || `${customer.firstName} ${customer.lastName}`}
                        </span>
                        <NoteCountBadge customerId={customer.id} />
                      </div>
                      <span className="text-[10px] text-[#667085] font-medium">
                        ID: {String(customer.id || '').substring(0, 8)}...
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 font-medium text-[#45504b]">{customer.email}</td>

                  {/* Dedicated Account Info */}
                  <td className="py-3.5 text-xs">
                    {customer.dedicatedAccountNumber ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-[#081b10]">
                          {customer.dedicatedAccountNumber}
                        </span>
                        <span className="text-[10px] text-[#667085] font-medium">
                          {customer.bankName || 'Virtual Bank'}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border border-[#f1f5f9] bg-[#f8fafc] text-[#475569] tracking-wide">
                        No Account Linked
                      </span>
                    )}
                  </td>

                  {/* Status Capsule */}
                  <td className="py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide',
                        statusClass,
                      )}
                    >
                      {mappedStatus}
                    </span>
                  </td>

                  {/* Created At Date */}
                  <td className="py-3.5 font-medium text-[#45504b]">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '--'}
                  </td>

                  {/* Action Link Row Context */}
                  <td className="py-3.5 text-right opacity-40 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-1 border-t border-[#f7faf6]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#081b10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs text-[#667085]">
            Page {page} of {totalPages} · {customers.length} customers
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#081b10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
