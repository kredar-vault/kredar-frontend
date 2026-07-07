import { Customer } from './types';

export function mapCustomer(data: any): Customer {
  return {
    id: data.id ?? data.customerId ?? '',
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    fullName: data.fullName ?? data.name ?? `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
    email: data.email ?? '',
    phoneNumber: data.phoneNumber ?? data.phone ?? '',
    status: data.status ?? 'Pending',
    createdAt: data.createdAt ?? data.createdAtUtc ?? data.registrationDate ?? '',
    dedicatedAccountNumber:
      data.dedicatedAccountNumber ??
      data.accountNumber ??
      data.dedicatedAccount?.accountNumber ??
      '',
    bankName: data.bankName ?? data.dedicatedAccount?.bankName ?? '',
  };
}
