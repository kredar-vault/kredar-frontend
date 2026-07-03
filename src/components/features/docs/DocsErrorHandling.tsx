'use client';

import { HelpCircle, AlertCircle } from 'lucide-react';

const errorsList = [
  {
    code: '400',
    name: 'Bad Request',
    desc: 'Indicates that the request was malformed or contained invalid parameters.',
  },
  {
    code: '401',
    name: 'Unauthorized',
    desc: 'Indicates that authentication credentials are missing or invalid.',
  },
  {
    code: '403',
    name: 'Forbidden',
    desc: 'Indicates that the request is not authorized to access the resources.',
  },
  {
    code: '404',
    name: 'Not Found',
    desc: 'Indicates that the requested resources does not exist.',
  },
  { code: '500', name: 'Server Errors', desc: 'Indicates an internal server error occurred.' },
];

export default function DocsErrorHandling() {
  return (
    <div className="space-y-8 max-w-5xl font-sans text-slate-800">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">Error Handling</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          This section outlines the error handling process for the API. It provides information on
          the types of errors returned, their corresponding HTTP status codes, and how to interpret
          error responses.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Table & Format */}
        <div className="lg:col-span-2 space-y-8">
          {/* Format */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0c1e13]">Error Response Format</h2>
            <p className="text-xs text-[#4e5b52] leading-relaxed">
              Error responses from the API follow a consistent format to facilitate easy
              understanding and debugging.
            </p>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>JavaScript</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 bg-[#1b1f23] leading-relaxed">
                {`{
  "error": {
    "code": "ERROR_CODE",
    "message": "ERROR_MESSAGE"
  }
}`}
              </pre>
            </div>
          </section>

          {/* Table */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0c1e13]">Common Error Codes</h2>
            <p className="text-xs text-[#4e5b52] leading-relaxed">
              The API may return the following error codes:
            </p>
            <div className="border border-[#e2ebd9] rounded-xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f4f7f4] border-b border-[#e2ebd9] text-[#4e5b52] font-semibold text-[10px] uppercase tracking-wider">
                    <th className="p-3">HTTP Status</th>
                    <th className="p-3">Summary</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2ebd9] text-[#0c1e13]">
                  {errorsList.map((err) => (
                    <tr key={err.code} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold font-mono">{err.code}</td>
                      <td className="p-3 font-semibold text-slate-700">{err.name}</td>
                      <td className="p-3 text-[#5d6b60] leading-relaxed">{err.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right side widgets */}
        <div className="space-y-6">
          {/* Error Console Preview */}
          <div className="bg-[#1b1f23] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Error Response</span>
            </div>
            <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 leading-normal">
              {`{
  "type": "api_error",
  "message": "No way this is happening",
  "documentation_url": "https://protocol.chat/docs/errors/api_error"
}`}
            </pre>
          </div>

          {/* Help Search Suggestion */}
          <div className="p-5 bg-[#f4f7f4] border border-[#e2ebd9] rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-xs text-[#0c1e13] flex items-center gap-1.5">
              <HelpCircle size={15} className="text-[#0f8b4b]" /> Try Search
            </h4>
            <p className="text-[11px] text-[#5d6b60] leading-relaxed">
              Enter the error message or keywords into the search bar above. If you don't find what
              you're seeking, feel free to reach out to us for assistance. We're here to help!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
