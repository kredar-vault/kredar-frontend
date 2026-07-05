'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF]">
      <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
