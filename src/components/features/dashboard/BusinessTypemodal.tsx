'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { setPendingBusinessType, clearPendingBusinessType } from '@/lib/cookies';
import { Loader2, Store, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  {
    value: 'MERCHANT',
    label: 'Merchant',
    icon: Store,
    description:
      'You collect payments from your customers into your own balance and can withdraw anytime.',
    example: 'e.g. restaurant, school, e-commerce store',
  },
  {
    value: 'PLATFORM',
    label: 'Platform',
    icon: Building2,
    description:
      'You create accounts for your own users. Their money stays in their wallets — you only earn and withdraw your service revenue.',
    example: 'e.g. fintech app, savings platform, marketplace',
  },
] as const;

export default function BusinessTypeModal() {
  const [selected, setSelected] = useState<'MERCHANT' | 'PLATFORM' | null>(null);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (businessType: string) => api.patch('/tenants/business-type', { businessType }),
    onSuccess: (_, businessType) => {
      // Cookie cleared — backend now authoritative
      clearPendingBusinessType();
      qc.invalidateQueries({ queryKey: ['tenant-profile'] });
    },
    onError: (_err, businessType) => {
      // Backend failed — keep cookie so the UI still adapts
      setPendingBusinessType(businessType);
      qc.invalidateQueries({ queryKey: ['tenant-profile'] });
    },
  });

  const handleConfirm = () => {
    if (!selected) return;
    // Save to cookie immediately so the UI reacts right away
    setPendingBusinessType(selected);
    mutation.mutate(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#081b10]">What type of business is this?</h2>
          <p className="mt-1 text-sm text-[#667085]">
            This controls what you can do with your balance. You cannot change it later.
          </p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map(({ value, label, icon: Icon, description, example }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={cn(
                'w-full rounded-xl border-2 p-4 text-left transition-all',
                selected === value
                  ? 'border-[#0f8b4b] bg-[#f0faf4]'
                  : 'border-[#e8ede9] hover:border-[#0f8b4b]/40 hover:bg-gray-50',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 p-2 rounded-lg flex-shrink-0',
                    selected === value ? 'bg-[#0f8b4b] text-white' : 'bg-gray-100 text-gray-500',
                  )}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#081b10]">{label}</p>
                  <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{description}</p>
                  <p className="text-[10px] text-[#0f8b4b] font-medium mt-1">{example}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || mutation.isPending}
          className="mt-5 w-full h-11 rounded-xl bg-[#0f8b4b] text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#0c703c] transition-colors"
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Saving…
            </>
          ) : (
            'Continue to Dashboard'
          )}
        </button>
      </div>
    </div>
  );
}
