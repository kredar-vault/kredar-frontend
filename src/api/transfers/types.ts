export interface BankLookupPayload {
  accountNumber: string;
  bankCode: string;
}

export interface BankLookupResponse {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

export interface CreateTransferPayload {
  merchantTxRef: string;
  amount: number;
  accountNumber: string;
  bankCode: string;
  narration?: string;
}

export interface TransferDetails {
  id: string;
  merchantTxRef: string;
  amount: number;
  accountNumber: string;
  accountName?: string;
  bankCode: string;
  status: 'Pending' | 'Success' | 'Failed' | string;
  createdAt: string;
}
