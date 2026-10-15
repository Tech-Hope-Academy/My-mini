import "server-only";
import crypto from "crypto";
import type { TelegramUser } from "./telegram";

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
  startParam?: string;
}

/**
 * Validates Telegram WebApp `initData` on the server, per the official spec:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * Steps:
 * 1. Parse the initData query string.
 * 2. Remove `hash`, sort remaining keys alphabetically, and join as
 *    `key=value` lines separated by `\n` to build the data-check-string.
 * 3. Compute secret_key = HMAC_SHA256(bot_token, key="WebAppData").
 * 4. Compute hash = HMAC_SHA256(data-check-string, key=secret_key).
 * 5. Compare with the hash received from Telegram (constant-time).
 * 6. Reject if auth_date is older than the configured max age.
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
  options: { maxAgeSeconds?: number } = {}
): ValidatedInitData {
  const maxAgeSeconds = options.maxAgeSeconds ?? 86400; // 24 hours by default

  if (!initData || typeof initData !== "string") {
    throw new Error("Missing initData");
  }
  if (!botToken) {
    throw new Error("Server is missing TELEGRAM_BOT_TOKEN");
  }

  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  if (!receivedHash) {
    throw new Error("initData is missing hash");
  }
  params.delete("hash");

  const dataCheckArr: string[] = [];
  const keys = Array.from(params.keys()).sort();
  for (const key of keys) {
    dataCheckArr.push(`${key}=${params.get(key)}`);
  }
  const dataCheckString = dataCheckArr.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const receivedBuffer = Buffer.from(receivedHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (
    receivedBuffer.length !== computedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, computedBuffer)
  ) {
    throw new Error("Invalid initData signature");
  }

  const authDateRaw = params.get("auth_date");
  const authDate = authDateRaw ? parseInt(authDateRaw, 10) : 0;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!authDate || nowSeconds - authDate > maxAgeSeconds) {
    throw new Error("initData has expired");
  }

  const userRaw = params.get("user");
  if (!userRaw) {
    throw new Error("initData is missing user information");
  }

  let user: TelegramUser;
  try {
    user = JSON.parse(userRaw) as TelegramUser;
  } catch {
    throw new Error("initData user field is not valid JSON");
  }

  if (!user || typeof user.id !== "number") {
    throw new Error("initData user is missing a valid id");
  }

  return {
    user,
    authDate,
    startParam: params.get("start_param") ?? undefined,
  };
}
