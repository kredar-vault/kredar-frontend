import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCustomerKyc, submitCustomerKyc, updateKycDocumentStatus } from './service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/get-error-message';

import { mapCustomer } from './mapper';
import {
  getCustomers,
  getDedicatedAccounts, // Added missing import
  getCustomer,
  getActiveCustomers,
  getInactiveCustomers,
  getCustomerStats,
  createCustomerWithDedicatedAccount,
  updateCustomerStatus,
  getCustomerTransactions,
  getCustomerTransactionStats,
  generateVirtualAccount,
} from './service';

import {
  Customer,
  CustomerStats,
  CustomerTransaction,
  CustomerTransactionStats,
  CreateCustomerPayload,
} from './types';

// Shared helper to fetch customers and match them concurrently with their dedicated accounts
async function fetchCustomersWithAccounts(fetchFn: () => Promise<any[]>) {
  const [customers, accounts] = await Promise.all([fetchFn(), getDedicatedAccounts()]);

  const customerList = Array.isArray(customers) ? customers : [];
  const accountList = Array.isArray(accounts) ? accounts : [];

  return customerList.map((c) => {
    const matchedAccount = accountList.find(
      (acc: any) => acc.customerId === c.id || acc.customerId === c.customerId,
    );

    const mapped = mapCustomer(c);
    if (matchedAccount) {
      mapped.dedicatedAccountNumber =
        matchedAccount.accountNumber || matchedAccount.dedicatedAccountNumber || '';
      mapped.bankName = matchedAccount.bankName || mapped.bankName || '';
    }
    return mapped;
  });
}

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => fetchCustomersWithAccounts(getCustomers),
  });
}

export function useActiveCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['customers', 'active'],
    queryFn: () => fetchCustomersWithAccounts(getActiveCustomers),
  });
}

export function useInactiveCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['customers', 'inactive'],
    queryFn: () => fetchCustomersWithAccounts(getInactiveCustomers),
  });
}

export function useCustomer(id: string) {
  return useQuery<Customer>({
    queryKey: ['customers', id],
    queryFn: async () => {
      const [customer, accounts] = await Promise.all([getCustomer(id), getDedicatedAccounts()]);

      if (!customer) throw new Error('Customer data not found');

      const accountList = Array.isArray(accounts) ? accounts : [];
      const matchedAccount = accountList.find(
        (acc: any) => acc.customerId === id || acc.customerId === customer.id,
      );

      const mapped = mapCustomer(customer);
      if (matchedAccount) {
        mapped.dedicatedAccountNumber =
          matchedAccount.accountNumber || matchedAccount.dedicatedAccountNumber || '';
        mapped.bankName = matchedAccount.bankName || mapped.bankName || '';
      }
      return mapped;
    },
    enabled: !!id,
  });
}

export function useCustomerStats() {
  return useQuery<CustomerStats>({
    queryKey: ['customers', 'stats'],
    queryFn: getCustomerStats,
  });
}

export function useCustomerTransactions(customerId: string) {
  return useQuery<CustomerTransaction[]>({
    queryKey: ['customers', customerId, 'transactions'],
    queryFn: () => getCustomerTransactions(customerId),
    enabled: !!customerId,
  });
}

export function useCustomerTransactionStats(customerId: string) {
  return useQuery<CustomerTransactionStats>({
    queryKey: ['customers', customerId, 'transaction-stats'],
    queryFn: () => getCustomerTransactionStats(customerId),
    enabled: !!customerId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createCustomerWithDedicatedAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', 'stats'] });
    },
  });
}

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCustomerStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customers', 'stats'] });
    },
  });
}

export function useGenerateVirtualAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => generateVirtualAccount(customerId),
    onSuccess: (_, customerId) => {
      // Invalidate everything associated with the customer lists and details
      // so the UI gets fresh data showing the newly tied virtual account immediately
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] });
    },
  });
}

export function useCustomerKyc(customerId: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'kyc'],
    queryFn: () => getCustomerKyc(customerId),
    enabled: !!customerId,
  });
}

export function useSubmitCustomerKyc(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => submitCustomerKyc(customerId, payload),
    onSuccess: () => {
      toast.success('KYC documents submitted');
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'kyc'] });
    },
    onError: (error: any) => {
      console.error('[useSubmitCustomerKyc] error', error);
      toast.error(getErrorMessage(error, 'Failed to submit KYC documents'));
    },
  });
}

export function useUpdateKycDocumentStatus(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, status }: { docId: string; status: string }) =>
      updateKycDocumentStatus(docId, status),
    onSuccess: () => {
      toast.success('KYC status updated');
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'kyc'] });
    },
    onError: (error: any) => {
      console.error('[useUpdateKycDocumentStatus] error', error);
      toast.error(getErrorMessage(error, 'Failed to update KYC status'));
    },
  });
}
