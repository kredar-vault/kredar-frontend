'use client';

import Link from 'next/link';
import { MoreVertical } from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationDate: string;
  avatar: string;
}

interface CustomersTableProps {
  customers: CustomerItem[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="space-y-4">
      {/* Customers List Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
              <th className="pb-3 font-semibold">Customer ID</th>
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Email</th>
              <th className="pb-3 font-semibold">Phone</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {customers.map((c) => (
              <tr
                key={c.id}
                className="text-sm hover:bg-[#f7faf6]/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 font-mono text-xs font-bold text-[#081b10]">
                  <Link href={`/dashboard/customers/${c.id}`} className="hover:underline">
                    {c.id}
                  </Link>
                </td>
                <td className="py-3.5 flex items-center gap-3">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#ebebeb]"
                  />
                  <Link
                    href={`/dashboard/customers/${c.id}`}
                    className="font-bold text-[#081b10] hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="py-3.5 text-[#45504b] font-medium">{c.email}</td>
                <td className="py-3.5 text-[#45504b] font-medium">{c.phone}</td>
                <td className="py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]">
                    {c.status}
                  </span>
                </td>
                <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="text-[#45504b] hover:text-[#081b10] p-1.5 rounded-lg hover:bg-[#f3f4f6]">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center pt-6 pb-2">
        <nav className="flex items-center gap-1 text-sm font-semibold text-[#45504b]">
          <button className="px-3 py-1.5 rounded-lg hover:bg-[#f7faf6] transition-colors">
            Previous
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#0f8b4b]/10 text-[#0f8b4b]">1</button>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">2</button>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">3</button>
          <span className="px-2">...</span>
          <button className="w-9 h-9 rounded-lg hover:bg-[#f7faf6] transition-colors">10</button>
          <button className="px-3 py-1.5 rounded-lg hover:bg-[#f7faf6] transition-colors">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
export type { CustomerItem };
