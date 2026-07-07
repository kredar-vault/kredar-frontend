import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreateCheckoutSessionPayload, CheckoutSessionDetails } from './types';

// Mutation to create a checkout session
export function useCreateCheckoutSession() {
  return useMutation<CheckoutSessionDetails, Error, CreateCheckoutSessionPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/checkout/sessions', payload);
      return res.data?.data || res.data;
    },
  });
}

// Query to get checkout session details by token
export function useCheckoutDetails(token: string) {
  return useQuery<CheckoutSessionDetails, Error>({
    queryKey: ['checkout-session', token],
    queryFn: async () => {
      const res = await api.get(`/checkout/${token}`);
      return res.data?.data || res.data;
    },
    enabled: !!token,
  });
}
