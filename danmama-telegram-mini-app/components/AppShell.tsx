"use client";

import { useTelegram } from "@/components/TelegramProvider";
import { BottomNav } from "@/components/BottomNav";
import { Avatar } from "@/components/Avatar";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens";
import { BrowserPreview } from "@/components/BrowserPreview";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { status, profile, errorMessage, retry } = useTelegram();

  if (status === "idle" || status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "no-telegram") {
    return <BrowserPreview />;
  }

  if (status === "error" || !profile) {
    return <ErrorScreen message={errorMessage ?? "Unknown error."} onRetry={retry} />;
  }

  return (
    <div className="min-h-screen bg-surface-light pb-24 dark:bg-surface-dark">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-3.5 backdrop-blur-lg dark:border-white/10 dark:bg-surface-dark/90">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Danmama
          </span>
          <span className="hidden text-sm text-slate-400 dark:text-slate-500 sm:inline">
            {title}
          </span>
        </div>
        <Avatar
          photoUrl={profile.photoUrl}
          firstName={profile.firstName}
          lastName={profile.lastName}
          size={32}
        />
      </header>

      <main className="mx-auto w-full max-w-md animate-fade-in px-5 py-5">{children}</main>

      <BottomNav />
    </div>
  );
}
