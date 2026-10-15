"use client";

import { useTelegram } from "@/components/TelegramProvider";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { SectionLabel, ListCard, InfoRow } from "@/components/Cards";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ru: "Russian",
  es: "Spanish",
  fr: "French",
  de: "German",
  ar: "Arabic",
  pt: "Portuguese",
  tr: "Turkish",
  uk: "Ukrainian",
  id: "Indonesian",
};

function ProfileContent() {
  const { profile } = useTelegram();
  if (!profile) return null;

  const languageLabel = profile.languageCode
    ? LANGUAGE_NAMES[profile.languageCode] ?? profile.languageCode.toUpperCase()
    : "Not set";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-center gap-3 py-4 text-center">
        <Avatar
          photoUrl={profile.photoUrl}
          firstName={profile.firstName}
          lastName={profile.lastName}
          size={84}
        />
        <div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {profile.firstName} {profile.lastName ?? ""}
          </p>
          {profile.username && (
            <p className="text-sm text-slate-500 dark:text-slate-400">@{profile.username}</p>
          )}
        </div>
      </section>

      <section>
        <SectionLabel>Personal info</SectionLabel>
        <ListCard>
          <InfoRow label="First name" value={profile.firstName} />
          <InfoRow label="Last name" value={profile.lastName ?? "Not set"} />
          <InfoRow label="Username" value={profile.username ? `@${profile.username}` : "Not set"} isLast />
        </ListCard>
      </section>

      <section>
        <SectionLabel>Telegram account</SectionLabel>
        <ListCard>
          <InfoRow label="Telegram ID" value={String(profile.telegramId)} />
          <InfoRow label="Language" value={languageLabel} isLast />
        </ListCard>
      </section>

      <section>
        <SectionLabel>Account</SectionLabel>
        <ListCard>
          <InfoRow label="Registered" value={formatDate(profile.createdAt)} />
          <InfoRow label="Last updated" value={formatDate(profile.updatedAt)} isLast />
        </ListCard>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <ProfileContent />
    </AppShell>
  );
}
