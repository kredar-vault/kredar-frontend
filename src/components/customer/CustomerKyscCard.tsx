'use client';

import { useState } from 'react';
import { Loader2, FileText, Check, X, Plus } from 'lucide-react';
import {
  useCustomerKyc,
  useSubmitCustomerKyc,
  useUpdateKycDocumentStatus,
} from '@/api/customers/hooks';

interface CustomerKycCardProps {
  customerId: string;
}

const statusStyles: Record<string, string> = {
  Verified: 'bg-[#ECFDF3] text-[#027A48]',
  Pending: 'bg-[#FFFAEB] text-[#B54708]',
  Rejected: 'bg-[#FEF3F2] text-[#B42318]',
};

const documentTypes = ['ProofOfAddress', 'IdCard', 'UtilityBill', 'BusinessCertificate'];

export default function CustomerKycCard({ customerId }: CustomerKycCardProps) {
  const { data, isLoading } = useCustomerKyc(customerId);
  const submitMutation = useSubmitCustomerKyc(customerId);
  const updateStatusMutation = useUpdateKycDocumentStatus(customerId);

  const [showForm, setShowForm] = useState(false);
  const [documentType, setDocumentType] = useState(documentTypes[0]);
  const [fileUrl, setFileUrl] = useState('');

  // Defensive handling: backend response shape for GET isn't confirmed yet,
  // so this supports either a raw array of documents, or an object with a `documents` array.
  const documents: any[] = Array.isArray(data) ? data : (data?.documents ?? []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl.trim()) return;
    try {
      await submitMutation.mutateAsync({ documentType, fileUrl: fileUrl.trim() });
      setShowForm(false);
      setFileUrl('');
    } catch {
      // error toast already handled in useSubmitCustomerKyc
    }
  };

  const handleUpdateStatus = async (docId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ docId, status });
    } catch {
      // error toast already handled in useUpdateKycDocumentStatus
    }
  };

  return (
    <div className="bg-white rounded-md border border-[#EAECF0] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#101828]">KYC Documents</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0f8b4b] hover:text-[#0c7640]"
        >
          <Plus size={14} />
          Add document
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 p-4 bg-[#F9FAFB] rounded-lg space-y-3">
          <div>
            <label className="text-xs font-medium text-[#45504b]">Document type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg bg-white"
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#45504b]">File URL</label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 h-9 px-3 text-sm border border-[#d8e1da] rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="h-8 text-xs font-semibold px-3 rounded-lg border border-[#d8e1da] text-[#45504b]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="h-8 text-xs font-semibold px-3 rounded-lg bg-[#0f8b4b] text-white flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="py-6 flex justify-center">
          <Loader2 size={20} className="animate-spin text-[#667085]" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-sm text-[#667085] py-2">No KYC documents submitted yet.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border border-[#EAECF0] rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#667085]" />
                <div>
                  <p className="text-sm font-semibold text-[#101828]">{doc.documentType}</p>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0f8b4b] hover:underline"
                    >
                      View document
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                    statusStyles[doc.status] ?? statusStyles.Pending
                  }`}
                >
                  {doc.status}
                </span>

                {doc.status === 'Pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(doc.id, 'Verified')}
                      disabled={updateStatusMutation.isPending}
                      className="text-[#027A48] hover:bg-[#ECFDF3] p-1.5 rounded-lg"
                      title="Approve"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(doc.id, 'Rejected')}
                      disabled={updateStatusMutation.isPending}
                      className="text-[#B42318] hover:bg-[#FEF3F2] p-1.5 rounded-lg"
                      title="Reject"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
