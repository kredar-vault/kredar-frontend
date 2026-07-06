export interface KycDocument {
  id: string;
  documentType: 'GovernmentId' | 'ProfileImage' | 'ProofOfAddress' | string;
  fileUrl: string;
  status: 'Pending' | 'Verified' | 'Rejected' | string;
  createdAt?: string;
}

export interface SubmitKycPayload {
  documentType: 'GovernmentId' | 'ProfileImage' | 'ProofOfAddress' | string;
  fileUrl: string;
}

export interface UpdateKycStatusPayload {
  status: 'Pending' | 'Verified' | 'Rejected' | string;
}
