import React from 'react';

export default function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Create Customer Accounts',
      desc: 'From customer onboarding to real-time reconciliation, Kredar provides unique virtual payment accounts for each of your customers.',
    },
    {
      num: '02',
      title: 'Automatic Matching',
      desc: 'Every inbound transfer is automatically matched and reconciled with zero manual effort required from your team.',
    },
    {
      num: '03',
      title: 'Receive Payments',
      desc: 'Payments are confirmed, settled and available for your customers within seconds of arrival.',
    },
    {
      num: '04',
      title: 'Stay Updated',
      desc: 'Get real-time notifications and powerful analytics on every transaction across your entire business.',
    },
  ];

  return (
    <section id="process" className="w-full bg-white py-16 md:py-20  selection:bg-[#006C49]/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-14">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#006C49] block mb-2">
            Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 leading-tight">
            How it works
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
            From collecting payment to always-accurate records — Kredar helps you operate with total
            confidence.
          </p>
        </div>

        {/* ── CARD PROCESS FLOW GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border border-gray-100 p-5 md:p-6 flex flex-col justify-start shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,108,73,0.04)] transition-all duration-300 group"
            >
              {/* Step Sequence Counter Bubble */}
              <span className="text-3xl md:text-4xl font-bold text-[#006C49]/10 block mb-4 group-hover:text-[#00FF9D]/30 transition-colors duration-300 select-none">
                {step.num}
              </span>

              <h3 className="text-xs font-bold text-gray-900 mb-2 tracking-tight">{step.title}</h3>

              <p className="text-[11px] text-gray-500 leading-relaxed font-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
