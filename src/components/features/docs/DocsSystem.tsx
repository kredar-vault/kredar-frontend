'use client';

export default function DocsSystem() {
  return (
    <div className="space-y-6 max-w-4xl font-sans text-slate-800 animate-fade-in-up">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#0c1e13]">System</h1>
        <p className="text-xs text-[#5d6b60] font-mono">/api/health</p>
      </section>

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
          Simple endpoint to check if the API is running.
        </p>

        <div className="bg-[#24292e] rounded-xl overflow-hidden shadow border border-slate-700 max-w-md">
          <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Response (200 OK)</span>
          </div>
          <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23]">
            {`{
  "status": "healthy",
  "version": "1.0.0"
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
