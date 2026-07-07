'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const verified = searchParams.get('verified') === 'true';
  const message = searchParams.get('message');

  useEffect(() => {
    if (verified) {
      toast.success(message || 'Email verified!');
    } else {
      toast.error(message || 'Verification failed');
    }
  }, [verified, message]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#d8e1da] bg-white p-8 text-center space-y-4">
        {verified ? (
          <>
            <CheckCircle2 className="mx-auto text-green-600" size={40} />
            <h2 className="text-lg font-bold text-[#081b10]">Email verified</h2>
            <p className="text-sm text-[#45504b]">
              {message || 'Your email has been verified successfully.'}
            </p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="kredar-btn-primary mt-2 h-9 px-4 text-xs font-semibold"
            >
              Continue to login
            </button>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-600" size={40} />
            <h2 className="text-lg font-bold text-[#081b10]">Verification failed</h2>
            <p className="text-sm text-[#45504b]">
              {message || 'Something went wrong. Please try again.'}
            </p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="kredar-btn-outline mt-2 h-9 px-4 text-xs font-semibold"
            >
              Back to home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
