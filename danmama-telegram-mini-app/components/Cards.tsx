"use client";

import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2.5 px-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
      {children}
    </h2>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent = "brand",
}: {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: "brand" | "amber" | "emerald";
}) {
  const accents: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <div className="rounded-2xl bg-card-light p-4 dark:bg-card-dark">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${accents[accent]}`}>
        {icon}
      </div>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function InfoRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 ${
        isLast ? "" : "border-b border-slate-100 dark:border-white/5"
      }`}
    >
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

export function ListCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-card-light dark:border-white/5 dark:bg-card-dark">
      {children}
    </div>
  );
}
