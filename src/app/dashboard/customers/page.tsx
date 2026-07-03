'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CustomersTable, { CustomerItem } from '@/components/features/customers/CustomersTable';
import CustomersFilters from '@/components/features/customers/CustomersFilters';

// Mock Customers data
const customersData: CustomerItem[] = [
  {
    id: 'CUST-3920-18',
    name: 'Chinonso Okeke',
    email: 'chinonso.okeke@gmail.com',
    phone: '+234 812 345 6789',
    status: 'Verified',
    registrationDate: '2026-02-23',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80',
  },
  {
    id: 'CUST-8492-01',
    name: 'Fatima Abubakar',
    email: 'fatima.abubakar@gmail.com',
    phone: '+234 803 111 2222',
    status: 'Verified',
    registrationDate: '2026-02-23',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80',
  },
  {
    id: 'CUST-1049-38',
    name: 'Tunde Adeyemi',
    email: 'tunde.adeyemi@gmail.com',
    phone: '+234 905 555 6666',
    status: 'Verified',
    registrationDate: '2026-02-23',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop&auto=format&q=80',
  },
  {
    id: 'CUST-5839-20',
    name: 'Oluwaseun Adebayo',
    email: 'seun.adebayo@gmail.com',
    phone: '+234 815 444 3333',
    status: 'Verified',
    registrationDate: '2026-02-23',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80',
  },
  {
    id: 'CUST-4829-10',
    name: 'Zainab Ibrahim',
    email: 'zainab.ibrahim@gmail.com',
    phone: '+234 708 999 8888',
    status: 'Verified',
    registrationDate: '2026-02-23',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&auto=format&q=80',
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCustomers = customersData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

      {loading ? (
        /* SKELETAL LOADING STATE */
        <>
          {/* Skeletons: Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#d8e1da] rounded-2xl p-6 min-h-[120px] flex flex-col justify-between shadow-sm"
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mt-2" />
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
              <span className="text-3xl font-bold text-[#081b10] mt-2 tracking-tight">5</span>
            </div>
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">Active Wallets</span>
              <span className="text-3xl font-bold text-[#081b10] mt-2 tracking-tight">5</span>
            </div>
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
              <span className="text-sm font-medium text-[#45504b]">KYC Verified</span>
              <span className="text-3xl font-bold text-[#0f8b4b] mt-2 tracking-tight">5</span>
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
