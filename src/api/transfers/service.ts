import { api } from '@/lib/api';
import {
  BankLookupPayload,
  BankLookupResponse,
  CreateTransferPayload,
  TransferDetails,
} from './types';

const extractData = (res: any) => {
  if (res?.data && 'data' in res.data) {
    return res.data.data;
  }
  return res?.data;
};

export async function lookupBankAccount(payload: BankLookupPayload): Promise<BankLookupResponse> {
  const res = await api.post('/transfers/bank/lookup', payload);
  return extractData(res);
}

export async function createTransfer(payload: CreateTransferPayload): Promise<TransferDetails> {
  const res = await api.post('/transfers/bank', payload);
  return extractData(res);
}
