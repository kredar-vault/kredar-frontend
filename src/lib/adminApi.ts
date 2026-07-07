const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('kredar_admin_token') : null;
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Request failed');
  return json.data ?? json;
}

export const adminApi = {
  login: (email: string, password: string, totpCode?: string) =>
    req<{ token: string; role: string; email: string }>('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, totpCode }),
    }),

  summary: () =>
    req<{
      reconciled: number;
      underpaid: number;
      overpaid: number;
      reversed: number;
      failed: number;
      totalTenants: number;
      pendingReview: number;
    }>('/api/v1/admin/reconciliation/summary'),

  tenants: (status?: string) =>
    req<unknown[]>(`/api/v1/admin/tenants${status ? `?status=${status}` : ''}`),

  tenant: (id: string) =>
    req<{
      tenant: Record<string, unknown>;
      onboarding: Record<string, unknown> | null;
      apiKeys: unknown[];
    }>(`/api/v1/admin/tenants/${id}`),

  approve: (id: string, reason?: string) =>
    req(`/api/v1/admin/tenants/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  reject: (id: string, reason: string) =>
    req(`/api/v1/admin/tenants/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),

  requestInfo: (id: string, reason: string) =>
    req(`/api/v1/admin/tenants/${id}/request-info`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  suspend: (id: string, reason?: string) =>
    req(`/api/v1/admin/tenants/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  unsuspend: (id: string) => req(`/api/v1/admin/tenants/${id}/unsuspend`, { method: 'POST' }),

  reconciliation: (bucket?: string, page = 1) =>
    req<{ total: number; page: number; items: unknown[] }>(
      `/api/v1/admin/reconciliation?page=${page}${bucket ? `&bucket=${bucket}` : ''}`,
    ),

  forceReconcile: (txId: string) =>
    req(`/api/v1/admin/reconciliation/${txId}/force-reconcile`, { method: 'POST' }),

  reverse: (txId: string, reason?: string) =>
    req(`/api/v1/admin/reconciliation/${txId}/reverse`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  failedWebhooks: (page = 1) =>
    req<{ total: number; page: number; items: unknown[] }>(
      `/api/v1/admin/webhooks/failed?page=${page}`,
    ),

  retryWebhook: (id: string) => req(`/api/v1/admin/webhooks/${id}/retry`, { method: 'POST' }),

  audit: (tenantId?: string, page = 1) =>
    req<{ total: number; page: number; items: unknown[] }>(
      `/api/v1/admin/audit?page=${page}${tenantId ? `&tenantId=${tenantId}` : ''}`,
    ),
};
