'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { TeamMember } from '@/api/team/types';
import Button from '../landing/Button';

interface TeamMemberModalProps {
  open: boolean;
  member?: TeamMember | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; email: string; role: string }) => void;
}

export default function TeamMemberModal({
  open,
  member,
  loading = false,
  onClose,
  onSubmit,
}: TeamMemberModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');

  useEffect(() => {
    if (member) {
      setFullName(member.fullName);
      setEmail(member.email);
      setRole(member.role);
    } else {
      setFullName('');
      setEmail('');
      setRole('Employee');
    }
  }, [member, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim()) return;

    onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf2ee] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#081b10]">
              {member ? 'Edit Team Member' : 'Add Team Member'}
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              {member ? 'Update this team member.' : 'Invite a new member to your organization.'}
            </p>
          </div>

          <Button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="kredar-label">Full name</label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="kredar-input"
            />
          </div>

          <div>
            <label className="kredar-label">Email address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="kredar-input"
            />
          </div>

          <div className="relative">
            <label className="kredar-label">Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="kredar-select pr-10"
            >
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
              <option value="Developer">Developer</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#667085]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#edf2ee] px-6 py-5">
          <Button type="button" onClick={onClose} disabled={loading} className="kredar-btn-outline">
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="kredar-btn-primary min-w-[150px]"
          >
            {loading ? (
              <Loader2 size={18} className="mx-auto animate-spin" />
            ) : member ? (
              'Save Changes'
            ) : (
              'Invite Member'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
