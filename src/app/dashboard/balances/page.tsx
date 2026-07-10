'use client';

import { useState } from 'react';
import { useBalance, useSimulateDeposit } from '@/api/balances/hooks';
import { useCreateTransfer } from '@/api/transfers/hooks';
import { Plus, Minus, Loader2, X } from 'lucide-react';
import AccountLookupField from '@/components/ui/AccountLookupField';

function generateMerchantTxRef() {
  return `kredar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateAccountReference() {
  return `acct_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function BalancesPage() {
  const { data: balance = 0, isLoading } = useBalance();

  // Deposit modal
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [senderName, setSenderName] = useState('');
  const depositMutation = useSimulateDeposit();

  // Withdraw modal
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const transferMutation = useCreateTransfer();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);

  const resetWithdraw = () => {
    setBankCode('');
    setAccountNumber('');
    setAccountName('');
    setWithdrawAmount('');
  };

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
      // toast handled in hook
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!accountName || !withdrawAmount || !bankCode || !accountNumber) return;
    try {
      await transferMutation.mutateAsync({
        merchantTxRef: generateMerchantTxRef(),
        bankCode,
        accountNumber,
        amount: Number(withdrawAmount),
        narration: 'Balance withdrawal',
      });
      setWithdrawOpen(false);
      resetWithdraw();
    } catch {
      // toast handled in hook
    }
  };

  const withdrawExceedsBalance = Number(withdrawAmount) > balance;
  const canWithdraw = !!accountName && !!withdrawAmount && !withdrawExceedsBalance;

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#081b10]">Withdraw funds</h4>
                <p className="text-xs text-[#8c9c94] mt-0.5">Enter the account to send funds to</p>
              </div>
              <button
                onClick={() => {
                  setWithdrawOpen(false);
                  resetWithdraw();
                }}
                className="text-[#667085] hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <AccountLookupField
              layout="stack"
              bankCode={bankCode}
              accountNumber={accountNumber}
              accountName={accountName}
              onBankChange={setBankCode}
              onAccountNumberChange={setAccountNumber}
              onAccountNameChange={setAccountName}
            />

            {accountName && (
              <div>
                <label className="text-xs font-medium text-[#45504b]">Amount (NGN)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 h-10 px-3 text-sm border border-[#d8e1da] rounded-xl outline-none focus:border-[#0f8b4b]"
                />
                {withdrawAmount && (
                  <p
                    className={`text-xs mt-1 ${withdrawExceedsBalance ? 'text-red-500' : 'text-[#8c9c94]'}`}
                  >
                    {withdrawExceedsBalance
                      ? `Insufficient balance. Available: ${formatCurrency(balance)}`
                      : `Available: ${formatCurrency(balance)}`}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setWithdrawOpen(false);
                  resetWithdraw();
                }}
                className="flex-1 h-10 text-xs font-semibold rounded-xl border border-[#d8e1da] text-[#45504b] hover:bg-[#f7faf6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                disabled={!canWithdraw || transferMutation.isPending}
                className="flex-1 h-10 text-xs font-semibold rounded-xl bg-[#0F8B4B] text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-colors hover:bg-[#0c703c]"
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
