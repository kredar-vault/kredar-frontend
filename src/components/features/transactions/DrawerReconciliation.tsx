'use client';

import { cn } from '@/lib/utils';

interface DrawerReconciliationProps {
  status: string;
  expectedAmount: string;
  receivedAmount: string;
  difference: string;
  statusColors: Record<string, string>;
}

export default function DrawerReconciliation({
  status,
  expectedAmount,
  receivedAmount,
  difference,
  statusColors,
}: DrawerReconciliationProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-bold text-[#081b10] border-b border-[#f0f4f1] pb-2">
        Reconciliation details
      </h3>

      <div className="grid grid-cols-2 gap-y-3.5 text-sm">
        <span className="text-[#45504b] font-medium">Status</span>
        <span className="text-right">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
              statusColors[status],
            )}
          >
            {status}
          </span>
        </span>

        {status !== 'Failed' && (
          <>
            <span className="text-[#45504b] font-medium">Expected amount</span>
            <span className="font-semibold text-[#081b10] text-right">{expectedAmount}</span>

            <span className="text-[#45504b] font-medium">Amount Received</span>
            <span className="font-semibold text-[#081b10] text-right">{receivedAmount}</span>

            <span className="text-[#45504b] font-medium">Difference</span>
            <span className="font-semibold text-[#081b10] text-right">{difference}</span>
          </>
        )}
      </div>
    </section>
  );
}
