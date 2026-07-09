import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/get-error-message';
import { BillingSchedule, BillingPeriod, CreateBillingSchedulePayload } from './types';

const extract = (res: any) => res.data?.data ?? res.data;

export function useBillingSchedules() {
  return useQuery<BillingSchedule[]>({
    queryKey: ['billing-schedules'],
    queryFn: async () => {
      const res = await api.get('/billing/schedules');
      return extract(res) ?? [];
    },
  });
}

export function useBillingPeriods(id: string) {
  return useQuery<BillingPeriod[]>({
    queryKey: ['billing-schedules', id, 'periods'],
    queryFn: async () => {
      const res = await api.get(`/billing/schedules/${id}/periods`);
      return extract(res) ?? [];
    },
    enabled: !!id,
  });
}

export function useCreateBillingSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBillingSchedulePayload) => {
      const res = await api.post('/billing/schedules', payload);
      return extract(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-schedules'] });
      toast.success('Billing schedule created.');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Failed to create billing schedule.'));
    },
  });
}

export function useSetNextAmount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, amountKobo }: { id: string; amountKobo: number }) => {
      const res = await api.put(`/billing/schedules/${id}/next-amount`, { amountKobo });
      return extract(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-schedules'] });
      toast.success('Next cycle amount updated.');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Failed to update amount.'));
    },
  });
}

function useScheduleAction(action: 'pause' | 'resume' | 'cancel', successMsg: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/billing/schedules/${id}/${action}`, {});
      return extract(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-schedules'] });
      toast.success(successMsg);
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, `Failed to ${action} schedule.`));
    },
  });
}

export const usePauseSchedule = () => useScheduleAction('pause', 'Schedule paused.');
export const useResumeSchedule = () => useScheduleAction('resume', 'Schedule resumed.');
export const useCancelSchedule = () => useScheduleAction('cancel', 'Schedule cancelled.');
