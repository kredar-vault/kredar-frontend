'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import DrawerReconciliation from './DrawerReconciliation';
import { cn } from '@/lib/utils';
import { TransactionItem } from '@/api/transactions/types';
import CustomerIdentityCard from '@/components/ui/CustomerIdentityCard';

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionItem | null;
}

const statusColors: Record<string, string> = {
  Reconciled: 'bg-[#effaf2] text-[#0f8b4b] border-[#d4eedb]',
  Overpaid: 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]',
  Failed: 'bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]',
  Pending: 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]',
  Underpaid: 'bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]',
  Reversed: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
};

export default function TransactionDetailsDrawer({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false);

  // Handle animation mount
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const tx = transaction
    ? {
        ...transaction,
        reference: transaction.reference ?? 'NMB483920183',
        fee: transaction.fee ?? (transaction.status === 'Underpaid' ? undefined : '₦100.00'),
        currency: transaction.currency ?? 'NGN',
        method: transaction.method ?? 'Bank Transfer',
        time: transaction.time ?? '22:55pm',
        customerName: transaction.customerName ?? 'Anonymous',
        accountNumber:
          transaction.accountNumber ??
          (transaction.status === 'Underpaid' ? 'XT-AV-3024567891' : '1234567890'),
        narration: transaction.narration ?? 'June Contribution',
        expectedAmount:
          transaction.expectedAmount ??
          (transaction.status === 'Underpaid' ? '₦50,000' : transaction.amount),
        receivedAmount:
          transaction.receivedAmount ??
          (transaction.status === 'Underpaid' ? '₦45,000' : transaction.amount),
        difference:
          transaction.difference ?? (transaction.status === 'Underpaid' ? '₦5,000' : '₦0.00'),
      }
    : null;

  if (!tx) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'absolute top-0 right-0 h-full w-full max-w-lg bg-white  flex flex-col transition-transform duration-200 ease-in-out z-10',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0f4f1] flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#081b10]">Transaction Details</h2>
            <p className="text-sm font-semibold text-[#45504b]">{tx.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors text-[#45504b]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable details content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Transaction Summary */}
          <section className="space-y-4">
            <h3 className="text-base font-bold text-[#081b10] border-b border-[#f0f4f1] pb-2">
              Transaction Summary
            </h3>

            <div className="grid grid-cols-2 gap-y-3.5 text-sm">
              <span className="text-[#45504b] font-medium">Transaction ID</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.id}</span>

              <span className="text-[#45504b] font-medium">Status</span>
              <span className="text-right">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border',
                    statusColors[tx.status],
                  )}
                >
                  {tx.status}
                </span>
              </span>

              <span className="text-[#45504b] font-medium">Payment reference</span>
              <span className="font-semibold text-[#081b10] text-right truncate max-w-[200px] inline-block">
                {tx.reference}
              </span>

              <span className="text-[#45504b] font-medium">Amount</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.amount}</span>

              {tx.fee && (
                <>
                  <span className="text-[#45504b] font-medium">Fee</span>
                  <span className="font-semibold text-[#081b10] text-right">{tx.fee}</span>
                </>
              )}

              <span className="text-[#45504b] font-medium">Currency</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.currency}</span>

              <span className="text-[#45504b] font-medium">Payment method</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.method}</span>

              <span className="text-[#45504b] font-medium">Date</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.date}</span>

              <span className="text-[#45504b] font-medium">Time</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.time}</span>
            </div>
          </section>

          {/* Section 2: Account Details */}
          <section className="space-y-4">
            <h3 className="text-base font-bold text-[#081b10] border-b border-[#f0f4f1] pb-2">
              Account details
            </h3>

            <div className="grid grid-cols-2 gap-y-3.5 text-sm">
              <span className="text-[#45504b] font-medium">Customer</span>
              <span className="text-right">
                <CustomerIdentityCard
                  customerId={transaction?.customerId}
                  customerName={tx.customerName}
                  dedicatedAccountNumber={tx.accountNumber}
                />
              </span>

              <span className="text-[#45504b] font-medium">Dedicated virtual account</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.accountNumber}</span>

              <span className="text-[#45504b] font-medium">Narration</span>
              <span className="font-semibold text-[#081b10] text-right">{tx.narration}</span>
            </div>
          </section>

          {/* Section 3: Reconciliation details */}
          <DrawerReconciliation
            status={tx.status}
            expectedAmount={tx.expectedAmount}
            receivedAmount={tx.receivedAmount}
            difference={tx.difference}
            statusColors={statusColors}
          />
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#f0f4f1] flex items-center justify-end gap-3 bg-[#f7faf6]/20">
          <button onClick={onClose} className="kredar-btn-outline h-10 px-5 text-sm">
            Cancel
          </button>
          <button className="kredar-btn-primary flex items-center gap-2 h-10 px-5 text-sm font-semibold">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
