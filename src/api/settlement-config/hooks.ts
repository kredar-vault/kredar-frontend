import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SettlementSettings, SplitSettings } from './types';

// Query to get settlement settings
export function useSettlementSettings() {
  return useQuery<SettlementSettings, Error>({
    queryKey: ['settlement-settings'],
    queryFn: async () => {
      const res = await api.get('/settings/settlement');
      return res.data?.data || res.data;
    },
  });
}

// Mutation to update settlement settings
export function useUpdateSettlementSettings() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, SettlementSettings>({
    mutationFn: async (payload) => {
      const res = await api.put('/settings/settlement', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlement-settings'] });
    },
  });
}

// Query to get split settings
export function useSplitSettings() {
  return useQuery<SplitSettings, Error>({
    queryKey: ['split-settings'],
    queryFn: async () => {
      const res = await api.get('/settings/splits');
      return res.data?.data || res.data;
    },
  });
}

// Mutation to update split settings
export function useUpdateSplitSettings() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, SplitSettings>({
    mutationFn: async (payload) => {
      const res = await api.put('/settings/splits', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-settings'] });
    },
  });
}
