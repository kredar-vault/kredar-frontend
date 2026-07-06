import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Customer, CustomerTransaction, CreateCustomerPayload, CustomerStats } from './types';

// Helper mapper to normalize customer response objects
function mapCustomer(c: any): Customer {
  return {
    id: c.id || c.customerId || '',
    name: c.name || c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Anonymous',
    email: c.email || '',
    phone: c.phone || c.phoneNumber || '',
    status: c.status || 'Pending',
    registrationDate: c.registrationDate || c.createdAt?.split('T')[0] || '',
    avatar:
      c.avatar ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80',
  };
}

// Query to get all customers
export function useCustomers() {
  return useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map(mapCustomer);
    },
  });
}

// Query to get all active customers
export function useCustomersActive() {
  return useQuery<Customer[], Error>({
    queryKey: ['customers-active'],
    queryFn: async () => {
      const res = await api.get('/customers/active');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map(mapCustomer);
    },
  });
}

// Query to get all inactive customers
export function useCustomersInactive() {
  return useQuery<Customer[], Error>({
    queryKey: ['customers-inactive'],
    queryFn: async () => {
      const res = await api.get('/customers/inactive');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map(mapCustomer);
    },
  });
}

// Query to get customer statistics summary
export function useCustomerStats() {
  return useQuery<CustomerStats, Error>({
    queryKey: ['customers-stats'],
    queryFn: async () => {
      const res = await api.get('/customers/stats');
      return res.data?.data || res.data;
    },
  });
}

// Query to get customer detail by ID
export function useCustomerDetail(id: string) {
  return useQuery<Customer | null, Error>({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/customers/${id}`);
      const data = res.data?.data || res.data;
      if (!data) return null;
      return mapCustomer(data);
    },
    enabled: !!id,
  });
}

// Query to get customer transactions by ID
export function useCustomerTransactions(id: string) {
  return useQuery<CustomerTransaction[], Error>({
    queryKey: ['customer-transactions', id],
    queryFn: async () => {
      if (!id) return [];
      const res = await api.get(`/customers/${id}/transactions`);
      const rawTransactions = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return rawTransactions.map((tx: any) => {
        const txStatus = tx.status || 'Pending';
        const mappedStatus = txStatus.charAt(0).toUpperCase() + txStatus.slice(1).toLowerCase();
        const formatCurrency = (val: number) => {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: tx.currency || 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(val);
        };
        return {
          id: tx.id || tx.transactionId || '',
          date: tx.date || tx.createdAt?.split('T')[0] || '',
          amount: typeof tx.amount === 'number' ? formatCurrency(tx.amount) : tx.amount || '₦0',
          status: mappedStatus,
        };
      });
    },
    enabled: !!id,
  });
}

// Mutation to create a new customer profile
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation<Customer, Error, CreateCustomerPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/customers', payload);
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers-stats'] });
    },
  });
}

// Mutation to update customer status
export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { id: string; status: 'Active' | 'Inactive' | 'Restricted' | string }
  >({
    mutationFn: async ({ id, status }) => {
      const res = await api.patch(`/customers/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers-stats'] });
    },
  });
}
