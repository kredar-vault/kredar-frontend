'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, MoreVertical, ShieldCheck, Check } from 'lucide-react';
import { ApiKeyItem } from '@/api/api-keys/types';
import { WebhookEndpoint } from '@/api/webhooks/types';

interface DevelopersTabProps {
  apiKeys: ApiKeyItem[];
  webhooks: WebhookEndpoint[];
  onCreateKey: () => void;
  onDeleteKey: (id: string) => void;
  onSaveWebhook: (url: string) => void;
  onDeleteWebhook: (id: string) => void;
}

export default function DevelopersTab({
  apiKeys,
  webhooks,
  onCreateKey,
  onDeleteKey,
  onSaveWebhook,
  onDeleteWebhook,
}: DevelopersTabProps) {
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (webhooks && webhooks.length > 0) {
      setWebhookUrl(webhooks[0].url);
    } else {
      setWebhookUrl('');
    }
  }, [webhooks]);

  const handleSaveWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    onSaveWebhook(webhookUrl.trim());
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Segment 1: API Keys list */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#081b10]">API Keys</h3>

        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <p className="text-sm text-[#45504b] py-2">No API keys created yet.</p>
          ) : (
            apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 border border-[#d8e1da] rounded-xl bg-white text-sm"
              >
                <span className="font-semibold text-[#081b10]">{key.name}:</span>
                <code className="text-xs text-[#45504b] font-mono select-all bg-[#f7faf6] px-2.5 py-1 rounded border border-[#ebebeb] max-w-[240px] truncate">
                  {key.keyString}
                </code>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDeleteKey(key.id)}
                    className="text-[#ef4444] hover:text-red-600 transition-colors p-1.5 hover:bg-[#fff0f0] rounded-lg"
                    title="Delete API Key"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    type="button"
                    className="text-[#45504b] p-1.5 rounded-lg hover:bg-[#f3f4f6]"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onCreateKey}
          className="kredar-btn-primary h-9 text-xs font-semibold px-4 flex items-center gap-1.5"
        >
          <Plus size={14} />
          Create API Key
        </button>
      </div>

      <hr className="border-[#f0f4f1]" />

      {/* Segment 2: Webhooks (as pictured in Figma) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#081b10]">Webhooks</h3>

        <form onSubmit={handleSaveWebhookSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="kredar-label">Full name</label>
            <input
              type="text"
              placeholder="https://your-server.com/webhooks"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="kredar-input"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="kredar-btn-primary h-9 text-xs font-semibold px-4 flex items-center gap-1.5"
            >
              <Plus size={14} />
              Save webhook
            </button>

            {webhooks.length > 0 && (
              <button
                type="button"
                onClick={() => onDeleteWebhook(webhooks[0].id)}
                className="kredar-btn-outline h-9 text-xs font-semibold px-4 flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete webhook
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export type { ApiKeyItem };
