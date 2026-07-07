import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TransactionItem, CreateTransactionPayload, CustomerTransactionStats } from './types';

// 1. Query to get all transactions
export function useTransactions(status?: string) {
  return useQuery<TransactionItem[], Error>({
    queryKey: ['transactions', status],
    queryFn: async () => {
      const res = await api.get('/transactions', {
        params: status ? { status } : {},
      });
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
    },
  });
}

// 2. Query to get transaction details by ID
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

// 3. ADDED: Query to get transactions for a specific customer
export function useCustomerTransactions(customerId: string) {
  return useQuery<TransactionItem[], Error>({
    queryKey: ['customer-transactions', customerId],
    queryFn: async () => {
      const res = await api.get(`/customers/${customerId}/transactions`);
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
    },
    enabled: !!customerId,
  });
}

// 4. Query to get customer transaction stats
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

// 5. Mutation to create/post a test transaction
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
