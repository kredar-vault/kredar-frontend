'use client';

import { Lock } from 'lucide-react';

export default function SecurityTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-[#081b10]">Security</h3>
        <p className="mt-1 text-sm text-[#45504b]">
          Manage your account security and authentication settings.
        </p>
      </div>

      <div className="rounded-2xl border border-[#d8e1da] bg-white p-6">
        <h4 className="text-base font-semibold text-[#081b10]">Security settings coming soon</h4>

        <p className="mt-3 text-sm leading-7 text-[#45504b]">
          We're working on additional security features to help you better protect your account.
          Soon, you'll be able to update your password, manage active sessions, configure two-factor
          authentication (2FA), and review your account security from this page.
        </p>

        <p className="mt-4 text-sm leading-7 text-[#45504b]">
          These features are currently under development and will be available in a future update.
          In the meantime, if you need assistance with your account, please contact the Kredar
          support team.
        </p>
      </div>
    </div>
  );
}
