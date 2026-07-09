'use client';

import { useState } from 'react';
import { Globe, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const endpoints = [
  {
    group: 'Authentication',
    items: [
      { method: 'POST', path: '/api/v1/auth/login', desc: 'Sign in and get JWT token' },
      { method: 'POST', path: '/api/v1/auth/refresh', desc: 'Refresh access token' },
    ],
  },
  {
    group: 'Customers',
    items: [
      { method: 'GET', path: '/api/v1/customers', desc: 'List all customers' },
      { method: 'POST', path: '/api/v1/customers', desc: 'Create a new customer' },
      { method: 'GET', path: '/api/v1/customers/{id}', desc: 'Get customer by ID' },
      { method: 'GET', path: '/api/v1/customers/{id}/notes', desc: 'List customer notes' },
      { method: 'POST', path: '/api/v1/customers/{id}/notes', desc: 'Add a note to a customer' },
      { method: 'DELETE', path: '/api/v1/notes/{noteId}', desc: 'Delete a customer note' },
    ],
  },
  {
    group: 'Transactions',
    items: [
      { method: 'GET', path: '/api/v1/transactions', desc: 'List all transactions' },
      { method: 'GET', path: '/api/v1/transactions/{id}', desc: 'Get transaction by ID' },
      { method: 'GET', path: '/api/v1/insights', desc: 'Pay-in / Pay-out totals' },
    ],
  },
  {
    group: 'Transfers',
    items: [
      { method: 'POST', path: '/api/v1/transfers', desc: 'Initiate a bank transfer' },
      { method: 'GET', path: '/api/v1/transfers', desc: 'List all transfers' },
      { method: 'POST', path: '/api/v1/transfers/bank/lookup', desc: 'Look up bank account name' },
    ],
  },
  {
    group: 'Dedicated Accounts',
    items: [
      { method: 'GET', path: '/api/v1/dedicated-accounts', desc: 'List virtual accounts' },
      { method: 'POST', path: '/api/v1/dedicated-accounts', desc: 'Create a virtual account' },
    ],
  },
  {
    group: 'Webhooks',
    items: [
      { method: 'GET', path: '/api/v1/webhooks', desc: 'List webhook endpoints' },
      { method: 'POST', path: '/api/v1/webhooks', desc: 'Register a webhook endpoint' },
      { method: 'GET', path: '/api/v1/webhooks/logs', desc: 'List webhook delivery logs' },
      { method: 'GET', path: '/api/v1/webhooks/logs/stats', desc: 'Delivery stats' },
      { method: 'POST', path: '/api/v1/webhooks/logs/{id}/retry', desc: 'Retry a failed delivery' },
    ],
  },
  {
    group: 'Activity',
    items: [{ method: 'GET', path: '/api/v1/activity', desc: 'Unified activity feed' }],
  },
  {
    group: 'API Keys',
    items: [
      { method: 'GET', path: '/api/v1/api-keys', desc: 'List API keys' },
      { method: 'POST', path: '/api/v1/api-keys', desc: 'Generate a new API key' },
      { method: 'DELETE', path: '/api/v1/api-keys/{id}', desc: 'Revoke an API key' },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-50 text-blue-600',
  POST: 'bg-[#effaf2] text-[#0f8b4b]',
  PUT: 'bg-amber-50 text-amber-600',
  PATCH: 'bg-purple-50 text-purple-600',
  DELETE: 'bg-red-50 text-red-500',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {copied ? <Check size={12} className="text-[#0f8b4b]" /> : <Copy size={12} />}
    </button>
  );
}

export default function ApiExplorerPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ Authentication: true });

  const toggle = (group: string) => setOpen((prev) => ({ ...prev, [group]: !prev[group] }));

  const baseUrl = 'https://api.kredar.xyz';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">API Explorer</h1>
        <p className="text-xs text-[#45504b] mt-0.5">Browse all available endpoints</p>
      </div>

      <div className="bg-gray-900 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Globe size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-400">Base URL</span>
        <code className="text-xs text-[#7ee8a2] font-mono flex-1">{baseUrl}</code>
        <CopyButton text={baseUrl} />
      </div>

      <div className="space-y-2">
        {endpoints.map((group) => (
          <div
            key={group.group}
            className="bg-white border border-[#f0f4f1] rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(group.group)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-800">{group.group}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">
                  {group.items.length} endpoint{group.items.length !== 1 ? 's' : ''}
                </span>
                {open[group.group] ? (
                  <ChevronDown size={14} className="text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="text-gray-400" />
                )}
              </div>
            </button>

            {open[group.group] && (
              <div className="border-t border-gray-50 divide-y divide-gray-50">
                {group.items.map((ep) => (
                  <div
                    key={ep.path}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors group"
                  >
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 w-14 text-center',
                        methodColors[ep.method] ?? 'bg-gray-100 text-gray-600',
                      )}
                    >
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono text-gray-700 flex-1 truncate">
                      {ep.path}
                    </code>
                    <span className="text-[11px] text-gray-400 hidden sm:block truncate max-w-[200px]">
                      {ep.desc}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton text={`${baseUrl}${ep.path}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
