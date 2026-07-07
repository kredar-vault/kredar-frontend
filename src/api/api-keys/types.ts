export interface ApiKeyItem {
  id: string;
  label: string;
  keyString: string;
  mode: string;
  createdAt: string;
}

export interface CreateApiKeyPayload {
  label: string;
  mode: string;
}
