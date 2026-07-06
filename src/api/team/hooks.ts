import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TeamMemberItem, InviteTeamMemberPayload, UpdateTeamMemberPayload } from './types';

// Query to list team members
export function useTeamMembers() {
  return useQuery<TeamMemberItem[], Error>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const res = await api.get('/team');
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      return raw.map((t: any) => ({
        id: t.id || '',
        fullName: t.fullName || t.name || '',
        email: t.email || '',
        role: t.role || '',
        createdAt: t.createdAt || '',
      }));
    },
  });
}

// Mutation to invite a team member
export function useAddTeamMember() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, InviteTeamMemberPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/team', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}

// Mutation to update a team member's role or details
export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; payload: UpdateTeamMemberPayload }>({
    mutationFn: async ({ id, payload }) => {
      const res = await api.patch(`/team/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}

// Mutation to delete a team member
export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete(`/team/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}
