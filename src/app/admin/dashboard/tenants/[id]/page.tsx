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

const HIDDEN_FIELDS = [
  'passwordHash',
  'emailVerificationToken',
  'loginOtp',
  'passwordResetToken',
  'passwordResetTokenExpiry',
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    Approved: 'bg-[#effaf2] text-[#0f8b4b] border-[#c6e9d4]',
    Rejected: 'bg-red-50 text-red-700 border-red-100',
    UnderReview: 'bg-amber-50 text-amber-700 border-amber-100',
    MoreInfoRequired: 'bg-orange-50 text-orange-700 border-orange-100',
    Pending: 'bg-white/10 text-white/70 border-white/20',
    NotStarted: 'bg-white/10 text-white/70 border-white/20',
  };
  return map[s] ?? 'bg-white/10 text-white/70 border-white/20';
};

const formatKey = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

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
      .catch((e: Error) => setError(e.message))
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
  const kybStatus = (ob?.status as string) ?? 'NotStarted';
  const businessName = (t?.businessName as string) ?? (t?.email as string) ?? 'Tenant';

  const tenantFields = Object.entries(t ?? {}).filter(([k]) => !HIDDEN_FIELDS.includes(k));
  const obFields = Object.entries(ob ?? {}).filter(([k]) => k !== 'id' && k !== 'tenantId');

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[#45504b] hover:text-[#081b10] transition-colors"
      >
        <ChevronLeft size={15} /> Back to Tenants
      </button>

      {loading && (
        <div className="bg-white border border-[#d8e1da] rounded-2xl h-56 animate-pulse" />
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Hero header */}
          <div className="bg-[#0a1f16] rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f8b4b]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {businessName
                      .split(' ')
                      .map((w: string) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{businessName}</h1>
                  <p className="text-white/50 text-sm mt-0.5">{t?.email as string}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {suspended && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                    Suspended
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge(kybStatus)}`}
                >
                  KYB: {kybStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Tenant info */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-[#081b10] mb-4">Account Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {tenantFields.map(([k, v]) => (
                <div key={k} className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-[#45504b] uppercase tracking-widest">
                    {formatKey(k)}
                  </p>
                  <p className="text-sm text-[#081b10] break-all">{String(v ?? '—')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Onboarding */}
          {ob && obFields.length > 0 && (
            <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-[#081b10] mb-4">KYB Application</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {obFields.map(([k, v]) => (
                  <div key={k} className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-[#45504b] uppercase tracking-widest">
                      {formatKey(k)}
                    </p>
                    <p className="text-sm text-[#081b10] break-all">{String(v ?? '—')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-[#081b10] mb-4">Actions</h2>

            {showReasonFor && (
              <div className="mb-4 p-4 bg-[#f7faf6] rounded-xl border border-[#d8e1da] space-y-3">
                <label className="block text-xs font-semibold text-[#45504b]">
                  Reason{' '}
                  {showReasonFor === 'approve' || showReasonFor === 'suspend'
                    ? '(optional)'
                    : '(required)'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="w-full border border-[#d8e1da] bg-white rounded-xl px-3 py-2.5 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] resize-none transition-colors"
                  placeholder="Enter reason…"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => doAction(showReasonFor, false)}
                    disabled={!!actionLoading}
                    className="bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading === showReasonFor ? 'Working…' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReasonFor(null);
                      setReason('');
                    }}
                    className="border border-[#d8e1da] text-sm text-[#45504b] px-5 py-2 rounded-xl hover:bg-[#f7faf6] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setShowReasonFor('approve')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                Approve
              </button>
              <button
                onClick={() => setShowReasonFor('reject')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <XCircle size={15} />
                Reject
              </button>
              <button
                onClick={() => setShowReasonFor('request-info')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <Info size={15} />
                Request Info
              </button>
              {suspended ? (
                <button
                  onClick={() => doAction('unsuspend')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 border border-[#d8e1da] text-[#081b10] hover:bg-[#f7faf6] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  Unsuspend
                </button>
              ) : (
                <button
                  onClick={() => setShowReasonFor('suspend')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Ban size={15} />
                  Suspend
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
