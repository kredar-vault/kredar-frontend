'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const attributes = [
  { name: 'recipient_id', type: 'string', desc: 'Unique identifier identification' },
  {
    name: 'amount',
    type: 'integer',
    desc: 'Amount intended to be collected by this PaymentIntent. A positive integer representing how much to charge',
  },
  {
    name: 'currency',
    type: 'retrievable with publishable key',
    desc: 'Three-letter ISO currency code, in lowercase. Must be a supported currency.',
  },
  { name: 'description', type: 'string', desc: 'describe the reason for payment' },
  { name: 'status', type: 'string', desc: 'show what the result on transaction' },
];

const requestCode = {
  js: `// JS SDK Example\nconst payout = await client.payouts.create({\n  amount: 100.00,\n  currency: 'USD',\n  payment_method: 'credit_card',\n  card_number: '4111111111111111',\n  expiration_month: 12,\n  expiration_year: 2025,\n  cvv: '123'\n});`,
  python: `# Python Example\npayout = client.Payouts.create(\n  amount=100.00,\n  currency='USD',\n  payment_method='credit_card',\n  card_number='4111111111111111',\n  expiration_month=12,\n  expiration_year=2025,\n  cvv='123'\n)`,
  php: `// PHP Example\n$payout = $client->payouts->create([\n  'amount' => 100.00,\n  'currency' => 'USD',\n  'payment_method' => 'credit_card',\n  'card_number' => '4111111111111111',\n  'expiration_month' => 12,\n  'expiration_year' => 2025,\n  'cvv' => '123'\n]);`,
};

export default function DocsPayout() {
  const [activeTab, setActiveTab] = useState<'js' | 'python' | 'php'>('js');

  return (
    <div className="space-y-8 max-w-5xl font-sans text-slate-800 animate-fade-in-up">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">Payout</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          Create subscription plans and billing for your application. Below, you'll find
          comprehensive information on how to integrate and utilize the API plan includes pricing
          and billing cycle information that defines the amount and frequency of charge for a
          subscription. You can also define a fixed plan, such as a $5 basic plan or a volume- or
          graduated-based plan with pricing tiers based on the quantity purchased.
        </p>
      </section>

      {/* Authentication segment */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Authentication</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          You need an API key. You can obtain your API key by signing up for an account on our
          platform. Use this API key in the Authorization header of your HTTP requests.
        </p>
        <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700">
          <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Make file</span>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 bg-[#1b1f23]">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </div>
      </section>

      {/* Grid: Params left, Code right */}
      <section className="space-y-6">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Initiate Payout</h2>
        <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
          POST /payout
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attributes List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xs text-[#0c1e13]">Attributes</h3>
            <div className="space-y-4 divide-y divide-[#e2ebd9]">
              {attributes.map((attr) => (
                <div key={attr.name} className="pt-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono bg-[#f4f7f4] px-1.5 py-0.5 rounded text-emerald-700 font-bold">
                      {attr.name}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px] italic">{attr.type}</span>
                  </div>
                  <p className="text-[11px] text-[#5d6b60] leading-relaxed">{attr.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Console Blocks */}
          <div className="space-y-6 self-start lg:sticky lg:top-24">
            {/* Request Block */}
            <div className="bg-[#1b1f23] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <div className="flex gap-4">
                  {(['js', 'python', 'php'] as const).map((tab) => (
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
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 leading-normal">
                <code>{requestCode[activeTab]}</code>
              </pre>
            </div>

            {/* Response Block */}
            <div className="bg-[#1b1f23] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Response</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 leading-normal">
                {`{
  "id": "payout123",
  "recipient_id": "user123",
  "amount": 100.00,
  "currency": "USD",
  "status": "pending",
  "date": "2024-02-10"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export { attributes };
