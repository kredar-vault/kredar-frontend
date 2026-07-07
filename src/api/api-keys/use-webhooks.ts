import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createWebhook, deleteWebhook, getWebhooks } from './webhooks.service';
import { WebhookEndpoint } from './webhooks.types';
import { mapWebhook } from './webhooks.mapper';

export function useWebhooks() {
  return useQuery<WebhookEndpoint[]>({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const hooks = await getWebhooks();
      return hooks.map(mapWebhook);
    },
  });
}

export function useSaveWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => createWebhook(url),
    onSuccess: () => {
      toast.success('Webhook saved');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
    onError: (error) => {
      console.error('[useSaveWebhook] error', error);
      toast.error('Failed to save webhook');
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWebhook(id),
    onSuccess: () => {
      toast.success('Webhook deleted');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
    onError: (error) => {
      console.error('[useDeleteWebhook] error', error);
      toast.error('Failed to delete webhook');
    },
  });
}
