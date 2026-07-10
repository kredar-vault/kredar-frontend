'use client';

import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
  CalendarClock,
  Plus,
  Minus,
  Loader2,
  X,
  Activity,
} from 'lucide-react';
import {
  useBalanceFull,
  useRevenue,
  useBalanceActivity,
  useWithdraw,
  useRevenueWithdraw,
  useSimulateDeposit,
  ActivityItem,
} from '@/api/balances/hooks';
import { useTenantProfile } from '@/api/tenant/hooks';
import { getPendingBusinessType } from '@/lib/cookies';
import AccountLookupField from '@/components/ui/AccountLookupField';
import { cn } from '@/lib/utils';

function generateAccountReference() {
  return `acct_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

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
    <div className="bg-white border border-[#f0f4f1] rounded-2xl p-4 shadow-sm flex items-start justify-between">
      <div className="space-y-1 min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        {loading ? (
          <div className="h-7 w-28 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="text-xl font-bold text-gray-900 tracking-tight truncate">{value}</p>
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
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#081b10]">{title}</h4>
            <p className="text-xs text-[#8c9c94] mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-[#667085] hover:text-black">
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
          <button
            onClick={onClose}
            className="flex-1 h-10 text-xs font-semibold rounded-xl border border-[#d8e1da] text-[#45504b] hover:bg-[#f7faf6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ bankCode, accountNumber, accountName, amount, narration })}
            disabled={!canSubmit || isPending}
            className="flex-1 h-10 text-xs font-semibold rounded-xl bg-[#0f8b4b] text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-colors hover:bg-[#0c703c]"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : 'Confirm withdrawal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BalancesPage() {
  const { data: profile } = useTenantProfile();
  const { data: balance, isLoading: balLoading } = useBalanceFull();
  const { data: revenue, isLoading: revLoading } = useRevenue();
  const { data: activity = [], isLoading: actLoading } = useBalanceActivity();

  const rawType = ((profile?.businessType ?? '') || getPendingBusinessType() || '').toUpperCase();
  const isPlatform = rawType.includes('PLATFORM');

  const withdrawMutation = useWithdraw();
  const revenueWithdrawMutation = useRevenueWithdraw();
  const depositMutation = useSimulateDeposit();

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [revenueWithdrawOpen, setRevenueWithdrawOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [senderName, setSenderName] = useState('');

  const availableBalance = balance?.availableBalance ?? 0;
  const availableRevenue = revenue?.availableRevenue ?? 0;

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

  const handleRevenueWithdraw = async (p: any) => {
    try {
      await revenueWithdrawMutation.mutateAsync({
        amount: Number(p.amount),
        bankCode: p.bankCode,
        accountNumber: p.accountNumber,
        narration: p.narration,
      });
      setRevenueWithdrawOpen(false);
    } catch {
      /* toast handled */
    }
  };

  const handleDeposit = async () => {
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
      /* toast handled */
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">
            {isPlatform ? 'Revenue' : 'Balances'}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            {isPlatform
              ? 'Track and withdraw your earned revenue.'
              : 'Monitor and manage your funds.'}
          </p>
        </div>
        {isPlatform && (
          <button
            onClick={() => setDepositOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-[#effaf2] text-[#0f8b4b] px-4 text-xs font-semibold hover:bg-[#d4eedb] transition-colors flex-shrink-0"
          >
            <Plus size={14} />
            Simulate Deposit
          </button>
        )}
      </div>

      {/* Main balance hero — MERCHANT only */}
      {!isPlatform && (
        <div className="bg-white border border-[#f0f4f1] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Available Balance
              </p>
              {balLoading ? (
                <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
              ) : (
                <h2 className="text-4xl font-bold tracking-tight text-[#081b10]">
                  {fmt(availableBalance, balance?.currency)}
                </h2>
              )}
            </div>

            <div className="flex gap-2.5 flex-shrink-0 flex-wrap">
              <button
                onClick={() => setDepositOpen(true)}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-[#effaf2] text-[#0f8b4b] px-4 text-xs font-semibold hover:bg-[#d4eedb] transition-colors"
              >
                <Plus size={14} />
                Simulate Deposit
              </button>
              <button
                onClick={() => setWithdrawOpen(true)}
                disabled={!balance?.canWithdraw}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-[#0f8b4b] text-white px-4 text-xs font-semibold hover:bg-[#0c703c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={14} />
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid — MERCHANT only */}
      {!isPlatform &&
        (balLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#f0f4f1] rounded-2xl p-4 h-24 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Pending"
              value={fmt(balance?.pendingBalance ?? 0)}
              icon={<Clock size={16} />}
              accent="bg-amber-50 text-amber-500"
            />
            <StatCard
              label="Incoming Today"
              value={fmt(balance?.incomingToday ?? 0)}
              icon={<ArrowDownLeft size={16} />}
              accent="bg-[#effaf2] text-[#0f8b4b]"
            />
            <StatCard
              label="Settled Today"
              value={fmt(balance?.settledToday ?? 0)}
              icon={<CheckCircle2 size={16} />}
              accent="bg-[#effaf2] text-[#0f8b4b]"
            />
            <StatCard
              label="On Hold"
              value={fmt(balance?.onHoldBalance ?? 0)}
              icon={<Wallet size={16} />}
              accent="bg-gray-100 text-gray-500"
            />
          </div>
        ))}

      {/* Platform revenue section */}
      {isPlatform && !revLoading && revenue?.enabled && (
        <div className="bg-white border border-[#f0f4f1] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} className="text-[#0f8b4b]" />
              <h3 className="text-sm font-bold text-gray-900">Your Revenue</h3>
              <span className="text-[10px] bg-[#effaf2] text-[#0f8b4b] font-semibold px-2 py-0.5 rounded-full">
                Withdrawable
              </span>
            </div>
            <button
              onClick={() => setRevenueWithdrawOpen(true)}
              disabled={availableRevenue <= 0}
              className="flex h-8 items-center gap-1.5 rounded-xl bg-[#0f8b4b] text-white px-3 text-xs font-semibold hover:bg-[#0c703c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={13} />
              Withdraw Revenue
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Available to Withdraw
              </p>
              <p className="text-2xl font-bold text-[#0f8b4b] mt-1">
                {fmt(revenue.availableRevenue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Total Earned
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(revenue.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Today
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(revenue.todayRevenue)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(revenue.monthlyRevenue)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Activity */}
      <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
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

      {/* Modals */}
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

      {revenueWithdrawOpen && (
        <WithdrawModal
          title="Withdraw revenue"
          subtitle={`Available revenue: ${fmt(availableRevenue)}`}
          availableLabel="Available revenue"
          availableAmount={availableRevenue}
          onConfirm={handleRevenueWithdraw}
          isPending={revenueWithdrawMutation.isPending}
          onClose={() => setRevenueWithdrawOpen(false)}
        />
      )}

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
                onClick={handleDeposit}
                disabled={!depositAmount || !senderName.trim() || depositMutation.isPending}
                className="h-9 text-xs font-semibold px-4 rounded-lg bg-[#0f8b4b] text-white disabled:opacity-50 flex items-center gap-2"
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
    </div>
  );
}
