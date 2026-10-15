"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V21h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.5-4 4.2-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 13.5a1.8 1.8 0 0 0 .36 1.98l.06.06a2.17 2.17 0 1 1-3.07 3.07l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.09 1.65V20a2.17 2.17 0 1 1-4.34 0v-.09a1.8 1.8 0 0 0-1.18-1.65 1.8 1.8 0 0 0-1.98.36l-.06.06a2.17 2.17 0 1 1-3.07-3.07l.06-.06a1.8 1.8 0 0 0 .36-1.98 1.8 1.8 0 0 0-1.65-1.09H2a2.17 2.17 0 1 1 0-4.34h.09a1.8 1.8 0 0 0 1.65-1.18 1.8 1.8 0 0 0-.36-1.98l-.06-.06a2.17 2.17 0 1 1 3.07-3.07l.06.06a1.8 1.8 0 0 0 1.98.36H8.5a1.8 1.8 0 0 0 1.09-1.65V2a2.17 2.17 0 1 1 4.34 0v.09a1.8 1.8 0 0 0 1.09 1.65 1.8 1.8 0 0 0 1.98-.36l.06-.06a2.17 2.17 0 1 1 3.07 3.07l-.06.06a1.8 1.8 0 0 0-.36 1.98v.07a1.8 1.8 0 0 0 1.65 1.09H22a2.17 2.17 0 1 1 0 4.34h-.09a1.8 1.8 0 0 0-1.65 1.09Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/90 backdrop-blur-lg dark:border-white/10 dark:bg-surface-dark/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`focus-ring flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
