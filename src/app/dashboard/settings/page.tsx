'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProfileTab, { ProfileData } from '@/components/features/settings/ProfileTab';
import TeamTab, { TeamMember } from '@/components/features/settings/TeamTab';
import DevelopersTab, { ApiKey } from '@/components/features/settings/DevelopersTab';
import SecurityTab from '@/components/features/settings/SecurityTab';

// Default Business Profile Details
const initialProfile: ProfileData = {
  businessName: 'AjoVault',
  registrationNumber: '40987235984AB',
  businessType: 'Limited Liability Company (LLP)',
  industry: 'Finance',
  country: 'Nigeria',
  businessAddress: 'Peeters, Off west avenue, Lagos',
  countryCode: '+234',
  phoneNumber: '703 567 8999',
  email: 'johndoe.ltd@gmail.com',
  website: 'johndoe.ltd@meridian.com',
};

// Initial Team Members
const initialTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Tunde Adebayo',
    email: 'tundeadebayo@gmail.com',
    role: 'Admin',
    dateAdded: '2026-02-23',
  },
  {
    id: 2,
    name: 'Tunde Adebayo',
    email: 'tundeadebayo@gmail.com',
    role: 'Employee',
    dateAdded: '2026-02-23',
  },
  {
    id: 3,
    name: 'Tunde Adebayo',
    email: 'tundeadebayo@gmail.com',
    role: 'Developer',
    dateAdded: '2026-02-23',
  },
];

// Initial API Keys
const initialApiKeys: ApiKey[] = [{ id: 1, name: 'AjoVault', keyString: 'bjwpifeup84981928' }];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'developers' | 'security'>(
    'profile',
  );

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const rawOnboarding = localStorage.getItem('kredar_onboarding_data');
      const rawUser = localStorage.getItem('kredar_current_user');

      let emailVal = initialProfile.email;
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.email) emailVal = u.email;
      }

      if (rawOnboarding) {
        const parsed = JSON.parse(rawOnboarding);
        const bi = parsed.businessInfo;
        if (bi) {
          setProfile({
            businessName: bi.businessName || initialProfile.businessName,
            registrationNumber: bi.registrationNumber || initialProfile.registrationNumber,
            businessType: bi.businessType || initialProfile.businessType,
            industry: bi.industry || initialProfile.industry,
            country: bi.country || initialProfile.country,
            businessAddress: bi.businessAddress || initialProfile.businessAddress,
            countryCode: bi.countryCode || initialProfile.countryCode,
            phoneNumber: bi.phoneNumber || initialProfile.phoneNumber,
            email: emailVal,
            website: bi.website || initialProfile.website,
          });
        }
      } else {
        setProfile((prev) => ({ ...prev, email: emailVal }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rawOnboarding = localStorage.getItem('kredar_onboarding_data');
      let parsed: any = {};
      if (rawOnboarding) {
        parsed = JSON.parse(rawOnboarding);
      }
      parsed.businessInfo = {
        ...parsed.businessInfo,
        businessName: profile.businessName,
        registrationNumber: profile.registrationNumber,
        businessType: profile.businessType,
        industry: profile.industry,
        country: profile.country,
        businessAddress: profile.businessAddress,
        countryCode: profile.countryCode,
        phoneNumber: profile.phoneNumber,
        website: profile.website,
      };
      localStorage.setItem('kredar_onboarding_data', JSON.stringify(parsed));
      toast.success('Business profile updated successfully!');
    } catch {
      toast.error('Failed to update business profile.');
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

  const handleCreateApiKey = () => {
    const randomKey =
      Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newK: ApiKey = {
      id: Date.now(),
      name: 'AjoVault',
      keyString: randomKey,
    };
    setApiKeys((prev) => [...prev, newK]);
    toast.success('New API Key created successfully!');
  };

  const handleDeleteApiKey = (id: number) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success('API Key deleted.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[#081b10]">Settings</h1>
      </div>

      <div className="bg-white border border-[#d8e1da] rounded-2xl p-6 shadow-sm min-h-[500px]">
        {/* Tab triggers */}
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

        {/* Render Active Tab */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-10 bg-gray-100 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'team' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-10 bg-gray-200 rounded-xl w-24" />
                </div>
                <div className="space-y-2.5 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3 border-b border-[#f0f4f1]"
                    >
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-3.5 bg-gray-200 rounded w-48" />
                      </div>
                      <div className="h-8 bg-gray-100 rounded-lg w-20" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'developers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-40" />
                  <div className="h-10 bg-gray-200 rounded-xl w-32" />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center py-4 border-b border-[#f0f4f1]">
                    <div className="h-4 bg-gray-200 rounded w-28" />
                    <div className="h-4 bg-gray-200 rounded w-48" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'security' && (
              <div className="max-w-md space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-4 bg-gray-200 rounded w-28" />
                    <div className="h-10 bg-gray-100 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            )}
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
                onCreateKey={handleCreateApiKey}
                onDeleteKey={handleDeleteApiKey}
              />
            )}
            {activeTab === 'security' && <SecurityTab />}
          </>
        )}
      </div>
    </div>
  );
}
