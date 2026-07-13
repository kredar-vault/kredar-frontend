export interface TransactionItem {
  id: string;
  name?: string;
  customerId?: string;
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
  narration?: string;
  reference?: string;
  fee?: number | string;
  time?: string;
  accountNumber?: string;
  method?: string;
  expectedAmount?: number | string;
  receivedAmount?: number | string;
  difference?: number | string;
  direction?: 'in' | 'out';
  createdAt?: string;
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
