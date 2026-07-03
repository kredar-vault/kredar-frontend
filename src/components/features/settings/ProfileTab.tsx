'use client';

import { ChevronDown } from 'lucide-react';

interface ProfileData {
  businessName: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  country: string;
  businessAddress: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  website: string;
}

interface ProfileTabProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  onSave: (e: React.FormEvent) => void;
}

export default function ProfileTab({ profile, setProfile, onSave }: ProfileTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
        {/* Business Name */}
        <div>
          <label className="kredar-label">Business name</label>
          <input
            type="text"
            value={profile.businessName}
            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
            className="kredar-input"
          />
        </div>

        {/* Business registration number */}
        <div>
          <label className="kredar-label">Business registration number</label>
          <input
            type="text"
            value={profile.registrationNumber}
            onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
            className="kredar-input"
          />
        </div>

        {/* Business type select */}
        <div className="relative">
          <label className="kredar-label">Business type</label>
          <select
            value={profile.businessType}
            onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
            className="kredar-select pr-10"
          >
            <option>{profile.businessType}</option>
            <option>Sole Proprietorship</option>
            <option>Partnership</option>
            <option>Corporation</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
        </div>

        {/* Industry select */}
        <div className="relative">
          <label className="kredar-label">Industry</label>
          <select
            value={profile.industry}
            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
            className="kredar-select pr-10"
          >
            <option>{profile.industry}</option>
            <option>Technology</option>
            <option>Logistics</option>
            <option>Retail</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
        </div>

        {/* Country select */}
        <div className="relative">
          <label className="kredar-label">Country</label>
          <select
            value={profile.country}
            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            className="kredar-select pr-10"
          >
            <option>{profile.country}</option>
            <option>Ghana</option>
            <option>Kenya</option>
            <option>United States</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
        </div>

        {/* Business address */}
        <div>
          <label className="kredar-label">Business address*</label>
          <input
            type="text"
            value={profile.businessAddress}
            onChange={(e) => setProfile({ ...profile, businessAddress: e.target.value })}
            className="kredar-input"
          />
        </div>
      </div>

      {/* Country code + Phone + Email */}
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-5">
        <div>
          <label className="kredar-label">Country code</label>
          <input
            type="text"
            value={profile.countryCode}
            onChange={(e) => setProfile({ ...profile, countryCode: e.target.value })}
            className="kredar-input text-center"
          />
        </div>
        <div>
          <label className="kredar-label">Phone Number</label>
          <input
            type="text"
            value={profile.phoneNumber}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            className="kredar-input"
          />
        </div>
        <div>
          <label className="kredar-label">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="kredar-input"
          />
        </div>
      </div>

      {/* Website */}
      <div className="max-w-md">
        <label className="kredar-label">Website</label>
        <input
          type="text"
          value={profile.website}
          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
          className="kredar-input"
        />
      </div>

      <button type="submit" className="kredar-btn-primary">
        Save Changes
      </button>
    </form>
  );
}
export type { ProfileData };
