/**
 * Registers the bot's slash commands with Telegram so they appear in the
 * chat's command menu.
 *
 * Usage:
 *   npm run set-commands
 *
 * Requires TELEGRAM_BOT_TOKEN in .env.local (or the environment).
 */
require("dotenv").config({ path: ".env.local" });

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error("Missing TELEGRAM_BOT_TOKEN in .env.local");
    process.exit(1);
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commands: [
        { command: "start", description: "Open the welcome message" },
        { command: "app", description: "Open the Danmama app" },
        { command: "help", description: "Show help and available commands" },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok || data.ok === false) {
    console.error("Failed to set commands:", data.description || res.statusText);
    process.exit(1);
  }

  console.log("Bot commands set successfully!");
  console.log(data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
