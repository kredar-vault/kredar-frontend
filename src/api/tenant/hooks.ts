import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProfileData, OnboardingStatus, OnboardingSubmitPayload } from './types';

// Query to get the tenant's current profile
export function useTenantProfile() {
  return useQuery<ProfileData | null, Error>({
    queryKey: ['tenant-profile'],
    queryFn: async () => {
      const res = await api.get('/tenants/profile');
      const data = res.data?.data || res.data;
      if (!data) return null;
      return {
        businessName: data.businessName || '',
        registrationNumber: data.businessRegistrationNumber || data.registrationNumber || '',
        businessType: data.businessType || '',
        industry: data.industry || '',
        country: data.country || '',
        businessAddress: data.businessAddress || '',
        countryCode: data.countryCode || '+234',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        website: data.website || '',
      };
    },
  });
}

// Query to check onboarding status
export function useOnboardingStatus() {
  return useQuery<OnboardingStatus | null, Error>({
    queryKey: ['onboarding-status'],
    queryFn: async () => {
      const res = await api.get('/onboarding');
      return res.data?.data || res.data || null;
    },
  });
}

// Mutation to update profile in Settings
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, Partial<ProfileData>>({
    mutationFn: async (payload) => {
      // Map to correct API keys for business registration number
      const mappedPayload = {
        businessName: payload.businessName,
        businessRegistrationNumber: payload.registrationNumber,
        businessType: payload.businessType,
        industry: payload.industry,
        country: payload.country,
        businessAddress: payload.businessAddress,
        phoneNumber: payload.phoneNumber,
        website: payload.website,
      };
      const res = await api.patch('/tenants/profile', mappedPayload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-profile'] });
    },
  });
}

// Mutation to submit the onboarding details
export function useSubmitOnboarding() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, OnboardingSubmitPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/onboarding/submit', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-profile'] });
    },
  });
}
