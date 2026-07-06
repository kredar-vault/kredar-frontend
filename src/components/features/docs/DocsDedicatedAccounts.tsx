'use client';

import { useState } from 'react';

export default function DocsDedicatedAccounts() {
  const [copiedCreateReq, setCopiedCreateReq] = useState(false);
  const [copiedCreateRes, setCopiedCreateRes] = useState(false);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  const createReqJson = `{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "expectedAmount": 0
}`;

  const createResJson = `{
  "accountNumber": "1234567890",
  "accountName": "John Doe",
  "bankName": "Nomba Bank",
  "status": "ACTIVE",
  "createdAt": "2026-07-02T12:00:00Z"
}`;

  return (
    <div className="space-y-10 max-w-4xl font-sans text-slate-800 animate-fade-in-up">
      <section className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">
          Dedicated Accounts
        </h1>
        <p className="text-xs text-[#5d6b60] font-mono">/api/v1/dedicated-accounts</p>
      </section>

      {/* 1. Create a Dedicated Virtual Account */}
      <section id="create-dedicated-account" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-extrabold text-[#0c1e13]">
          Create a Dedicated Virtual Account
        </h2>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
            POST
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/dedicated-accounts
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Create a new dedicated virtual account for a customer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Request payload */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-700">Request Body</h4>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>JSON Payload</span>
                <button
                  onClick={() => handleCopy(createReqJson, setCopiedCreateReq)}
                  className="text-white hover:text-emerald-400"
                >
                  {copiedCreateReq ? 'copied!' : 'copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23]">
                <code>{createReqJson}</code>
              </pre>
            </div>
          </div>

          {/* Response Payload */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-700">Response (200 OK)</h4>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>JSON Response</span>
                <button
                  onClick={() => handleCopy(createResJson, setCopiedCreateRes)}
                  className="text-white hover:text-emerald-400"
                >
                  {copiedCreateRes ? 'copied!' : 'copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23]">
                <code>{createResJson}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 2. List All Dedicated Accounts */}
      <section id="list-dedicated-accounts" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-extrabold text-[#0c1e13]">List All Dedicated Accounts</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/dedicated-accounts
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Returns a list of all dedicated virtual accounts under your business.
        </p>

        <div className="space-y-2 pt-2">
          <h4 className="font-extrabold text-xs text-slate-700">Query Parameters</h4>
          <div className="border border-[#e2ebd9] rounded-xl overflow-hidden shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f4f7f4] border-b border-[#e2ebd9] text-[#4e5b52] font-semibold text-[10px] uppercase">
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2ebd9] text-[#0c1e13]">
                <tr>
                  <td className="p-3 font-bold font-mono">page</td>
                  <td className="p-3 text-slate-400">integer</td>
                  <td className="p-3">The page index for pagination.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">limit</td>
                  <td className="p-3 text-slate-400">integer</td>
                  <td className="p-3">The number of records per page.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">customerId</td>
                  <td className="p-3 text-slate-400">string</td>
                  <td className="p-3">Filter results by customer ID (UUID format).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Get Dedicated Account by ID */}
      <section id="get-dedicated-account" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-extrabold text-[#0c1e13]">Get Dedicated Account by ID</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/dedicated-accounts/{'{id}'}
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Retrieve details of a specific dedicated virtual account.
        </p>
      </section>
    </div>
  );
}
