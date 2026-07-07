'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from '@/api/team/hooks';

import { TeamMember } from '@/api/team/types';
import TeamTable from './teamTable';
import TeamMemberModal from './editteam';
import DeleteMemberDialog from './deleteteamMember';

export default function TeamTab() {
  const { data: members = [], isLoading } = useTeamMembers();

  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleAdd = () => {
    setSelectedMember(null);
    setShowModal(true);
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setShowModal(false);
  };

  const closeDeleteDialog = () => {
    setSelectedMember(null);
    setShowDeleteDialog(false);
  };

  const handleSubmit = async (payload: { fullName: string; email: string; role: string }) => {
    try {
      if (selectedMember) {
        await updateMember.mutateAsync({
          id: selectedMember.id,
          payload,
        });

        toast.success('Team member updated successfully.');
      } else {
        await createMember.mutateAsync(payload);

        toast.success('Team member invited successfully.');
      }

      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;

    try {
      await deleteMember.mutateAsync(selectedMember.id);

      toast.success('Team member deleted successfully.');

      closeDeleteDialog();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete member.');
    }
  };

  return (
    <>
      <TeamTable
        members={members}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TeamMemberModal
        open={showModal}
        member={selectedMember}
        loading={createMember.isPending || updateMember.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteMemberDialog
        open={showDeleteDialog}
        loading={deleteMember.isPending}
        memberName={selectedMember?.fullName}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  );
}
