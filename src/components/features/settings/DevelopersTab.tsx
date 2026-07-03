'use client';

import { Plus, Trash2, MoreVertical } from 'lucide-react';

interface ApiKey {
  id: number;
  name: string;
  keyString: string;
}

interface DevelopersTabProps {
  apiKeys: ApiKey[];
  onCreateKey: () => void;
  onDeleteKey: (id: number) => void;
}

export default function DevelopersTab({ apiKeys, onCreateKey, onDeleteKey }: DevelopersTabProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Segment 1: API Keys list */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#081b10]">API Keys</h3>

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-4 border border-[#d8e1da] rounded-xl bg-white text-sm"
            >
              <span className="font-semibold text-[#081b10]">{key.name}</span>
              <code className="text-xs text-[#45504b] font-mono select-all bg-[#f7faf6] px-2.5 py-1 rounded border border-[#ebebeb] max-w-[240px] truncate">
                {key.keyString}
              </code>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDeleteKey(key.id)}
                  className="text-[#ef4444] hover:text-red-600 transition-colors p-1.5 hover:bg-[#fff0f0] rounded-lg"
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
          ))}
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
    </div>
  );
}
export type { ApiKey };
