'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Security settings updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSaveSecurity} className="space-y-5 max-w-md">
      <div>
        <h3 className="text-lg font-bold text-[#081b10] flex items-center gap-2">
          <Lock size={18} className="text-[#0f8b4b]" />
          Update Password
        </h3>
        <p className="text-xs text-[#45504b] mt-1">
          Choose a strong, secure password for your account
        </p>
      </div>

      <div>
        <label className="kredar-label">Current password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="kredar-input"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="kredar-label">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="kredar-input"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="kredar-label">Confirm new password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="kredar-input"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" className="kredar-btn-primary">
        Save Changes
      </button>
    </form>
  );
}
