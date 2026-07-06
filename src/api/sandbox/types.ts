export interface SimulateDepositPayload {
  accountReference: string;
  amountNaira: number;
  senderName?: string;
  reversal?: boolean;
}

export interface SimulationResponse {
  isSuccess: boolean;
  message?: string;
  transactionId?: string;
}
