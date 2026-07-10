'use client';

import { useMemo } from 'react';
import { useCustomers } from '@/api/customers/hooks';

export function useCustomerMap() {
  const { data: customers = [], isLoading } = useCustomers();

  const customerMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);

  return { customerMap, isLoading };
}
