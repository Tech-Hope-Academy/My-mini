"use client";

function getBotLink(): string | null {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  return username ? `https://t.me/${username}` : null;
}

export function BrowserPreview() {
  const botLink = getBotLink();

  return (
    <div className="flex min-h-screen flex-col bg-surface-light dark:bg-surface-dark">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-12">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-2xl font-bold text-white shadow-lg shadow-brand-600/20">
            D
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Danmama
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            A personal dashboard built for Telegram. Open it from a Telegram chat to sign in
            automatically with your Telegram account.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-card-dark">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700" />
            <div className="flex-1">
              <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-white/10" />
              <div className="mt-1.5 h-2 w-16 rounded bg-slate-100 dark:bg-white/5" />
            </div>
            <div className="h-5 w-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10" />
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {["Profile", "Telegram", "Activity", "Settings"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 p-3 text-xs font-medium text-slate-400 dark:border-white/5 dark:text-slate-500"
              >
                <div className="mb-2 h-6 w-6 rounded-lg bg-slate-100 dark:bg-white/5" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {botLink ? (
          <a
            href={botLink}
            className="focus-ring rounded-full bg-brand-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Open in Telegram
          </a>
        ) : (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Open this link from your Telegram bot to launch the app.
          </p>
        )}
      </div>
    </div>
  );
}
