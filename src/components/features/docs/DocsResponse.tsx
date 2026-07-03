'use client';

export default function DocsResponse() {
  return (
    <div className="space-y-8 max-w-4xl font-sans text-slate-800">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0c1e13]">Response</h1>
        <p className="text-sm text-[#4e5b52] leading-relaxed">
          This document outlines the responses returned by the Payment API endpoints.
        </p>
      </section>

      {/* Attributes & Status codes */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Common Response Attributes</h2>
        <ul className="list-disc list-inside text-xs text-[#5d6b60] space-y-1.5 pl-2 leading-relaxed">
          <li>
            <strong>status:</strong> Indicates the status of the request. Possible values include:
          </li>
          <ul className="list-circle list-inside text-[11px] text-[#5d6b60] pl-6 space-y-0.5">
            <li>
              <code className="font-mono">success</code>: The request was successful.
            </li>
            <li>
              <code className="font-mono">error</code>: There was an error processing the request.
            </li>
          </ul>
          <li>
            <strong>message:</strong> Provides a human-readable message providing additional context
            about the response.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Response Status Codes</h2>
        <p className="text-xs text-[#4e5b52]">
          The Payment API returns standard HTTP status codes to indicate the success or failure of a
          request.
        </p>
        <ul className="list-disc list-inside text-xs text-[#5d6b60] space-y-1.5 pl-2 leading-relaxed">
          <li>
            <strong>200 OK:</strong> The request was successful.
          </li>
          <li>
            <strong>400 Bad Request:</strong> The request was malformed or invalid.
          </li>
          <li>
            <strong>401 Unauthorized:</strong> Authentication credentials were missing or invalid.
          </li>
          <li>
            <strong>403 Forbidden:</strong> The request is forbidden due to insufficient
            permissions.
          </li>
          <li>
            <strong>404 Not Found:</strong> The requested resource was not found.
          </li>
          <li>
            <strong>5xx Server Error:</strong> An error occurred on the server while processing the
            request.
          </li>
        </ul>
      </section>

      {/* Side-by-side Response Examples */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Example Responses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Successful Response */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-700">Successful Response</h3>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Make file</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23] leading-relaxed">
                {`{
  "status": "success",
  "message": "Payment Successful",
  "data": {
    "transaction_id": "123456789",
    "amount": "100.00",
    "currency": "USD",
    "customer_id": "123456",
    "timestamp": "2024-02-09T12:34:56Z"
  }
}`}
              </pre>
            </div>
          </div>

          {/* Error Response */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-700">Error Response</h3>
            <div className="bg-[#24292e] rounded-xl overflow-hidden shadow-md border border-slate-700">
              <div className="bg-[#1f2428] border-b border-slate-700 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Make file</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-400 bg-[#1b1f23] leading-relaxed">
                {`{
  "status": "error",
  "message": "Invalid card number"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Response Data Formats */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Response Data Formats</h2>
        <ul className="list-disc list-inside text-xs text-[#5d6b60] space-y-1.5 pl-2 leading-relaxed">
          <li>
            <strong>transaction_id:</strong> Unique identifier for the transaction.
          </li>
          <li>
            <strong>amount:</strong> Amount of the transaction.
          </li>
          <li>
            <strong>currency:</strong> Currency of the transaction.
          </li>
          <li>
            <strong>customer_id:</strong> Identifier of the customer associated with the
            transaction.
          </li>
          <li>
            <strong>timestamp:</strong> Timestamp indicating when the transaction occurred.
          </li>
        </ul>
      </section>

      {/* Error Messages */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0c1e13]">Error Messages</h2>
        <p className="text-xs text-[#4e5b52]">
          The API returns specific error messages to provide context about why a request failed.
          Common error messages include:
        </p>
        <ul className="list-disc list-inside text-xs text-[#5d6b60] space-y-1.5 pl-2 leading-relaxed">
          <li>Invalid Card Number: The provided credit card number is invalid.</li>
          <li>
            Insufficient Funds: The customer does not have sufficient funds to complete the
            transaction.
          </li>
          <li>Expired Card: The provided credit card has expired.</li>
        </ul>
      </section>
    </div>
  );
}
