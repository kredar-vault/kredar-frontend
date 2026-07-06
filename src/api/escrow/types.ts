export interface EscrowHoldPayload {
  releaseCondition?: string;
}

export interface EscrowResponse {
  isSuccess: boolean;
  message?: string;
}
