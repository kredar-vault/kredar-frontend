import { api } from '@/lib/api';
import { CreateApiKeyPayload } from './types';

const extractData = (res: any) => {
  if (res?.data && 'data' in res.data) {
    return res.data.data;
  }

  return res?.data;
};

export async function getApiKeys() {
  const res = await api.get('/api-keys');

  const data = extractData(res);

  return Array.isArray(data) ? data : [];
}

export async function createApiKey(payload: CreateApiKeyPayload) {
  const res = await api.post('/api-keys', payload);
  return extractData(res);
}

export async function rotateApiKey(id: string) {
  const res = await api.post(`/api-keys/${id}/rotate`);
  return extractData(res);
}

export async function deleteApiKey(id: string) {
  const res = await api.delete(`/api-keys/${id}`);
  return extractData(res);
}
