'use client';

import { ShieldCheck, Layers, Eye, BarChart, ShoppingCart } from 'lucide-react';

const features = [
  {
    title: 'Account Management',
    desc: 'Manage user accounts and transactions, chargebacks, or bank reversals with ease, ensuring smooth operation.',
    icon: ShieldCheck,
  },
  {
    title: 'Payment Processing',
    desc: 'Seamlessly process payments from multiple sources with our secure and efficient API.',
    icon: Layers,
  },
  {
    title: 'Transaction Monitoring',
    desc: 'Monitor transactions in real-time and gain insights into your financial data.',
    icon: Eye,
  },
  {
    title: 'Custom Reporting',
    desc: 'Generate custom reports and analytics to track performance and make informed decisions.',
    icon: BarChart,
  },
  {
    title: 'Order',
    desc: 'Create, update, retrieve, authorize, and capture orders.',
    icon: ShoppingCart,
  },
];

export default function DocsOverview() {
  return (
    <div className="space-y-8 max-w-4xl font-sans text-slate-800 animate-fade-in-up">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">Overview</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          Streamline financial processes, enhance security, and drive innovation in the digital
          finance landscape.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">API Features</h2>
        <div className="space-y-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex gap-4 p-4 bg-white border border-[#e2ebd9] rounded-2xl hover:shadow-sm transition-shadow"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0f8b4b]/10 flex items-center justify-center text-[#0f8b4b] shrink-0">
                  <Icon size={16} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-[#0c1e13]">{f.title}</h4>
                  <p className="text-[11px] text-[#5d6b60] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Use Cases</h2>
        <div className="p-5 bg-white border border-[#e2ebd9] rounded-2xl space-y-2">
          <h4 className="font-extrabold text-xs text-[#0c1e13]">Financial Institution</h4>
          <p className="text-[11px] text-[#5d6b60] leading-relaxed">
            Streamline operations and improve security with our comprehensive API solutions.
          </p>
        </div>
      </section>
    </div>
  );
}
