export interface SubMerchant {
  id: string;
  name: string;
  reference: string;
  createdAt?: string;
  payoutConfig?: {
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
    platformFeeBps: number;
  };
}

export interface CreateSubMerchantPayload {
  name: string;
  reference: string;
}

export interface SetSubMerchantPayoutPayload {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  platformFeeBps: number;
}
