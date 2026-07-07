'use client';

import { FileText, Trash2, Upload, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadingFileState {
  id: 'certificate' | 'proofOfAddress';
  name: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'failed';
}

interface DocUploadCardProps {
  id: 'certificate' | 'proofOfAddress';
  label: string;
  fileState: UploadingFileState | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onRetry: () => void;
}

export default function DocUploadCard({
  id,
  label,
  fileState,
  inputRef,
  onFileChange,
  onRemove,
  onRetry,
}: DocUploadCardProps) {
  return (
    <div className="space-y-2">
      <label className="kredar-label">{label}</label>

      {fileState ? (
        <div className="border border-[#d8e1da] rounded-xl p-4 bg-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f7faf6] rounded-lg flex items-center justify-center border border-[#d8e1da] flex-shrink-0">
              <FileText size={20} className="text-[#45504b]" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <p className="text-sm font-semibold text-[#081b10] truncate">{fileState.name}</p>

              {/* Status information */}
              {fileState.status === 'uploading' && (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 size={13} className="text-[#4f46e5] animate-spin" />
                  <span className="text-xs text-[#4f46e5] font-semibold">
                    Uploading... {fileState.progress}%
                  </span>
                </div>
              )}

              {fileState.status === 'complete' && (
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle2 size={13} className="text-[#0f8b4b]" />
                  <span className="text-xs text-[#0f8b4b] font-semibold">Upload complete</span>
                </div>
              )}

              {fileState.status === 'failed' && (
                <div className="flex items-center gap-1.5 mt-1">
                  <XCircle size={13} className="text-[#ef4444]" />
                  <span className="text-xs text-[#ef4444] font-semibold">
                    Connection drop.{' '}
                    <button
                      type="button"
                      onClick={onRetry}
                      className="text-[#4f46e5] hover:underline font-bold inline-flex items-center gap-0.5 ml-1"
                    >
                      <RefreshCw size={10} /> Retry upload
                    </button>
                  </span>
                </div>
              )}

              {/* Upload Progress Bar */}
              <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-md overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-150 ease-out rounded-md',
                    fileState.status === 'uploading' && 'bg-[#4f46e5]',
                    fileState.status === 'complete' && 'bg-[#0f8b4b]',
                    fileState.status === 'failed' && 'bg-[#ef4444]',
                  )}
                  style={{ width: `${fileState.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Delete Action button */}
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-4 right-4 text-[#ef4444] hover:text-red-600 transition-colors p-1.5 hover:bg-[#fff0f0] rounded-lg"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ) : (
        /* Empty Upload area container */
        <div
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-[#d8e1da] hover:border-[#0f8b4b] rounded-xl p-8 bg-[#f7faf6]/20 hover:bg-[#f7faf6]/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center"
        >
          <input
            type="file"
            ref={inputRef as any}
            onChange={onFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-md bg-white border border-[#d8e1da] flex items-center justify-center text-[#45504b] ">
            <Upload size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#081b10]">Click to upload or drag and drop</p>
            <p className="text-xs text-[#45504b] mt-1">PDF, PNG, JPG or JPEG (max. 10MB)</p>
          </div>
        </div>
      )}
    </div>
  );
}
export type { UploadingFileState };
