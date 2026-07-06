export interface SettlementSettings {
  settlementAccountNumber?: string;
  settlementBankCode?: string;
  settlementAccountName?: string;
  autoSettle: boolean;
  minPayoutNaira: number;
}

export interface SplitLeg {
  beneficiaryName: string;
  accountNumber: string;
  bankCode: string;
  basis: string;
  shareBps: number;
  flatNaira: number;
}

export interface SplitSettings {
  splits: SplitLeg[];
}
