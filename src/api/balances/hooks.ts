import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const res = await api.get('/insights/balance');
      return typeof res.data?.balance === 'number'
        ? res.data.balance
        : (res.data?.data?.balance ?? 0);
    },
  });
}
