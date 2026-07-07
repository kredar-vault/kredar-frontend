export interface CreateCheckoutSessionPayload {
  accountReference: string;
  ttlSeconds?: number;
}

export interface CheckoutSessionDetails {
  token: string;
  accountReference: string;
  amount?: number;
  status: string;
  expiresAt: string;
}
