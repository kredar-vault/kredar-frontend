'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Snippets {
  curl: string;
  js: string;
  python: string;
}

interface DocsCodePanelProps {
  snippets: Record<string, Snippets>;
  activeSection: string;
}

export default function DocsCodePanel({ snippets, activeSection }: DocsCodePanelProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const codeData = snippets[activeSection] || {
    curl: '# No snippet available for this section',
    js: '// No snippet available for this section',
    python: '# No snippet available for this section',
  };

  const currentCode =
    activeTab === 'curl' ? codeData.curl : activeTab === 'js' ? codeData.js : codeData.python;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full xl:w-96 flex-shrink-0 bg-[#030A03] border border-white/10 rounded-md overflow-hidden shadow-xl self-start xl:sticky xl:top-24">
      {/* Header Tabs list */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex gap-2.5">
          {(['curl', 'js', 'python'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-2.5 py-1 rounded transition-colors uppercase font-mono font-bold',
                activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80',
              )}
            >
              {tab === 'js' ? 'Node.js' : tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-white/30 font-mono text-[10px]">200 OK &middot; ~180ms</span>
        </div>
      </div>

      {/* Request line */}
      <div className="px-5 pt-4 pb-2 border-b border-white/5">
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-wide mb-1">Request</p>
        <p className="text-xs font-mono text-emerald-400 break-all">
          {activeTab === 'curl' ? 'HTTPS' : activeTab === 'js' ? 'fetch()' : 'requests'} &rarr;{' '}
          <span className="text-white/70">
            api.kredar.com{`/api/v1/${activeSection.replace(/-/g, '/')}`}
          </span>
        </p>
      </div>

      {/* Code Block Content */}
      <div className="p-5 font-mono text-xs text-white/90 leading-relaxed overflow-x-auto max-h-[380px] bg-[#020702]">
        <pre className="select-all whitespace-pre-wrap break-all">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="bg-white/5 border-t border-white/10 p-3.5 text-[10px] text-white/40 font-mono flex justify-between items-center">
        <span>Content-Type: application/json</span>
        <button
          onClick={handleCopy}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
}

export type { Snippets };
