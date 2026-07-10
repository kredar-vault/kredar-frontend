'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Play, Copy, Check, ChevronDown, ChevronRight, Code2, Globe, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import ActivityContent from '../_components/ActivityContent';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface EndpointDef {
  method: HttpMethod;
  path: string;
  label: string;
  description: string;
  body?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
}

interface Collection {
  name: string;
  color: string;
  items: EndpointDef[];
}

const COLLECTIONS: Collection[] = [
  {
    name: 'Customers',
    color: '#0f8b4b',
    items: [
      {
        method: 'GET',
        path: '/customers',
        label: 'List Customers',
        description: 'Return all customers for the tenant',
        queryParams: { page: 1, pageSize: 20, search: '' },
      },
      {
        method: 'POST',
        path: '/customers',
        label: 'Create Customer',
        description: 'Create a new customer',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: '+2348012345678',
        },
      },
      {
        method: 'GET',
        path: '/customers/{id}',
        label: 'Get Customer',
        description: 'Get a single customer by ID — replace {id} with UUID',
        queryParams: {},
      },
      {
        method: 'PATCH',
        path: '/customers/{id}/status',
        label: 'Update Status',
        description: 'Change customer status — replace {id}',
        body: { status: 'Active' },
      },
    ],
  },
  {
    name: 'Dedicated Accounts',
    color: '#2563eb',
    items: [
      {
        method: 'GET',
        path: '/dedicated-accounts',
        label: 'List DVAs',
        description: 'Get all dedicated virtual accounts',
        queryParams: { page: 1, pageSize: 20 },
      },
      {
        method: 'GET',
        path: '/dedicated-accounts/{id}',
        label: 'Get DVA by ID',
        description: 'Get a dedicated account by its UUID — replace {id}',
        queryParams: {},
      },
      {
        method: 'POST',
        path: '/dedicated-accounts',
        label: 'Provision DVA',
        description: 'Create a dedicated virtual account for a customer',
        body: { customerId: '', expectedAmount: null },
      },
    ],
  },
  {
    name: 'Transactions',
    color: '#7c3aed',
    items: [
      {
        method: 'GET',
        path: '/transactions',
        label: 'List Transactions',
        description: 'Get all transactions with optional filters',
        queryParams: { page: 1, pageSize: 20, status: '', customerId: '' },
      },
      {
        method: 'GET',
        path: '/transactions/{id}',
        label: 'Get Transaction',
        description: 'Get a single transaction by UUID — replace {id}',
        queryParams: {},
      },
    ],
  },
  {
    name: 'Transfers',
    color: '#d97706',
    items: [
      {
        method: 'GET',
        path: '/transfers',
        label: 'List Transfers',
        description: 'Get all outbound transfers',
        queryParams: { page: 1, pageSize: 20 },
      },
      {
        method: 'POST',
        path: '/transfers/bank',
        label: 'Send Transfer',
        description: 'Send money to a Nigerian bank account',
        body: {
          merchantTxRef: 'txref-001',
          amount: 1000,
          accountNumber: '',
          bankCode: '000013',
          narration: 'Payment',
        },
      },
      {
        method: 'POST',
        path: '/transfers/bank/lookup',
        label: 'Lookup Account',
        description: 'Verify a bank account name before transfer',
        body: { accountNumber: '', bankCode: '000013' },
      },
      {
        method: 'GET',
        path: '/transfers/{merchantTxRef}',
        label: 'Get Transfer',
        description: 'Get transfer by merchant reference — replace {merchantTxRef}',
        queryParams: {},
      },
    ],
  },
  {
    name: 'Webhooks',
    color: '#8b5cf6',
    items: [
      {
        method: 'GET',
        path: '/webhook-endpoints',
        label: 'List Endpoints',
        description: 'Get all registered webhook endpoints',
        queryParams: {},
      },
      {
        method: 'POST',
        path: '/webhook-endpoints',
        label: 'Create Endpoint',
        description: 'Register a new webhook URL',
        body: {
          url: 'https://example.com/webhook',
          events: ['PaymentReceived', 'TransferCompleted'],
        },
      },
      {
        method: 'DELETE',
        path: '/webhook-endpoints/{id}',
        label: 'Delete Endpoint',
        description: 'Remove a webhook endpoint — replace {id}',
        body: {},
      },
    ],
  },
  {
    name: 'Insights',
    color: '#059669',
    items: [
      {
        method: 'GET',
        path: '/insights',
        label: 'Get Insights',
        description: 'Business metrics and summaries',
        queryParams: {},
      },
      {
        method: 'GET',
        path: '/insights/balance',
        label: 'Get Balance',
        description: 'Available and total balance with fee breakdown',
        queryParams: {},
      },
    ],
  },
  {
    name: 'Reconciliation',
    color: '#0891b2',
    items: [
      {
        method: 'GET',
        path: '/reconciliation',
        label: 'List',
        description: 'Get reconciliation records with optional filters',
        queryParams: { page: 1, pageSize: 20, status: '', customerId: '' },
      },
      {
        method: 'GET',
        path: '/reconciliation/stats',
        label: 'Stats',
        description: 'Match rates and success metrics',
        queryParams: {},
      },
      {
        method: 'POST',
        path: '/reconciliation/{id}/match',
        label: 'Match Transaction',
        description: 'Match a transaction to a customer — replace {id}',
        body: { customerId: '', note: '' },
      },
      {
        method: 'POST',
        path: '/reconciliation/{id}/ignore',
        label: 'Ignore Transaction',
        description: 'Mark a transaction as ignored — replace {id}',
        body: { reason: '' },
      },
    ],
  },
];

