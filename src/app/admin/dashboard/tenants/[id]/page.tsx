'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import { ChevronLeft, CheckCircle2, XCircle, Info, Ban, RefreshCw } from 'lucide-react';

type TenantDetail = {
  tenant: Record<string, unknown>;
  onboarding: Record<string, unknown> | null;
  apiKeys: unknown[];
};

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [reason, setReason] = useState('');
  const [showReasonFor, setShowReasonFor] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .tenant(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const doAction = async (action: string, requiresReason = false) => {
    if (requiresReason && !reason.trim()) {
      setShowReasonFor(action);
      return;
    }
    setActionLoading(action);
    try {
      if (action === 'approve') await adminApi.approve(id, reason || undefined);
      if (action === 'reject') await adminApi.reject(id, reason);
      if (action === 'request-info') await adminApi.requestInfo(id, reason);
      if (action === 'suspend') await adminApi.suspend(id, reason || undefined);
      if (action === 'unsuspend') await adminApi.unsuspend(id);
      setReason('');
      setShowReasonFor(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  const t = data?.tenant;
  const ob = data?.onboarding;
  const suspended = t?.isSuspended as boolean | undefined;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[#45504b] hover:text-[#081b10] transition-colors"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {loading && (
        <div className="bg-white border border-[#d8e1da] rounded-2xl p-10 animate-pulse h-64" />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Tenant info card */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
            <h1 className="text-2xl font-bold text-[#081b10]">
              {(t?.businessName as string) ?? (t?.email as string) ?? 'Tenant'}
            </h1>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(t ?? {})
                .filter(
                  ([k]) => !['passwordHash', 'emailVerificationToken', 'loginOtp'].includes(k),
                )
                .map(([k, v]) => (
                  <div key={k}>
                    <span className="text-xs text-[#45504b] font-semibold uppercase tracking-wide">
                      {k}
                    </span>
                    <p className="text-[#081b10] mt-0.5 break-all">{String(v ?? '—')}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Onboarding card */}
          {ob && (
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-[#081b10] text-lg">Onboarding Application</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(ob).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-xs text-[#45504b] font-semibold uppercase tracking-wide">
                      {k}
                    </span>
                    <p className="text-[#081b10] mt-0.5 break-all">{String(v ?? '—')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-[#081b10] text-lg">Actions</h2>

            {showReasonFor && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#45504b]">
                  Reason {showReasonFor === 'approve' ? '(optional)' : '(required)'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="w-full border border-[#d8e1da] rounded-lg px-3 py-2 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30 resize-none"
                  placeholder="Enter reason…"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => doAction(showReasonFor, false)}
                    disabled={!!actionLoading}
                    className="bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === showReasonFor ? 'Working…' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReasonFor(null);
                      setReason('');
                    }}
                    className="border border-[#d8e1da] text-sm text-[#45504b] px-4 py-2 rounded-lg hover:bg-[#f7faf6] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowReasonFor('approve')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle2 size={15} /> Approve
              </button>
              <button
                onClick={() => setShowReasonFor('reject')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle size={15} /> Reject
              </button>
              <button
                onClick={() => setShowReasonFor('request-info')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Info size={15} /> Request Info
              </button>
              {suspended ? (
                <button
                  onClick={() => doAction('unsuspend')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 border border-[#d8e1da] text-[#081b10] hover:bg-[#f7faf6] text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={15} /> Unsuspend
                </button>
              ) : (
                <button
                  onClick={() => setShowReasonFor('suspend')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Ban size={15} /> Suspend
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
