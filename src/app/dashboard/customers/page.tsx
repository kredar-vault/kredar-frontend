'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CustomersTable, { CustomerItem } from '@/components/features/customers/CustomersTable';
import CustomersFilters from '@/components/features/customers/CustomersFilters';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rawCustomers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
    },
  });

  // Map backend customer items safely to CustomerItem schema
  const customers: CustomerItem[] = rawCustomers.map((c: any) => ({
    id: c.id || c.customerId || '',
    name: c.name || c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Anonymous',
    email: c.email || '',
    phone: c.phone || c.phoneNumber || '',
    status: c.status || 'Pending',
    registrationDate: c.registrationDate || c.createdAt?.split('T')[0] || '',
    avatar:
      c.avatar ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80',
  }));

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Compile active totals
  const totalCustomers = customers.length;
  const activeWallets = customers.filter(
    (c) => c.status.toLowerCase() === 'active' || c.status.toLowerCase() === 'verified',
  ).length;
  const kycVerified = customers.filter((c) => c.status.toLowerCase() === 'verified').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#081b10]">Customers</h1>
          <p className="text-sm text-[#45504b] mt-1">
            Manage and audit your registered business customers
          </p>
        </div>
        <Link
          href="/dashboard/customers"
          className="bg-[#0f8b4b] hover:bg-[#0c703c] text-white flex items-center gap-1.5 h-10 px-4 rounded-lg text-xs font-semibold transition-colors"
        >
          <Plus size={14} />
          Add Customer
        </Link>
      </div>

      {isLoading ? (
        /* SKELETAL LOADING STATE */
        <>
          {/* Skeletons: Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[120px] flex flex-col justify-between shadow-sm animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-8 bg-gray-200 rounded w-16 mt-2" />
              </div>
            ))}
          </div>

          {/* Skeletons: Table */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-full" />
            <div className="space-y-4 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-[#f0f4f1] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 animate-pulse w-28" />
                      <div className="h-3 bg-gray-200 animate-pulse w-36" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse w-24" />
                  <div className="h-4 bg-gray-200 animate-pulse w-16" />
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ACTUAL CONTENT */
        <>
          {/* Metrics summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">Total Customers</span>
              <span className="text-3xl font-bold text-[#081b10] mt-2 tracking-tight">
                {totalCustomers}
              </span>
            </div>
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">Active Wallets</span>
              <span className="text-3xl font-bold text-[#081b10] mt-2 tracking-tight">
                {activeWallets}
              </span>
            </div>
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">KYC Verified</span>
              <span className="text-3xl font-bold text-[#0f8b4b] mt-2 tracking-tight">
                {kycVerified}
              </span>
            </div>
          </div>

          {/* Main Customers List Grid Card */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-5 shadow-sm space-y-4">
            <CustomersFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <CustomersTable customers={filteredCustomers} />
          </div>
        </>
      )}
    </div>
  );
}
