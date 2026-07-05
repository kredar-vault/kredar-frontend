'use client';

import { Loader2 } from 'lucide-react';

interface AuthLoadingModalProps {
  message: string;
}

export default function AuthLoadingModal({ message }: AuthLoadingModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071c10]/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-xl max-w-xs w-full p-6 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="relative flex items-center justify-center">
          <Loader2 size={36} className="text-[#0f8b4b] animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#081b10] text-center">{message}</p>
      </div>
    </div>
  );
}
