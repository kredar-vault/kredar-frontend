export interface TenantProfile {
  businessName: string;
  businessRegistrationNumber: string;
  businessType: string;
  industry: string;
  country: string;
  businessAddress: string;
  phoneNumber: string;
  website: string;
}

export type UpdateTenantProfilePayload = TenantProfile;
