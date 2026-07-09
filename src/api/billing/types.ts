export interface BillingSchedule {
  id: string;
  reference: string | null;
  accountRef: string;
  interval: string;
  status: 'Active' | 'Paused' | 'Cancelled' | string;
  nextAmountKobo: number;
  dueOffsetDays: number;
  periodsGenerated: number;
  carryCreditKobo: number;
  currentPeriodEndUtc: string | null;
  description: string | null;
  createdAtUtc: string;
}

export interface BillingPeriod {
  id: string;
  sequence: number;
  status: 'Open' | 'Paid' | 'Overdue' | string;
  expectedAmountKobo: number;
  amountAttributedKobo: number;
  outstandingKobo: number;
  periodStartUtc: string;
  periodEndUtc: string;
  dueDateUtc: string;
  paidAtUtc: string | null;
}

export interface CreateBillingSchedulePayload {
  accountRef: string;
  interval: string;
  amountKobo: number;
  dueOffsetDays?: number;
  description?: string;
  reference?: string;
}
