/**
 * Sets the Telegram bot webhook to point at your deployed app.
 *
 * Usage:
 *   npm run set-webhook
 *
 * Requires these variables in .env.local (or the environment):
 *   TELEGRAM_BOT_TOKEN
 *   NEXT_PUBLIC_APP_URL
 *   TELEGRAM_WEBHOOK_SECRET (optional but recommended)
 */
require("dotenv").config({ path: ".env.local" });

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) {
    console.error("Missing TELEGRAM_BOT_TOKEN in .env.local");
    process.exit(1);
  }
  if (!appUrl) {
    console.error("Missing NEXT_PUBLIC_APP_URL in .env.local");
    process.exit(1);
  }

  const webhookUrl = `${appUrl.replace(/\/$/, "")}/api/telegram/webhook`;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret || undefined,
      allowed_updates: ["message", "callback_query"],
    }),
  });

  const data = await res.json();

  if (!res.ok || data.ok === false) {
    console.error("Failed to set webhook:", data.description || res.statusText);
    process.exit(1);
  }

  console.log("Webhook set successfully!");
  console.log("URL:", webhookUrl);
  console.log(data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
