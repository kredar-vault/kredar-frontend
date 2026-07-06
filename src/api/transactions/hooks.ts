import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TransactionItem, CreateTransactionPayload, CustomerTransactionStats } from './types';

// Query to get all transactions
export function useTransactions(status?: string) {
  return useQuery<TransactionItem[], Error>({
    queryKey: ['transactions', status],
    queryFn: async () => {
      const res = await api.get('/transactions', {
        params: status ? { status } : {},
      });
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw;
    },
  });
}

// Query to get transaction details by ID
export function useTransactionDetails(id: string) {
  return useQuery<TransactionItem, Error>({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const res = await api.get(`/transactions/${id}`);
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });
}

// Query to get customer transaction stats
export function useCustomerTransactionStats(customerId: string) {
  return useQuery<CustomerTransactionStats, Error>({
    queryKey: ['customer-transaction-stats', customerId],
    queryFn: async () => {
      const res = await api.get(`/customers/${customerId}/transactions/stats`);
      return res.data?.data || res.data;
    },
    enabled: !!customerId,
  });
}

// Mutation to create/post a test transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<TransactionItem, Error, CreateTransactionPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/transactions', payload);
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });
}
