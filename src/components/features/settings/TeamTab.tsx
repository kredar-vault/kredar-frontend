'use client';

import { useState } from 'react';
import { Plus, Edit2, MoreVertical, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  dateAdded: string;
}

interface TeamTabProps {
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  onAddMember: (name: string, email: string, role: string) => void;
  onSaveMember: (id: number, name: string, email: string, role: string) => void;
  onDeleteMember: (id: number) => void;
}

export default function TeamTab({ team, onAddMember, onSaveMember, onDeleteMember }: TeamTabProps) {
  // Sub-states inside tab
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [addingMember, setAddingMember] = useState(false);
  const [teamFormName, setTeamFormName] = useState('');
  const [teamFormEmail, setTeamFormEmail] = useState('');
  const [teamFormRole, setTeamFormRole] = useState('Employee');

  const startAddMember = () => {
    setTeamFormName('');
    setTeamFormEmail('');
    setTeamFormRole('Employee');
    setAddingMember(true);
  };

  const startEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setTeamFormName(member.name);
    setTeamFormEmail(member.email);
    setTeamFormRole(member.role);
  };

  const handleSubmit = () => {
    if (!teamFormName || !teamFormEmail) return;
    if (editingMember) {
      onSaveMember(editingMember.id, teamFormName, teamFormEmail, teamFormRole);
      setEditingMember(null);
    } else if (addingMember) {
      onAddMember(teamFormName, teamFormEmail, teamFormRole);
      setAddingMember(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── List State ── */}
      {!editingMember && !addingMember && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#081b10]">Team members</h3>
            <button
              onClick={startAddMember}
              className="kredar-btn-primary h-9 text-xs font-semibold px-4 flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add team member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0f4f1] text-[#45504b] text-xs font-semibold">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Date Added</th>
                  <th className="pb-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {team.map((m) => (
                  <tr key={m.id} className="text-sm hover:bg-[#f7faf6]/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-[#081b10]">{m.name}</div>
                      <div className="text-xs text-[#667085] font-medium mt-0.5">{m.email}</div>
                    </td>
                    <td className="py-3.5 text-[#45504b] font-medium">{m.role}</td>
                    <td className="py-3.5 text-[#45504b] font-medium">{m.dateAdded}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditMember(m)}
                          className="text-[#45504b] hover:text-[#0f8b4b] p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button className="text-[#45504b] p-1.5 hover:bg-[#f3f4f6] rounded-lg">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Edit / Add Member Details State ── */}
      {(editingMember || addingMember) && (
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-3">
            <h3 className="text-lg font-bold text-[#081b10]">Basic information</h3>
            <div className="flex items-center gap-2">
              {editingMember && (
                <button
                  type="button"
                  onClick={() => onDeleteMember(editingMember.id)}
                  className="kredar-btn-outline h-9 px-4 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingMember(null);
                  setAddingMember(false);
                }}
                className="kredar-btn-outline h-9 px-4 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="kredar-btn-primary h-9 px-4 text-xs font-semibold"
              >
                Save changes
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="kredar-label">Full name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={teamFormName}
                onChange={(e) => setTeamFormName(e.target.value)}
                className="kredar-input"
              />
            </div>

            <div>
              <label className="kredar-label">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={teamFormEmail}
                onChange={(e) => setTeamFormEmail(e.target.value)}
                className="kredar-input"
              />
            </div>

            <div className="relative">
              <label className="kredar-label">Role</label>
              <select
                value={teamFormRole}
                onChange={(e) => setTeamFormRole(e.target.value)}
                className="kredar-select pr-10"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="Developer">Developer</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export type { TeamMember };
