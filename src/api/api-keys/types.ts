export interface ApiKeyItem {
  id: string;
  name?: string;
  label?: string;
  keyString?: string;
  mode?: string;
  createdAt?: string;
}

export interface CreateApiKeyPayload {
  label: string;
  mode?: 'test' | 'live' | string;
}
