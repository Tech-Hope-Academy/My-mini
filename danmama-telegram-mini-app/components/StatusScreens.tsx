"use client";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light dark:bg-surface-dark">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 dark:border-white/10 dark:border-t-brand-400" />
      <p className="text-sm text-slate-500 dark:text-slate-400">Connecting to Danmama…</p>
    </div>
  );
}

export function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light px-6 text-center dark:bg-surface-dark">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" strokeLinecap="round" />
          <path d="M12 16h.01" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">We couldn&apos;t sign you in</h2>
        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="focus-ring rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
