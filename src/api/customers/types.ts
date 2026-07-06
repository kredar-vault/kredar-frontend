export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationDate: string;
  avatar: string;
}

export interface CustomerTransaction {
  id: string;
  date: string;
  amount: number | string;
  status: string;
  currency?: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  restrictedCustomers: number;
}
