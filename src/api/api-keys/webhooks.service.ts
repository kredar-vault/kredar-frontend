import { api } from '@/lib/api';

const extractData = (res: any) => {
  if (res?.data && 'data' in res.data) {
    return res.data.data;
  }
  return res?.data;
};

export async function getWebhooks() {
  const res = await api.get('/webhook-endpoints');
  const data = extractData(res);
  return Array.isArray(data) ? data : [];
}

export async function createWebhook(url: string) {
  const res = await api.post('/webhook-endpoints', { url });
  return extractData(res);
}

export async function deleteWebhook(id: string) {
  const res = await api.delete(`/webhook-endpoints/${id}`);
  return extractData(res);
}
