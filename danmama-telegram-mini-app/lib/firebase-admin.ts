import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK — SERVER ONLY.
 *
 * This file must never be imported from a "use client" component. It reads
 * the private service-account key from environment variables that are not
 * prefixed with NEXT_PUBLIC_, so Next.js will never bundle them into
 * client-side JavaScript.
 */

function formatPrivateKey(key: string | undefined): string | undefined {
  // Vercel/most hosts store the key with literal "\n" sequences that need
  // to be converted back into real newlines.
  return key?.replace(/\\n/g, "\n");
}

function hasAdminConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

export function getFirebaseAdminApp(): App {
  if (!hasAdminConfig()) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  if (adminApp) return adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    adminApp = existing[0];
    return adminApp;
  }

  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
    }),
  });

  return adminApp;
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  adminDb = getFirestore(getFirebaseAdminApp());
  return adminDb;
}

export const isFirebaseAdminConfigured = hasAdminConfig();
