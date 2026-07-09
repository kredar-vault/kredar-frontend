'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StickyNote, Trash2, Plus, Loader2 } from 'lucide-react';

export default function CustomerNotes({ customerId }: { customerId: string }) {
  const [content, setContent] = useState('');
  const qc = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['customer-notes', customerId],
    queryFn: async () => {
      const res = await api.get(`/customers/${customerId}/notes`);
      return res.data?.data ?? [];
    },
  });

  const addNote = useMutation({
    mutationFn: (text: string) => api.post(`/customers/${customerId}/notes`, { content: text }),
    onSuccess: () => {
      setContent('');
      qc.invalidateQueries({ queryKey: ['customer-notes', customerId] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: (id: string) => api.delete(`/notes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer-notes', customerId] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) addNote.mutate(content.trim());
  };

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note about this customer..."
          rows={2}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30 focus:border-[#0f8b4b]"
        />
        <button
          type="submit"
          disabled={!content.trim() || addNote.isPending}
          className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f8b4b] text-white text-xs font-semibold hover:bg-[#0c7640] disabled:opacity-50 transition-colors"
        >
          {addNote.isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Add
        </button>
      </form>

      {/* Notes list */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !notes.length ? (
        <div className="py-10 text-center text-sm text-gray-400">
          <StickyNote size={28} className="mx-auto mb-2 text-gray-300" />
          No notes yet
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note: any) => (
            <div
              key={note.id}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {note.createdByEmail ?? 'Unknown'} &middot;{' '}
                  {new Date(note.createdAt).toLocaleString('en-NG', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteNote.mutate(note.id)}
                disabled={deleteNote.isPending}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                title="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
