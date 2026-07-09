'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBalance, useSimulateDeposit } from '@/api/balances/hooks';
import { useCreateTransfer } from '@/api/transfers/hooks';
import { useSettlementSettings } from '@/api/settlement-config/hooks';
import { Plus, Minus, Loader2, X } from 'lucide-react';

function generateMerchantTxRef() {
  return `kredar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateAccountReference() {
  return `acct_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function BalancesPage() {
  const { data: balance = 0, isLoading } = useBalance();
  const { data: settlement } = useSettlementSettings();

  // Deposit modal state
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [senderName, setSenderName] = useState('');
  const depositMutation = useSimulateDeposit();

  // Withdraw modal state
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const transferMutation = useCreateTransfer();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);

  const hasSettlementAccount = !!(
    settlement?.settlementAccountNumber && settlement?.settlementBankCode
  );

  const handleConfirmDeposit = async () => {
    if (!depositAmount || !senderName.trim()) return;
    try {
      await depositMutation.mutateAsync({
        accountReference: generateAccountReference(),
        amountNaira: Number(depositAmount),
        senderName: senderName.trim(),
        reversal: false,
      });
      setDepositOpen(false);
      setDepositAmount('');
      setSenderName('');
    } catch {
      // error toast handled in useSimulateDeposit
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!withdrawAmount || !hasSettlementAccount) return;
    try {
      await transferMutation.mutateAsync({
        merchantTxRef: generateMerchantTxRef(),
        bankCode: settlement!.settlementBankCode!,
        accountNumber: settlement!.settlementAccountNumber!,
        amount: Number(withdrawAmount),
        narration: 'Balance withdrawal',
      });
      setWithdrawOpen(false);
      setWithdrawAmount('');
    } catch {
      // error toast handled in useCreateTransfer
    }
  };

  const withdrawExceedsBalance = Number(withdrawAmount) > balance;

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
          <button
            onClick={() => setDepositOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-md bg-[#006C49] px-3.5 text-xs font-semibold text-white transition hover:bg-[#0a2e1f]"
          >
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

      {/* Deposit modal */}
      {depositOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#081b10]">Simulate deposit</h4>
              <button
                onClick={() => {
                  setDepositOpen(false);
                  setDepositAmount('');
                  setSenderName('');
                }}
                className="text-[#667085] hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#45504b]">Sender name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg outline-none focus:border-[#0f8b4b]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#45504b]">Amount (NGN)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg outline-none focus:border-[#0f8b4b]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setDepositOpen(false);
                  setDepositAmount('');
                  setSenderName('');
                }}
                className="h-9 text-xs font-semibold px-4 rounded-lg border border-[#d8e1da] text-[#45504b]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeposit}
                disabled={!depositAmount || !senderName.trim() || depositMutation.isPending}
                className="h-9 text-xs font-semibold px-4 rounded-lg bg-[#0F8B4B] text-white disabled:opacity-50 flex items-center gap-2"
              >
                {depositMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  'Simulate deposit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw modal */}
      {withdrawOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#081b10]">Withdraw funds</h4>
              <button
                onClick={() => {
                  setWithdrawOpen(false);
                  setWithdrawAmount('');
                }}
                className="text-[#667085] hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            {hasSettlementAccount ? (
              <div className="space-y-3">
                <p className="text-xs text-[#667085]">
                  Funds will be sent to your registered settlement account.
                </p>

                <div className="bg-[#f7faf6] border border-[#e8ede9] rounded-lg px-3 py-2.5">
                  <p className="text-sm font-semibold text-[#081b10]">
                    {settlement?.settlementAccountName ?? 'Settlement account'}
                  </p>
                  <p className="text-xs text-[#667085] mt-0.5">
                    {settlement?.settlementAccountNumber}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#45504b]">Amount (NGN)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg outline-none focus:border-[#0f8b4b]"
                  />
                </div>

                {withdrawAmount && (
                  <div
                    className={`rounded-lg px-3 py-2 text-xs ${
                      withdrawExceedsBalance
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#f7faf6] text-[#45504b]'
                    }`}
                  >
                    {withdrawExceedsBalance
                      ? `Insufficient balance. Available: ${formatCurrency(balance)}`
                      : `You will withdraw ${formatCurrency(Number(withdrawAmount))}. Available: ${formatCurrency(balance)}`}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setWithdrawOpen(false);
                      setWithdrawAmount('');
                    }}
                    className="flex-1 h-9 text-xs font-semibold rounded-lg border border-[#d8e1da] text-[#45504b]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmWithdraw}
                    disabled={
                      !withdrawAmount || withdrawExceedsBalance || transferMutation.isPending
                    }
                    className="flex-1 h-9 text-xs font-semibold rounded-lg bg-[#0F8B4B] text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {transferMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      'Confirm withdrawal'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#f7faf6] border border-[#e8ede9] rounded-lg px-3 py-2.5 text-xs text-[#45504b]">
                  No settlement account configured. Add one in Settings before withdrawing.
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setWithdrawOpen(false);
                      setWithdrawAmount('');
                    }}
                    className="h-9 text-xs font-semibold px-4 rounded-lg border border-[#d8e1da] text-[#45504b]"
                  >
                    Cancel
                  </button>
                  <Link
                    href="/dashboard/settings?tab=settlement"
                    className="h-9 text-xs font-semibold px-4 rounded-lg bg-[#0F8B4B] text-white flex items-center"
                    onClick={() => setWithdrawOpen(false)}
                  >
                    Go to Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
