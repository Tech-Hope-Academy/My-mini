import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram-auth";
import { upsertUserFromTelegram } from "@/lib/user-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "Server misconfiguration: TELEGRAM_BOT_TOKEN is not set." },
      { status: 500 }
    );
  }

  let body: { initData?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.initData) {
    return NextResponse.json({ error: "Missing initData in request body." }, { status: 400 });
  }

  let validated;
  try {
    validated = validateTelegramInitData(body.initData, botToken);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid initData.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  try {
    const profile = await upsertUserFromTelegram(validated.user);
    return NextResponse.json({ user: profile, startParam: validated.startParam ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save user profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
