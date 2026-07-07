import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTeamMember, deleteTeamMember, getTeamMembers, updateTeamMember } from './service';

import { TeamMember, CreateTeamMemberPayload, UpdateTeamMemberPayload } from './types';

export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: getTeamMembers,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTeamMemberPayload) => createTeamMember(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team'],
      });
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeamMemberPayload }) =>
      updateTeamMember(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team'],
      });
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTeamMember(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team'],
      });
    },
  });
}
