'use client';

interface CustomerAvatarProps {
  firstName: string;
  lastName?: string;
  size?: number;
}

export default function CustomerAvatar({
  firstName,
  lastName = '',
  size = 40,
}: CustomerAvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="flex items-center justify-center rounded-full bg-gray-900 text-white font-semibold select-none border border-[#eef2ef]"
    >
      {initials}
    </div>
  );
}
