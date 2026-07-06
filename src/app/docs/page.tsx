'use client';

import { useState, useEffect } from 'react';
import DocsHeader from '@/components/features/docs/DocsHeader';
import DocsSidebar, { SidebarGroup } from '@/components/features/docs/DocsSidebar';
import DocsIntroduction from '@/components/features/docs/DocsIntroduction';
import DocsDedicatedAccounts from '@/components/features/docs/DocsDedicatedAccounts';
import DocsTransactions from '@/components/features/docs/DocsTransactions';
import DocsSystem from '@/components/features/docs/DocsSystem';

const sidebarGroups: SidebarGroup[] = [
  {
    id: 'get-started',
    title: 'Getting Started',
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'base-url', title: 'Base URL' },
      { id: 'auth', title: 'Authentication' },
    ],
  },
  {
    id: 'dedicated-accounts-group',
    title: 'Dedicated Accounts',
    items: [
      { id: 'create-dedicated-account', title: 'Create a Dedicated Virtual Account' },
      { id: 'list-dedicated-accounts', title: 'List All Dedicated Accounts' },
      { id: 'get-dedicated-account', title: 'Get Dedicated Account by ID' },
    ],
  },
  {
    id: 'transactions-group',
    title: 'Transactions',
    items: [
      { id: 'list-transactions', title: 'List All Transactions' },
      { id: 'create-transaction', title: 'Manual Transaction Record' },
      { id: 'get-transaction', title: 'Get Transaction by ID' },
      { id: 'customer-transactions', title: 'Get Customer Transactions' },
      { id: 'customer-transaction-stats', title: 'Get Customer Transaction Statistics' },
    ],
  },
  {
    id: 'system-group',
    title: 'System',
    items: [{ id: 'health', title: 'Health Check' }],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const targetId = id === 'auth' ? 'authentication' : id;
    const element = document.getElementById(targetId);
    if (element) {
      // Smooth scroll to the target section
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll spy to highlight active section on scroll
  useEffect(() => {
    const sections = [
      'introduction',
      'base-url',
      'authentication',
      'create-dedicated-account',
      'list-dedicated-accounts',
      'get-dedicated-account',
      'list-transactions',
      'create-transaction',
      'get-transaction',
      'customer-transactions',
      'customer-transaction-stats',
      'health',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const activeId = id === 'authentication' ? 'auth' : id;
            setActiveSection(activeId);
          }
        });
      },
      {
        rootMargin: '-10% 0px -70% 0px',
      },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
          setActiveSection={handleSectionClick}
        />

        {/* Scrollable Document Details Content Column */}
        <main className="flex-1 min-w-0 pb-16 space-y-16">
          <DocsIntroduction onNavigate={handleSectionClick} />
          <DocsDedicatedAccounts />
          <DocsTransactions />
          <DocsSystem />
        </main>
      </div>

      {/* Copyright info line */}
      <footer className="border-t border-[#e2ebd9] py-6 text-center text-xs text-slate-400">
        &copy; Copyright 2026 Kredar. All rights reserved.
      </footer>
    </div>
  );
}
