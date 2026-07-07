'use client';

import { useState } from 'react';
import { Trash2, Plus, Users } from 'lucide-react';
import { TeamMember } from '@/api/team/types';

interface TeamTableProps {
  members: TeamMember[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

export default function TeamTable({
  members,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
}: TeamTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#edf2ee] bg-white p-6">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#edf2ee] bg-white overflow-visible">
      <div className="flex flex-col gap-4 border-b border-[#edf2ee] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#081b10]">Team Members</h2>

          <p className="mt-1 text-sm text-[#667085]">
            Manage everyone with access to your merchant account.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="kredar-btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="py-20 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-[#eef9f2] flex items-center justify-center">
            <Users size={30} className="text-[#169E5C]" />
          </div>

          <h3 className="mt-5 text-xl font-semibold">No Team Members</h3>

          <p className="mt-2 text-sm text-[#667085]">Invite your first teammate.</p>

          <button onClick={onAdd} className="kredar-btn-primary mt-6">
            Add Member
          </button>
        </div>
      ) : (
        <>
          {/* Desktop */}

          <div className="hidden md:block overflow-visible">
            <div className="grid grid-cols-[2fr_170px_170px_70px] border-b border-[#edf2ee] bg-[#fafafa] px-6 py-3 text-xs uppercase font-semibold tracking-wide text-[#667085]">
              <p>Member</p>
              <p>Role</p>
              <p>Date Added</p>
              <div />
            </div>

            <div className="divide-y divide-[#edf2ee] overflow-visible">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[2fr_170px_170px_70px] items-center px-6 py-5 hover:bg-[#fafcfb] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#169E5C] text-sm font-semibold text-white uppercase">
                      {member.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#081b10]">{member.fullName}</p>

                      <p className="truncate text-sm text-[#667085]">{member.email}</p>
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex rounded-full bg-[#eef9f2] px-3 py-1 text-xs font-medium text-[#169E5C]">
                      {member.role}
                    </span>
                  </div>

                  <p className="text-sm text-[#667085]">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </p>

                  <div className="relative flex justify-end overflow-visible">
                    <button
                      onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f5f5f5]"
                    >
                      :
                    </button>

                    {openMenu === member.id && (
                      <div className="absolute right-0 top-11 z-[9999] w-48 rounded-xl border border-[#edf2ee] bg-white py-2 shadow-2xl">
                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            onEdit(member);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#081b10] hover:bg-[#f7faf8]"
                        >
                          edit Edit Member
                        </button>

                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            onDelete(member);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete Member
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-4 p-4 md:hidden">
            {members.map((member) => (
              <div
                key={member.id}
                className="relative rounded-2xl border border-[#edf2ee] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#169E5C] text-sm font-semibold uppercase text-white">
                      {member.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#081b10]">{member.fullName}</p>

                      <p className="truncate text-sm text-[#667085]">{member.email}</p>

                      <span className="mt-2 inline-flex rounded-full bg-[#eef9f2] px-3 py-1 text-xs font-medium text-[#169E5C]">
                        {member.role}
                      </span>

                      <p className="mt-3 text-xs text-[#98A2B3]">
                        Added {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f5f5f5]"
                    >
                      :
                    </button>

                    {openMenu === member.id && (
                      <div className="absolute right-0 top-11 z-[9999] w-48 rounded-xl border border-[#edf2ee] bg-white py-2 shadow-2xl">
                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            onEdit(member);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-[#f7faf8]"
                        >
                          edit Edit Member
                        </button>

                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            onDelete(member);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete Member
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
