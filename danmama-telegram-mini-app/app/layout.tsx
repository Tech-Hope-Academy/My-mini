import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { TelegramProvider } from "@/components/TelegramProvider";
import { TELEGRAM_MINI_APP_SCRIPT_SRC } from "@/lib/telegram";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danmama",
  description: "Your personal dashboard, right inside Telegram.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2481FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src={TELEGRAM_MINI_APP_SCRIPT_SRC} strategy="beforeInteractive" />
      </head>
      <body className="font-sans">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
