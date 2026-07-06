import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { RuleItem, CreateRulePayload } from './types';

// Query to get all rules
export function useRules() {
  return useQuery<RuleItem[], Error>({
    queryKey: ['rules'],
    queryFn: async () => {
      const res = await api.get('/rules');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((r: any) => ({
        id: r.id || '',
        trigger: r.trigger || '',
        action: r.action || '',
        thresholdNaira: r.thresholdNaira,
        priority: r.priority || 0,
      }));
    },
  });
}

// Mutation to create a new routing rule
export function useCreateRule() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CreateRulePayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/rules', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
}

// Mutation to delete a rule
export function useDeleteRule() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete(`/rules/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
}
