'use client';

import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Clock,
  CheckCircle2,
  Minus,
  Loader2,
  X,
  Activity,
} from 'lucide-react';
import {
  useBalanceFull,
  useBalanceActivity,
  useWithdraw,
  ActivityItem,
} from '@/api/balances/hooks';
import AccountLookupField from '@/components/ui/AccountLookupField';
import { cn } from '@/lib/utils';
import Button from '@/components/features/landing/Button';

const fmt = (v: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
};

function StatCard({
  label,
  value,
  icon,
  accent,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-white border border-[#f0f4f1] rounded-2xl p-4 flex items-start justify-between">
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        {loading ? (
          <div className="h-7 w-28 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        )}
      </div>
      <div className={cn('p-2 rounded-xl flex-shrink-0', accent)}>{icon}</div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const isCredit = item.type === 'CREDIT';
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
          isCredit ? 'bg-[#effaf2] text-[#0f8b4b]' : 'bg-blue-50 text-blue-500',
        )}
      >
        {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.description}</p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.createdAt)}</p>
      </div>
      <p
        className={cn(
          'text-sm font-bold tabular-nums flex-shrink-0',
          isCredit ? 'text-[#0f8b4b]' : 'text-gray-900',
        )}
      >
        {isCredit ? '+' : '-'}
        {fmt(item.amount)}
      </p>
    </div>
  );
}

function WithdrawModal({
  title,
  subtitle,
  availableLabel,
  availableAmount,
  onConfirm,
  isPending,
  onClose,
}: {
  title: string;
  subtitle: string;
  availableLabel: string;
  availableAmount: number;
  onConfirm: (p: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
    amount: string;
    narration: string;
  }) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('Business Withdrawal');

  const exceeds = Number(amount) > availableAmount;
  const canSubmit = !!accountName && !!amount && Number(amount) > 0 && !exceeds;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#081b10]">{title}</h4>
            <p className="text-xs text-[#8c9c94] mt-0.5">{subtitle}</p>
          </div>
          <Button onClick={onClose} className="text-[#667085] hover:text-black">
            <X size={18} />
          </Button>
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
          <>
            <div>
              <label className="text-xs font-medium text-[#45504b]">Amount (NGN)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full mt-1 h-10 px-3 text-sm border border-[#d8e1da] rounded-xl outline-none focus:border-[#0f8b4b]"
              />
              {amount && (
                <p className={cn('text-xs mt-1', exceeds ? 'text-red-500' : 'text-[#8c9c94]')}>
                  {exceeds
                    ? `Exceeds ${availableLabel} of ${fmt(availableAmount)}`
                    : `${availableLabel}: ${fmt(availableAmount)}`}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-[#45504b]">Narration</label>
              <input
                type="text"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="w-full mt-1 h-10 px-3 text-sm border border-[#d8e1da] rounded-xl outline-none focus:border-[#0f8b4b]"
              />
            </div>
          </>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            onClick={onClose}
            className="flex-1 h-10 text-xs font-semibold rounded-xl border border-[#d8e1da] text-[#45504b] hover:bg-[#f7faf6] transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm({ bankCode, accountNumber, accountName, amount, narration })}
            disabled={!canSubmit || isPending}
            className="flex-1 h-10 text-xs font-semibold rounded-xl bg-[#0f8b4b] text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-colors hover:bg-[#0c703c]"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : 'Confirm withdrawal'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BalancesPage() {
  const { data: balance, isLoading: balLoading } = useBalanceFull();
  const { data: activity = [], isLoading: actLoading } = useBalanceActivity();
  const withdrawMutation = useWithdraw();

  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const availableBalance = balance?.availableBalance ?? 0;

  const handleBalanceWithdraw = async (p: any) => {
    try {
      await withdrawMutation.mutateAsync({
        amount: Number(p.amount),
        bankCode: p.bankCode,
        accountNumber: p.accountNumber,
        narration: p.narration,
      });
      setWithdrawOpen(false);
    } catch {
      /* toast handled */
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">Balances</h1>
        <p className="text-xs text-[#667085] mt-0.5">Monitor and manage your funds</p>
      </div>

      {/* Main balance hero */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">Total Balance</p>
            {balLoading ? (
              <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <h2 className="text-4xl font-bold tracking-tight text-[#081b10]">
                {fmt(availableBalance, balance?.currency)}
              </h2>
            )}
          </div>

          <div className="flex-shrink-0">
            <Button
              onClick={() => setWithdrawOpen(true)}
              disabled={!balance?.canWithdraw}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-[#0f8b4b] text-white px-4 text-xs font-semibold hover:bg-[#0c703c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Balance Activity */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <Activity size={15} className="text-gray-400" />
          <h3 className="text-sm font-bold text-gray-900">Balance Activity</h3>
        </div>
        {actLoading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="py-16 text-center">
            <Activity size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activity.map((item, i) => (
              <ActivityRow key={i} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Withdraw modal */}
      {withdrawOpen && (
        <WithdrawModal
          title="Withdraw funds"
          subtitle={`Available: ${fmt(availableBalance)}`}
          availableLabel="Available balance"
          availableAmount={availableBalance}
          onConfirm={handleBalanceWithdraw}
          isPending={withdrawMutation.isPending}
          onClose={() => setWithdrawOpen(false)}
        />
      )}
    </div>
  );
}
