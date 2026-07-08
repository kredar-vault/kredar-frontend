import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { mapApiKey } from './mapper';
import { getApiKeys, createApiKey, rotateApiKey, deleteApiKey } from './service';
import { ApiKeyItem, CreateApiKeyPayload } from './types';
import { getErrorMessage } from '@/lib/get-error-message';

export function useApiKeys() {
  return useQuery<ApiKeyItem[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const keys = await getApiKeys();
      return keys.map(mapApiKey).filter((key) => key.status !== 'Revoked'); // 👈 this line is required
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
    onError: (error: any) => {
      console.error('[useCreateApiKey] error', error);
      toast.error(getErrorMessage(error, 'Failed to create API key'));
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
    onError: (error: any) => {
      console.error('[useRotateApiKey] error', error);
      toast.error(getErrorMessage(error, 'Failed to rotate API key'));
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
    onError: (error: any) => {
      console.error('[useDeleteApiKey] error', error);
      toast.error(getErrorMessage(error, 'Failed to delete API key'));
    },
  });
}
