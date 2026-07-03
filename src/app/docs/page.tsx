'use client';

import { useState } from 'react';
import DocsHeader from '@/components/features/docs/DocsHeader';
import DocsSidebar, { SidebarGroup } from '@/components/features/docs/DocsSidebar';
import DocsIntroduction from '@/components/features/docs/DocsIntroduction';
import DocsAuthentication from '@/components/features/docs/DocsAuthentication';
import DocsErrorHandling from '@/components/features/docs/DocsErrorHandling';
import DocsRequests from '@/components/features/docs/DocsRequests';
import DocsResponse from '@/components/features/docs/DocsResponse';
import DocsPayments from '@/components/features/docs/DocsPayments';
import DocsOverview from '@/components/features/docs/DocsOverview';
import DocsPayout from '@/components/features/docs/DocsPayout';
import DocsTransactionSearch from '@/components/features/docs/DocsTransactionSearch';

const sidebarGroups: SidebarGroup[] = [
  {
    id: 'get-started',
    title: 'Get Started',
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'quick-start', title: 'Quick Start' },
      { id: 'client', title: 'Client' },
      { id: 'libraries', title: 'Libraries' },
    ],
  },
  {
    id: 'guide',
    title: 'Guide',
    items: [
      { id: 'authentication', title: 'Authentication' },
      { id: 'error-handling', title: 'Error Handling' },
      { id: 'response', title: 'Response' },
      { id: 'request', title: 'Request' },
      { id: 'pagination', title: 'Pagination' },
      { id: 'webhook', title: 'Webhook' },
    ],
  },
  {
    id: 'core-resources',
    title: 'Core Resources',
    items: [
      { id: 'payment', title: 'Payment' },
      { id: 'overview', title: 'Overview' },
      { id: 'accept-payment', title: 'Accept Payment' },
      { id: 'subscription', title: 'Subscription' },
      { id: 'payout', title: 'Payout' },
      { id: 'refund', title: 'Refund' },
      { id: 'split-payment', title: 'Split Payment' },
      { id: 'transaction-search', title: 'Transaction Search' },
      { id: 'orders', title: 'Orders' },
      { id: 'invoicing', title: 'Invoicing' },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased selection:bg-[#0f8b4b]/20">
      {/* Platform Header */}
      <DocsHeader />

      {/* Main layout frame */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Interactive Sidebar */}
        <DocsSidebar
          groups={sidebarGroups}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Scrollable Document Details Content Column */}
        <main className="flex-1 min-w-0 pb-16">
          {['introduction', 'quick-start', 'client', 'libraries'].includes(activeSection) && (
            <DocsIntroduction onNavigate={setActiveSection} activeSection={activeSection} />
          )}

          {activeSection === 'authentication' && <DocsAuthentication />}

          {activeSection === 'error-handling' && <DocsErrorHandling />}

          {['request', 'pagination'].includes(activeSection) && <DocsRequests />}

          {activeSection === 'response' && <DocsResponse />}

          {activeSection === 'payment' && <DocsPayments />}

          {activeSection === 'overview' && <DocsOverview />}

          {activeSection === 'payout' && <DocsPayout />}

          {activeSection === 'transaction-search' && <DocsTransactionSearch />}

          {![
            'introduction',
            'quick-start',
            'client',
            'libraries',
            'authentication',
            'error-handling',
            'request',
            'pagination',
            'response',
            'payment',
            'overview',
            'payout',
            'transaction-search',
          ].includes(activeSection) && (
            <div className="space-y-4 max-w-2xl py-12">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0c1e13] capitalize">
                {activeSection.replace('-', ' ')} Documentation
              </h1>
              <p className="text-sm text-[#5d6b60] leading-relaxed">
                Documentation for this endpoint or resource is currently being finalized. Please
                reference the main guidelines or consult our developer support channel.
              </p>
              <div className="p-4 bg-[#f4f7f4] border border-[#e2ebd9] rounded-xl text-xs text-[#4e5b52] leading-relaxed">
                Need help integrating {activeSection.replace('-', ' ')}? Our support team can assist
                you with custom code examples.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Copyright info line */}
      <footer className="border-t border-[#e2ebd9] py-6 text-center text-xs text-slate-400">
        &copy; Copyright 2024. All rights reserved.
      </footer>
    </div>
  );
}
