// src/components/shared/CustomerIdentityCard.tsx
'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerIdentityCardProps {
  customerId?: string | null;
  customerName?: string | null;
  dedicatedAccountNumber?: string | null;
  bankName?: string | null;
  size?: 'sm' | 'md';
}

export default function CustomerIdentityCard({
  customerId,
  customerName,
  dedicatedAccountNumber,
  bankName,
  size = 'sm',
}: CustomerIdentityCardProps) {
  // Nothing to identify by — happens if a transaction has no customerId
  // at all (e.g. a stray/unmatched payment). Don't fake an identity.
  if (!customerId && !dedicatedAccountNumber) {
    return (
      <span className="text-[11px] font-medium text-gray-400 italic">
        Unmatched — no customer linked
      </span>
    );
  }

  const content = (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-6 h-6 rounded-full bg-[#effaf2] text-[#0f8b4b] flex items-center justify-center flex-shrink-0">
        <User size={12} />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            'font-semibold text-[#081b10] truncate',
            size === 'sm' ? 'text-xs' : 'text-sm',
          )}
        >
          {customerName || 'Unknown customer'}
        </p>
        {dedicatedAccountNumber && (
          <p className="text-[10px] text-gray-400 truncate">
            {dedicatedAccountNumber}
            {bankName ? ` · ${bankName}` : ''}
          </p>
        )}
      </div>
    </div>
  );

  // Only link if we actually have a customerId to link to
  return customerId ? (
    <Link
      href={`/dashboard/customers/${customerId}`}
      className="hover:opacity-80 transition-opacity"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
