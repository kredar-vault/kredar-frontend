'use client';

import { Loader2, Trash2, X } from 'lucide-react';

interface DeleteMemberDialogProps {
  open: boolean;
  loading?: boolean;
  memberName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMemberDialog({
  open,
  loading = false,
  memberName,
  onClose,
  onConfirm,
}: DeleteMemberDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#edf2ee]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 className="text-red-600" size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#081b10]">Delete Team Member</h2>

              <p className="text-sm text-[#667085]">This action cannot be undone.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-[#45504b]">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-[#081b10]">{memberName}</span> from your team?
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#edf2ee] px-6 py-5">
          <button onClick={onClose} disabled={loading} className="kredar-btn-outline">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Trash2 size={16} />
                Delete Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
