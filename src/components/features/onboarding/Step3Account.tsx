'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '050', name: 'Ecobank' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '082', name: 'Keystone Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '50211', name: 'Kuda Microfinance Bank' },
  { code: '50515', name: 'Moniepoint MFB' },
  { code: '999992', name: 'OPay' },
  { code: '999991', name: 'PalmPay' },
];

const schema = z.object({
  bankCode: z.string().min(1, 'Please select your bank'),
  accountName: z
    .string()
    .min(1, 'Account name is required')
    .regex(/^[a-zA-Z\s.']+$/, 'Account name must only contain letters (no numbers allowed)'),
  accountNumber: z
    .string()
    .length(10, 'Account number must be exactly 10 digits')
    .regex(/^\d+$/, 'Account number must contain only numbers'),
});

type FormValues = z.infer<typeof schema>;

export interface Step3Data {
  bankCode: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface Props {
  defaultValues: Step3Data | null;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

export default function Step3Account({ defaultValues, onNext, onBack }: Props) {
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [resolvedName, setResolvedName] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          bankCode: defaultValues.bankCode,
          accountName: defaultValues.accountName,
          accountNumber: defaultValues.accountNumber,
        }
      : undefined,
  });

  const watchedBankCode = watch('bankCode');
  const watchedAccountNumber = watch('accountNumber');

  useEffect(() => {
    if (watchedBankCode && watchedAccountNumber && watchedAccountNumber.length === 10) {
      const performLookup = async () => {
        setResolving(true);
        setResolveError('');
        setResolvedName('');
        try {
          const res = await api.post('/transfers/bank/lookup', {
            accountNumber: watchedAccountNumber,
            bankCode: watchedBankCode,
          });
          const name = res.data?.accountName || res.data?.data?.accountName || res.data?.data;
          if (name) {
            setResolvedName(name);
            setValue('accountName', name);
            toast.success('Account resolved successfully!');
          } else {
            setResolveError('Could not resolve account name automatically.');
          }
        } catch (err: any) {
          console.error(err);
          setResolveError(
            err.response?.data?.message ||
              'Failed to verify account number. You can enter the name manually.',
          );
        } finally {
          setResolving(false);
        }
      };

      performLookup();
    } else {
      setResolvedName('');
      setResolveError('');
    }
  }, [watchedBankCode, watchedAccountNumber, setValue]);

  const onSubmit = (values: FormValues) => {
    const selected = NIGERIAN_BANKS.find((b) => b.code === values.bankCode);
    onNext({
      bankCode: values.bankCode,
      bankName: selected ? selected.name : '',
      accountName: values.accountName,
      accountNumber: values.accountNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-md  px-10 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-[#081b10]">Account details</h1>
        <p className="mt-1.5 text-sm text-[#45504b]">
          Add the bank account where your collected payments will be settled
        </p>
      </div>

      <div className="space-y-5">
        {/* Bank selection dropdown */}
        <div className="relative">
          <label className="kredar-label">Bank name*</label>
          <select
            {...register('bankCode')}
            className={cn('kredar-input appearance-none pr-10', errors.bankCode && 'input-error')}
          >
            <option value="">Select your bank</option>
            {NIGERIAN_BANKS.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
          {errors.bankCode && <p className="kredar-error-text">{errors.bankCode.message}</p>}
        </div>

        {/* Account name + Account number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="kredar-label">Account name*</label>
            <input
              placeholder="Enter account name"
              {...register('accountName')}
              className={cn('kredar-input', errors.accountName && 'input-error')}
            />
            {errors.accountName && (
              <p className="kredar-error-text">{errors.accountName.message}</p>
            )}
          </div>
          <div>
            <label className="kredar-label">Account number*</label>
            <input
              placeholder="Enter account number"
              maxLength={10}
              {...register('accountNumber')}
              className={cn('kredar-input', errors.accountNumber && 'input-error')}
            />
            {errors.accountNumber && (
              <p className="kredar-error-text">{errors.accountNumber.message}</p>
            )}

            {resolving && (
              <p className="text-xs text-[#0f8b4b] mt-1 flex items-center gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying account number...
              </p>
            )}
            {resolvedName && (
              <p className="text-xs text-[#0f8b4b] mt-1 font-semibold">
                ✓ Account Verified: {resolvedName}
              </p>
            )}
            {resolveError && (
              <p className="text-xs text-[#d946ef] mt-1 font-medium">⚠ {resolveError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={onBack} className="kredar-btn-outline">
          Back
        </button>
        <button type="submit" className="kredar-btn-primary">
          Next
        </button>
      </div>
    </form>
  );
}
