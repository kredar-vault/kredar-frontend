'use client';

import { useState } from 'react';
import { Copy, Check, Activity } from 'lucide-react';

export default function DocsSystem() {
  const [copiedHealth, setCopiedHealth] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  const healthResJson = `{
  "status": "healthy",
  "version": "1.0.0",
  "service": "Kredar API",
  "timestamp": "2026-07-07T09:14:32Z"
}`;

  const curlCmd = `curl https://api.kredar.com/api/health`;

  return (
    <div className="space-y-10 max-w-4xl text-slate-800 animate-fade-in-up">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#0c1e13]">System</h1>
        <p className="text-xs text-[#5d6b60] font-mono">/api/health</p>
        <p className="text-sm text-[#4e5b52] leading-relaxed pt-2">
          Kredar's system endpoints let you monitor the health and availability of the API
          independently of your business logic. Use these to power uptime monitors, status pages, or
          automated alerts in your own infrastructure.
        </p>
      </section>

      {/* Overview callout */}
      <div className="p-6 bg-white border border-[#e2ebd9] rounded-md space-y-3">
        <h3 className="font-bold text-sm text-[#0c1e13] flex items-center gap-2">
          <Activity size={16} className="text-[#0f8b4b]" /> Why check API health?
        </h3>
        <p className="text-xs text-[#5d6b60] leading-relaxed">
          Before troubleshooting an integration issue, it's good practice to confirm the Kredar API
          itself is reachable and operating normally. This endpoint requires no authentication, so
          it's safe to call from monitoring tools, load balancers, or CI pipelines without exposing
          your API key.
        </p>
      </div>

      {/* Health check */}
      <section id="health" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Health Check</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/health
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Returns the current operational status of the Kredar API. No authentication is required
          for this endpoint — it is publicly accessible so it can be polled by external monitoring
          services.
        </p>

        <div className="space-y-2 pt-2">
          <h4 className="font-bold text-xs text-slate-700">Response Fields</h4>
          <div className="border border-[#e2ebd9] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f4f7f4] border-b border-[#e2ebd9] text-[#4e5b52] font-semibold text-[10px] uppercase">
                  <th className="p-3">Field</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2ebd9] text-[#0c1e13]">
                <tr>
                  <td className="p-3 font-bold font-mono">status</td>
                  <td className="p-3 text-slate-400">string</td>
                  <td className="p-3">
                    <span className="font-mono text-emerald-700 font-bold">"healthy"</span> when the
                    API is operating normally.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">version</td>
                  <td className="p-3 text-slate-400">string</td>
                  <td className="p-3">The currently deployed version of the Kredar API.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">service</td>
                  <td className="p-3 text-slate-400">string</td>
                  <td className="p-3">Identifies the responding service — always "Kredar API".</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">timestamp</td>
                  <td className="p-3 text-slate-400">string (ISO)</td>
                  <td className="p-3">The server time at which the health check was evaluated.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* cURL example */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-700">Example Request</h4>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>cURL</span>
                <button
                  onClick={() => handleCopy(curlCmd, setCopiedCurl)}
                  className="text-white hover:text-emerald-400 flex items-center gap-1"
                >
                  {copiedCurl ? <Check size={10} /> : <Copy size={10} />}
                  {copiedCurl ? 'copied!' : 'copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-white/90 bg-[#1b1f23]">
                <code>{curlCmd}</code>
              </pre>
            </div>
          </div>

          {/* Response payload */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-700">Response (200 OK)</h4>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>JSON Response</span>
                <button
                  onClick={() => handleCopy(healthResJson, setCopiedHealth)}
                  className="text-white hover:text-emerald-400 flex items-center gap-1"
                >
                  {copiedHealth ? <Check size={10} /> : <Copy size={10} />}
                  {copiedHealth ? 'copied!' : 'copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23]">
                <code>{healthResJson}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Status codes */}
      <section id="status-codes" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Status Codes</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          The Kredar API uses standard HTTP status codes across all endpoints to indicate the
          success or failure of a request.
        </p>

        <div className="border border-[#e2ebd9] rounded-xl overflow-hidden bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f4f7f4] border-b border-[#e2ebd9] text-[#4e5b52] font-semibold text-[10px] uppercase">
                <th className="p-3">Code</th>
                <th className="p-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebd9] text-[#0c1e13]">
              <tr>
                <td className="p-3 font-bold font-mono text-emerald-700">200</td>
                <td className="p-3">Request succeeded.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-mono text-amber-700">400</td>
                <td className="p-3">Bad request — one or more validation errors occurred.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-mono text-amber-700">401</td>
                <td className="p-3">Missing or invalid API key.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-mono text-amber-700">403</td>
                <td className="p-3">
                  Authenticated, but not permitted — for example, an action requiring an approved
                  KYC status.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-mono text-amber-700">404</td>
                <td className="p-3">The requested resource does not exist.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-mono text-rose-700">500</td>
                <td className="p-3">
                  An unexpected error occurred on Kredar's servers. If this persists, contact Kredar
                  support.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
