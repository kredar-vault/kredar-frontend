export interface TeamMemberItem {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee' | 'Developer' | string;
  createdAt?: string;
}

export interface InviteTeamMemberPayload {
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee' | 'Developer' | string;
}

export interface UpdateTeamMemberPayload {
  fullName?: string;
  role: 'Admin' | 'Employee' | 'Developer' | string;
}
