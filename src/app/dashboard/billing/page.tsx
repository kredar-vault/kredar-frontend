'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
  useBillingSchedules,
  useCreateBillingSchedule,
  usePauseSchedule,
  useResumeSchedule,
  useCancelSchedule,
} from '@/api/billing/hooks';
import { useCustomers } from '@/api/customers/hooks';

const INTERVALS = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const STATUS_STYLE: Record<string, string> = {
  Active: 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]',
  Paused: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  Cancelled: 'bg-red-50 text-red-700 border-red-100',
};

const PERIOD_STATUS_STYLE: Record<string, string> = {
  Open: 'bg-blue-50 text-blue-700 border-blue-100',
  Paid: 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]',
  Overdue: 'bg-red-50 text-red-700 border-red-100',
};

function fmt(kobo: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const FIELD =
  'w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors';
const LABEL = 'block text-xs font-semibold text-[#45504b] mb-1.5';

export default function BillingPage() {
  const { data: schedules = [], isLoading } = useBillingSchedules();
  const { data: customers = [] } = useCustomers();
  const pause = usePauseSchedule();
  const resume = useResumeSchedule();
  const cancel = useCancelSchedule();
  const create = useCreateBillingSchedule();

  const [showCreate, setShowCreate] = useState(false);
  const [accountRef, setAccountRef] = useState('');
  const [interval, setInterval] = useState('Monthly');
  const [amount, setAmount] = useState('');
  const [dueOffsetDays, setDueOffsetDays] = useState('3');
  const [description, setDescription] = useState('');

  const active = schedules.filter((s) => s.status === 'Active');
  const paused = schedules.filter((s) => s.status === 'Paused').length;
  const nextCycleTotal = active.reduce((sum, s) => sum + s.nextAmountKobo, 0);

  const resetForm = () => {
    setAccountRef('');
    setInterval('Monthly');
    setAmount('');
    setDueOffsetDays('3');
    setDescription('');
  };

  const handleCreate = () => {
    const naira = parseFloat(amount);
    if (!accountRef || !naira || naira <= 0) return;
    create.mutate(
      {
        accountRef,
        interval,
        amountKobo: Math.round(naira * 100),
        dueOffsetDays: parseInt(dueOffsetDays) || 3,
        ...(description ? { description } : {}),
      },
      {
        onSuccess: () => {
          setShowCreate(false);
          resetForm();
        },
      },
    );
  };

  const customersWithDva = customers.filter((c) => c.dedicatedAccountNumber);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#030A05]">Billing</h1>
          <p className="text-sm text-[#8c9c94] mt-0.5">
            Recurring billing schedules across your customers
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          New schedule
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active schedules', value: String(active.length) },
          { label: 'Next-cycle value', value: fmt(nextCycleTotal) },
          { label: 'Paused', value: String(paused) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#e8ede9] rounded-2xl p-5">
            <p className="text-xs font-medium text-[#8c9c94]">{label}</p>
            <p className="text-2xl font-bold text-[#030A05] mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8ede9] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4f1] bg-[#f7faf6]">
              {[
                'Customer / Ref',
                'Interval',
                'Next amount',
                'Periods',
                'Next due',
                'Status',
                '',
              ].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide ${h === '' ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : schedules.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium text-[#45504b]">No billing schedules yet</p>
                  <p className="text-xs text-[#8c9c94] mt-1">
                    Create one to start recurring billing for your customers
                  </p>
                </td>
              </tr>
            ) : (
              schedules.map((s) => (
                <tr key={s.id} className="hover:bg-[#f7faf6]/70 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#030A05]">{s.accountRef}</p>
                    {s.description && (
                      <p className="text-xs text-[#8c9c94] mt-0.5">{s.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#45504b]">{s.interval}</td>
                  <td className="px-5 py-4 font-semibold text-[#030A05]">
                    {fmt(s.nextAmountKobo)}
                  </td>
                  <td className="px-5 py-4 text-[#45504b]">{s.periodsGenerated}</td>
                  <td className="px-5 py-4 text-[#45504b]">{fmtDate(s.currentPeriodEndUtc)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLE[s.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      {s.status === 'Active' && (
                        <button
                          onClick={() => pause.mutate(s.id)}
                          disabled={pause.isPending}
                          className="text-xs font-semibold text-yellow-600 hover:text-yellow-800 transition-colors disabled:opacity-50"
                        >
                          Pause
                        </button>
                      )}
                      {s.status === 'Paused' && (
                        <button
                          onClick={() => resume.mutate(s.id)}
                          disabled={resume.isPending}
                          className="text-xs font-semibold text-[#0f8b4b] hover:text-[#0c703c] transition-colors disabled:opacity-50"
                        >
                          Resume
                        </button>
                      )}
                      {s.status !== 'Cancelled' && (
                        <button
                          onClick={() =>
                            window.confirm('Cancel this billing schedule?') && cancel.mutate(s.id)
                          }
                          disabled={cancel.isPending}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-base font-bold text-[#030A05] mb-4">New billing schedule</h2>
            <div className="space-y-4">
              <div>
                <label className={LABEL}>Customer</label>
                {customersWithDva.length > 0 ? (
                  <select
                    value={accountRef}
                    onChange={(e) => setAccountRef(e.target.value)}
                    className={FIELD}
                  >
                    <option value="">Select a customer…</option>
                    {customersWithDva.map((c) => (
                      <option key={c.id} value={c.dedicatedAccountNumber}>
                        {c.fullName || `${c.firstName} ${c.lastName}`} — {c.dedicatedAccountNumber}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={accountRef}
                    onChange={(e) => setAccountRef(e.target.value)}
                    placeholder="DVA account reference"
                    className={FIELD}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Interval</label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className={FIELD}
                  >
                    {INTERVALS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Amount (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Due offset (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={dueOffsetDays}
                    onChange={(e) => setDueOffsetDays(e.target.value)}
                    className={FIELD}
                  />
                  <p className="text-[10px] text-[#8c9c94] mt-1">
                    Days after cycle end payment is due
                  </p>
                </div>
                <div>
                  <label className={LABEL}>Description (optional)</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Monthly plan"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    resetForm();
                  }}
                  className="flex-1 border border-[#d8e1da] text-sm font-semibold text-[#45504b] py-2.5 rounded-xl hover:bg-[#f7faf6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!accountRef || !amount || create.isPending}
                  className="flex-1 bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {create.isPending && <Loader2 size={14} className="animate-spin" />}
                  Create schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
