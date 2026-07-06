import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  BankLookupPayload,
  BankLookupResponse,
  CreateTransferPayload,
  TransferDetails,
} from './types';

// Mutation to lookup a bank account details
export function useBankLookup() {
  return useMutation<BankLookupResponse, Error, BankLookupPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/transfers/bank/lookup', payload);
      return res.data?.data || res.data;
    },
  });
}

// Mutation to initiate a bank transfer
export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CreateTransferPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/transfers/bank', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });
}

// Query to list all transfers
export function useTransfers() {
  return useQuery<TransferDetails[], Error>({
    queryKey: ['transfers'],
    queryFn: async () => {
      const res = await api.get('/transfers');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((t: any) => ({
        id: t.id || '',
        merchantTxRef: t.merchantTxRef || '',
        amount: t.amount || 0,
        accountNumber: t.accountNumber || '',
        accountName: t.accountName || '',
        bankCode: t.bankCode || '',
        status: t.status || 'Pending',
        createdAt: t.createdAt || '',
      }));
    },
  });
}

// Query to get details of a specific transfer by merchant tx ref
export function useTransferDetails(merchantTxRef: string) {
  return useQuery<TransferDetails, Error>({
    queryKey: ['transfer', merchantTxRef],
    queryFn: async () => {
      const res = await api.get(`/transfers/${merchantTxRef}`);
      return res.data?.data || res.data;
    },
    enabled: !!merchantTxRef,
  });
}
