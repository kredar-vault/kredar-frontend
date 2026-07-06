export interface TransactionItem {
  id: string;
  name?: string;
  customerName?: string;
  customer?: {
    name: string;
    [key: string]: any;
  };
  date?: string;
  createdAt?: string;
  amount: number;
  status: string;
  type?: string;
  currency?: string;
  avatar?: string;
}

export interface CreateTransactionPayload {
  customerId?: string;
  paymentReference?: string;
  amount: number;
  fee?: number;
  currency: string;
  paymentMethod?: string;
  dedicatedAccountNumber?: string;
  narration?: string;
  expectedAmount?: number;
}

export interface CustomerTransactionStats {
  totalAmount: number;
  count: number;
  successfulCount: number;
  failedCount: number;
}
