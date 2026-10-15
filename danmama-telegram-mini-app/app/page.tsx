"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/components/TelegramProvider";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens";
import { BrowserPreview } from "@/components/BrowserPreview";

export default function HomePage() {
  const router = useRouter();
  const { status, errorMessage, retry } = useTelegram();

  useEffect(() => {
    if (status === "success") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "no-telegram") {
    return <BrowserPreview />;
  }

  if (status === "error") {
    return <ErrorScreen message={errorMessage ?? "Unknown error."} onRetry={retry} />;
  }

  // idle | loading | success (brief moment before redirect)
  return <LoadingScreen />;
}
