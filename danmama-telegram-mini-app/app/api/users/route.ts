import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram-auth";
import { getUserProfile } from "@/lib/user-store";

export const dynamic = "force-dynamic";

/**
 * Reads initData from the `Authorization: tma <initData>` header, the
 * convention recommended by Telegram for Mini Apps, and returns the
 * matching Firestore profile. This lets the client re-fetch fresh profile
 * data without re-running the full auth/upsert flow.
 */
export async function GET(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "Server misconfiguration: TELEGRAM_BOT_TOKEN is not set." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const initData = authHeader.startsWith("tma ") ? authHeader.slice(4) : null;

  if (!initData) {
    return NextResponse.json(
      { error: "Missing Authorization header (expected: 'tma <initData>')." },
      { status: 401 }
    );
  }

  let validated;
  try {
    validated = validateTelegramInitData(initData, botToken);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid initData.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  try {
    const profile = await getUserProfile(validated.user.id);
    if (!profile) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }
    return NextResponse.json({ user: profile });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load user profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
