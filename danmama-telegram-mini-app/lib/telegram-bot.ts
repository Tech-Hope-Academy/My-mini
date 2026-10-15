import "server-only";

const TELEGRAM_API_BASE = "https://api.telegram.org";

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Server is missing TELEGRAM_BOT_TOKEN");
  }
  return token;
}

interface InlineKeyboardButton {
  text: string;
  url?: string;
  web_app?: { url: string };
  callback_data?: string;
}

interface SendMessageOptions {
  chatId: number | string;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
  replyMarkup?: {
    inline_keyboard: InlineKeyboardButton[][];
  };
}

async function callTelegramApi<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${TELEGRAM_API_BASE}/bot${getBotToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || data.ok === false) {
    throw new Error(`Telegram API error (${method}): ${data.description ?? res.statusText}`);
  }
  return data.result as T;
}

export async function sendTelegramMessage(options: SendMessageOptions) {
  return callTelegramApi("sendMessage", {
    chat_id: options.chatId,
    text: options.text,
    parse_mode: options.parseMode ?? "HTML",
    reply_markup: options.replyMarkup,
    disable_web_page_preview: true,
  });
}

export async function setTelegramWebhook(url: string, secretToken?: string) {
  return callTelegramApi("setWebhook", {
    url,
    secret_token: secretToken,
    allowed_updates: ["message", "callback_query"],
  });
}

export async function deleteTelegramWebhook() {
  return callTelegramApi("deleteWebhook", {});
}

export async function setTelegramBotCommands() {
  return callTelegramApi("setMyCommands", {
    commands: [
      { command: "start", description: "Open the welcome message" },
      { command: "app", description: "Open the Danmama app" },
      { command: "help", description: "Show help and available commands" },
    ],
  });
}

export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    throw new Error("Server is missing NEXT_PUBLIC_APP_URL");
  }
  return url.replace(/\/$/, "");
}
