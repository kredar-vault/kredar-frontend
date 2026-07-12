'use client';

import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCreateCustomer } from '@/api/customers/hooks';
import Button from '../features/landing/Button';

export default function CustomerForm() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCustomer.mutateAsync(formData);
      toast.success('Customer register completed and dynamic ledger active.');
      router.push('/dashboard/customers');
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Failed to create customer record.');
    }
  };

  const fields = [
    { label: 'First Name', name: 'firstName', placeholder: 'e.g. Tunde', type: 'text' },
    { label: 'Last Name', name: 'lastName', placeholder: 'e.g. Adebayo', type: 'text' },
    { label: 'Email Address', name: 'email', placeholder: 'tunde@example.com', type: 'email' },
    { label: 'Phone Number', name: 'phoneNumber', placeholder: '+234 801 234 5678', type: 'tel' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#eef2ef] rounded-md p-6 md:p-8  max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h3 className="text-base font-bold text-[#081b10]">Register New Customer</h3>
        <p className="text-[11px] text-[#667085] font-medium mt-0.5">
          Establishes secure node structures inside ledger frameworks
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-[#45504b] tracking-wide">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              required
              placeholder={field.placeholder}
              className="h-10 w-full rounded-xl border border-[#eef2ef] px-3.5 text-xs font-medium text-[#081b10] placeholder-[#667085]/60 outline-none transition-all duration-200 focus:border-[#0f8b4b] focus:ring-2 focus:ring-[#0f8b4b]/5 bg-[#f7faf6]/20"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={createCustomer.isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#0a2e1f] to-[#041910] hover:from-[#0d3d29] hover:to-[#072619] px-5 text-xs font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 "
        >
          {createCustomer.isPending ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Provisioning Profile...</span>
            </>
          ) : (
            <>
              <span>Create Customer</span>
              <ArrowRight size={13} className="text-white/70" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
