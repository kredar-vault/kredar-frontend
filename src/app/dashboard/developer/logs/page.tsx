'use client';

import ActivityContent from '../_components/ActivityContent';

export default function ApiActivityPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#081b10]">API Activity</h1>
        <p className="text-xs text-[#45504b] mt-0.5">
          Monitor every request made using your API keys
        </p>
      </div>
      <ActivityContent />
    </div>
  );
}
