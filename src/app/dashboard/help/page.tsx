'use client';

import { useState } from 'react';
import { Mail, MessageCircle, FileText, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I create an API key?',
    answer:
      'Go to Settings → Developers, then click "Create API Key". Your key will be shown once — copy it immediately, as it cannot be retrieved again for security reasons.',
  },
  {
    question: 'How do I set up a webhook?',
    answer:
      'Go to Settings → Developers → Webhooks, paste your server URL, and click "Save webhook". We\'ll send event notifications (like transactions and payments) to that URL as they happen.',
  },
  {
    question: 'How long does a withdrawal take?',
    answer:
      'Bank transfers are typically processed within a few minutes but may take longer depending on your bank and network conditions.',
  },
  {
    question: "What do I do if my webhook isn't receiving events?",
    answer:
      'Check that your server URL is publicly accessible and returns a 200 response. You can also check delivery logs to see failed attempts and retry them.',
  },
  {
    question: 'How do I verify my email address?',
    answer:
      'After signing up, check your inbox for a confirmation link. If you didn\'t receive it, go to the verify email page and click "Resend link".',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header - Scaled down */}
      <h1 className="text-xl font-bold text-[#081b10]">Help & Support</h1>
      <p className="mt-1 text-xs text-[#45504b]">Find answers or reach out to us.</p>

      {/* Support Cards - Smaller, more compact */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { icon: Mail, label: 'Email', sub: 'support@kredar.com' },
          { icon: MessageCircle, label: 'Chat', sub: 'Mon–Fri, 9–6' },
          { icon: FileText, label: 'Docs', sub: 'API Guides' },
        ].map((item, i) => (
          <a
            key={i}
            href="#"
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-[#d8e1da] hover:border-[#0f8b4b] hover:bg-[#f4f7f5] transition-colors"
          >
            <item.icon size={18} className="text-[#0f8b4b]" />
            <span className="text-[11px] font-bold text-[#081b10] uppercase tracking-wider">
              {item.label}
            </span>
            <span className="text-[10px] text-[#45504b]">{item.sub}</span>
          </a>
        ))}
      </div>

      {/* FAQ Section - Sharper, smaller text */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-[#081b10] uppercase tracking-wide">FAQ</h2>
        <div className="border-t border-[#d8e1da]">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#d8e1da]">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <span className="text-[13px] font-medium text-[#081b10]">{faq.question}</span>
                <ChevronDown
                  size={14}
                  className={`text-[#45504b] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="pb-3 text-[12px] leading-relaxed text-[#45504b]">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
