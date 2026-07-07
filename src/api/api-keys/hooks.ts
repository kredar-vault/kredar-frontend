import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { mapApiKey } from './mapper';
import { getApiKeys, createApiKey, rotateApiKey, deleteApiKey } from './service';
import { ApiKeyItem, CreateApiKeyPayload } from './types';
import { toast } from 'sonner';

export function useApiKeys() {
  return useQuery<ApiKeyItem[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      console.log('[useApiKeys] fetching keys');
      const keys = await getApiKeys();
      console.log('[useApiKeys] fetched', keys);
      return keys.map(mapApiKey);
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => createApiKey(payload),
    onSuccess: () => {
      console.log('[useCreateApiKey] success');
      toast.success('API key created');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (error) => {
      console.error('[useCreateApiKey] error', error);
      toast.error('Failed to create API key');
    },
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rotateApiKey(id),
    onSuccess: () => {
      console.log('[useRotateApiKey] success');
      toast.success('API key rotated');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (error) => {
      console.error('[useRotateApiKey] error', error);
      toast.error('Failed to rotate API key');
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log('[useDeleteApiKey] calling deleteApiKey with id:', id);
      return deleteApiKey(id);
    },
    onSuccess: (data, id) => {
      console.log('[useDeleteApiKey] success for id:', id);
      toast.success('API key deleted');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (error, id) => {
      console.error('[useDeleteApiKey] error for id:', id, error);
      toast.error('Failed to delete API key');
    },
  });
}
