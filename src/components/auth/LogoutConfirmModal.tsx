'use client';

import { Loader2 } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  isLoggingOut,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {isLoggingOut ? (
        <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-xl max-w-xs w-full p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-200">
          <Loader2 className="w-10 h-10 text-[#0f8b4b] animate-spin" />
          <p className="text-sm font-semibold text-[#081b10]">Logging out</p>
        </div>
      ) : (
        <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#081b10]">Confirm Log Out</h3>
            <p className="text-sm text-[#45504b]">
              Are you sure you want to log out? You will need to sign in again to access your
              account.
            </p>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[#d8e1da] rounded-xl text-xs font-semibold text-[#45504b] hover:bg-[#f7faf6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-[#ef4444] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
