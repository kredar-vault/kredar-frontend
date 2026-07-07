import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SimulateDepositPayload, SimulationResponse } from './types';

// Mutation to simulate a credit transfer deposit to a virtual account
export function useSimulateDeposit() {
  const queryClient = useQueryClient();
  return useMutation<SimulationResponse, Error, SimulateDepositPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/sandbox/simulate/deposit', payload);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate balances and transactions to refresh visual state immediately
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dedicated-accounts'] });
    },
  });
}
