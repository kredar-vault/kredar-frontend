'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Activity,
  BarChart,
  Terminal,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const METHOD_STYLE: Record<string, string> = {
  GET: 'text-blue-600 bg-blue-50 border-blue-100',
  POST: 'text-[#0f8b4b] bg-[#effaf2] border-green-100',
  PATCH: 'text-amber-600 bg-amber-50 border-amber-100',
  PUT: 'text-purple-600 bg-purple-50 border-purple-100',
  DELETE: 'text-red-600 bg-red-50 border-red-100',
};

const statusStyle = (code: number) => {
  if (code >= 500) return 'text-red-600 bg-red-50 border-red-100';
  if (code >= 400) return 'text-amber-600 bg-amber-50 border-amber-100';
  return 'text-[#0f8b4b] bg-[#effaf2] border-green-100';
};

const statusIcon = (code: number) => {
  if (code >= 500) return <XCircle size={13} className="text-red-400" />;
  if (code >= 400) return <AlertCircle size={13} className="text-amber-400" />;
  return <CheckCircle2 size={13} className="text-[#0f8b4b]" />;
};

function exportCSV(logs: any[]) {
  const headers = ['Time', 'Method', 'Path', 'Status', 'Duration (ms)', 'IP'];
  const rows = logs.map((l) => [
    new Date(l.createdAt).toISOString(),
    l.method,
    l.path + (l.queryString ? '?' + l.queryString : ''),
    l.statusCode,
    l.durationMs ?? '',
    l.ipAddress ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `api-activity-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function RequestDrawer({ logId, onClose }: { logId: string; onClose: () => void }) {
  const { data: log, isLoading } = useQuery({
    queryKey: ['api-log-detail', logId],
    queryFn: async () => {
      const r = await api.get(`/api-logs/${logId}`);
      return r.data?.data ?? null;
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
          {log && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className={cn(
                  'text-[11px] font-bold px-2 py-0.5 rounded border',
                  METHOD_STYLE[log.method] ?? 'text-gray-500 bg-gray-100 border-gray-100',
                )}
              >
                {log.method}
              </span>
              <p className="text-sm font-mono text-gray-700 truncate">{log.path}</p>
            </div>
          )}
          {log && (
            <span
              className={cn(
                'text-[11px] font-bold px-2.5 py-1 rounded-lg border',
                statusStyle(log.statusCode),
              )}
            >
              {log.statusCode}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 p-5 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : log ? (
          <div className="flex-1 overflow-y-auto">
            <div className="flex gap-3 px-5 py-4 border-b border-gray-50">
              {[
                ['Duration', `${log.durationMs ?? '—'}ms`],
                ['Status', log.statusCode],
                [
                  'Time',
                  new Date(log.createdAt).toLocaleTimeString('en-NG', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }),
                ],
              ].map(([label, val]) => (
                <div
                  key={String(label)}
                  className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 flex-1"
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    {label}
                  </p>
                  <p
                    className={cn(
                      'text-lg font-bold tabular-nums',
                      label === 'Status' && Number(val) >= 400 ? 'text-red-500' : 'text-gray-900',
                    )}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Request
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 font-mono text-xs">
                  {[
                    ['Method', log.method],
                    ['Path', log.path],
                    log.queryString && ['Query', log.queryString],
                    ['IP Address', log.ipAddress ?? '—'],
                    log.apiKeyId && ['API Key', `•••• ${log.apiKeyId.slice(-6)}`],
                    [
                      'Timestamp',
                      new Date(log.createdAt).toLocaleString('en-NG', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }),
                    ],
                  ]
                    .filter(Boolean)
                    .map((row: any) => (
                      <div key={row[0]} className="flex justify-between gap-4">
                        <span className="text-gray-400 shrink-0">{row[0]}</span>
                        <span className="font-semibold text-gray-800 truncate text-right">
                          {row[1]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              {log.errorMessage && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Error
                  </p>
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl font-mono break-words">
                    {log.errorMessage}
                  </p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Request ID
                </p>
                <p className="text-xs font-mono text-gray-600">{log.id}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
            Log not found
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivityContent() {
  const [page, setPage] = useState(1);
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [liveUpdates, setLiveUpdates] = useState(true);

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const r = await api.get('/api-usage');
      return r.data?.data ?? {};
    },
    refetchInterval: liveUpdates ? 30_000 : false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['api-logs', page, methodFilter, statusFilter],
    queryFn: async () => {
      let url = `/api-logs?page=${page}&pageSize=20`;
      if (methodFilter !== 'all') url += `&method=${methodFilter}`;
      if (statusFilter === 'success') url += '&minStatus=200&maxStatus=299';
      if (statusFilter === 'error') url += '&minStatus=400';
      const r = await api.get(url);
      return r.data?.data ?? { items: [], total: 0 };
    },
    refetchInterval: liveUpdates ? 10_000 : false,
  });

  const logs: any[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const metricCards = [
    {
      label: 'Success Rate',
      value: usage?.successRate != null ? `${usage.successRate.toFixed(1)}%` : '—',
      icon: <CheckCircle2 size={15} className="text-[#0f8b4b]" />,
      color: 'text-[#0f8b4b]',
      bg: 'bg-[#effaf2]',
    },
    {
      label: 'Avg Latency',
      value: usage?.avgResponseMs != null ? `${Math.round(usage.avgResponseMs)}ms` : '—',
      icon: <Clock size={15} className="text-blue-500" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Requests',
      value: usage?.totalRequests?.toLocaleString() ?? '—',
      icon: <Activity size={15} className="text-purple-500" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Errors',
      value: usage?.errorCount?.toLocaleString() ?? '—',
      icon: <XCircle size={15} className="text-red-400" />,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ];

  const slowEndpoints: any[] = (usage?.topEndpoints ?? [])
    .filter((e: any) => e.avgMs != null)
    .sort((a: any, b: any) => b.avgMs - a.avgMs)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-gray-500">Monitor every request made using your API keys</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(logs)}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <Download size={12} /> Export CSV
          </button>
          <button
            onClick={() => setLiveUpdates((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors',
              liveUpdates
                ? 'bg-[#effaf2] border-green-200 text-[#0f8b4b]'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50',
            )}
          >
            {liveUpdates ? <Wifi size={12} /> : <WifiOff size={12} />}
            {liveUpdates ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map((c) => (
          <div key={c.label} className="bg-white border border-[#f0f4f1] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {c.label}
              </p>
              <div className={cn('p-1.5 rounded-lg', c.bg)}>{c.icon}</div>
            </div>
            {usageLoading ? (
              <div className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className={cn('text-xl font-bold tabular-nums', c.color)}>{c.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-4">
        {/* Log Table */}
        <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 flex-wrap">
            <Filter size={12} className="text-gray-400" />
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none text-gray-600"
            >
              <option value="all">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none text-gray-600"
            >
              <option value="all">All Status</option>
              <option value="success">2xx Success</option>
              <option value="error">4xx / 5xx</option>
            </select>
            {liveUpdates && (
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f8b4b] animate-pulse" />
                <span className="text-[10px] text-gray-400">Live</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['Time', 'Method', 'Endpoint', 'Status', 'Duration', 'API Key'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Terminal size={24} className="mx-auto mb-2 text-gray-200" />
                      <p className="text-xs text-gray-400">No API requests logged yet</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLogId(log.id)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {statusIcon(log.statusCode)}
                          <span className="text-[10px] text-gray-400 tabular-nums">
                            {new Date(log.createdAt).toLocaleTimeString('en-NG', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            'text-[11px] font-bold px-2 py-0.5 rounded border',
                            METHOD_STYLE[log.method] ?? 'text-gray-500 bg-gray-100 border-gray-100',
                          )}
                        >
                          {log.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-xs font-mono text-gray-700 truncate">{log.path}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            'text-[11px] font-bold px-2 py-0.5 rounded border tabular-nums',
                            statusStyle(log.statusCode),
                          )}
                        >
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 tabular-nums">
                        {log.durationMs != null ? `${log.durationMs}ms` : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">
                        {log.apiKeyId ? `•••• ${log.apiKeyId.slice(-4)}` : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
              <p className="text-[10px] text-gray-400">
                {logs.length} of {total.toLocaleString()}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-gray-400">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <h3 className="text-xs font-bold text-gray-700">Slowest Endpoints</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {slowEndpoints.length === 0 ? (
                <p className="px-4 py-6 text-xs text-gray-400 text-center">No data yet</p>
              ) : (
                slowEndpoints.map((ep, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-[9px] font-bold px-1.5 py-0.5 rounded border',
                            METHOD_STYLE[ep.method] ?? 'text-gray-500 bg-gray-100 border-gray-100',
                          )}
                        >
                          {ep.method}
                        </span>
                        <p className="text-[10px] font-mono text-gray-600 truncate max-w-[120px]">
                          {ep.path}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 tabular-nums">
                        {Math.round(ep.avgMs)}ms
                      </span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          ep.avgMs > 500
                            ? 'bg-red-400'
                            : ep.avgMs > 200
                              ? 'bg-amber-400'
                              : 'bg-[#0f8b4b]',
                        )}
                        style={{
                          width: `${Math.min(100, (ep.avgMs / (slowEndpoints[0]?.avgMs ?? 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-[#f0f4f1] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <h3 className="text-xs font-bold text-gray-700">Error Breakdown</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                {
                  label: '4xx Client Errors',
                  count: logs.filter((l) => l.statusCode >= 400 && l.statusCode < 500).length,
                  color: 'bg-amber-400',
                },
                {
                  label: '5xx Server Errors',
                  count: logs.filter((l) => l.statusCode >= 500).length,
                  color: 'bg-red-400',
                },
                {
                  label: '2xx Success',
                  count: logs.filter((l) => l.statusCode < 400).length,
                  color: 'bg-[#0f8b4b]',
                },
              ].map((e) => (
                <div key={e.label}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-gray-500">{e.label}</p>
                    <p className="text-[10px] font-bold text-gray-700 tabular-nums">{e.count}</p>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', e.color)}
                      style={{
                        width: logs.length > 0 ? `${(e.count / logs.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedLogId && (
        <RequestDrawer logId={selectedLogId} onClose={() => setSelectedLogId(null)} />
      )}
    </div>
  );
}
