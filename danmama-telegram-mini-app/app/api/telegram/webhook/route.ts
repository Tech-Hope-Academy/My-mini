import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage, getAppUrl } from "@/lib/telegram-bot";

export const dynamic = "force-dynamic";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number; type: string };
    from?: { id: number; first_name: string; username?: string };
    text?: string;
  };
}

const WELCOME_TEXT =
  "👋 <b>Welcome to Danmama!</b>\n\n" +
  "Danmama is your personal dashboard right inside Telegram. Tap the button " +
  "below to open the app and see your profile, activity, and settings.";

const HELP_TEXT =
  "<b>Danmama — available commands</b>\n\n" +
  "/start — show the welcome message\n" +
  "/app — open the Danmama Mini App\n" +
  "/help — show this help message";

function buildOpenAppKeyboard() {
  const appUrl = getAppUrl();
  return {
    inline_keyboard: [
      [
        {
          text: "🚀 Open Danmama App",
          web_app: { url: appUrl },
        },
      ],
    ],
  };
}

async function handleCommand(chatId: number, text: string) {
  const command = text.split(/[\s@]/)[0];

  switch (command) {
    case "/start":
      await sendTelegramMessage({
        chatId,
        text: WELCOME_TEXT,
        replyMarkup: buildOpenAppKeyboard(),
      });
      break;
    case "/app":
      await sendTelegramMessage({
        chatId,
        text: "Tap below to open Danmama:",
        replyMarkup: buildOpenAppKeyboard(),
      });
      break;
    case "/help":
      await sendTelegramMessage({ chatId, text: HELP_TEXT });
      break;
    default:
      await sendTelegramMessage({
        chatId,
        text: "Sorry, I didn't understand that command. Send /help to see what I can do.",
      });
  }
}

export async function POST(req: NextRequest) {
  // Verify the request actually came from Telegram, if a webhook secret is configured.
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (configuredSecret) {
    const receivedSecret = req.headers.get("x-telegram-bot-api-secret-token");
    if (receivedSecret !== configuredSecret) {
      return NextResponse.json({ error: "Invalid webhook secret." }, { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const message = update.message;
    if (message?.text && message.text.startsWith("/")) {
      await handleCommand(message.chat.id, message.text);
    }
  } catch (err) {
    // Log but still return 200 — Telegram retries aggressively on non-2xx
    // responses, and we don't want a downstream error to cause a retry storm.
    console.error("Telegram webhook handler error:", err);
  }

  // Telegram requires a fast 200 response regardless of internal outcome.
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Danmama Telegram webhook endpoint is live. Send POST requests only.",
  });
}
