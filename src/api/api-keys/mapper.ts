import { ApiKeyItem } from './types';

export function mapApiKey(key: any): ApiKeyItem {
  return {
    id: key.id ?? '',
    label: key.label ?? '',
    clientId: key.clientId ?? '',
    keyString: key.clientSecret ?? key.keyString ?? key.secretKey ?? key.key ?? '',
    mode: key.mode ?? 'live',
    status: key.status ?? '',
    createdAt: key.createdAt ?? '',
  };
}
