'use client';

import { Users, CheckCircle, CreditCard, Bell } from 'lucide-react';

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#091C09] px-6 py-[125px] flex flex-col items-center gap-[101px] align-self-stretch text-white"
    >
      <div className="max-w-7xl w-full flex flex-col items-center">
        <div className="text-center max-w-3xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="text-base text-white/70 leading-relaxed">
            From collecting payments to keeping records accurate, Kredar simplifies the work behind
            every bank transfer so your business can operate with confidence.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-16">
          {[
            {
              title: 'Create Customer Accounts',
              description: 'Provision dedicated payment accounts for every customer.',
              icon: Users,
            },
            {
              title: 'Automatic Matching',
              description:
                'Every incoming payment is automatically linked to the correct customer.',
              icon: CheckCircle,
            },
            {
              title: 'Receive Payments',
              description: 'Customers pay using their assigned account details.',
              icon: CreditCard,
            },
            {
              title: 'Stay Updated',
              description:
                'Transactions appear instantly with accurate payment records and notifications.',
              icon: Bell,
            },
          ].map((step, idx) => (
            <div
              key={step.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#169E5C]/15 border border-[#169E5C]/20 flex items-center justify-center text-[#169E5C]">
                  <step.icon size={18} />
                </div>
                <h3 className="font-bold text-white text-base">{step.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
