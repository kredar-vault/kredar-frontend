'use client';

import { useState } from 'react';
import { BookOpen, Sparkles, Copy, Check } from 'lucide-react';

interface DocsIntroductionProps {
  onNavigate: (sectionId: string) => void;
}

export default function DocsIntroduction({ onNavigate }: DocsIntroductionProps) {
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  const curlCmd = `curl -G https://api.kredar.xyz/api/v1/dedicated-accounts \\
  -H "Authorization: Bearer <API_KEY>" \\
  -d limit=10`;

  return (
    <div className="space-y-10 max-w-4xl text-slate-800 animate-fade-in-up">
      {/* Introduction */}
      <section id="introduction" className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#0c1e13]">Introduction</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          Join the ranks of businesses using Kredar to accept payments through dedicated virtual
          accounts. Explore this documentation to start creating accounts, tracking transactions,
          and building richer payment experiences for your customers.
        </p>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          You can use the Kredar API in test mode, which doesn't affect your live data or interact
          with the banking networks. The API key you use to authenticate the request determines
          whether the request is live mode or test mode.
        </p>
      </section>

      {/* Grid Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-[#e2ebd9] rounded-md space-y-3  hover:shadow-md transition-shadow">
          <h3 className="font-bold text-sm text-[#0c1e13] flex items-center gap-2">
            <BookOpen size={16} className="text-[#0f8b4b]" /> Getting started
          </h3>
          <p className="text-xs text-[#5d6b60] leading-relaxed">
            Embark on your payment processing journey with ease by following these simple steps to
            get started with the Kredar API.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="text-xs font-bold text-[#0f8b4b] hover:underline block pt-2 text-left"
          >
            Developer Quick Start Guide &rarr;
          </button>
        </div>

        <div className="p-6 bg-white border border-[#e2ebd9] rounded-md space-y-3  hover:shadow-md transition-shadow">
          <h3 className="font-bold text-sm text-[#0c1e13] flex items-center gap-2">
            <Sparkles size={16} className="text-[#0f8b4b]" /> Not a developer?
          </h3>
          <p className="text-xs text-[#5d6b60] leading-relaxed">
            Explore our no-code option to get started with Kredar and do more with your Kredar
            account.
          </p>
          <button
            onClick={() => onNavigate('introduction')}
            className="text-xs font-bold text-[#0f8b4b] hover:underline block pt-2 text-left"
          >
            No Code Option &rarr;
          </button>
        </div>
      </div>

      {/* Base URL */}
      <section id="base-url" className="space-y-3 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Base URL</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          All API requests should be made to the base URL below. Use your deployed URL if you are
          self-hosting.
        </p>
        <pre className="p-4 bg-[#f8faf8] border border-[#e2ebd9] rounded-xl text-xs font-mono text-emerald-800 font-bold">
          https://api.kredar.xyz
        </pre>
      </section>

      {/* Authentication */}
      <section id="authentication" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Authentication</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          All endpoints require a valid{' '}
          <code className="font-mono bg-[#f4f7f4] px-1 py-0.5 rounded text-emerald-800 font-bold">
            Authorization: Bearer &lt;API_KEY&gt;
          </code>{' '}
          header. Keep your API key secret — never expose it in client-side code.
        </p>

        <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700">
          <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Header Example</span>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 bg-[#1b1f23] leading-relaxed">
            <code>Authorization: Bearer &lt;API_KEY&gt;</code>
          </pre>
        </div>

        <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-lg border border-slate-700 mt-4">
          <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>cURL Request Example</span>
            <button
              onClick={() => handleCopy(curlCmd, setCopiedCurl)}
              className="bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded text-white text-[10px] transition-colors flex items-center gap-1"
            >
              {copiedCurl ? <Check size={10} /> : <Copy size={10} />}
              {copiedCurl ? 'copied!' : 'copy'}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] font-mono text-white/90 bg-[#1b1f23] leading-relaxed">
            <code>{curlCmd}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
