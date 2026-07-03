'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Logo header */}
      <div className="px-8 py-5">
        <KredarLogo />
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-sm px-10 py-20 flex flex-col items-center text-center gap-4">
          {/* Success icon */}
          <div className="w-14 h-14 rounded-full bg-[#0f8b4b]/10 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-[#0f8b4b]" strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#081b10] leading-snug mt-2">
            Your account has been created
            <br />
            successfully!
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-[#45504b]">Welcome to the future of finance</p>

          {/* CTA */}
          <button onClick={() => router.replace('/dashboard')} className="kredar-btn-primary mt-2">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
