'use client';

import { useState } from 'react';
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

  const codeData = snippets[activeSection] || {
    curl: '# No snippet available',
    js: '// No snippet available',
    python: '# No snippet available',
  };

  const currentCode =
    activeTab === 'curl' ? codeData.curl : activeTab === 'js' ? codeData.js : codeData.python;

  return (
    <div className="w-full lg:w-96 flex-shrink-0 bg-[#030A03] border border-white/10 rounded-md overflow-hidden shadow-xl self-start lg:sticky lg:top-24">
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
        <span className="text-white/30 font-mono text-[10px]">Response 200 OK</span>
      </div>

      {/* Code Block Content */}
      <div className="p-5 font-mono text-xs text-white/90 leading-relaxed overflow-x-auto max-h-[380px] bg-[#020702]">
        <pre className="select-all whitespace-pre-wrap break-all">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="bg-white/5 border-t border-white/10 p-3.5 text-[10px] text-white/40 font-mono flex justify-between">
        <span>Content-Type: application/json</span>
        <button
          onClick={() => navigator.clipboard.writeText(currentCode)}
          className="text-white/60 hover:text-white transition-colors"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}
export type { Snippets };
