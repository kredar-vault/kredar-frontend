'use client';

import { useState } from 'react';
import { BookOpen, Terminal, Sparkles, Code2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocsIntroductionProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

const installSnippets = {
  curl: `curl -G https://api.protocol.chat/v1/conversations \\\n  -H "Authorization: Bearer {token}" \\\n  -d limit=10`,
  js: `npm install @apidoc/client\n\nconst client = require('@apidoc/client')('YOUR_TOKEN');`,
  python: `pip install apidoc\n\nimport apidoc\nclient = apidoc.Client(token="YOUR_TOKEN")`,
  php: `composer require apidoc/client\n\n$client = new \\ApiDoc\\Client('YOUR_TOKEN');`,
  ruby: `gem install apidoc\n\nrequire 'apidoc'\nclient = ApiDoc::Client.new(token: 'YOUR_TOKEN')`,
};

const libraries = [
  {
    name: 'Rubby',
    desc: 'A dynamic, open source programming language with a focus on simplicity and productivity.',
  },
  {
    name: 'Php',
    desc: 'A dynamic, open source programming language with a focus on simplicity and productivity.',
  },
  {
    name: 'Nodejs',
    desc: 'A dynamic, open source programming language with a focus on simplicity and productivity.',
  },
  {
    name: 'Python',
    desc: 'A dynamic, open source programming language with a focus on simplicity and productivity.',
  },
  {
    name: 'GO',
    desc: 'A dynamic, open source programming language with a focus on simplicity and productivity.',
  },
];

export default function DocsIntroduction({ onNavigate, activeSection }: DocsIntroductionProps) {
  const [activeTab, setActiveTab] = useState<keyof typeof installSnippets>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(installSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl font-sans text-slate-850">
      {/* 1. Introduction section */}
      {activeSection === 'introduction' && (
        <>
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">
              API-DOC Documentation
            </h1>
            <p className="text-sm text-[#4e5b52] leading-relaxed">
              Join the ranks of satisfied developers who have harnessed the power of our API to
              enhance their applications and drive business growth. Explore our documentation and
              start revolutionizing payment experiences today.
            </p>
            <p className="text-sm text-[#4e5b52] leading-relaxed">
              You can use the API-DOC in test mode, which doesn't affect your live data or interact
              with the banking networks. The API key you use to authenticate the request determines
              whether the request is live mode or test mode.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#e2ebd9] rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-extrabold text-sm text-[#0c1e13] flex items-center gap-2">
                <BookOpen size={16} className="text-[#0f8b4b]" /> Getting started
              </h3>
              <p className="text-xs text-[#5d6b60] leading-relaxed">
                Embark on your payment processing journey with ease by following these simple steps
                to get started with our Payment API.
              </p>
              <button
                onClick={() => onNavigate('quick-start')}
                className="text-xs font-bold text-[#0f8b4b] hover:underline block pt-2 text-left"
              >
                Developer Quick Start Guide &rarr;
              </button>
            </div>

            <div className="p-6 bg-white border border-[#e2ebd9] rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-extrabold text-sm text-[#0c1e13] flex items-center gap-2">
                <Sparkles size={16} className="text-[#0f8b4b]" /> Not a developer?
              </h3>
              <p className="text-xs text-[#5d6b60] leading-relaxed">
                Explore our no-code option to get started with API-DOC and do more with our API-DOC
                account.
              </p>
              <button className="text-xs font-bold text-[#0f8b4b] hover:underline block pt-2 text-left">
                No Code Option &rarr;
              </button>
            </div>
          </div>
        </>
      )}

      {/* 2. Quick Start Guide */}
      {activeSection === 'quick-start' && (
        <section className="space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">
            Quick Start Guide
          </h1>
          <p className="text-sm text-[#4e5b52] leading-relaxed">
            Follow this developer guide to quickly configure, test, and integrate your backend
            systems with the payment API.
          </p>
          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Retrieve API Keys',
                text: 'Sign in to the developer dashboard, go to API Keys tab, and secure your public/secret credentials.',
              },
              {
                step: '2',
                title: 'Set client headers',
                text: 'Construct your HTTP request and inject your keys into the header details.',
              },
              {
                step: '3',
                title: 'Simulate transaction',
                text: 'Call the virtual accounts creation endpoints and post a test webhook event.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex gap-4 p-4 border border-[#e2ebd9] rounded-xl bg-[#f4f7f4]/40"
              >
                <span className="w-6 h-6 bg-[#0f8b4b]/10 text-[#0f8b4b] rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-extrabold text-xs text-[#0c1e13]">{s.title}</h4>
                  <p className="text-[11px] text-[#5d6b60] mt-0.5">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Choose your client */}
      {activeSection === 'client' && (
        <section className="space-y-4">
          <h1 className="text-3xl font-extrabold text-[#0c1e13]">Choose your client</h1>
          <p className="text-xs text-[#4e5b52] leading-relaxed">
            Select the client that best suits your development needs. API-DOC offers clients for
            JavaScript, Python, PHP, Ruby, and Go.
          </p>
          <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-lg border border-slate-700">
            <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <div className="flex gap-4">
                {(['curl', 'js', 'python', 'php', 'ruby'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'hover:text-white uppercase transition-colors',
                      activeTab === tab
                        ? 'text-[#0f8b4b] font-bold border-b border-[#0f8b4b] pb-0.5'
                        : '',
                    )}
                  >
                    {tab === 'js' ? 'JavaScript' : tab}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded text-white text-[10px]"
              >
                {copied ? 'copied!' : 'copy'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-white/95 bg-[#1b1f23] leading-relaxed">
              <code>{installSnippets[activeTab]}</code>
            </pre>
          </div>
        </section>
      )}

      {/* 4. Client Libraries grid */}
      {activeSection === 'libraries' && (
        <section className="space-y-4">
          <h1 className="text-3xl font-extrabold text-[#0c1e13]">Client Libraries</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraries.map((lib) => (
              <div
                key={lib.name}
                className="p-5 bg-white border border-[#e2ebd9] rounded-2xl space-y-2.5 shadow-sm"
              >
                <h4 className="font-bold text-xs text-[#0c1e13] flex items-center gap-2">
                  <Code2 size={15} className="text-slate-400" /> {lib.name}
                </h4>
                <p className="text-[11px] text-[#5d6b60] leading-relaxed">{lib.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feedback rating footer */}
      <div className="border-t border-[#e2ebd9] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-slate-500">
        <span>Was this page helpful?</span>
        <div className="flex gap-3">
          <button className="px-3.5 py-1.5 rounded-lg border border-[#e2ebd9] bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs text-[#0c1e13]">
            <ThumbsUp size={12} /> Helpful
          </button>
          <button className="px-3.5 py-1.5 rounded-lg border border-[#e2ebd9] bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs text-[#0c1e13]">
            <ThumbsDown size={12} /> Not helpful
          </button>
        </div>
      </div>
    </div>
  );
}
export { libraries };
