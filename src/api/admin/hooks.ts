import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  AdminLoginPayload,
  VerifyMfaPayload,
  CreateAdminPayload,
  ReviewTenantPayload,
  AdminTenantItem,
  AdminReconciliationItem,
  AuditLogItem,
} from './types';

// admin/auth/login
export function useAdminLogin() {
  return useMutation<any, Error, AdminLoginPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/auth/login', payload);
      return res.data;
    },
  });
}

// admin/mfa/enroll
export function useEnrollMfa() {
  return useMutation<any, Error, void>({
    mutationFn: async () => {
      const res = await api.post('/admin/mfa/enroll');
      return res.data;
    },
  });
}

// admin/mfa/verify
export function useVerifyMfa() {
  return useMutation<any, Error, VerifyMfaPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/mfa/verify', payload);
      return res.data;
    },
  });
}

// admin/admins (create another admin)
export function useCreateAdmin() {
  return useMutation<any, Error, CreateAdminPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/admins', payload);
      return res.data;
    },
  });
}

// admin/tenants (list tenants)
export function useAdminTenants(status?: string) {
  return useQuery<AdminTenantItem[], Error>({
    queryKey: ['admin-tenants', status],
    queryFn: async () => {
      const res = await api.get('/admin/tenants', {
        params: status ? { status } : {},
      });
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((t: any) => ({
        id: t.id || '',
        email: t.email || '',
        businessName: t.businessName || '',
        status: t.status || 'Pending',
        createdAt: t.createdAt || '',
      }));
    },
  });
}

// admin/tenants/{tenantId}
export function useAdminTenantDetail(tenantId: string) {
  return useQuery<AdminTenantItem, Error>({
    queryKey: ['admin-tenant', tenantId],
    queryFn: async () => {
      const res = await api.get(`/admin/tenants/${tenantId}`);
      return res.data?.data || res.data;
    },
    enabled: !!tenantId,
  });
}

// admin/tenants/{tenantId}/approve
export function useApproveTenant() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { tenantId: string; payload: ReviewTenantPayload }>({
    mutationFn: async ({ tenantId, payload }) => {
      const res = await api.post(`/admin/tenants/${tenantId}/approve`, payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenant', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
  });
}

// admin/tenants/{tenantId}/reject
export function useRejectTenant() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { tenantId: string; payload: ReviewTenantPayload }>({
    mutationFn: async ({ tenantId, payload }) => {
      const res = await api.post(`/admin/tenants/${tenantId}/reject`, payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenant', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
  });
}

// admin/tenants/{tenantId}/request-info
export function useRequestInfoTenant() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { tenantId: string; payload: ReviewTenantPayload }>({
    mutationFn: async ({ tenantId, payload }) => {
      const res = await api.post(`/admin/tenants/${tenantId}/request-info`, payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenant', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
  });
}

// admin/tenants/{tenantId}/suspend
export function useSuspendTenant() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { tenantId: string; payload: ReviewTenantPayload }>({
    mutationFn: async ({ tenantId, payload }) => {
      const res = await api.post(`/admin/tenants/${tenantId}/suspend`, payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenant', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
  });
}

// admin/tenants/{tenantId}/unsuspend
export function useUnsuspendTenant() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (tenantId) => {
      const res = await api.post(`/admin/tenants/${tenantId}/unsuspend`);
      return res.data;
    },
    onSuccess: (_, tenantId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenant', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    },
  });
}

// admin/reconciliation
export function useReconciliations() {
  return useQuery<AdminReconciliationItem[], Error>({
    queryKey: ['admin-reconciliations'],
    queryFn: async () => {
      const res = await api.get('/admin/reconciliation');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((r: any) => ({
        id: r.id || '',
        transactionId: r.transactionId || '',
        amount: r.amount || 0,
        status: r.status || '',
        matchedAt: r.matchedAt || '',
      }));
    },
  });
}

// admin/reconciliation/summary
export function useReconciliationSummary() {
  return useQuery<any, Error>({
    queryKey: ['admin-reconciliation-summary'],
    queryFn: async () => {
      const res = await api.get('/admin/reconciliation/summary');
      return res.data?.data || res.data;
    },
  });
}

// admin/reconciliation/{txId}/force-reconcile
export function useForceReconcile() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (txId) => {
      const res = await api.post(`/admin/reconciliation/${txId}/force-reconcile`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reconciliations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reconciliation-summary'] });
    },
  });
}

// admin/reconciliation/{txId}/reverse
export function useReverseTransaction() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (txId) => {
      const res = await api.post(`/admin/reconciliation/${txId}/reverse`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reconciliations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reconciliation-summary'] });
    },
  });
}

// admin/webhooks/failed
export function useFailedWebhooks() {
  return useQuery<any[], Error>({
    queryKey: ['admin-failed-webhooks'],
    queryFn: async () => {
      const res = await api.get('/admin/webhooks/failed');
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
  });
}

// admin/webhooks/{deliveryId}/retry
export function useRetryWebhook() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (deliveryId) => {
      const res = await api.post(`/admin/webhooks/${deliveryId}/retry`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-failed-webhooks'] });
    },
  });
}

// admin/audit
export function useAuditLogs() {
  return useQuery<AuditLogItem[], Error>({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((a: any) => ({
        id: a.id || '',
        adminId: a.adminId || '',
        action: a.action || '',
        details: a.details || '',
        timestamp: a.timestamp || '',
      }));
    },
  });
}
