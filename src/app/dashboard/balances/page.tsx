'use client';

import { useState } from 'react';
import { Plus, Minus, Copy, Check, ShieldCheck, Wallet, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function BalancesPage() {
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    data: dedicatedAccount,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['dedicated-account'],
    queryFn: async () => {
      try {
        const res = await api.get('/dedicated-accounts');
        if (!res || !res.data) {
          return null;
        }
        const rawData = res.data.data !== undefined ? res.data.data : res.data;
        if (rawData === undefined || rawData === null) {
          return null;
        }
        const result = Array.isArray(rawData) ? rawData[0] : rawData;
        return result !== undefined ? result : null;
      } catch (err) {
        console.error('Error fetching dedicated account:', err);
        return null;
      }
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Account number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAccount = async () => {
    setCreating(true);
    try {
      await api.post('/dedicated-accounts', {});
      toast.success('Dedicated settlement account generated successfully!');
      refetch();
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to generate account.';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const balance = dedicatedAccount?.balance ?? 0;
  const accountNumber = dedicatedAccount?.accountNumber;
  const bankName = dedicatedAccount?.bankName;
  const accountName = dedicatedAccount?.accountName;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Balances</h1>
        <p className="text-sm text-[#45504b] mt-1">
          Monitor settlement funds and virtual bank coordinates
        </p>
      </div>

      {isLoading ? (
        /* SKELETAL LOADING STATE */
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6 animate-pulse">
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-10 bg-gray-200 rounded w-48" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
          </div>
        </div>
      ) : !dedicatedAccount ? (
        /* SETUP EMPTY STATE */
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-10 shadow-sm max-w-3xl flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#effaf2] rounded-full flex items-center justify-center text-[#0f8b4b]">
            <Wallet size={32} />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-bold text-[#081b10]">Generate Settlement Account</h3>
            <p className="text-sm text-[#45504b] leading-relaxed">
              Activate your virtual bank coordinates to receive bank transfers, manage settlements,
              and process merchant payouts.
            </p>
          </div>
          <button
            onClick={handleCreateAccount}
            disabled={creating}
            className="kredar-btn-primary flex items-center gap-2 px-6 h-11 text-sm font-semibold"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Account...
              </>
            ) : (
              'Generate Dedicated Account'
            )}
          </button>
        </div>
      ) : (
        /* ACTIVE BALANCE VIEW & METADATA */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl items-start">
          {/* Balance card */}
          <div className="lg:col-span-2 bg-white border border-[#d8e1da] rounded-2xl p-8 shadow-sm space-y-6">
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f8b4b] rounded-full" />
              <div className="space-y-2">
                <span className="text-sm font-semibold text-[#45504b]">Available Balance</span>
                <div className="text-4xl font-bold text-[#081b10] tracking-tight">
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button className="kredar-btn-primary flex items-center gap-2 h-10 px-5 text-sm font-semibold">
                <Plus size={16} />
                Deposit
              </button>

              <button className="bg-[#0a2e1f] hover:bg-[#061c13] text-white flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold transition-colors">
                <Minus size={16} />
                Withdraw
              </button>
            </div>
          </div>

          {/* Virtual Account coordinates sidebar */}
          <div className="bg-[#0a2e1f] text-white border border-[#164d36] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-[#66c987]">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Settlement Coordinates
              </span>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <span className="text-[11px] text-white/50 block font-medium">BANK PARTNER</span>
                <span className="text-sm font-bold tracking-wide mt-0.5 block">
                  {bankName || 'Wema Bank'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-white/50 block font-medium">ACCOUNT NAME</span>
                <span className="text-sm font-bold tracking-wide mt-0.5 block">
                  {accountName || 'Kredar Customer'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-white/50 block font-medium">ACCOUNT NUMBER</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-lg font-bold tracking-wider font-mono">
                    {accountNumber || '0000000000'}
                  </span>
                  {accountNumber && (
                    <button
                      onClick={() => handleCopy(accountNumber)}
                      className="text-white/70 hover:text-white p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Copy account number"
                    >
                      {copied ? <Check size={14} className="text-[#66c987]" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
