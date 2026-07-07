export interface ApiKeyItem {
  id: string;
  label: string;
  clientId: string;
  keyString: string;
  mode: string;
  status: string;
  createdAt: string;
}

export interface CreateApiKeyPayload {
  label: string;
  mode: string;
}
