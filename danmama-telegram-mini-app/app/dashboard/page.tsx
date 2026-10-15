"use client";

import Link from "next/link";
import { useTelegram } from "@/components/TelegramProvider";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { StatCard, SectionLabel, ListCard, InfoRow } from "@/components/Cards";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DashboardContent() {
  const { profile } = useTelegram();
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex items-center gap-3.5 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
        <Avatar
          photoUrl={profile.photoUrl}
          firstName={profile.firstName}
          lastName={profile.lastName}
          size={52}
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">
            Welcome, {profile.firstName}
            {profile.lastName ? ` ${profile.lastName}` : ""}
          </p>
          <p className="text-sm text-brand-100">
            {profile.username ? `@${profile.username}` : `ID ${profile.telegramId}`}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard
          label="Account status"
          value="Active"
          accent="emerald"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Telegram ID"
          value={String(profile.telegramId)}
          accent="brand"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 2-7 20-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </section>

      <section>
        <SectionLabel>Overview</SectionLabel>
        <ListCard>
          <InfoRow label="Full name" value={`${profile.firstName} ${profile.lastName ?? ""}`.trim()} />
          <InfoRow label="Username" value={profile.username ? `@${profile.username}` : "Not set"} />
          <InfoRow label="Member since" value={formatDate(profile.createdAt)} isLast />
        </ListCard>
      </section>

      <section>
        <SectionLabel>Quick access</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/profile"
            className="focus-ring rounded-2xl border border-slate-100 bg-card-light p-4 transition-colors hover:border-brand-200 dark:border-white/5 dark:bg-card-dark dark:hover:border-brand-500/30"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Profile</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">View your details</p>
          </Link>
          <Link
            href="/settings"
            className="focus-ring rounded-2xl border border-slate-100 bg-card-light p-4 transition-colors hover:border-brand-200 dark:border-white/5 dark:bg-card-dark dark:hover:border-brand-500/30"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Settings</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Appearance & app info</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <DashboardContent />
    </AppShell>
  );
}