const METHOD_STYLE: Record<HttpMethod, string> = {
  GET: 'text-blue-600 bg-blue-50 border-blue-100',
  POST: 'text-[#0f8b4b] bg-[#effaf2] border-green-100',
  PATCH: 'text-amber-600 bg-amber-50 border-amber-100',
  PUT: 'text-purple-600 bg-purple-50 border-purple-100',
  DELETE: 'text-red-600 bg-red-50 border-red-100',
};

function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== '' && v !== null && v !== undefined,
  );
  if (!entries.length) return '';
  return (
    '?' +
    entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
  );
}

function generateCurl(method: string, fullPath: string, body?: string): string {
  const url = `https://api.kredar.io/api/v1${fullPath}`;
  let out = `curl -X ${method} "${url}" \\\n  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\\n  -H "Content-Type: application/json"`;
  if (body && method !== 'GET') out += ` \\\n  -d '${body}'`;
  return out;
}

function generateJS(method: string, fullPath: string, body?: string): string {
  const url = `https://api.kredar.io/api/v1${fullPath}`;
  const lines = [
    `const response = await fetch("${url}", {`,
    `  method: "${method}",`,
    `  headers: {`,
    `    "Authorization": "Bearer YOUR_ACCESS_TOKEN",`,
    `    "Content-Type": "application/json",`,
    `  },`,
  ];
  if (body && method !== 'GET') lines.push(`  body: JSON.stringify(${body}),`);
  lines.push(`});`, `const data = await response.json();`, `console.log(data);`);
  return lines.join('\n');
}

