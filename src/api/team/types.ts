export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  dateAdded: string;
}

export interface CreateTeamMemberPayload {
  fullName: string;
  email: string;
  role: string;
}

export interface UpdateTeamMemberPayload {
  fullName: string;
  email: string;
  role: string;
}
