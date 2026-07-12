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

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0 },
    { label: 'Active Customers', value: stats?.activeCustomers ?? 0 },
    { label: 'Inactive Customers', value: stats?.inactiveCustomers ?? 0 },
    { label: 'Restricted', value: stats?.restrictedCustomers ?? 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 mt-4">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Customers</h1>
          <p className="text-xs text-[#45504b] mt-0.5">Manage your registered customers</p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f8b4b] px-4 text-sm font-semibold text-white transition hover:bg-[#0a7040] self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Customer
        </Link>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-2xl border border-gray-100 bg-white"
              />
            ))}
          </div>

          <div className="h-[500px] animate-pulse rounded-2xl border border-gray-100 bg-white" />
        </>
      ) : (
        <>
          {/* Unified Stat Cards — matches Reconciliation page pattern */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1"
              >
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mt-2 p-5 space-y-4">
            <CustomersFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <CustomersTable customers={filteredCustomers} />
          </div>
        </>
      )}
    </div>
  );
}
