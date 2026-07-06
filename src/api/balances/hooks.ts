import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DedicatedAccount, BankLookupPayload, BankLookupResponse } from './types';

// Query to get dedicated settlement account
export function useDedicatedAccount() {
  return useQuery<DedicatedAccount | null, Error>({
    queryKey: ['dedicated-account'],
    queryFn: async () => {
      const res = await api.get('/dedicated-accounts');
      if (!res || !res.data) {
        return null;
      }
      const rawData = res.data.data !== undefined ? res.data.data : res.data;
      if (rawData === undefined || rawData === null) {
        return null;
      }
      const result = Array.isArray(rawData) ? rawData[0] : rawData;
      return result !== undefined ? result : null;
    },
  });
}

// Mutation to create dedicated settlement account
export function useCreateDedicatedAccount() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { customerId: string }>({
    mutationFn: async (payload) => {
      const res = await api.post('/dedicated-accounts', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dedicated-account'] });
    },
  });
}

// Mutation to verify account number at bank
export function useBankLookup() {
  return useMutation<BankLookupResponse, Error, BankLookupPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/transfers/bank/lookup', payload);
      const name = res.data?.accountName || res.data?.data?.accountName || res.data?.data;
      if (!name) {
        throw new Error('Could not resolve account name automatically.');
      }
      return { accountName: name };
    },
  });
}

// Query to get dedicated account details by ID
export function useDedicatedAccountDetails(id: string) {
  return useQuery<DedicatedAccount, Error>({
    queryKey: ['dedicated-account-detail', id],
    queryFn: async () => {
      const res = await api.get(`/dedicated-accounts/${id}`);
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });
}
