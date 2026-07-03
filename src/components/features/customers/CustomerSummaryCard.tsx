'use client';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationDate: string;
  avatar: string;
}

interface CustomerSummaryCardProps {
  customer: Customer;
}

export default function CustomerSummaryCard({ customer }: CustomerSummaryCardProps) {
  return (
    <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-14 h-14 rounded-full object-cover border border-[#ebebeb] flex-shrink-0"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-[#081b10]">{customer.name}</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#effaf2] text-[#0f8b4b] border border-[#d4eedb]">
              {customer.status}
            </span>
          </div>
          <p className="text-sm text-[#45504b] font-medium">{customer.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left border-t md:border-t-0 md:border-l border-[#f0f4f1] pt-6 md:pt-0 md:pl-8">
        <div>
          <span className="text-[11px] font-semibold text-[#45504b] uppercase tracking-wider block">
            Wallet Balance
          </span>
          <span className="text-lg font-bold text-[#081b10] block mt-0.5">-</span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#45504b] uppercase tracking-wider block">
            Total Received
          </span>
          <span className="text-lg font-bold text-[#081b10] block mt-0.5">-</span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#45504b] uppercase tracking-wider block">
            Total Payments
          </span>
          <span className="text-lg font-bold text-[#081b10] block mt-0.5">-</span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#45504b] uppercase tracking-wider block">
            Created On
          </span>
          <span className="text-xs font-bold text-[#081b10] block mt-1.5">
            {customer.registrationDate}
          </span>
        </div>
      </div>
    </div>
  );
}
export type { Customer };
