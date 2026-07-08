'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

const NIGERIAN_BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank Nigeria', code: '023' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank (FCMB)', code: '214' },
  { name: 'Globus Bank', code: '00103' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Jaiz Bank', code: '301' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Moniepoint MFB', code: '50515' },
  { name: 'Opay', code: '999992' },
  { name: 'Palmpay', code: '999991' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Suntrust Bank', code: '100' },
  { name: 'Titan Trust Bank', code: '102' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'VFD Microfinance Bank', code: '566' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' },
];

export { NIGERIAN_BANKS };

type LookupState = 'idle' | 'loading' | 'success' | 'error';

interface AccountLookupFieldProps {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  onBankChange: (code: string) => void;
  onAccountNumberChange: (number: string) => void;
  onAccountNameChange: (name: string) => void;
  layout?: 'grid' | 'stack';
}

const BASE =
  'w-full border bg-white rounded-xl px-4 py-3 text-sm text-[#030A05] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 transition-colors';
const FIELD_NORMAL = `${BASE} border-[#d8e1da] focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b]`;
const FIELD_OK = `${BASE} border-[#0f8b4b] focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] bg-[#f7fdf9]`;
const FIELD_ERR = `${BASE} border-red-300 focus:ring-red-200 focus:border-red-400`;
const LABEL = 'block text-xs font-semibold text-[#45504b] mb-1.5';

export default function AccountLookupField({
  bankCode,
  accountNumber,
  accountName,
  onBankChange,
  onAccountNumberChange,
  onAccountNameChange,
  layout = 'grid',
}: AccountLookupFieldProps) {
  const [lookupState, setLookupState] = useState<LookupState>('idle');
  const [lookupError, setLookupError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (accountNumber.length !== 10 || !bankCode) {
      setLookupState('idle');
      setLookupError('');
      if (accountName) onAccountNameChange('');
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLookupState('loading');
      setLookupError('');
      onAccountNameChange('');
      try {
        const res = await api.post('/api/v1/transfers/bank/lookup', {
          accountNumber,
          bankCode,
        });
        const name = res.data.data?.accountName ?? '';
        onAccountNameChange(name);
        setLookupState('success');
      } catch (err: any) {
        setLookupError(err.response?.data?.message ?? 'Account not found');
        setLookupState('error');
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [accountNumber, bankCode]);

  const accountNumberField = (
    <div>
      <label className={LABEL}>Account number</label>
      <div className="relative">
        <input
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="0123456789"
          maxLength={10}
          className={
            lookupState === 'success'
              ? FIELD_OK
              : lookupState === 'error'
                ? FIELD_ERR
                : FIELD_NORMAL
          }
        />
        {lookupState === 'loading' && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0f8b4b] animate-spin"
          />
        )}
        {lookupState === 'success' && (
          <CheckCircle
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0f8b4b]"
          />
        )}
        {lookupState === 'error' && (
          <XCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />
        )}
      </div>
      {lookupState === 'error' && <p className="text-[11px] text-red-500 mt-1">{lookupError}</p>}
    </div>
  );

  const bankField = (
    <div>
      <label className={LABEL}>Bank</label>
      <select
        value={bankCode}
        onChange={(e) => onBankChange(e.target.value)}
        className={FIELD_NORMAL}
      >
        <option value="">Select bank</option>
        {NIGERIAN_BANKS.map((b) => (
          <option key={b.code} value={b.code}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );

  const accountNameField = accountName ? (
    <div className={layout === 'grid' ? 'sm:col-span-2' : ''}>
      <label className={LABEL}>Account name</label>
      <div className="flex items-center gap-2 px-4 py-3 bg-[#f0fbf5] border border-[#0f8b4b]/30 rounded-xl">
        <CheckCircle size={14} className="text-[#0f8b4b] flex-shrink-0" />
        <span className="text-sm font-semibold text-[#0f8b4b]">{accountName}</span>
      </div>
    </div>
  ) : null;

  if (layout === 'stack') {
    return (
      <div className="space-y-4">
        {bankField}
        {accountNumberField}
        {accountNameField}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {bankField}
      {accountNumberField}
      {accountNameField}
    </div>
  );
}
