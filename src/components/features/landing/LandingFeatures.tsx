'use client';

import { Zap } from 'lucide-react';

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="px-6 py-[90px] max-w-7xl mx-auto flex flex-col items-center gap-[10px]"
    >
      <div className="text-center max-w-3xl space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#081b10]">
          Built for better payment operations
        </h2>
        <p className="text-base text-[#45504b] leading-relaxed">
          From collecting payments to keeping records accurate, Kredar simplifies the work behind
          every bank transfer so your business can operate with confidence.
        </p>
      </div>

      {/* Feature Split Block */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Dedicated Virtual Accounts */}
        <div className="bg-[#052214] rounded-3xl p-10 text-white flex flex-col justify-between min-h-[380px] shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Zap size={22} className="text-[#169E5C]" />
            </div>
            <h3 className="text-2xl font-bold">Dedicated Virtual Accounts</h3>
            <p className="text-white/80 leading-relaxed text-sm">
              Collect bank transfers through dedicated payment accounts and keep every payment
              organized from the moment it arrives.
            </p>
          </div>
        </div>

        {/* Card 2: Image Box (Mock laptop worker) */}
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] bg-slate-100 shadow-sm border border-[#d8e1da]">
          <img
            src="images/merchant.png"
            alt="Merchant working"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Grid sub-items */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Card 3: Scale */}
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-[#081b10] text-base">Built for scale</h4>
          <p className="text-xs text-[#45504b] leading-relaxed">
            Whether you’re serving hundreds or thousands of customers, Kredar scales with your
            payment operations.
          </p>
        </div>

        {/* Card 4: Verified */}
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-[#081b10] text-base">Payments verified</h4>
          <p className="text-xs text-[#45504b] leading-relaxed">
            Every incoming transfer is matched to the right customer, reducing manual checks and
            reconciliation work.
          </p>
        </div>

        {/* Card 5: Visibility */}
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-[#081b10] text-base">Real-time visibility</h4>
          <p className="text-xs text-[#45504b] leading-relaxed">
            Monitor payment activity as it happens and stay up to date without refreshing
            spreadsheets.
          </p>
        </div>

        {/* Card 6: Insights (Green box) */}
        <div className="bg-[#052214] rounded-2xl p-6 text-white space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base">Insights that matter</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Understand payment activity through clear transaction records and reporting that
              supports better operational decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
