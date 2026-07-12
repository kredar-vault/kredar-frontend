'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, MoreVertical, RotateCw, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { ApiKeyItem } from '@/api/api-keys/types';
import { WebhookEndpoint } from '@/api/webhooks/types';
import Button from '../landing/Button';

interface DevelopersTabProps {
  apiKeys: ApiKeyItem[];
  webhooks: WebhookEndpoint[];
  onCreateKey: () => void;
  onDeleteKey: (id: string) => void;
  onRotateKey: (id: string) => void;
  onSaveWebhook: (url: string) => void;
  onDeleteWebhook: (id: string) => void;
  newKeySecret?: string | null;
  onCloseNewKeyModal?: () => void;
}

function maskKey(key: string) {
  if (!key) return '••••••••••••';
  const visible = key.slice(-4);
  return `••••••••${visible}`;
}

export default function DevelopersTab({
  apiKeys,
  webhooks,
  onCreateKey,
  onDeleteKey,
  onRotateKey,
  onSaveWebhook,
  onDeleteWebhook,
  newKeySecret,
  onCloseNewKeyModal,
}: DevelopersTabProps) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedModal, setCopiedModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (webhooks && webhooks.length > 0) {
      setWebhookUrl(webhooks[0].url);
    } else {
      setWebhookUrl('');
    }
  }, [webhooks]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    onSaveWebhook(webhookUrl.trim());
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      onDeleteKey(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const toggleVisible = (id: string) => {
    setVisibleKeyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('[DevelopersTab] copy failed', err);
    }
  };

  const handleCopyModal = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedModal(true);
      setTimeout(() => setCopiedModal(false), 1500);
    } catch (err) {
      console.error('[DevelopersTab] copy failed', err);
    }
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
            apiKeys.map((key) => {
              const isVisible = visibleKeyIds.has(key.id);
              const displayValue = isVisible ? key.keyString : maskKey(key.keyString);

              return (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border border-[#d8e1da] rounded-xl bg-white text-sm relative gap-3"
                >
                  <span className="font-semibold text-[#081b10] shrink-0">
                    {key.label || 'API Key'}
                  </span>

                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <code className="text-xs text-[#45504b] font-mono bg-[#f7faf6] px-2.5 py-1 rounded border border-[#ebebeb] max-w-[220px] truncate">
                      {displayValue}
                    </code>

                    <Button
                      type="button"
                      onClick={() => toggleVisible(key.id)}
                      className="text-[#45504b] p-1.5 rounded-lg hover:bg-[#f3f4f6]"
                      title={isVisible ? 'Hide key' : 'Show key'}
                    >
                      {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleCopy(key.id, key.keyString)}
                      className="text-[#45504b] p-1.5 rounded-lg hover:bg-[#f3f4f6]"
                      title="Copy key"
                    >
                      {copiedId === key.id ? (
                        <Check size={15} className="text-green-600" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      onClick={() => setConfirmDeleteId(key.id)}
                      className="text-[#ef4444] hover:text-red-600 transition-colors p-1.5 hover:bg-[#fff0f0] rounded-lg"
                      title="Delete API Key"
                    >
                      <Trash2 size={16} />
                    </Button>

                    <div className="relative" ref={openMenuId === key.id ? menuRef : null}>
                      <Button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === key.id ? null : key.id)}
                        className="text-[#45504b] p-1.5 rounded-lg hover:bg-[#f3f4f6]"
                      >
                        <MoreVertical size={16} />
                      </Button>

                      {openMenuId === key.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-[#d8e1da] rounded-lg shadow-md py-1 min-w-[140px]">
                          <Button
                            type="button"
                            onClick={() => {
                              onRotateKey(key.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#081b10] hover:bg-[#f7faf6]"
                          >
                            <RotateCw size={14} />
                            Rotate key
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Button
          type="button"
          onClick={onCreateKey}
          className="kredar-btn-primary h-9 text-xs font-semibold px-4 flex items-center gap-1.5"
        >
          <Plus size={14} />
          Create API Key
        </Button>
      </div>

      <hr className="border-[#f0f4f1]" />

      {/* Segment 2: Webhooks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#081b10]">Webhooks</h3>

        <form onSubmit={handleSaveWebhookSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="kredar-label">Webhook URL</label>
            <input
              type="text"
              placeholder="https://your-server.com/webhooks"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="kredar-input"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="kredar-btn-primary h-9 text-xs font-semibold px-4 flex items-center gap-1.5"
            >
              <Plus size={14} />
              Save webhook
            </Button>

            {webhooks.length > 0 && (
              <Button
                type="button"
                onClick={() => onDeleteWebhook(webhooks[0].id)}
                className="kredar-btn-outline h-9 text-xs font-semibold px-4 flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete webhook
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h4 className="text-base font-bold text-[#081b10]">Delete API key?</h4>
            <p className="text-sm text-[#45504b]">
              This action can&apos;t be undone. Any integrations using this key will stop working
              immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="kredar-btn-outline h-9 text-xs font-semibold px-4"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="h-9 text-xs font-semibold px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New key reveal modal — shows ONCE right after creation */}
      {newKeySecret && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h4 className="text-base font-bold text-[#081b10]">API key created</h4>
            <p className="text-sm text-[#45504b]">
              Copy this key now. For security, you won&apos;t be able to see it again after closing
              this window.
            </p>

            <div className="flex items-center gap-2 bg-[#f7faf6] border border-[#ebebeb] rounded-lg px-3 py-2">
              <code className="text-xs font-mono text-[#081b10] break-all flex-1">
                {newKeySecret}
              </code>
              <Button
                type="button"
                onClick={() => handleCopyModal(newKeySecret)}
                className="text-[#45504b] p-1.5 rounded-lg hover:bg-white shrink-0"
                title="Copy key"
              >
                {copiedModal ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </Button>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={onCloseNewKeyModal}
                className="kredar-btn-primary h-9 text-xs font-semibold px-4"
              >
                Done, I&apos;ve copied it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { ApiKeyItem };
