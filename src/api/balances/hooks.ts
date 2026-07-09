import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/get-error-message';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const res = await api.get('/api/v1/insights/balance');
      return (res.data?.data?.availableBalance ?? res.data?.availableBalance ?? 0) as number;
    },
  });
}

export interface SimulateDepositPayload {
  accountReference: string;
  amountNaira: number;
  senderName: string;
  reversal: boolean;
}

export function useSimulateDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SimulateDepositPayload) =>
      api.post('/api/v1/sandbox/simulate/deposit', payload),
    onSuccess: () => {
      toast.success('Deposit simulated successfully');
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error: any) => {
      console.error('[useSimulateDeposit] error', error);
      toast.error(getErrorMessage(error, 'Failed to simulate deposit'));
    },
  });
}
