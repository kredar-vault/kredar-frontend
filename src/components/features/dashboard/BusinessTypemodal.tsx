// 'use client';

// import { useState } from 'react';
// import { useTenantProfile, useUpdateProfile } from '@/api/tenant/hooks';
// import { setPendingBusinessType, clearPendingBusinessType } from '@/lib/cookies';

// export default function BusinessTypeModal() {
//   const [selected, setSelected] = useState<'merchant' | 'platform' | null>(null);
//   const { data: profile } = useTenantProfile();
//   const updateProfile = useUpdateProfile();

//   const handleConfirm = () => {
//     if (!selected) return;

//     // Save locally right away — nav filtering + this modal work immediately
//     // regardless of whether the backend PATCH succeeds. Remove this once
//     // backend relaxes validation on partial PATCH /tenants/profile.
//     setPendingBusinessType(selected);

//     updateProfile.mutate(
//       { ...profile, businessType: selected },
//       {
//         onSuccess: () => {
//           clearPendingBusinessType(); // backend now has it, cookie no longer needed
//         },
//         // onError already toasts via useUpdateProfile — cookie stays set either
//         // way, so the user isn't blocked even if the save 400s.
//       }
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-full max-w-md rounded-xl bg-white p-6">
//         <h2 className="text-lg font-semibold">What type of business is this?</h2>
//         <p className="mt-1 text-sm text-zinc-500">
//           This determines what your dashboard shows.
//         </p>

//         <div className="mt-5 grid grid-cols-1 gap-3">
//           {(['merchant', 'platform'] as const).map((type) => (
//             <button
//               key={type}
//               onClick={() => setSelected(type)}
//               className={`rounded-lg border p-4 text-left capitalize ${
//                 selected === type ? 'border-[#006C49] bg-[#006C49]/5' : 'border-zinc-200'
//               }`}
//             >
//               {type}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={handleConfirm}
//           disabled={!selected || updateProfile.isPending}
//           className="mt-5 w-full rounded-lg bg-[#006C49] py-2.5 text-white disabled:opacity-50"
//         >
//           {updateProfile.isPending ? 'Saving...' : 'Continue'}
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { setPendingBusinessType } from '@/lib/cookies';
// import { useTenantProfile, useUpdateProfile } from '@/api/tenant/hooks'; // re-enable once backend fixes PATCH validation

export default function BusinessTypeModal() {
  const [selected, setSelected] = useState<'merchant' | 'platform' | null>(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setSaving(true);

    // TEMP: backend PATCH /tenants/profile 400s on businessType-only updates.
    // Storing locally for now so nav filtering + this modal work correctly.
    // Swap this back to updateProfile.mutate({ businessType: selected }) once
    // backend confirms partial PATCH is fixed.
    setPendingBusinessType(selected);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="text-lg font-semibold">What type of business is this?</h2>
        <p className="mt-1 text-sm text-zinc-500">This determines what your dashboard shows.</p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {(['merchant', 'platform'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelected(type)}
              className={`rounded-lg border p-4 text-left capitalize ${
                selected === type ? 'border-[#006C49] bg-[#006C49]/5' : 'border-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          className="mt-5 w-full rounded-lg bg-[#006C49] py-2.5 text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
