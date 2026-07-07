'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, ChevronRight, Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { Customer } from '@/api/customers/types';
import { useGenerateVirtualAccount } from '@/api/customers/hooks';
import CustomerAvatar from './avatar';

interface CustomersTableProps {
  customers: Customer[];
}

const statusStyles: Record<string, string> = {
  Active: 'bg-[#ECFDF3] text-[#027A48]',
  Pending: 'bg-[#FFFAEB] text-[#B54708]',
  Inactive: 'bg-[#F2F4F7] text-[#344054]',
  Restricted: 'bg-[#FEF3F2] text-[#B42318]',
};

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const generateVirtualAcc = useGenerateVirtualAccount();

  if (!customers.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[#667085]">No customers found.</p>
      </div>
    );
  }

  const handleCreateVirtualAccount = async (id: string) => {
    setActiveMenuId(null);
    try {
      await generateVirtualAcc.mutateAsync(id);
      toast.success('Virtual account created successfully!');
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || 'Failed to create virtual account.');
    }
  };

  return (
    <div className="w-full rounded-xl border border-[#EAECF0] bg-white ">
      {/* Responsive outer wrapper allows internal scrolling on mobile instead of page breaking */}
      <div className="overflow-x-auto w-full">
        {/* Ensures the table fields never squash awkwardly on medium views */}
        <table className="min-w-[1000px] w-full divide-y divide-[#EAECF0] table-fixed">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="w-[28%] py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Customer
              </th>
              <th className="w-[22%] py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Email
              </th>
              <th className="w-[20%] py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Dedicated Account
              </th>
              <th className="w-[12%] py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Status
              </th>
              <th className="w-[12%] py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Created
              </th>
              <th className="w-[6%] py-3.5 px-6 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F2F4F7] bg-white">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-[#FAFAFA] transition-colors">
                <td className="py-4 px-6 truncate">
                  <div className="flex items-center gap-3">
                    <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} />
                    <div className="truncate">
                      <p className="font-semibold text-[#101828] truncate">
                        {customer.fullName || `${customer.firstName} ${customer.lastName}`}
                      </p>
                      <p className="text-xs text-[#667085] truncate max-w-[180px]">{customer.id}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-sm text-[#475467] truncate">{customer.email}</td>

                <td className="py-4 px-4 text-sm text-[#101828] font-medium whitespace-nowrap">
                  {customer.dedicatedAccountNumber ? (
                    <div>
                      <p className="font-semibold">{customer.dedicatedAccountNumber}</p>
                      <p className="text-xs text-[#667085] font-normal">
                        {customer.bankName || 'Virtual Bank'}
                      </p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-[#475467] bg-[#F2F4F7] px-2.5 py-1 rounded-md font-normal">
                      No Account Linked
                    </span>
                  )}
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[customer.status] ?? statusStyles.Pending}`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="py-4 px-4 text-sm text-[#475467] whitespace-nowrap">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '--'}
                </td>

                {/* relative property is removed from 'td' container to allow positioning logic to attach to outer view bounds */}
                <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-1">
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="rounded-lg p-2 text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
                    >
                      <ChevronRight size={18} />
                    </Link>

                    {/* Outer relative wrapper handles isolating dropdown flow context correctly */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === customer.id ? null : customer.id)
                        }
                        className="rounded-lg p-2 text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === customer.id && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setActiveMenuId(null)}
                          />
                          {/* absolute right-0 handles aligning dropdown edge cleanly below the action buttons */}
                          <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-[#EAECF0] bg-white p-1 shadow-xl z-40 text-left animate-in fade-in-50 duration-100">
                            <button
                              onClick={() => handleCreateVirtualAccount(customer.id)}
                              disabled={generateVirtualAcc.isPending}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] disabled:opacity-50"
                            >
                              {generateVirtualAcc.isPending ? (
                                <Loader2 size={16} className="animate-spin text-[#0F8B4B]" />
                              ) : (
                                <CreditCard size={16} className="text-[#667085]" />
                              )}
                              Create Virtual Account
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
