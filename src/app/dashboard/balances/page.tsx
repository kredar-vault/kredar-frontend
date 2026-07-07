'use client';

import { useBalance } from '@/api/balances/hooks';
import { Plus, Minus, Loader2 } from 'lucide-react';

export default function BalancesPage() {
  const { data: balance = 0, isLoading } = useBalance();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="max-w-4xl space-y-5 pb-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#081B10]">Balances</h1>
        <p className="text-xs text-[#667085]">Monitor your funds here.</p>
      </div>

      <div className="rounded-xl border border-[#E6ECE8] bg-white p-5  max-w-xl">
        <div className="relative">
          <div className="absolute left-0 top-0 h-full w-0.5 rounded-md bg-[#0F8B4B]" />

          <div className="pl-3.5">
            <p className="text-xs font-medium text-[#667085] uppercase tracking-wider">
              Available Balance
            </p>

            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#081B10] flex items-center min-h-[36px]">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#667085]" />
              ) : (
                formatCurrency(balance)
              )}
            </h2>
          </div>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button className="flex h-8 items-center gap-1.5 rounded-md bg-[#006C49] px-3.5 text-xs font-semibold text-white transition hover:bg-[#0a2e1f]">
            <Plus size={14} />
            Deposit
          </button>

          <button className="flex h-8 items-center gap-1.5 rounded-md bg-[#102A1F] px-3.5 text-xs font-semibold text-white transition hover:bg-black">
            <Minus size={14} />
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
