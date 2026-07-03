'use client';

import { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function DocsAuthentication() {
  const [copiedBasic, setCopiedBasic] = useState(false);
  const [copiedBearer, setCopiedBearer] = useState(false);

  const handleCopyBasic = () => {
    navigator.clipboard.writeText('Authorization: Basic BASE64_ENCODED_CREDENTIALS');
    setCopiedBasic(true);
    setTimeout(() => setCopiedBasic(false), 1500);
  };

  const handleCopyBearer = () => {
    navigator.clipboard.writeText('Authorization: Bearer ACCESS_TOKEN');
    setCopiedBearer(true);
    setTimeout(() => setCopiedBearer(false), 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl font-sans text-slate-800">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">Authentication</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          You'll need to authenticate your requests to access any of the endpoints in the API-DOC.
          In the guide, we'll look at how authentication works. API-DOC we offer two ways to
          authenticate your API requests: Basic authentication and OAuth2 with a token - OAuth2 is
          the recommended way.
        </p>
      </section>

      {/* Basic Auth */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Basic Authetication</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          Basic authentication involves sending a username and password with each request. While
          this method is straightforward, it's less secure compared to OAuth2. To authenticate using
          Basic Authentication, include your username and password in the request headers.
        </p>
        <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700">
          <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Make file</span>
            <button
              onClick={handleCopyBasic}
              className="bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded text-white text-[10px] transition-colors"
            >
              {copiedBasic ? 'copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 bg-[#1b1f23]">
            <code>Authorization: Basic BASE64_ENCODED_CREDENTIALS</code>
          </pre>
        </div>
      </section>

      {/* OAuth2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">OAuth2 with Token</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          OAuth2 with Token is the recommended authentication method. It provides a more secure and
          flexible way to authenticate API requests.
        </p>
      </section>

      {/* Obtaining Token */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Obtaining an Access Token</h2>
        <p className="text-xs text-[#4e5b52] leading-relaxed">
          To authenticate using OAuth2, follow these steps:
        </p>
        <ol className="list-decimal list-inside text-xs text-[#4e5b52] space-y-1.5 pl-2 leading-relaxed">
          <li>Authorization Request: Redirect the user to the authorization endpoint.</li>
          <li>
            User Authentication: The user provides their credentials and authorizes the application.
          </li>
          <li>Access Token Request: Exchange the authorization grant for an access token.</li>
          <li>
            Using the Access Token: Include the access token in the Authorization header of each
            request.
          </li>
        </ol>

        <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700 pt-2">
          <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Example</span>
            <button
              onClick={handleCopyBearer}
              className="bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded text-white text-[10px] transition-colors"
            >
              {copiedBearer ? 'copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 bg-[#1b1f23]">
            <code>Authorization: Bearer ACCESS_TOKEN</code>
          </pre>
        </div>
      </section>

      {/* Security */}
      <section className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5">
        <h4 className="font-bold text-xs text-[#0c1e13] flex items-center gap-2">
          <ShieldAlert size={15} className="text-amber-500" /> Security Considerations
        </h4>
        <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-1 pl-2">
          <li>Always use HTTPS to encrypt data transmission.</li>
          <li>Keep credentials and access tokens confidential.</li>
          <li>Rotate or revoke access tokens regularly.</li>
          <li>Implement proper error handling for unauthorized access attempts.</li>
        </ul>
      </section>
    </div>
  );
}
