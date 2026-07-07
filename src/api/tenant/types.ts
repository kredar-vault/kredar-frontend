export interface ProfileData {
  businessName: string;
  legalName?: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  country: string;
  businessAddress: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  website: string;
}

export interface OnboardingStatus {
  status: 'Draft' | 'UnderReview' | 'Approved' | 'Rejected' | string;
  [key: string]: any;
}

export interface OnboardingSubmitPayload {
  legalName?: string;
  registrationNumber?: string | null;
  businessType?: string;
  industry?: string;
  country?: string;
  address?: string;
  contactPhone?: string;
  website?: string | null;
  settlementBankName?: string;
  settlementBankCode?: string;
  settlementAccountName?: string;
  settlementAccountNumber?: string;
}
