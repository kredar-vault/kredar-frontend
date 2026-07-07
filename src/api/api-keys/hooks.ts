import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { mapApiKey } from './mapper';

import { getApiKeys, createApiKey, rotateApiKey, deleteApiKey } from './service';

import { ApiKeyItem, CreateApiKeyPayload } from './types';

export function useApiKeys() {
  return useQuery<ApiKeyItem[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const keys = await getApiKeys();
      return keys.map(mapApiKey);
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => createApiKey(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api-keys'],
      });
    },
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rotateApiKey(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api-keys'],
      });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiKey(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api-keys'],
      });
    },
  });
}
