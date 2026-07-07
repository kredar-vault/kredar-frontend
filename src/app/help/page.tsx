'use client';

import { useState, useMemo } from 'react';
import {
  Mail,
  MessageCircle,
  FileText,
  ChevronDown,
  LifeBuoy,
  Search,
  ArrowRight,
} from 'lucide-react';
import DocsHeader from '@/components/features/docs/DocsHeader';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Integration' | 'Payouts' | 'Account';
}

const faqs: FAQItem[] = [
  {
    category: 'Integration',
    question: 'How do I create an API key?',
    answer:
      'Go to Settings, then Developers, then click "Create API Key". Your key will be shown once, so copy it immediately, as it cannot be retrieved again for security reasons.',
  },
  {
    category: 'Integration',
    question: 'How do I set up a webhook?',
    answer:
      'Go to Settings, then Developers, then Webhooks. Paste your server URL and click "Save webhook". We will send event notifications, like transactions and payments, to that URL as they happen.',
  },
  {
    category: 'Payouts',
    question: 'How long does a withdrawal take?',
    answer:
      'Bank transfers are typically processed within a few minutes but may take longer depending on your bank and network conditions.',
  },
  {
    category: 'Integration',
    question: 'What do I do if my webhook is not receiving events?',
    answer:
      'Check that your server URL is publicly accessible and returns a 200 response. You can also check delivery logs to see failed attempts and retry them.',
  },
  {
    category: 'Account',
    question: 'How do I verify my email address?',
    answer:
      'After signing up, check your inbox for a confirmation link. If you did not receive it, go to the verify email page and click "Resend link".',
  },
  {
    category: 'Account',
    question: 'What is a dedicated account?',
    answer:
      'A dedicated account is a unique virtual bank account generated for one of your customers. When they pay into it, the funds are automatically credited to your Kredar balance.',
  },
  {
    category: 'Account',
    question: 'Why does my KYC status show as pending?',
    answer:
      'Submitted documents are reviewed before being approved or rejected. This usually takes a short while. You will see the status update once a review is complete.',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter FAQs based on search string
  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 antialiased">
      {/* Header Section */}
      <DocsHeader />
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f4faf6] to-white border border-[#e3ebe5] rounded-2xl p-6 sm:p-8">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f6ed] text-[#0f8b4b]">
            <LifeBuoy size={14} />
            Support Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#081b10]">
            How can we help you today?
          </h1>
          <p className="text-sm text-[#45504b] leading-relaxed">
            Find immediate answers to setup requests, API configurations, and account status
            tracking, or loop in our support squad.
          </p>

          {/* Search Bar */}
          <div className="relative mt-4 group">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#73857c] group-focus-within:text-[#0f8b4b] transition-colors"
            />
            <input
              type="text"
              placeholder="Search for articles, keywords, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#d8e1da] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="mailto:support@kredar.com"
          className="group flex flex-col justify-between p-5 border border-[#d8e1da] rounded-xl bg-white hover:border-[#0f8b4b] hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e7f6ed] text-[#0f8b4b]">
              <Mail size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-[#081b10] group-hover:text-[#0f8b4b] transition-colors">
                Email Support
              </span>
              <span className="block text-xs text-[#45504b] mt-0.5">
                Custom assistance delivered directly to your inbox.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-dashed border-[#eaf0ec]">
            <span className="text-xs font-medium text-[#0f8b4b]">support@kredar.com</span>
            <ArrowRight
              size={14}
              className="text-[#73857c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </a>

        <a
          href="#"
          className="group flex flex-col justify-between p-5 border border-[#d8e1da] rounded-xl bg-white hover:border-[#0f8b4b] hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e7f6ed] text-[#0f8b4b]">
              <MessageCircle size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-[#081b10] group-hover:text-[#0f8b4b] transition-colors">
                Live Chat
              </span>
              <span className="block text-xs text-[#45504b] mt-0.5">
                Talk to our product specialists in real-time.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-dashed border-[#eaf0ec]">
            <span className="text-xs font-medium text-[#45504b]">Mon - Fri, 9am - 6pm</span>
            <ArrowRight
              size={14}
              className="text-[#73857c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </a>

        <a
          href="/docs"
          className="group flex flex-col justify-between p-5 border border-[#d8e1da] rounded-xl bg-white hover:border-[#0f8b4b] hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e7f6ed] text-[#0f8b4b]">
              <FileText size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-[#081b10] group-hover:text-[#0f8b4b] transition-colors">
                Developer Docs
              </span>
              <span className="block text-xs text-[#45504b] mt-0.5">
                Explore extensive API references, webhooks, and SDK setups.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-dashed border-[#eaf0ec]">
            <span className="text-xs font-medium text-[#0f8b4b]">View API Guides</span>
            <ArrowRight
              size={14}
              className="text-[#73857c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </a>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e3ebe5] pb-3">
          <h2 className="text-lg font-bold text-[#081b10]">Frequently asked questions</h2>
          <span className="text-xs font-medium text-[#45504b] bg-[#f4faf6] px-2.5 py-1 rounded-md border border-[#e3ebe5]">
            Showing {filteredFaqs.length} results
          </span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#d8e1da] rounded-xl bg-white">
            <p className="text-sm text-[#45504b] font-medium">
              No results found matching "{searchQuery}"
            </p>
            <p className="text-xs text-[#73857c] mt-1">
              Try checking for typos or use fewer keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl bg-white transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#0f8b4b] shadow-sm ring-1 ring-[#0f8b4b]/10'
                      : 'border-[#d8e1da] hover:border-[#bdcfc3]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="space-y-1.5 pr-4">
                      <span
                        className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          faq.category === 'Integration'
                            ? 'bg-[#e0f2fe] text-[#0369a1]'
                            : faq.category === 'Payouts'
                              ? 'bg-[#fef3c7] text-[#92400e]'
                              : 'bg-[#f3e8ff] text-[#6b21a8]'
                        }`}
                      >
                        {faq.category}
                      </span>
                      <span className="block text-sm font-semibold text-[#081b10] leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-[#73857c] transition-transform duration-200 shrink-0 mt-4 ${
                        isOpen ? 'rotate-180 text-[#0f8b4b]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#45504b] leading-relaxed border-t border-[#f4faf6] pt-3 bg-[#fafdfb]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
