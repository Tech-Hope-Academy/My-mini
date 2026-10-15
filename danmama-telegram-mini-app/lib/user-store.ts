import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "./firebase-admin";
import type { TelegramUser } from "./telegram";

export interface DanmamaUserProfile {
  telegramId: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  languageCode: string | null;
  photoUrl: string | null;
  createdAt: unknown;
  updatedAt: unknown;
}

const USERS_COLLECTION = "users";

/**
 * Creates the Firestore user document on first login, or updates the
 * mutable Telegram-provided fields on every subsequent login.
 */
export async function upsertUserFromTelegram(user: TelegramUser): Promise<DanmamaUserProfile> {
  const db = getAdminDb();
  const ref = db.collection(USERS_COLLECTION).doc(String(user.id));
  const snapshot = await ref.get();

  const mutableFields = {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name ?? null,
    username: user.username ?? null,
    languageCode: user.language_code ?? null,
    photoUrl: user.photo_url ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!snapshot.exists) {
    await ref.set({
      ...mutableFields,
      createdAt: FieldValue.serverTimestamp(),
    });
  } else {
    await ref.set(mutableFields, { merge: true });
  }

  const finalSnapshot = await ref.get();
  return finalSnapshot.data() as DanmamaUserProfile;
}

export async function getUserProfile(telegramId: number): Promise<DanmamaUserProfile | null> {
  const db = getAdminDb();
  const snapshot = await db.collection(USERS_COLLECTION).doc(String(telegramId)).get();
  if (!snapshot.exists) return null;
  return snapshot.data() as DanmamaUserProfile;
}