function generatePython(method: string, fullPath: string, body?: string): string {
  const url = `https://api.kredar.io/api/v1${fullPath}`;
  const lines = [
    `import requests`,
    ``,
    `headers = {`,
    `    "Authorization": "Bearer YOUR_ACCESS_TOKEN",`,
    `    "Content-Type": "application/json",`,
    `}`,
    ``,
  ];
  if (body && method !== 'GET') {
    lines.push(
      `payload = ${body}`,
      `response = requests.${method.toLowerCase()}("${url}", headers=headers, json=payload)`,
    );
  } else {
    lines.push(`response = requests.${method.toLowerCase()}("${url}", headers=headers)`);
  }
  lines.push(`print(response.json())`);
  return lines.join('\n');
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-white/80 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
    >
      {copied ? <Check size={12} className="text-[#0f8b4b]" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function ApiPlaygroundPage() {
  const [pageTab, setPageTab] = useState<'playground' | 'activity'>('playground');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Customers: true });
  const [selected, setSelected] = useState<EndpointDef | null>(null);
  const [pathOverride, setPathOverride] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [queryText, setQueryText] = useState('');
  const [activeTab, setActiveTab] = useState<'body' | 'params'>('body');
  const [codeTab, setCodeTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    data: unknown;
    duration: number;
  } | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [responseTab, setResponseTab] = useState<'response' | 'headers'>('response');

  const isGet = selected?.method === 'GET' || selected?.method === 'DELETE';

  const selectEndpoint = (ep: EndpointDef) => {
    setSelected(ep);
    setPathOverride(ep.path);
    const hasBody = ep.body && Object.keys(ep.body).length > 0;
    const hasQuery = ep.queryParams != null;
    setBodyText(
      hasBody
        ? JSON.stringify(ep.body, null, 2)
        : ep.method !== 'GET' && ep.method !== 'DELETE'
          ? '{\n  \n}'
          : '',
    );
    setQueryText(
      hasQuery && Object.keys(ep.queryParams!).length > 0
        ? JSON.stringify(ep.queryParams, null, 2)
        : '{}',
    );
    setActiveTab(ep.method === 'GET' ? 'params' : 'body');
    setResponse(null);
  };

  const buildFullPath = () => {
    const base = pathOverride;
    if (!isGet) return base;
    try {
      const params = JSON.parse(queryText);
      const qs = buildQueryString(params);
      return base + qs;
    } catch {
      return base;
    }
  };

  const runRequest = async () => {
    if (!selected) return;
    setRunning(true);
    const start = Date.now();
    const fullPath = buildFullPath();
    try {
      let parsedBody: unknown;
      if (bodyText.trim() && !isGet) {
        try {
          parsedBody = JSON.parse(bodyText);
        } catch {
          /* skip */
        }
      }
      const res = await (api.request as any)({
        method: selected.method,
        url: fullPath,
        data: parsedBody,
      });
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        duration: Date.now() - start,
      });
      setResponseHeaders(res.headers ?? {});
    } catch (err: any) {
      const res = err?.response;
      setResponse({
        status: res?.status ?? 0,
        statusText: res?.statusText ?? 'Network Error',
        data: res?.data ?? { error: err?.message },
        duration: Date.now() - start,
      });
      setResponseHeaders(res?.headers ?? {});
    }
    setRunning(false);
    setResponseTab('response');
  };

  const fullPath = buildFullPath();
  const flatBody = bodyText.replace(/\n\s*/g, ' ');
  const codeSnippets = selected
    ? {
        curl: generateCurl(selected.method, fullPath, !isGet ? flatBody : undefined),
        js: generateJS(selected.method, fullPath, !isGet ? flatBody : undefined),
        python: generatePython(selected.method, fullPath, !isGet ? flatBody : undefined),
      }
    : {
        curl: '// Select an endpoint to generate code',
        js: '// Select an endpoint to generate code',
        python: '# Select an endpoint to generate code',
      };

  const activeText = activeTab === 'params' ? queryText : bodyText;
  const setActiveText = activeTab === 'params' ? setQueryText : setBodyText;

  return (
    <div
      className="flex flex-col gap-0 max-w-[1400px] mx-auto pb-4"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* Header + tab bar */}
      <div className="flex-shrink-0 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">API Playground</h1>
            <p className="text-xs text-[#45504b] mt-0.5">
              Build, test and debug requests against your Kredar API
            </p>
          </div>
          {pageTab === 'playground' && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-[#0f8b4b]" />
              Production
            </div>
          )}
        </div>

        {/* Page tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(
            [
              { id: 'playground', label: 'Playground', icon: Globe },
              { id: 'activity', label: 'API Activity', icon: Activity },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPageTab(id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all',
                pageTab === id
                  ? 'bg-white text-[#081b10] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {pageTab === 'activity' ? (
        <div className="flex-1 overflow-y-auto pb-4">
          <ActivityContent />
        </div>
      ) : null}

      {pageTab === 'playground' ? (
        <>
          <div className="flex-1 flex gap-3 min-h-0">
            {/* LEFT — Collections */}
            <div className="w-56 flex-shrink-0 bg-white border border-[#f0f4f1] rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="px-3 py-3 border-b border-gray-50 flex-shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Collections
                </p>
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                {COLLECTIONS.map((col) => (
                  <div key={col.name}>
                    <button
                      onClick={() => setOpenGroups((g) => ({ ...g, [col.name]: !g[col.name] }))}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: col.color }}
                      />
                      <span className="text-xs font-semibold text-gray-700 flex-1 truncate">
                        {col.name}
                      </span>
                      {openGroups[col.name] ? (
                        <ChevronDown size={10} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={10} className="text-gray-400" />
                      )}
                    </button>
                    {openGroups[col.name] && (
                      <div className="ml-5 border-l border-gray-100 pl-2 mb-1">
                        {col.items.map((ep) => {
                          const active = selected?.label === ep.label && selected?.path === ep.path;
                          return (
                            <button
                              key={ep.label}
                              onClick={() => selectEndpoint(ep)}
                              className={cn(
                                'w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors',
                                active
                                  ? 'bg-[#0a2e1f] text-white'
                                  : 'hover:bg-gray-50 text-gray-600',
                              )}
                            >
                              <span
                                className={cn(
                                  'text-[9px] font-bold shrink-0',
                                  active ? 'text-white/60' : METHOD_STYLE[ep.method].split(' ')[0],
                                )}
                              >
                                {ep.method}
                              </span>
                              <span className="text-[11px] truncate font-medium">{ep.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CENTER — Request builder */}
            <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
              {/* URL bar */}
              <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm p-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {selected ? (
                    <span
                      className={cn(
                        'text-xs font-bold px-2.5 py-1 rounded-lg border flex-shrink-0',
                        METHOD_STYLE[selected.method],
                      )}
                    >
                      {selected.method}
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 flex-shrink-0">
                      METHOD
                    </span>
                  )}
                  <input
                    type="text"
                    value={selected ? `/api/v1${pathOverride}` : ''}
                    onChange={(e) => setPathOverride(e.target.value.replace(/^\/api\/v1/, ''))}
                    placeholder="Select an endpoint from the collections →"
                    className="flex-1 font-mono text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 min-w-0"
                  />
                  <button
                    onClick={runRequest}
                    disabled={!selected || running}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors flex-shrink-0',
                      selected && !running
                        ? 'bg-[#0f8b4b] hover:bg-[#0a7040]'
                        : 'bg-gray-200 cursor-not-allowed',
                    )}
                  >
                    <Play size={12} />
                    {running ? 'Running…' : 'Run'}
                  </button>
                </div>
                {selected && (
                  <p className="mt-2 text-[10px] text-gray-400">{selected.description}</p>
                )}
              </div>

              {/* Body / Params editor */}
              <div className="flex-1 bg-white border border-[#f0f4f1] rounded-2xl shadow-sm flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 border-b border-gray-50 flex-shrink-0">
                  <div className="flex">
                    {selected?.method === 'GET' || selected?.method === 'DELETE' ? (
                      <button className="text-[11px] font-semibold py-3 px-1 mr-4 border-b-2 border-[#0f8b4b] text-[#0f8b4b]">
                        Query Params
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveTab('body')}
                          className={cn(
                            'text-[11px] font-semibold py-3 px-1 mr-4 border-b-2 transition-colors',
                            activeTab === 'body'
                              ? 'border-[#0f8b4b] text-[#0f8b4b]'
                              : 'border-transparent text-gray-400 hover:text-gray-600',
                          )}
                        >
                          Body
                        </button>
                        <button
                          onClick={() => setActiveTab('params')}
                          className={cn(
                            'text-[11px] font-semibold py-3 px-1 border-b-2 transition-colors',
                            activeTab === 'params'
                              ? 'border-[#0f8b4b] text-[#0f8b4b]'
                              : 'border-transparent text-gray-400 hover:text-gray-600',
                          )}
                        >
                          Query Params
                        </button>
                      </>
                    )}
                  </div>
                  {activeText && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeText);
                      }}
                      className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100"
                    >
                      <Copy size={11} /> Copy
                    </button>
                  )}
                </div>

                <div className="flex-1 p-3 overflow-hidden">
                  {!selected ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Globe size={36} className="text-gray-200 mb-2" />
                      <p className="text-xs text-gray-400">Select an endpoint to get started</p>
                    </div>
                  ) : (
                    <textarea
                      key={`${selected.path}-${activeTab}`}
                      value={activeText}
                      onChange={(e) => setActiveText(e.target.value)}
                      spellCheck={false}
                      className="w-full h-full px-3 py-2.5 text-xs font-mono border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 bg-gray-50"
                      placeholder={
                        activeTab === 'params'
                          ? '{\n  "page": 1,\n  "pageSize": 20\n}'
                          : '{\n  "key": "value"\n}'
                      }
                    />
                  )}
                </div>
              </div>

              {/* Code snippets */}
              <div
                className="bg-[#0a2e1f] rounded-2xl shadow-sm overflow-hidden flex-shrink-0"
                style={{ maxHeight: '190px' }}
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <div className="flex">
                    {(['curl', 'js', 'python'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setCodeTab(t)}
                        className={cn(
                          'text-[10px] font-bold px-3 py-1.5 rounded-lg mr-1 transition-colors',
                          codeTab === t
                            ? 'bg-white/10 text-white'
                            : 'text-white/40 hover:text-white/70',
                        )}
                      >
                        {t === 'curl' ? 'cURL' : t === 'js' ? 'JavaScript' : 'Python'}
                      </button>
                    ))}
                  </div>
                  <CopyButton text={codeSnippets[codeTab]} />
                </div>
                <div className="overflow-auto" style={{ maxHeight: '140px' }}>
                  <pre className="px-4 py-3 text-[11px] text-green-300 font-mono whitespace-pre leading-relaxed">
                    {codeSnippets[codeTab]}
                  </pre>
                </div>
              </div>
            </div>

            {/* RIGHT — Response */}
            <div className="w-80 flex-shrink-0 bg-white border border-[#f0f4f1] rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-700">Response</p>
                  {response && (
                    <span
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-lg tabular-nums',
                        response.status >= 500
                          ? 'text-red-600 bg-red-50'
                          : response.status >= 400
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-[#0f8b4b] bg-[#effaf2]',
                      )}
                    >
                      {response.status}
                    </span>
                  )}
                </div>
                {response && (
                  <span className="text-[10px] text-gray-400 tabular-nums">
                    {response.duration}ms
                  </span>
                )}
              </div>

              {response && (
                <div className="flex border-b border-gray-50 px-4 flex-shrink-0">
                  {(['response', 'headers'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setResponseTab(t)}
                      className={cn(
                        'text-[11px] font-semibold py-2.5 px-1 mr-4 border-b-2 capitalize transition-colors',
                        responseTab === t
                          ? 'border-[#0f8b4b] text-[#0f8b4b]'
                          : 'border-transparent text-gray-400',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-auto">
                {running ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#0f8b4b] border-t-transparent animate-spin" />
                    <p className="text-xs text-gray-400">Sending request…</p>
                  </div>
                ) : response ? (
                  responseTab === 'response' ? (
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10 bg-white rounded-lg">
                        <CopyButton text={JSON.stringify(response.data, null, 2)} />
                      </div>
                      <pre className="px-4 py-3 text-[11px] font-mono text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="px-4 py-3 space-y-2">
                      {Object.entries(responseHeaders).map(([k, v]) => (
                        <div key={k} className="text-[11px] font-mono">
                          <span className="text-gray-400">{k}: </span>
                          <span className="text-gray-700 break-all">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <Code2 size={32} className="text-gray-200 mb-2" />
                    <p className="text-xs text-gray-400">Run a request to see the response here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
