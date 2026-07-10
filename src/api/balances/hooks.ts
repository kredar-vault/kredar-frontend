import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/get-error-message';

// Legacy hook — used by other pages
export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const res = await api.get('/insights/balance');
      return (res.data?.data?.availableBalance ?? res.data?.availableBalance ?? 0) as number;
    },
  });
}

// Full balance object from /balance — used by the Balances page
export function useBalanceFull() {
  return useQuery({
    queryKey: ['balance-full'],
    queryFn: async () => {
      const res = await api.get('/balance');
      const d = res.data?.data ?? res.data ?? {};
      return {
        availableBalance: (d.availableBalance ?? 0) as number,
        pendingBalance: (d.pendingBalance ?? 0) as number,
        onHoldBalance: (d.onHoldBalance ?? 0) as number,
        incomingToday: (d.incomingToday ?? 0) as number,
        settledToday: (d.settledToday ?? 0) as number,
        currency: (d.currency ?? 'NGN') as string,
        canWithdraw: (d.canWithdraw ?? true) as boolean,
      };
    },
    refetchInterval: 30_000,
  });
}

export function useRevenue() {
  return useQuery({
    queryKey: ['revenue'],
    queryFn: async () => {
      const res = await api.get('/revenue');
      const d = res.data?.data ?? res.data ?? {};
      return {
        enabled: (d.enabled ?? false) as boolean,
        totalRevenue: (d.totalRevenue ?? 0) as number,
        todayRevenue: (d.todayRevenue ?? 0) as number,
        monthlyRevenue: (d.monthlyRevenue ?? 0) as number,
        availableRevenue: (d.availableRevenue ?? 0) as number,
      };
    },
    refetchInterval: 30_000,
  });
}

export interface ActivityItem {
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  createdAt: string;
}

export function useBalanceActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ['balance-activity'],
    queryFn: async () => {
      const res = await api.get('/balance/activity');
      return (res.data?.data ?? res.data ?? []) as ActivityItem[];
    },
    refetchInterval: 30_000,
  });
}

export interface WithdrawPayload {
  amount: number;
  bankCode: string;
  accountNumber: string;
  narration: string;
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WithdrawPayload) => api.post('/balance/withdraw', payload),
    onSuccess: () => {
      toast.success('Withdrawal initiated successfully');
      queryClient.invalidateQueries({ queryKey: ['balance-full'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['balance-activity'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Withdrawal failed'));
    },
  });
}

export interface RevenueWithdrawPayload {
  amount: number;
  bankCode: string;
  accountNumber: string;
  narration: string;
}

export function useRevenueWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RevenueWithdrawPayload) => api.post('/revenue/withdraw', payload),
    onSuccess: () => {
      toast.success('Revenue withdrawal initiated successfully');
      queryClient.invalidateQueries({ queryKey: ['revenue'] });
      queryClient.invalidateQueries({ queryKey: ['balance-activity'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Revenue withdrawal failed'));
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
    mutationFn: (payload: SimulateDepositPayload) => api.post('/sandbox/simulate/deposit', payload),
    onSuccess: () => {
      toast.success('Deposit simulated successfully');
      queryClient.invalidateQueries({ queryKey: ['balance-full'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['balance-activity'] });
    },
    onError: (error: any) => {
      console.error('[useSimulateDeposit] error', error);
      toast.error(getErrorMessage(error, 'Failed to simulate deposit'));
    },
  });
}
