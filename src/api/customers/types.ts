export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  dedicatedAccountNumber: string;
  bankName: string;
}

export interface DedicatedAccount {
  id: string;
  accountRef: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  expectedAmountKobo: number;
  amountPaidKobo: number;
  deficitKobo: number;
  overpaymentKobo: number;
  status: string;
  paymentState: string;
  subMerchantId: string;
  expiryDateUtc: string;
  createdAtUtc: string;
}

export interface CustomerTransaction {
  id: string;
  amount: string;
  date: string;
  status: string;
}

export interface CustomerTransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalAmount: number;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface DedicatedAccountPayload {
  customerId: string;
  expectedAmount: number;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  restrictedCustomers: number;
}

export interface CustomerKyc {
  customerId: string;
  status: string; // e.g. 'NotSubmitted' | 'Pending' | 'Approved' | 'Rejected'
  documents: KycDocument[];
}

export type KycDocumentType =
  'ProofOfAddress' | 'IdCard' | 'UtilityBill' | 'BusinessCertificate' | string;
export type KycDocumentStatus = 'Pending' | 'Verified' | 'Rejected' | string;

export interface KycDocument {
  id: string;
  documentType: KycDocumentType;
  fileUrl: string;
  status: KycDocumentStatus;
  createdAt?: string;
}

export interface SubmitKycPayload {
  documentType: KycDocumentType;
  fileUrl: string;
}
