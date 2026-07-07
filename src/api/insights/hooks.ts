import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useInsights() {
  return useQuery<any, Error>({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await api.get('/insights');
      return res.data?.data || res.data;
    },
  });
}
