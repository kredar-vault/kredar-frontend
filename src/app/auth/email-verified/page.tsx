'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';

function EmailVerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified') === 'true';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
        {verified ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-[#0f8b4b] mx-auto mb-6" />
            <h1 className="text-xl font-bold text-[#081b10] mb-2">Email verified!</h1>
            <p className="text-sm text-[#45504b] mb-8">
              Your account has been activated. You can now sign in to Kredar.
            </p>
            <button
              onClick={() => router.replace('/auth/login')}
              className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              Sign in to your account
            </button>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-xl font-bold text-[#081b10] mb-2">Verification failed</h1>
            <p className="text-sm text-[#45504b] mb-8">
              This link is invalid or has expired. Please sign up again to get a new verification
              link.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.replace('/auth/signup')}
                className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                Create a new account
              </button>
              <button
                onClick={() => router.replace('/auth/login')}
                className="w-full border border-[#d8e1da] text-[#081b10] text-sm font-semibold py-3 rounded-xl hover:bg-[#f7faf6] transition-colors"
              >
                Back to sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EmailVerifiedContent />
    </Suspense>
  );
}
