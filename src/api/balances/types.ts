export interface DedicatedAccount {
  id?: string;
  balance?: number;
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
  customerId?: string;
  status?: string;
}

export interface BankLookupPayload {
  accountNumber: string;
  bankCode: string;
}

export interface BankLookupResponse {
  accountName: string;
}
