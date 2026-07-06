import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useHealthCheck() {
  return useQuery<{ status: string; timestamp: string }, Error>({
    queryKey: ['health-check'],
    queryFn: async () => {
      const res = await api.get('/health');
      return res.data;
    },
    refetchInterval: 30000, // check every 30s
  });
}
