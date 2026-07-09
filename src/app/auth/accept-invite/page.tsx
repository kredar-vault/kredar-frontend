'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('This link is invalid or has expired.');

  useEffect(() => {
    if (!token) {
      setErrorMessage('No invite token found in this link.');
      setStatus('error');
      return;
    }

    api
      .post('/team/accept', { token })
      .then(() => setStatus('success'))
      .catch((err) => {
        const msg = err?.response?.data?.message;
        if (msg) setErrorMessage(msg);
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-[#0f8b4b] mx-auto mb-6 animate-spin" />
            <h1 className="text-xl font-bold text-[#081b10] mb-2">Accepting your invite…</h1>
            <p className="text-sm text-[#45504b]">Just a moment while we verify your invitation.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-[#0f8b4b] mx-auto mb-6" />
            <h1 className="text-xl font-bold text-[#081b10] mb-2">You're in!</h1>
            <p className="text-sm text-[#45504b] mb-8">
              Your invitation has been accepted. Sign in to access the dashboard.
            </p>
            <button
              onClick={() => router.replace('/auth/login')}
              className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              Sign in to Kredar
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-xl font-bold text-[#081b10] mb-2">Invite failed</h1>
            <p className="text-sm text-[#45504b] mb-8">{errorMessage}</p>
            <button
              onClick={() => router.replace('/auth/login')}
              className="w-full border border-[#d8e1da] text-[#081b10] text-sm font-semibold py-3 rounded-xl hover:bg-[#f7faf6] transition-colors"
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
