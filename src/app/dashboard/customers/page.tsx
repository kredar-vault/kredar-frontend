'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { useCustomers, useCustomerStats } from '@/api/customers/hooks';
import CustomersTable from '@/components/customer/CustomersTable';
import CustomersFilters from '@/components/customer/CustomersFilters';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers = [], isLoading: customersLoading } = useCustomers();

  const { data: stats, isLoading: statsLoading } = useCustomerStats();

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

  const loading = customersLoading || statsLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#081B10]">
            Customers
          </h1>

          <p className="mt-1 text-sm text-[#667085]">Manage your registered customers.</p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0F8B4B] px-4 text-sm font-semibold text-white transition hover:bg-[#0D7A42] self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Customer
        </Link>
      </div>

      {loading ? (
        <>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-md border border-[#EAECF0] bg-white"
              />
            ))}
          </div>

          <div className="h-[500px] animate-pulse rounded-md border border-[#EAECF0] bg-white" />
        </>
      ) : (
        <>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
            <div className="rounded-md border border-[#EAECF0] bg-white p-6">
              <p className="text-sm font-medium text-[#667085]">Total Customers</p>

              <h2 className="mt-3 text-3xl font-bold text-[#101828]">
                {stats?.totalCustomers ?? 0}
              </h2>
            </div>

            <div className="rounded-md border border-[#EAECF0] bg-white p-6">
              <p className="text-sm font-medium text-[#667085]">Active Customers</p>

              <h2 className="mt-3 text-3xl font-bold text-[#0F8B4B]">
                {stats?.activeCustomers ?? 0}
              </h2>
            </div>

            <div className="rounded-md border border-[#EAECF0] bg-white p-6">
              <p className="text-sm font-medium text-[#667085]">Inactive Customers</p>

              <h2 className="mt-3 text-3xl font-bold text-[#101828]">
                {stats?.inactiveCustomers ?? 0}
              </h2>
            </div>

            <div className="rounded-md border border-[#EAECF0] bg-white p-6">
              <p className="text-sm font-medium text-[#667085]">Restricted</p>

              <h2 className="mt-3 text-3xl font-bold text-[#101828]">
                {stats?.restrictedCustomers ?? 0}
              </h2>
            </div>
          </div>

          <div className="space-y-4 rounded-md border border-[#EAECF0] bg-white p-5 ">
            <CustomersFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <CustomersTable customers={filteredCustomers} />
          </div>
        </>
      )}
    </div>
  );
}
