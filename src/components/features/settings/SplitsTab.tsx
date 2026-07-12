'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import AccountLookupField from '@/components/ui/AccountLookupField';
import Button from '../landing/Button';

type Split = {
  id?: string;
  beneficiaryName: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  basis: 'Percentage' | 'Flat';
  shareBps: number;
  flatNaira: number;
  priority: number;
};

const FIELD =
  'w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors';
const LABEL = 'block text-xs font-semibold text-[#45504b] mb-1.5';

export default function SplitsTab() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings/splits')
      .then((r) =>
        setSplits(
          (r.data.data ?? []).map((s: any) => ({
            ...s,
            accountNumber: s.accountNumber ?? '',
            bankCode: s.bankCode ?? '',
            accountName: s.accountName ?? '',
          })),
        ),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addSplit = () =>
    setSplits((s) => [
      ...s,
      {
        beneficiaryName: '',
        accountNumber: '',
        bankCode: '',
        accountName: '',
        basis: 'Percentage',
        shareBps: 0,
        flatNaira: 0,
        priority: s.length + 1,
      },
    ]);

  const removeSplit = (i: number) =>
    setSplits((s) =>
      s.filter((_, idx) => idx !== i).map((sp, idx) => ({ ...sp, priority: idx + 1 })),
    );

  const update = (i: number, field: keyof Split, value: any) =>
    setSplits((s) => s.map((sp, idx) => (idx === i ? { ...sp, [field]: value } : sp)));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings/splits', { splits });
      setSplits(
        (res.data.data ?? []).map((s: any) => ({ ...s, accountName: s.accountName ?? '' })),
      );
      toast.success('Split rules saved.');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to save splits.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#030A05]">Split settlement</h2>
        <p className="text-xs text-[#8c9c94] mt-1 max-w-xl">
          Route each settlement across multiple beneficiaries. Percentage legs share the amount
          pro-rata; flat legs take a fixed amount first, by priority. Saving replaces all existing
          legs.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {splits.length === 0 && (
            <div className="text-center py-12 bg-[#f7faf6] border border-[#e8ede9] rounded-xl">
              <p className="text-sm text-[#45504b] font-medium">No split rules yet</p>
              <p className="text-xs text-[#8c9c94] mt-1">
                Add a beneficiary to start splitting settlements
              </p>
            </div>
          )}

          {splits.map((sp, i) => (
            <div key={i} className="border border-[#e8ede9] rounded-xl bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#f7faf6] border-b border-[#f0f4f1]">
                <span className="text-xs font-bold text-[#45504b] uppercase tracking-wide">
                  Beneficiary {i + 1}
                </span>
                <Button
                  type="button"
                  onClick={() => removeSplit(i)}
                  className="text-red-400 hover:text-red-600 transition-colors p-0.5"
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className={LABEL}>Beneficiary name</label>
                  <input
                    value={sp.beneficiaryName}
                    onChange={(e) => update(i, 'beneficiaryName', e.target.value)}
                    placeholder="e.g. Acme Ltd"
                    className={FIELD}
                  />
                </div>

                <AccountLookupField
                  bankCode={sp.bankCode}
                  accountNumber={sp.accountNumber}
                  accountName={sp.accountName}
                  onBankChange={(code) => update(i, 'bankCode', code)}
                  onAccountNumberChange={(num) => update(i, 'accountNumber', num)}
                  onAccountNameChange={(name) => update(i, 'accountName', name)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Basis</label>
                    <select
                      value={sp.basis}
                      onChange={(e) => update(i, 'basis', e.target.value as any)}
                      className={FIELD}
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Flat">Flat amount</option>
                    </select>
                  </div>
                  {sp.basis === 'Percentage' ? (
                    <div>
                      <label className={LABEL}>Share (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={sp.shareBps / 100}
                        onChange={(e) =>
                          update(i, 'shareBps', Math.round(Number(e.target.value) * 100))
                        }
                        placeholder="e.g. 30"
                        className={FIELD}
                      />
                      <p className="text-[10px] text-[#8c9c94] mt-1">
                        Stored as basis points internally
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className={LABEL}>Flat amount (₦)</label>
                      <input
                        type="number"
                        min={0}
                        value={sp.flatNaira}
                        onChange={(e) => update(i, 'flatNaira', Number(e.target.value))}
                        className={FIELD}
                      />
                    </div>
                  )}
                </div>

                <div className="sm:w-1/2">
                  <label className={LABEL}>Priority</label>
                  <input
                    type="number"
                    min={1}
                    value={sp.priority}
                    onChange={(e) => update(i, 'priority', Number(e.target.value))}
                    className={FIELD}
                  />
                  <p className="text-[10px] text-[#8c9c94] mt-1">Lower number = settled first</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              onClick={addSplit}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#0f8b4b] hover:text-[#0c703c] transition-colors"
            >
              <Plus size={15} />
              Add beneficiary
            </Button>
            {splits.length > 0 && (
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Save split rules
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
