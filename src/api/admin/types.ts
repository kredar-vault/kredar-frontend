export interface AdminLoginPayload {
  email?: string;
  password?: string;
  totpCode?: string;
}

export interface VerifyMfaPayload {
  code: string;
}

export interface CreateAdminPayload {
  email?: string;
  password?: string;
  role?: string;
}

export interface ReviewTenantPayload {
  reason?: string;
}

export interface AdminTenantItem {
  id: string;
  email: string;
  businessName?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | string;
  createdAt: string;
}

export interface AdminReconciliationItem {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
  matchedAt?: string;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: string;
}
