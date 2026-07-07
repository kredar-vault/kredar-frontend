import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EscrowHoldPayload, EscrowResponse } from './types';

// Mutation to place hold on settlement
export function useHoldSettlement() {
  return useMutation<
    EscrowResponse,
    Error,
    { accountReference: string; payload: EscrowHoldPayload }
  >({
    mutationFn: async ({ accountReference, payload }) => {
      const res = await api.post(`/settlements/${accountReference}/hold`, payload);
      return res.data;
    },
  });
}

// Mutation to release settlement hold
export function useReleaseSettlement() {
  return useMutation<EscrowResponse, Error, string>({
    mutationFn: async (accountReference) => {
      const res = await api.post(`/settlements/${accountReference}/release`);
      return res.data;
    },
  });
}
