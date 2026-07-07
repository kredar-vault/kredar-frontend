import { WebhookEndpoint } from './webhooks.types';

export function mapWebhook(hook: any): WebhookEndpoint {
  return {
    id: hook.id ?? '',
    url: hook.url ?? '',
    status: hook.status ?? '',
    createdAt: hook.createdAt ?? '',
  };
}
