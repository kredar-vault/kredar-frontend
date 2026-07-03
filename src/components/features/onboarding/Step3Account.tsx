'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const schema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(5, 'Account number must be at least 5 digits'),
});

export type Step3Data = z.infer<typeof schema>;

interface Props {
  defaultValues: Step3Data | null;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

export default function Step3Account({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? undefined,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="bg-white rounded-2xl shadow-sm px-10 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-[#081b10]">Account details</h1>
        <p className="mt-1.5 text-sm text-[#45504b]">
          Add the bank account where your collected payments will be settled
        </p>
      </div>

      <div className="space-y-5">
        {/* Bank name — full width */}
        <div>
          <label className="kredar-label">Bank name*</label>
          <input
            placeholder="Enter your bank name"
            {...register('bankName')}
            className={cn('kredar-input', errors.bankName && 'input-error')}
          />
          {errors.bankName && <p className="kredar-error-text">{errors.bankName.message}</p>}
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
              {...register('accountNumber')}
              className={cn('kredar-input', errors.accountNumber && 'input-error')}
            />
            {errors.accountNumber && (
              <p className="kredar-error-text">{errors.accountNumber.message}</p>
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
