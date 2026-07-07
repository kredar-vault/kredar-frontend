import { api } from '@/lib/api';
import { CreateTeamMemberPayload, UpdateTeamMemberPayload } from './types';

const extractData = (res: any) => {
  if (res?.data && 'data' in res.data) {
    return res.data.data;
  }
  return res?.data;
};

export async function getTeamMembers() {
  const res = await api.get('/team');
  const data = extractData(res);
  return Array.isArray(data) ? data : [];
}

export async function createTeamMember(payload: CreateTeamMemberPayload) {
  const res = await api.post('/team', payload);
  return extractData(res);
}

export async function updateTeamMember(id: string, payload: UpdateTeamMemberPayload) {
  const res = await api.patch(`/team/${id}`, payload);
  return extractData(res);
}

export async function deleteTeamMember(id: string) {
  const res = await api.delete(`/team/${id}`);
  return extractData(res);
}
