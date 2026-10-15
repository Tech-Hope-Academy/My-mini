"use client";

import { useTelegram } from "@/components/TelegramProvider";
import { AppShell } from "@/components/AppShell";
import { SectionLabel, ListCard, InfoRow } from "@/components/Cards";
import { getTelegramWebApp } from "@/lib/telegram";

function ThemeToggle() {
  const { theme, setTheme } = useTelegram();

  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm text-slate-500 dark:text-slate-400">Appearance</span>
      <div className="flex rounded-full bg-slate-100 p-1 dark:bg-white/5">
        {(["light", "dark"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setTheme(option)}
            className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
              theme === option
                ? "bg-white text-slate-900 shadow-sm dark:bg-brand-600 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsContent() {
  const { profile, isTelegram } = useTelegram();
  const webApp = getTelegramWebApp();

  const handleClose = () => {
    webApp?.close();
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionLabel>Preferences</SectionLabel>
        <ListCard>
          <ThemeToggle />
        </ListCard>
      </section>

      <section>
        <SectionLabel>Telegram app info</SectionLabel>
        <ListCard>
          <InfoRow label="Running inside Telegram" value={isTelegram ? "Yes" : "No"} />
          <InfoRow label="Platform" value={webApp?.platform ?? "Unknown"} />
          <InfoRow label="WebApp version" value={webApp?.version ?? "Unknown"} isLast />
        </ListCard>
      </section>

      {profile && (
        <section>
          <SectionLabel>Account</SectionLabel>
          <ListCard>
            <InfoRow label="Signed in as" value={`@${profile.username ?? profile.telegramId}`} isLast />
          </ListCard>
        </section>
      )}

      {isTelegram && (
        <button
          onClick={handleClose}
          className="focus-ring rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
        >
          Close app
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <SettingsContent />
    </AppShell>
  );
}
