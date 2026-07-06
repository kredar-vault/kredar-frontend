'use client';

import { ShieldCheck, Copy, Check } from 'lucide-react';
import { DedicatedAccount } from '@/api/balances/types';

interface SettlementCoordinatesCardProps {
  dedicatedAccount: DedicatedAccount | null;
  onCopy: (text: string) => void;
  copied: boolean;
}

export default function SettlementCoordinatesCard({
  dedicatedAccount,
  onCopy,
  copied,
}: SettlementCoordinatesCardProps) {
  const accountNumber = dedicatedAccount?.accountNumber;
  const bankName = dedicatedAccount?.bankName;
  const accountName = dedicatedAccount?.accountName;

  return (
    <div className="bg-[#0a2e1f] text-white border border-[#164d36] rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 text-[#66c987]">
        <ShieldCheck size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">Settlement Coordinates</span>
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
                onClick={() => onCopy(accountNumber)}
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
  );
}
