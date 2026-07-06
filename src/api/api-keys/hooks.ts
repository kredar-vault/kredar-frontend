import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ApiKeyItem, CreateApiKeyPayload } from './types';

// Query to get all API keys
export function useApiKeys() {
  return useQuery<ApiKeyItem[], Error>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await api.get('/api-keys');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((k: any) => ({
        id: k.id || '',
        name: k.name || k.label || 'Kredar API Key',
        label: k.label || k.name || '',
        keyString: k.keyString || k.secretKey || k.key || '',
        mode: k.mode || 'live',
        createdAt: k.createdAt || '',
      }));
    },
  });
}

// Mutation to create a new API key
export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CreateApiKeyPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/api-keys', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
}

// Mutation to rotate an existing API key
export function useRotateApiKey() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.post(`/api-keys/${id}/rotate`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
}

// Mutation to delete an API key
export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete(`/api-keys/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
}
