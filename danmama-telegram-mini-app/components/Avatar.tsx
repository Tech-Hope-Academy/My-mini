"use client";

import Image from "next/image";

function getInitials(firstName: string, lastName?: string | null) {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "D";
}

export function Avatar({
  photoUrl,
  firstName,
  lastName,
  size = 48,
}: {
  photoUrl?: string | null;
  firstName: string;
  lastName?: string | null;
  size?: number;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={firstName}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-white/60 dark:ring-white/10"
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-semibold text-white ring-2 ring-white/60 dark:ring-white/10"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
