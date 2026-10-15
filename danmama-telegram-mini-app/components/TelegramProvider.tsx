"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getTelegramWebApp,
  initTelegramWebApp,
  isInsideTelegram,
  type TelegramUser,
} from "@/lib/telegram";

export interface DanmamaProfile {
  telegramId: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  languageCode: string | null;
  photoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

type AuthStatus = "idle" | "loading" | "success" | "error" | "no-telegram";

interface TelegramContextValue {
  status: AuthStatus;
  isTelegram: boolean;
  telegramUser: TelegramUser | null;
  profile: DanmamaProfile | null;
  errorMessage: string | null;
  initData: string | null;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  retry: () => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

function normalizeTimestamp(value: unknown): string | null {
  if (!value) return null;
  // Firestore Admin timestamps serialize to { _seconds, _nanoseconds } over JSON.
  if (typeof value === "object" && value !== null && "_seconds" in value) {
    const seconds = (value as { _seconds: number })._seconds;
    return new Date(seconds * 1000).toISOString();
  }
  if (typeof value === "string") return value;
  return null;
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [profile, setProfile] = useState<DanmamaProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  const setTheme = useCallback((next: "light" | "dark") => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("danmama-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  }, []);

  const runAuth = useCallback(async () => {
    const webApp = initTelegramWebApp();
    const insideTelegram = isInsideTelegram();
    setIsTelegram(insideTelegram);

    if (!insideTelegram || !webApp) {
      setStatus("no-telegram");
      return;
    }

    setInitData(webApp.initData);
    setTelegramUser(webApp.initDataUnsafe.user ?? null);
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/telegram/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: webApp.initData }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setProfile({
        ...data.user,
        createdAt: normalizeTimestamp(data.user.createdAt),
        updatedAt: normalizeTimestamp(data.user.updatedAt),
      });
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Restore saved theme preference, falling back to Telegram's color scheme.
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem("danmama-theme") : null;
    const webApp = getTelegramWebApp();
    const initial = (saved as "light" | "dark" | null) ?? webApp?.colorScheme ?? "light";
    setTheme(initial);

    runAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<TelegramContextValue>(
    () => ({
      status,
      isTelegram,
      telegramUser,
      profile,
      errorMessage,
      initData,
      theme,
      setTheme,
      retry: runAuth,
    }),
    [status, isTelegram, telegramUser, profile, errorMessage, initData, theme, setTheme, runAuth]
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram(): TelegramContextValue {
  const ctx = useContext(TelegramContext);
  if (!ctx) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return ctx;
}
