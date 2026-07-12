'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import AccountLookupField from '@/components/ui/AccountLookupField';
import Button from '../landing/Button';

type SettlementConfig = {
  settlementAccountNumber: string;
  settlementBankCode: string;
  settlementAccountName: string;
  autoSettle: boolean;
  minPayoutNaira: number;
};

const FIELD =
  'w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors';
const LABEL = 'block text-xs font-semibold text-[#45504b] mb-1.5';

export default function SettlementTab() {
  const [config, setConfig] = useState<SettlementConfig>({
    settlementAccountNumber: '',
    settlementBankCode: '',
    settlementAccountName: '',
    autoSettle: false,
    minPayoutNaira: 0,
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    api
      .get('/settings/settlement')
      .then((r) => {
        const d = r.data.data ?? {};
        setConfig({
          settlementAccountNumber: d.settlementAccountNumber ?? '',
          settlementBankCode: d.settlementBankCode ?? '',
          settlementAccountName: d.settlementAccountName ?? '',
          autoSettle: d.autoSettle ?? false,
          minPayoutNaira: d.minPayoutNaira ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoadingConfig(false));
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await api.put('/settings/settlement', config);
      setConfig(res.data.data);
      toast.success('Settlement account saved.');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to save settlement config.');
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#030A05]">Settlement account</h2>
        <p className="text-xs text-[#8c9c94] mt-0.5">Where your settled funds get sent</p>
      </div>

      {loadingConfig ? (
        <div className="space-y-5 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-11 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveConfig} className="space-y-5">
          <AccountLookupField
            bankCode={config.settlementBankCode}
            accountNumber={config.settlementAccountNumber}
            accountName={config.settlementAccountName}
            onBankChange={(code) => setConfig((c) => ({ ...c, settlementBankCode: code }))}
            onAccountNumberChange={(num) =>
              setConfig((c) => ({ ...c, settlementAccountNumber: num }))
            }
            onAccountNameChange={(name) =>
              setConfig((c) => ({ ...c, settlementAccountName: name }))
            }
          />

          <div>
            <label className={LABEL}>Minimum payout (₦)</label>
            <input
              type="number"
              min={0}
              value={config.minPayoutNaira}
              onChange={(e) => setConfig((c) => ({ ...c, minPayoutNaira: Number(e.target.value) }))}
              className={FIELD}
            />
          </div>

          {/* Auto-settle toggle */}
          <div className="flex items-center justify-between p-4 bg-[#f7faf6] border border-[#e8ede9] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[#030A05]">Auto-settle</p>
              <p className="text-xs text-[#8c9c94] mt-0.5">
                Automatically sweep settled funds to your account
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setConfig((c) => ({ ...c, autoSettle: !c.autoSettle }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${config.autoSettle ? 'bg-[#0f8b4b]' : 'bg-gray-200'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${config.autoSettle ? 'translate-x-5' : ''}`}
              />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={savingConfig}
              className="bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              {savingConfig && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
