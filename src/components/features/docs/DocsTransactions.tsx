'use client';

import { useState } from 'react';

export default function DocsTransactions() {
  const [copiedManualReq, setCopiedManualReq] = useState(false);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  const manualReqJson = `{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "paymentReference": "PAY-REF-902183",
  "amount": 0.01,
  "fee": 0,
  "currency": "NGN",
  "paymentMethod": "bank_transfer",
  "dedicatedAccountNumber": "1234567890",
  "narration": "Manual credit",
  "expectedAmount": 0
}`;

  return (
    <div className="space-y-10 max-w-4xl  text-slate-800 animate-fade-in-up">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#0c1e13]">Transactions</h1>
        <p className="text-xs text-[#5d6b60] font-mono">/api/v1/transactions</p>
      </section>

      {/* 1. List All Transactions */}
      <section id="list-transactions" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">List All Transactions</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/transactions
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Fetch all transactions across your dedicated accounts. Specify one or more filters below.
        </p>

        <div className="space-y-2">
          <h4 className="font-bold text-xs text-slate-700">Query Parameters</h4>
          <div className="border border-[#e2ebd9] rounded-xl overflow-hidden  bg-white">
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
                  <td className="p-3 font-bold font-mono">page, limit</td>
                  <td className="p-3 text-slate-400">integer</td>
                  <td className="p-3">Pagination details.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">status</td>
                  <td className="p-3 text-slate-400">string</td>
                  <td className="p-3">Filter status (SUCCESS, PENDING, REVERSED).</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">customerId</td>
                  <td className="p-3 text-slate-400">string</td>
                  <td className="p-3">Unique UUID filter of customer.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono">dateFrom, dateTo</td>
                  <td className="p-3 text-slate-400">string (ISO)</td>
                  <td className="p-3">Date range metrics.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Manual Transaction Record */}
      <section id="create-transaction" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Manual Transaction Record</h2>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
            POST
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/transactions
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Record a transaction manually (mainly for internal use).
        </p>

        <div className="space-y-2">
          <h4 className="font-bold text-xs text-slate-700">Request Body</h4>
          <div className="bg-[#24292e] rounded-xl overflow-hidden shadow border border-slate-700">
            <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>JSON Request Payload</span>
              <button
                onClick={() => handleCopy(manualReqJson, setCopiedManualReq)}
                className="text-white hover:text-emerald-400"
              >
                {copiedManualReq ? 'copied!' : 'copy'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23]">
              <code>{manualReqJson}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 3. Retrieve, Customer Transactions, Stats */}
      <section id="get-transaction" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Get Transaction by ID</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/transactions/{'{id}'}
          </code>
        </div>
      </section>

      <section id="customer-transactions" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Get Customer Transactions</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/customers/{'{customerId}'}/transactions
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Fetch all transactions for a specific customer.
        </p>
      </section>

      <section id="customer-transaction-stats" className="space-y-4 pt-6 border-t border-[#e2ebd9]">
        <h2 className="text-xl font-bold text-[#0c1e13]">Get Customer Transaction Statistics</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
            GET
          </span>
          <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
            /api/v1/customers/{'{customerId}'}/transactions/stats
          </code>
        </div>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Returns summary stats (total credited, number of transactions, etc.) for a customer.
        </p>
      </section>
    </div>
  );
}
