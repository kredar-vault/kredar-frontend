'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProfileTab, { ProfileData } from '@/components/features/settings/ProfileTab';
import TeamTab from '@/components/features/settings/TeamTab';
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
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  const handleCreateApiKey = async () => {
    try {
      await createKeyMutation.mutateAsync({
        label: profile.businessName || 'Kredar API Key',
        mode: 'live',
      });
      toast.success('New API Key created successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create API key.');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteKeyMutation.mutateAsync(id);
      toast.success('API Key deleted.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete API key.');
    }
  };

  const handleSaveWebhook = async (url: string) => {
    try {
      await createWebhookMutation.mutateAsync({ url });
      toast.success('Webhook registered successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to register webhook.');
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await deleteWebhookMutation.mutateAsync(id);
      toast.success('Webhook deleted.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete webhook.');
    }
  };

  // Team tab fetches and mutates its own data directly (see TeamTab.tsx),
  // so it's not part of this page's loading gate.
  const loading = isProfileLoading || isKeysLoading || isWebhooksLoading;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#081b10]">Settings</h1>
      </div>

      <div className="bg-white border border-[#d8e1da] rounded-md p-4 sm:p-6 min-h-[500px]">
        {/* Tab row: horizontally scrollable on narrow screens instead of
            wrapping/overflowing the card. */}
        <div className="border-b border-[#f0f4f1] mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div className="flex gap-6 sm:gap-8 w-max sm:w-auto min-w-full">
            {(['profile', 'team', 'developers', 'security'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-3 text-sm font-bold border-b-2 transition-all capitalize relative top-[1px] whitespace-nowrap shrink-0',
                  activeTab === tab
                    ? 'border-[#0f8b4b] text-[#0f8b4b]'
                    : 'border-transparent text-[#45504b] hover:text-[#081b10]',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
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
            {activeTab === 'team' && <TeamTab />}
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
            {activeTab === 'security' && <SecurityTab email={profile.email} />}
          </>
        )}
      </div>
    </div>
  );
}
