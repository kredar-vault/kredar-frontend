import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SubMerchant, CreateSubMerchantPayload, SetSubMerchantPayoutPayload } from './types';

// Query to get all sub-merchants
export function useSubMerchants() {
  return useQuery<SubMerchant[], Error>({
    queryKey: ['sub-merchants'],
    queryFn: async () => {
      const res = await api.get('/sub-merchants');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((s: any) => ({
        id: s.id || '',
        name: s.name || '',
        reference: s.reference || '',
        createdAt: s.createdAt || '',
        payoutConfig: s.payoutConfig,
      }));
    },
  });
}

// Mutation to create a new sub-merchant
export function useCreateSubMerchant() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CreateSubMerchantPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/sub-merchants', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-merchants'] });
    },
  });
}

// Query to get sub-merchant details by ID
export function useSubMerchantDetails(id: string) {
  return useQuery<SubMerchant, Error>({
    queryKey: ['sub-merchant', id],
    queryFn: async () => {
      const res = await api.get(`/sub-merchants/${id}`);
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });
}

// Mutation to update sub-merchant payout routing config
export function useSetSubMerchantPayout() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; payload: SetSubMerchantPayoutPayload }>({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/sub-merchants/${id}/payout`, payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sub-merchant', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['sub-merchants'] });
    },
  });
}
