'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Store } from 'lucide-react';
import AccountLookupField from '@/components/ui/AccountLookupField';

type SubMerchant = {
  id: string;
  name: string;
  reference: string;
  status: string;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  settlementAccountName?: string;
  platformFeeBps: number;
  createdAt: string;
};

type PayoutForm = {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  platformFeeBps: number;
};

export default function SubMerchantsPage() {
  const [merchants, setMerchants] = useState<SubMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createRef, setCreateRef] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Payout modal
  const [payoutTarget, setPayoutTarget] = useState<SubMerchant | null>(null);
  const [payoutForm, setPayoutForm] = useState<PayoutForm>({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
    platformFeeBps: 0,
  });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/api/v1/sub-merchants')
      .then((r) => setMerchants(r.data.data ?? []))
      .catch((e) => setError(e.response?.data?.message ?? 'Failed to load sub-merchants'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      await api.post('/api/v1/sub-merchants', { name: createName, reference: createRef });
      setShowCreate(false);
      setCreateName('');
      setCreateRef('');
      load();
    } catch (err: any) {
      setCreateError(err.response?.data?.message ?? 'Failed to create sub-merchant');
    } finally {
      setCreating(false);
    }
  };

  const openPayout = (m: SubMerchant) => {
    setPayoutTarget(m);
    setPayoutForm({
      bankName: m.settlementBankName ?? '',
      bankCode: '',
      accountNumber: m.settlementAccountNumber ?? '',
      accountName: m.settlementAccountName ?? '',
      platformFeeBps: m.platformFeeBps ?? 0,
    });
    setPayoutError('');
  };

  const handleSavePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutTarget) return;
    setPayoutError('');
    setSavingPayout(true);
    try {
      await api.put(`/api/v1/sub-merchants/${payoutTarget.id}/payout`, payoutForm);
      setPayoutTarget(null);
      load();
    } catch (err: any) {
      setPayoutError(err.response?.data?.message ?? 'Failed to save payout account');
    } finally {
      setSavingPayout(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#030A05]">Sub-merchants</h1>
          <p className="text-sm text-[#8c9c94] mt-0.5">
            Onboard sellers under your platform and route their settlements
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          New sub-merchant
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#e8ede9] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4f1] bg-[#f7faf6]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Reference
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Payout account
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[#45504b] uppercase tracking-wide text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f1]">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : merchants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-[#effaf2] rounded-xl flex items-center justify-center">
                      <Store size={18} className="text-[#0f8b4b]" />
                    </div>
                    <p className="text-sm font-medium text-[#45504b]">No sub-merchants yet</p>
                    <p className="text-xs text-[#8c9c94]">
                      Create one to start routing settlements
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              merchants.map((m) => (
                <tr key={m.id} className="hover:bg-[#f7faf6]/70 transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#030A05]">{m.name}</td>
                  <td className="px-5 py-4 text-[#45504b] font-mono text-xs">{m.reference}</td>
                  <td className="px-5 py-4 text-[#45504b]">
                    {m.settlementAccountNumber ? (
                      `${m.settlementBankName} · ${m.settlementAccountNumber}`
                    ) : (
                      <span className="text-[#9ca3a8] italic">Not set</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        m.status === 'Active'
                          ? 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]'
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openPayout(m)}
                      className="text-xs font-semibold text-[#0f8b4b] hover:text-[#0c703c] transition-colors"
                    >
                      Payout →
                    </button>
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
            <h2 className="text-base font-bold text-[#030A05] mb-4">New sub-merchant</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#45504b] mb-1.5">Name</label>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  required
                  placeholder="Acme Store"
                  className="w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45504b] mb-1.5">
                  Reference
                </label>
                <input
                  value={createRef}
                  onChange={(e) => setCreateRef(e.target.value)}
                  required
                  placeholder="acme-store"
                  className="w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors"
                />
                <p className="text-[10px] text-[#8c9c94] mt-1">
                  A unique identifier to attach virtual accounts to this sub-merchant.
                </p>
              </div>
              {createError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {createError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-[#d8e1da] text-sm font-semibold text-[#45504b] py-2.5 rounded-xl hover:bg-[#f7faf6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout modal */}
      {payoutTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-base font-bold text-[#030A05] mb-1">Payout account</h2>
            <p className="text-xs text-[#8c9c94] mb-4">
              Settlement details for{' '}
              <span className="font-semibold text-[#030A05]">{payoutTarget.name}</span>
            </p>
            <form onSubmit={handleSavePayout} className="space-y-4">
              <AccountLookupField
                layout="stack"
                bankCode={payoutForm.bankCode}
                accountNumber={payoutForm.accountNumber}
                accountName={payoutForm.accountName}
                onBankChange={(code) => setPayoutForm((f) => ({ ...f, bankCode: code }))}
                onAccountNumberChange={(num) =>
                  setPayoutForm((f) => ({ ...f, accountNumber: num }))
                }
                onAccountNameChange={(name) => setPayoutForm((f) => ({ ...f, accountName: name }))}
              />
              <div>
                <label className="block text-xs font-semibold text-[#45504b] mb-1.5">
                  Platform fee (bps)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  value={payoutForm.platformFeeBps}
                  onChange={(e) =>
                    setPayoutForm((f) => ({ ...f, platformFeeBps: Number(e.target.value) }))
                  }
                  className="w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors"
                />
                <p className="text-[10px] text-[#8c9c94] mt-1">100 bps = 1%. Leave 0 for no fee.</p>
              </div>
              {payoutError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {payoutError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutTarget(null)}
                  className="flex-1 border border-[#d8e1da] text-sm font-semibold text-[#45504b] py-2.5 rounded-xl hover:bg-[#f7faf6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPayout}
                  className="flex-1 bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {savingPayout ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
