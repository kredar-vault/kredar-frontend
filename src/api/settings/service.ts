import { api } from '@/lib/api';
import { UpdateTenantProfilePayload } from './types';

const extractData = (res: any) => {
  if (res?.data && 'data' in res.data) {
    return res.data.data;
  }

  return res?.data;
};

export async function getTenantProfile() {
  const res = await api.get('/tenants/profile');
  return extractData(res);
}

export async function updateTenantProfile(payload: UpdateTenantProfilePayload) {
  const res = await api.patch('/tenants/profile', payload);
  return extractData(res);
}
