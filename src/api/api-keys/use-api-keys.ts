import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { mapApiKey } from './mapper';
import { getApiKeys, createApiKey, rotateApiKey, deleteApiKey } from './service';
import { ApiKeyItem, CreateApiKeyPayload } from './types';

export function useApiKeys() {
  return useQuery<ApiKeyItem[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const keys = await getApiKeys();
      return keys.map(mapApiKey).filter((key) => key.status !== 'Revoked'); // hide deleted/revoked keys
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => createApiKey(payload),
    onSuccess: () => {
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
    mutationFn: (id: string) => deleteApiKey(id),
    onSuccess: () => {
      toast.success('API key deleted');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (error) => {
      console.error('[useDeleteApiKey] error', error);
      toast.error('Failed to delete API key');
    },
  });
}
