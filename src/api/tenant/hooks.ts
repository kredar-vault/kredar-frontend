import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ProfileData, OnboardingStatus, OnboardingSubmitPayload } from './types';
import { getErrorMessage } from '@/lib/get-error-message';

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

export function useOnboardingStatus() {
  return useQuery<OnboardingStatus | null, Error>({
    queryKey: ['onboarding-status'],
    queryFn: async () => {
      const res = await api.get('/onboarding');
      return res.data?.data || res.data || null;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, Partial<ProfileData>>({
    mutationFn: async (payload) => {
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
      toast.success('Business profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['tenant-profile'] });
    },
    onError: (error: any) => {
      console.error('[useUpdateProfile] error', error);
      toast.error(getErrorMessage(error, 'Failed to update profile.'));
    },
  });
}

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
    onError: (error: any) => {
      console.error('[useSubmitOnboarding] error', error);
      toast.error(getErrorMessage(error, 'Onboarding submission failed.'));
    },
  });
}
