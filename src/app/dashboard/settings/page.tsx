'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProfileTab, { ProfileData } from '@/components/features/settings/ProfileTab';
import TeamTab, { TeamMember } from '@/components/features/settings/TeamTab';
import DevelopersTab from '@/components/features/settings/DevelopersTab';
import SecurityTab from '@/components/features/settings/SecurityTab';
import { useTenantProfile, useUpdateProfile } from '@/api/tenant/hooks';
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '@/api/api-keys/hooks';
import {
  useWebhookEndpoints,
  useCreateWebhookEndpoint,
  useDeleteWebhookEndpoint,
} from '@/api/webhooks/hooks';

const emptyProfile: ProfileData = {
  businessName: '',
  registrationNumber: '',
  businessType: '',
  industry: '',
  country: '',
  businessAddress: '',
  countryCode: '+234',
  phoneNumber: '',
  email: '',
  website: '',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'developers' | 'security'>(
    'profile',
  );
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [team, setTeam] = useState<TeamMember[]>([]);

  const { data: serverProfile, isLoading: isProfileLoading } = useTenantProfile();
  const updateProfileMutation = useUpdateProfile();

  const { data: apiKeys = [], isLoading: isKeysLoading } = useApiKeys();
  const createKeyMutation = useCreateApiKey();
  const deleteKeyMutation = useDeleteApiKey();

  const { data: webhooks = [], isLoading: isWebhooksLoading } = useWebhookEndpoints();
  const createWebhookMutation = useCreateWebhookEndpoint();
  const deleteWebhookMutation = useDeleteWebhookEndpoint();

  useEffect(() => {
    if (serverProfile) {
      setProfile(serverProfile);
    }
  }, [serverProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let phoneToSend = profile.phoneNumber.trim().replace(/\s+/g, '');
      if (!phoneToSend.startsWith('+')) {
        const countryCodeClean = profile.countryCode.replace(/\s+/g, '').replace('-', '');
        const phoneWithoutZero = phoneToSend.startsWith('0') ? phoneToSend.slice(1) : phoneToSend;
        phoneToSend = `${countryCodeClean}${phoneWithoutZero}`;
      }
      await updateProfileMutation.mutateAsync({ ...profile, phoneNumber: phoneToSend });
      toast.success('Business profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  const handleAddTeamMember = (name: string, email: string, role: string) => {
    const newM: TeamMember = {
      id: Date.now(),
      name,
      email,
      role,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setTeam((prev) => [...prev, newM]);
    toast.success('Team member added.');
  };

  const handleSaveTeamMember = (id: number, name: string, email: string, role: string) => {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, name, email, role } : m)));
    toast.success('Team member changes saved.');
  };

  const handleDeleteTeamMember = (id: number) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    toast.success('Team member deleted.');
  };

  const handleCreateApiKey = async () => {
    try {
      await createKeyMutation.mutateAsync({
        label: profile.businessName || 'Kredar API Key',
        mode: 'live',
      });
      toast.success('New API Key created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create API key.');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteKeyMutation.mutateAsync(id);
      toast.success('API Key deleted.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete API key.');
    }
  };

  const handleSaveWebhook = async (url: string) => {
    try {
      await createWebhookMutation.mutateAsync({ url });
      toast.success('Webhook registered successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register webhook.');
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await deleteWebhookMutation.mutateAsync(id);
      toast.success('Webhook deleted.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete webhook.');
    }
  };

  const loading = isProfileLoading || isKeysLoading || isWebhooksLoading;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Settings</h1>
      </div>

      <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm min-h-[500px]">
        <div className="border-b border-[#f0f4f1] flex gap-8 mb-6">
          {(['profile', 'team', 'developers', 'security'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 text-sm font-bold border-b-2 transition-all capitalize relative top-[1px]',
                activeTab === tab
                  ? 'border-[#0f8b4b] text-[#0f8b4b]'
                  : 'border-transparent text-[#45504b] hover:text-[#081b10]',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-100 rounded-xl w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && (
              <ProfileTab profile={profile} setProfile={setProfile} onSave={handleSaveProfile} />
            )}
            {activeTab === 'team' && (
              <TeamTab
                team={team}
                setTeam={setTeam}
                onAddMember={handleAddTeamMember}
                onSaveMember={handleSaveTeamMember}
                onDeleteMember={handleDeleteTeamMember}
              />
            )}
            {activeTab === 'developers' && (
              <DevelopersTab
                apiKeys={apiKeys}
                webhooks={webhooks}
                onCreateKey={handleCreateApiKey}
                onDeleteKey={handleDeleteApiKey}
                onSaveWebhook={handleSaveWebhook}
                onDeleteWebhook={handleDeleteWebhook}
              />
            )}
            {activeTab === 'security' && <SecurityTab />}
          </>
        )}
      </div>
    </div>
  );
}
