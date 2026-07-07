import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { WebhookEndpoint, RegisterWebhookPayload, WebhookDelivery } from './types';

// Query to list all registered webhook endpoints
export function useWebhookEndpoints() {
  return useQuery<WebhookEndpoint[], Error>({
    queryKey: ['webhook-endpoints'],
    queryFn: async () => {
      const res = await api.get('/webhook-endpoints');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((w: any) => ({
        id: w.id || '',
        url: w.url || '',
        createdAt: w.createdAt || '',
        status: w.status || 'Active',
      }));
    },
  });
}

// Mutation to register a new webhook endpoint
export function useCreateWebhookEndpoint() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, RegisterWebhookPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/webhook-endpoints', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
    },
  });
}

// Mutation to delete a webhook endpoint
export function useDeleteWebhookEndpoint() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete(`/webhook-endpoints/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
    },
  });
}

// Query to list webhook delivery logs
export function useWebhookDeliveries(status?: string) {
  return useQuery<WebhookDelivery[], Error>({
    queryKey: ['webhook-deliveries', status],
    queryFn: async () => {
      const res = await api.get('/webhook-deliveries', {
        params: status ? { status } : {},
      });
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((d: any) => ({
        id: d.id || '',
        event: d.event || '',
        url: d.url || '',
        status: d.status || 'Pending',
        statusCode: d.statusCode || 200,
        payload: d.payload || '',
        errorMessage: d.errorMessage || '',
        createdAt: d.createdAt || '',
      }));
    },
  });
}

// Mutation to replay a failed webhook delivery
export function useReplayWebhook() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.post(`/webhook-deliveries/${id}/replay`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-deliveries'] });
    },
  });
}
