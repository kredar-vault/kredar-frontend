import { api } from '@/lib/api';
import { CreateCustomerPayload, DedicatedAccountPayload } from './types';

// Helper function to safely extract payload without passing full Axios configurations down the line
const extractData = (res: any) => {
  if (res?.data && 'data' in res.data) {
    return res.data.data;
  }
  return res?.data;
};

export async function getCustomers() {
  const res = await api.get('/customers');
  const data = extractData(res);
  return Array.isArray(data) ? data : [];
}

export async function getDedicatedAccounts() {
  const res = await api.get('/dedicated-accounts');
  const data = extractData(res);
  return Array.isArray(data) ? data : [];
}

export async function getActiveCustomers() {
  const res = await api.get('/customers/active');
  const data = extractData(res);
  return Array.isArray(data) ? data : [];
}

export async function getInactiveCustomers() {
  const res = await api.get('/customers/inactive');
  const data = extractData(res);
  return Array.isArray(data) ? data : [];
}

export async function getCustomerStats() {
  const res = await api.get('/customers/stats');
  return extractData(res);
}

export async function getCustomer(id: string) {
  const res = await api.get(`/customers/${id}`);
  return extractData(res);
}
export async function generateVirtualAccount(customerId: string) {
  // Matches your exact POST request signature profile
  const res = await api.post('/dedicated-accounts', {
    customerId: customerId,
    expectedAmount: 0, // Default baseline required parameter
  });
  return res.data?.data ?? res.data;
}
export async function getCustomerTransactions(customerId: string) {
  const res = await api.get(`/customers/${customerId}/transactions`);
  const data = extractData(res);
  const transactionList = Array.isArray(data) ? data : [];

  return transactionList.map((tx: any) => {
    let formattedAmount = '₦0';
    if (typeof tx.amount === 'number') {
      formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }).format(tx.amount);
    } else if (tx.amount) {
      formattedAmount = tx.amount;
    }

    let formattedDate = '';
    const rawDate = tx.createdAt || tx.date || tx.createdAtUtc;
    if (rawDate) {
      formattedDate = new Date(rawDate).toLocaleDateString();
    }

    return {
      id: tx.id || tx.transactionId || '',
      amount: formattedAmount,
      date: formattedDate,
      status: tx.status || 'Pending',
    };
  });
}

export async function getCustomerTransactionStats(customerId: string) {
  const res = await api.get(`/customers/${customerId}/transactions/stats`);
  return extractData(res);
}

export async function createCustomer(payload: CreateCustomerPayload) {
  const res = await api.post('/customers', payload);
  return extractData(res);
}

export async function createCustomerWithDedicatedAccount(payload: CreateCustomerPayload) {
  const customer = await createCustomer(payload);
  if (!customer) {
    throw new Error('Customer creation failed. Service returned empty response.');
  }

  const customerId = customer.id ?? customer.customerId;
  if (!customerId) {
    throw new Error('Customer ID not returned from service initialization.');
  }

  return customer;
}

export async function updateCustomerStatus(id: string, status: string) {
  const res = await api.patch(`/customers/${id}/status`, { status });
  return extractData(res);
}

export async function getCustomerKyc(customerId: string) {
  const res = await api.get(`/customers/${customerId}/kyc`);
  return extractData(res);
}

export async function submitCustomerKyc(
  customerId: string,
  payload: { documentType: string; fileUrl: string },
) {
  const res = await api.post(`/customers/${customerId}/kyc`, payload);
  return extractData(res);
}

export async function updateKycDocumentStatus(docId: string, status: string) {
  const res = await api.patch(`/customers/kyc/${docId}/status`, { status });
  return extractData(res);
}
