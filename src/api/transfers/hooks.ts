import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lookupBankAccount, createTransfer } from './service';
import { BankLookupPayload, CreateTransferPayload } from './types';

export function useLookupBankAccount() {
  return useMutation({
    mutationFn: (payload: BankLookupPayload) => lookupBankAccount(payload),
    onError: (error) => {
      console.error('[useLookupBankAccount] error', error);
      toast.error('Could not verify account. Check the details and try again.');
    },
  });
}

export function useCreateTransfer() {
  return useMutation({
    mutationFn: (payload: CreateTransferPayload) => createTransfer(payload),
    onSuccess: () => {
      toast.success('Withdrawal initiated');
    },
    onError: (error) => {
      console.error('[useCreateTransfer] error', error);
      toast.error('Withdrawal failed. Please try again.');
    },
  });
}
