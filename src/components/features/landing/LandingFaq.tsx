'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    question: 'Who is Kredar built for?',
    answer:
      'Kredar is designed for businesses that receive frequent bank transfer payments, including savings and investment platforms, schools, property management companies, donation platforms, and other organizations that need accurate payment tracking.',
  },
  {
    question: 'How does Kredar simplify payment collection?',
    answer:
      'Kredar automates account assignment and payment matching. By provisioning dedicated virtual accounts for each customer, incoming transfers are instantly matched to the right customer and settled in real time, eliminating manual reconciliation.',
  },
  {
    question: 'Can Kredar integrate with our existing systems?',
    answer:
      'Yes, Kredar is built developer-first. You can integrate Kredar with your existing ledger, back-office, or web platform using our secure REST APIs, webhooks, and sandbox environments.',
  },
  {
    question: 'Is Kredar suitable for growing businesses?',
    answer:
      'Absolutely. Whether you are handling hundreds or millions of transactions, Kredar’s cloud-native infrastructure auto-scales to support high-volume payment processing without any lag.',
  },
];

export default function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-[#FFF] px-6 py-[80px] min-h-[744px] flex flex-col items-center justify-center align-self-stretch border-t border-[#f0f4f1]"
    >
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-[#0f8b4b] uppercase tracking-[0.2em]">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#081b10]">
            Frequently asked questions
          </h2>
          <p className="text-sm text-[#45504b] leading-relaxed">
            Find answers to common questions about our platform, pricing, and features.
          </p>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-[#d8e1da] rounded-2xl bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-base text-[#081b10] hover:text-[#0f8b4b] transition-colors"
                >
                  <span>{item.question}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                <div
                  className={cn(
                    'transition-all duration-200 ease-in-out px-6 pb-6 text-sm text-[#45504b] leading-relaxed border-t border-slate-50 pt-4',
                    isOpen ? 'block animate-fadeIn' : 'hidden',
                  )}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
