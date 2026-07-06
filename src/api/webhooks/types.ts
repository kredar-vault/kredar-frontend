export interface WebhookEndpoint {
  id: string;
  url: string;
  createdAt?: string;
  status?: string;
}

export interface RegisterWebhookPayload {
  url: string;
}

export interface WebhookDelivery {
  id: string;
  event: string;
  url: string;
  status: 'Pending' | 'Delivered' | 'Failed' | 'DeadLetter' | string;
  statusCode?: number;
  payload?: string;
  errorMessage?: string;
  createdAt: string;
}
