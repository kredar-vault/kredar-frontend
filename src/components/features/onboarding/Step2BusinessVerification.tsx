'use client';

import { useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import DocUploadCard, { UploadingFileState } from './DocUploadCard';

export interface Step2Data {
  certificate: File | null;
  proofOfAddress: File | null;
}

interface Props {
  defaultValues: Step2Data | null;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

export default function Step2BusinessVerification({ defaultValues, onNext, onBack }: Props) {
  const certInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const getInitialFile = (
    id: 'certificate' | 'proofOfAddress',
    fileVal?: File | null,
  ): UploadingFileState | null =>
    fileVal ? { id, name: fileVal.name, file: fileVal, progress: 100, status: 'complete' } : null;

  const [files, setFiles] = useState<{
    certificate: UploadingFileState | null;
    proofOfAddress: UploadingFileState | null;
  }>({
    certificate: getInitialFile('certificate', defaultValues?.certificate),
    proofOfAddress: getInitialFile('proofOfAddress', defaultValues?.proofOfAddress),
  });

  const [attempted, setAttempted] = useState(false);

  // Simulation parameters
  const simulateUpload = (id: 'certificate' | 'proofOfAddress', file: File) => {
    setFiles((prev) => ({
      ...prev,
      [id]: {
        id,
        name: file.name,
        file,
        progress: 10,
        status: 'uploading',
      },
    }));

    let currentProgress = 10;
    const shouldFail = Math.random() < 0.2;
    const failAt = 50 + Math.floor(Math.random() * 30);

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;

      if (shouldFail && currentProgress >= failAt) {
        currentProgress = failAt;
        clearInterval(interval);
        setFiles((prev) => {
          const current = prev[id];
          if (!current) return prev;
          return {
            ...prev,
            [id]: {
              ...current,
              progress: currentProgress,
              status: 'failed',
            },
          };
        });
        return;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setFiles((prev) => {
          const current = prev[id];
          if (!current) return prev;
          return {
            ...prev,
            [id]: {
              ...current,
              progress: 100,
              status: 'complete',
            },
          };
        });
      } else {
        setFiles((prev) => {
          const current = prev[id];
          if (!current) return prev;
          return {
            ...prev,
            [id]: {
              ...current,
              progress: currentProgress,
            },
          };
        });
      }
    }, 150);
  };

  const handleFileChange = (
    id: 'certificate' | 'proofOfAddress',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(id, file);
    }
  };

  const handleRemove = (id: 'certificate' | 'proofOfAddress') => {
    setFiles((prev) => ({
      ...prev,
      [id]: null,
    }));
  };

  const handleRetry = (id: 'certificate' | 'proofOfAddress') => {
    const current = files[id];
    if (current?.file) {
      simulateUpload(id, current.file);
    }
  };

  const handleNext = () => {
    setAttempted(true);
    const certValid = files.certificate && files.certificate.status === 'complete';
    const proofValid = files.proofOfAddress && files.proofOfAddress.status === 'complete';

    if (certValid && proofValid) {
      onNext({
        certificate: files.certificate!.file,
        proofOfAddress: files.proofOfAddress!.file,
      });
    }
  };

  return (
    <div className="bg-white rounded-md  px-10 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#081b10]">Business Verification</h1>
        <p className="mt-1.5 text-sm text-[#45504b]">
          Upload your documents to complete business verification
        </p>
      </div>

      <div className="space-y-6">
        {/* Certificate Upload */}
        <DocUploadCard
          id="certificate"
          label="Certificate of incorporation*"
          fileState={files.certificate}
          inputRef={certInputRef}
          onFileChange={(e) => handleFileChange('certificate', e)}
          onRemove={() => handleRemove('certificate')}
          onRetry={() => handleRetry('certificate')}
        />

        {/* Proof of Address Upload */}
        <DocUploadCard
          id="proofOfAddress"
          label="Proof of business address*"
          fileState={files.proofOfAddress}
          inputRef={proofInputRef}
          onFileChange={(e) => handleFileChange('proofOfAddress', e)}
          onRemove={() => handleRemove('proofOfAddress')}
          onRetry={() => handleRetry('proofOfAddress')}
        />
      </div>

      {attempted &&
        !(
          files.certificate?.status === 'complete' && files.proofOfAddress?.status === 'complete'
        ) && (
          <p className="kredar-error-text text-sm">
            Please upload both files and wait for completion before proceeding.
          </p>
        )}

      {/* Notice info */}
      <div className="flex items-start gap-2 text-sm text-[#45504b] pt-2">
        <AlertCircle size={15} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
        <span>
          Documents are encrypted and stored securely. Verification typically takes 1 to 2 business
          days. You will be notified via email once the review is complete
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="kredar-btn-outline">
          Back
        </button>
        <button type="button" onClick={handleNext} className="kredar-btn-primary">
          Next
        </button>
      </div>
    </div>
  );
}
