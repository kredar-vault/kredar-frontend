import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { KycDocument, SubmitKycPayload, UpdateKycStatusPayload } from './types';

// Query to get customer KYC documents
export function useCustomerKyc(customerId: string) {
  return useQuery<KycDocument[], Error>({
    queryKey: ['customer-kyc', customerId],
    queryFn: async () => {
      const res = await api.get(`/customers/${customerId}/kyc`);
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((d: any) => ({
        id: d.id || '',
        documentType: d.documentType || '',
        fileUrl: d.fileUrl || '',
        status: d.status || 'Pending',
        createdAt: d.createdAt || '',
      }));
    },
    enabled: !!customerId,
  });
}

// Mutation to submit customer KYC document
export function useSubmitKyc() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { customerId: string; payload: SubmitKycPayload }>({
    mutationFn: async ({ customerId, payload }) => {
      const res = await api.post(`/customers/${customerId}/kyc`, payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-kyc', variables.customerId] });
    },
  });
}

// Mutation to update KYC document status (Admin tool)
export function useUpdateKycStatus() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { docId: string; payload: UpdateKycStatusPayload }>({
    mutationFn: async ({ docId, payload }) => {
      const res = await api.patch(`/customers/kyc/${docId}/status`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-kyc'] });
    },
  });
}
