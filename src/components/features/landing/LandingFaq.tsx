'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    question: 'Why is Kredar right for me?',
    answer:
      'Kredar is engineered for businesses that manage high-volume transfers. By automating tracking and settlements, we help you eliminate administrative overhead, scale transaction capabilities seamlessly, and keep records completely accurate with zero manual tracking required.',
  },
  {
    question: 'How does Kredar handle payment matching?',
    answer:
      'Kredar provisions unique virtual bank transfer accounts for each customer. When a payment is made into an account, our core engine instantly pairs it with the correct entity, triggering instant background matching and balance settlements within seconds.',
  },
  {
    question: 'Can Kredar integrate with my existing platform?',
    answer:
      'Yes. Kredar is built developer-first. You can seamlessly link our infrastructure to your current ledger frameworks, web platforms, or custom back-offices using our enterprise REST APIs, event-driven webhooks, and sandbox testing environments.',
  },
  {
    question: 'Is Kredar compatible with all Nigerian banks?',
    answer:
      'Absolutely. Our modern banking partner layer channels routing across all major commercial financial institutions, ensuring incoming local transfers reconcile accurately no matter which bank your client initiates from.',
  },
  {
    question: 'Is Kredar compliant with my existing platform?',
    answer:
      'Yes, Kredar is designed to complement your setup. We adhere strictly to institutional compliance standards and secure ledger data handling frameworks, keeping your financial stack fully secure and operationally aligned.',
  },
];

export default function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="bg-[#FAFDFB] px-4 py-16 md:py-20 flex flex-col items-center justify-center border-t border-[#f0f4f1]  selection:bg-[#006C49]/10"
    >
      <div className="max-w-3xl w-full space-y-10">
        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <span className="text-[10px] font-bold text-[#006C49] uppercase tracking-[0.2em] block">
            FAQ
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            Frequently asked questions
          </h2>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-normal">
            Find answers to common questions about our platform, pricing, and features.
          </p>
        </div>

        {/* ── ACCORDION LIST ── */}
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-[#e4ebe6] rounded-xl bg-white overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left font-bold text-xs md:text-sm text-gray-900 hover:text-[#006C49] transition-colors group"
                >
                  <span className="pr-4 tracking-tight">{item.question}</span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-gray-400 transition-transform duration-300 ease-in-out shrink-0 group-hover:text-gray-600',
                      isOpen && 'rotate-180 text-[#006C49]',
                    )}
                  />
                </button>

                {/* Smooth Max-Height Transition Container */}
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out border-gray-100',
                    isOpen
                      ? 'grid-rows-[1fr] border-t opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 md:p-5 text-[11px] md:text-xs text-gray-500 leading-relaxed font-normal bg-[#FAFDFB]/50">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
