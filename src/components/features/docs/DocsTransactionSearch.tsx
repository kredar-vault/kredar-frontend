'use client';

import { useState } from 'react';
import { Info, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { libraries } from '@/components/features/docs/DocsIntroduction';

const searchSnippets = {
  curl: `curl -G https://api.protocol.chat/v1/conversations \\\n  -H "Authorization: Bearer {token}" \\\n  -d limit=10`,
  js: `// JS SDK search call\nconst list = await client.transactions.list({\n  limit: 10\n});`,
  python: `# Python search call\nlist = client.Transactions.list(limit=10)`,
  php: `// PHP search call\n$list = $client->transactions->list(['limit' => 10]);`,
  ruby: `# Ruby search call\nlist = client.Transactions.list(limit: 10)`,
};

export default function DocsTransactionSearch() {
  const [activeTab, setActiveTab] = useState<keyof typeof searchSnippets>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(searchSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl font-sans text-slate-800 animate-fade-in-up">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">
          Transaction Search
        </h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          Use the Transaction Search API to get the history of transactions for a PayPal account.
          Reach out to your partner manager for the next steps. To enroll in the partner program,
          see Partners with Paypal for more information about the API, see the Transaction Search
          API Integration Guide.
        </p>
      </section>

      {/* Note box */}
      <div className="p-4 bg-[#f4f7f4] border border-[#e2ebd9] rounded-xl flex items-start gap-3">
        <Info size={16} className="text-[#0f8b4b] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5d6b60] leading-relaxed">
          <strong>Note:</strong> To use the API on behalf of third parties, you must be part of the
          PayPal partner network. Reach out to your partner manager for the next steps. To enroll in
          the partner program, see{' '}
          <button className="font-bold text-[#0f8b4b] hover:underline">Partner with PayPal</button>.
        </p>
      </div>

      {/* API path */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#0c1e13]">List transactions</h2>
        <div className="bg-[#1b1f23] text-white px-4 py-3.5 rounded-lg flex justify-between items-center text-xs font-mono shadow border border-slate-700">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600/20 text-[#10a35e] text-[10px] px-2 py-0.5 rounded font-extrabold">
              GET
            </span>
            <span>/v1/reporting/transactions</span>
          </div>
        </div>
        <p className="text-xs text-[#5d6b60] leading-relaxed">
          Lists transactions. Specify one or more query parameters to filter the transactions that
          appear in the response.
        </p>
      </div>

      {/* Console block */}
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
          <code>{searchSnippets[activeTab]}</code>
        </pre>
      </div>

      {/* Client Libraries Grid */}
      <section className="space-y-4 pt-4">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Client Libraries</h2>
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
    </div>
  );
}
