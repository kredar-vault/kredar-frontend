'use client';

import {
  CreditCard,
  RefreshCw,
  ShoppingCart,
  FileText,
  Activity,
  Gift,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

const cards = [
  {
    title: 'Accept Payment',
    desc: 'Authorize payments, capture authorized payments, refund payments that have already been captured, and show payment information.',
    icon: CreditCard,
  },
  {
    title: 'Subscription',
    desc: 'Create subscriptions that process recurring PayPal payments for physical or digital goods, or services.',
    icon: RefreshCw,
  },
  {
    title: 'Order',
    desc: 'Create, update, retrieve, authorize, and capture orders.',
    icon: ShoppingCart,
  },
  {
    title: 'Invoicing',
    desc: 'Create, send, and manage invoices, including tracking invoice payments.',
    icon: FileText,
  },
  {
    title: 'Transaction',
    desc: 'Get the transaction history for a API-DOC account.',
    icon: Activity,
  },
  {
    title: 'Payout',
    desc: 'Make payments or send commissions, rebates, rewards, and general disbursements to multiple accounts.',
    icon: Gift,
  },
  {
    title: 'Dispute',
    desc: 'Manage customer initiated disputes, chargebacks, or bank reversals.',
    icon: AlertTriangle,
  },
  {
    title: 'Refund',
    desc: 'Manage customer refund, full refund or partial refund.',
    icon: ShieldCheck,
  },
];

export default function DocsPayments() {
  return (
    <div className="space-y-8 max-w-4xl font-sans text-slate-800 animate-fade-in-up">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">Payments</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          Our API empowers developers and businesses to effortlessly integrate payment processing
          capabilities into their applications, streamlining transactions and enhancing user
          experiences.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="p-5 bg-white border border-[#e2ebd9] rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0f8b4b]/10 flex items-center justify-center text-[#0f8b4b]">
                  <Icon size={16} />
                </div>
                <h4 className="font-extrabold text-xs text-[#0c1e13]">{c.title}</h4>
                <p className="text-[11px] text-[#5d6b60] leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
