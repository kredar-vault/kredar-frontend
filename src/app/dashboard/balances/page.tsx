'use client';

import { useState } from 'react';
import { useBalance } from '@/api/balances/hooks';
import { useLookupBankAccount, useCreateTransfer } from '@/api/transfers/hooks';
import { Plus, Minus, Loader2, X } from 'lucide-react';

function generateMerchantTxRef() {
  return `kredar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function BalancesPage() {
  const { data: balance = 0, isLoading } = useBalance();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  const lookupMutation = useLookupBankAccount();
  const transferMutation = useCreateTransfer();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);

  const resetWithdrawForm = () => {
    setBankCode('');
    setAccountNumber('');
    setAmount('');
    setVerifiedName(null);
  };

  const handleLookup = async () => {
    if (!bankCode.trim() || accountNumber.trim().length < 10) return;
    try {
      const result = await lookupMutation.mutateAsync({
        bankCode: bankCode.trim(),
        accountNumber: accountNumber.trim(),
      });
      setVerifiedName(result?.accountName ?? null);
    } catch {
      setVerifiedName(null);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!verifiedName || !amount) return;
    try {
      await transferMutation.mutateAsync({
        merchantTxRef: generateMerchantTxRef(),
        bankCode: bankCode.trim(),
        accountNumber: accountNumber.trim(),
        amount: Number(amount),
      });
      setWithdrawOpen(false);
      resetWithdrawForm();
    } catch {
      // error toast already handled in useCreateTransfer
    }
  };

  return (
    <div className="max-w-4xl space-y-5 pb-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#081B10]">Balances</h1>
        <p className="text-xs text-[#667085]">Monitor your funds here.</p>
      </div>

      <div className="rounded-xl border border-[#E6ECE8] bg-white p-5 max-w-xl">
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

          <button
            onClick={() => setWithdrawOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-md bg-[#102A1F] px-3.5 text-xs font-semibold text-white transition hover:bg-black"
          >
            <Minus size={14} />
            Withdraw
          </button>
        </div>
      </div>

      {withdrawOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#081b10]">Withdraw funds</h4>
              <button
                onClick={() => {
                  setWithdrawOpen(false);
                  resetWithdrawForm();
                }}
                className="text-[#667085] hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#45504b]">Bank code</label>
                <input
                  type="text"
                  value={bankCode}
                  onChange={(e) => {
                    setBankCode(e.target.value);
                    setVerifiedName(null);
                  }}
                  placeholder="e.g. 058"
                  className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#45504b]">Account number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setVerifiedName(null);
                  }}
                  placeholder="10-digit account number"
                  className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg"
                />
              </div>

              {!verifiedName ? (
                <button
                  onClick={handleLookup}
                  disabled={lookupMutation.isPending}
                  className="w-full h-9 text-xs font-semibold rounded-lg bg-[#f7faf6] border border-[#d8e1da] text-[#081b10] flex items-center justify-center gap-2"
                >
                  {lookupMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Verify account'
                  )}
                </button>
              ) : (
                <div className="bg-[#f7faf6] border border-[#d8e1da] rounded-lg px-3 py-2 text-sm">
                  <span className="text-[#667085]">Account name: </span>
                  <span className="font-semibold text-[#081b10]">{verifiedName}</span>
                </div>
              )}

              {verifiedName && (
                <div>
                  <label className="text-xs font-medium text-[#45504b]">Amount (NGN)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setWithdrawOpen(false);
                  resetWithdrawForm();
                }}
                className="h-9 text-xs font-semibold px-4 rounded-lg border border-[#d8e1da] text-[#45504b]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                disabled={!verifiedName || !amount || transferMutation.isPending}
                className="h-9 text-xs font-semibold px-4 rounded-lg bg-[#0F8B4B] text-white disabled:opacity-50 flex items-center gap-2"
              >
                {transferMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  'Confirm withdrawal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
