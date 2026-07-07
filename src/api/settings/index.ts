import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTenantProfile, updateTenantProfile } from './service';

import { TenantProfile, UpdateTenantProfilePayload } from './types';

export function useTenantProfile() {
  return useQuery<TenantProfile>({
    queryKey: ['tenant-profile'],
    queryFn: getTenantProfile,
  });
}

export function useUpdateTenantProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTenantProfilePayload) => updateTenantProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenant-profile'],
      });
    },
  });
}
