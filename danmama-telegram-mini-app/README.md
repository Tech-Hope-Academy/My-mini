# Danmama — Telegram Mini App

A production-ready Telegram Mini App built with Next.js, TypeScript, Tailwind CSS and
Firebase. It shows a user's Telegram profile in a native-feeling dashboard, verifies
every login server-side, and syncs the profile to Firestore through a bot you control.

- 🔐 Server-side verification of Telegram `initData` (HMAC-SHA256, per Telegram's spec)
- 🔥 Firebase Firestore for user profiles, written only through the Admin SDK
- 🤖 A Telegram bot with `/start`, `/help`, `/app` commands and a webhook endpoint
- 📱 Mobile-first dashboard, profile and settings pages with light/dark mode
- 🌐 A friendly preview screen when opened in a normal browser (outside Telegram)
- ▲ Ready to deploy to Vercel

---

## How it works (quick overview)

1. A user opens your bot in Telegram and taps **"🚀 Open Danmama App"**.
2. Telegram loads your app inside a WebView and gives it `initData` — a signed string
   containing the user's Telegram profile.
3. The app sends that `initData` to `/api/telegram/auth`, which **re-derives the
   signature on the server** using your bot token and rejects anything that doesn't
   match or has expired. The browser is never trusted on its own.
4. Once verified, the server creates/updates a document in `users/{telegramId}` in
   Firestore using the **Firebase Admin SDK** (never the client SDK), and returns the
   profile to the app.
5. The dashboard, profile and settings pages render that verified profile.

---

## Prerequisites

- [Node.js](https://nodejs.org) 18.18 or newer
- A free [Telegram](https://telegram.org) account
- A free [Firebase](https://firebase.google.com) account
- A free [Vercel](https://vercel.com) account
- A [GitHub](https://github.com) account (to deploy to Vercel)

---

## STEP 1 — Create your Telegram Bot

1. Open Telegram and start a chat with [@BotFather](https://t.me/BotFather).
2. Send `/newbot`.
3. Choose a **display name**, e.g. `Danmama`.
4. Choose a **username** ending in `bot`, e.g. `danmama_bot`.
5. BotFather replies with your **bot token** — a string like
   `123456789:AAExampleTokenDoNotShareThisPublicly`.
   Copy it somewhere safe. **Never commit it to Git or share it publicly.**

(Optional but recommended, do this now or after deploying)
6. Send `/setdescription` → pick your bot → write a short description of Danmama.
7. Send `/setuserpic` → upload a logo for the bot.

---

## STEP 2 — Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**, name it (e.g. `danmama`), and finish the wizard
   (Google Analytics is optional — you can disable it).

## STEP 3 — Configure Firestore

1. In the Firebase Console, open **Build → Firestore Database**.
2. Click **Create database**.
3. Choose a location close to your users, and start in **production mode**
   (the app ships its own secure rules — see below).
4. Once created, open the **Rules** tab and replace the contents with the file from
   this project: [`firestore.rules`](./firestore.rules). Click **Publish**.
   These rules block all direct client reads/writes — every access to Firestore goes
   through your server's validated API routes instead.

## STEP 4 — Configure a Firebase Web App

1. In the Firebase Console, click the **⚙️ gear icon → Project settings**.
2. Under **Your apps**, click the **</> (Web)** icon to register a new web app.
3. Give it a nickname (e.g. `danmama-web`) and click **Register app**.
4. Firebase shows you a `firebaseConfig` object. You'll need these six values:
   `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

## STEP 4b — Create a Firebase Admin service account

1. Still in **Project settings**, open the **Service accounts** tab.
2. Click **Generate new private key** and confirm. A JSON file downloads.
3. Open that JSON file — you'll need three values from it:
   - `project_id`
   - `client_email`
   - `private_key` (a long string starting with `-----BEGIN PRIVATE KEY-----`)
4. **Keep this file secret.** Do not commit it to Git or upload it anywhere public.

---

## STEP 5 — Configure environment variables (local development)

1. In the project folder, copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in every value:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef

   TELEGRAM_BOT_TOKEN=123456789:AAExampleTokenDoNotShareThisPublicly
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=danmama_bot

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   TELEGRAM_WEBHOOK_SECRET=any-random-string-you-choose

   FIREBASE_ADMIN_PROJECT_ID=your-project-id
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
   ```

   > **Tip:** Paste `FIREBASE_ADMIN_PRIVATE_KEY` exactly as it appears in the JSON
   > file, wrapped in quotes, with `\n` left as literal characters — the app converts
   > them back into real newlines automatically.

---

## STEP 6 — Run locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Because Telegram Mini Apps only fully work
inside the Telegram client, you'll see the **browser preview screen** locally — that's
expected. To test the real flow before deploying, use a tunnel like
[ngrok](https://ngrok.com) (`ngrok http 3000`) and set `NEXT_PUBLIC_APP_URL` to the
`https://...ngrok-free.app` URL it gives you, then repeat STEP 12 with that URL.

Also verify the production build works:

```bash
npm run build
npm start
```

---

## STEP 7 — Upload to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Danmama Telegram Mini App"
git branch -M main
git remote add origin https://github.com/<your-username>/danmama-telegram-mini-app.git
git push -u origin main
```

`.env.local` is already excluded via `.gitignore` — your secrets will not be pushed.

---

## STEP 8 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository
   you just pushed.
2. Framework preset: Vercel detects **Next.js** automatically — leave the defaults.
3. Don't deploy yet — first add your environment variables (next step).

## STEP 9 — Add environment variables to Vercel

1. In the import screen (or later under **Project → Settings → Environment
   Variables**), add every variable from your `.env.local`, one by one, for the
   **Production** (and Preview, if you like) environment:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `TELEGRAM_BOT_TOKEN`
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
   - `NEXT_PUBLIC_APP_URL` — set this to your **Vercel production URL** (see Step 10;
     you can update it after the first deploy once you know the final URL)
   - `TELEGRAM_WEBHOOK_SECRET`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY` — paste the full key including the `\n` sequences

2. Click **Deploy**.

## STEP 10 — Get your Vercel URL and connect it

1. After the deploy finishes, Vercel shows your production URL, e.g.
   `https://danmama-telegram-mini-app.vercel.app`.
2. Go back to **Project → Settings → Environment Variables**, update
   `NEXT_PUBLIC_APP_URL` to that exact URL (no trailing slash), and redeploy
   (**Deployments → ⋯ → Redeploy**) so the new value takes effect.

---

## STEP 11 — Configure BotFather

Back in your chat with [@BotFather](https://t.me/BotFather):

1. **Set the Mini App / Web App URL:**
   - Send `/newapp`, choose your bot, and follow the prompts (title, description,
     photo), then provide your Vercel URL, e.g.
     `https://danmama-telegram-mini-app.vercel.app`, when asked for the Web App URL.
2. **Set the menu button** (so the app opens from the chat's menu button, next to the
   text field):
   - Send `/mybots` → select your bot → **Bot Settings → Menu Button → Configure menu
     button** → send your Vercel URL, then send a button title like `Open Danmama`.
3. **Set bot commands** so `/start`, `/app`, `/help` show up with descriptions in the
   Telegram UI. Either:
   - Run the included script (reads `.env.local` locally):
     ```bash
     npm run set-commands
     ```
   - Or manually via BotFather: `/setcommands` → select your bot → paste:
     ```
     start - Open the welcome message
     app - Open the Danmama app
     help - Show help and available commands
     ```

---

## STEP 12 — Set the webhook

Telegram needs to know where to send updates (like `/start`) for your bot. This
project exposes `POST /api/telegram/webhook` for that.

With `NEXT_PUBLIC_APP_URL` and `TELEGRAM_BOT_TOKEN` set correctly in `.env.local`
(pointing at your **production** Vercel URL), run:

```bash
npm run set-webhook
```

This calls Telegram's `setWebhook` API with your `/api/telegram/webhook` URL and your
`TELEGRAM_WEBHOOK_SECRET`, so the endpoint can confirm requests really come from
Telegram. You only need to re-run this if your production URL changes.

To confirm it worked, visit:
`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo` in a browser — you
should see your Vercel webhook URL and no `last_error_message`.

---

## STEP 13 — Test the Mini App

1. Open your bot in Telegram (search its @username, or use the `t.me/<username>` link).
2. Send `/start`. You should get a welcome message with an **"🚀 Open Danmama App"**
   button.
3. Tap it. The app should open inside Telegram, show a brief loading state, then land
   on the dashboard with your name, Telegram ID and profile info.
4. Check Firestore: **Firebase Console → Firestore Database → `users` collection** —
   you should see a document with your Telegram ID containing your profile.
5. Open the same Vercel URL in a normal desktop/mobile browser (not through Telegram)
   — you should see the friendly preview screen with an **"Open in Telegram"** button
   instead of the dashboard.

If anything fails, see **Troubleshooting** below.

---

## Project structure

```
danmama-telegram-mini-app/
├── app/
│   ├── api/
│   │   ├── telegram/
│   │   │   ├── auth/route.ts       # Verifies initData, upserts Firestore profile
│   │   │   └── webhook/route.ts    # Handles /start /help /app + bot updates
│   │   └── users/route.ts          # Returns the authenticated user's profile
│   ├── dashboard/page.tsx
│   ├── profile/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx                  # Loads the Telegram WebApp script
│   ├── page.tsx                    # Landing: redirects into the app or shows preview
│   └── globals.css
├── components/
│   ├── TelegramProvider.tsx        # Telegram detection + auth flow (React context)
│   ├── AppShell.tsx                # Header + bottom nav wrapper for app pages
│   ├── BottomNav.tsx
│   ├── BrowserPreview.tsx          # Shown when opened outside Telegram
│   ├── StatusScreens.tsx           # Loading / error screens
│   ├── Avatar.tsx
│   └── Cards.tsx
├── lib/
│   ├── firebase.ts                 # Client SDK (safe for the browser)
│   ├── firebase-admin.ts           # Admin SDK (server only)
│   ├── telegram.ts                 # Shared types + client helpers
│   ├── telegram-auth.ts            # Server-side initData signature validation
│   ├── telegram-bot.ts             # Bot API helper (sendMessage, setWebhook, ...)
│   └── user-store.ts               # Firestore read/write for user profiles
├── scripts/
│   ├── set-webhook.js
│   └── set-commands.js
├── firestore.rules
├── .env.example
└── README.md
```

---

## Security notes

- The Telegram Bot Token and Firebase Admin credentials are **never** exposed to the
  browser — they're only read in server-only files (`lib/firebase-admin.ts`,
  `lib/telegram-auth.ts`, `lib/telegram-bot.ts`, and API routes), and the `server-only`
  package causes a build error if one of them is accidentally imported into a client
  component.
- `initData` is verified using the official HMAC-SHA256 algorithm described in the
  [Telegram Mini Apps docs](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app),
  with a constant-time comparison and an expiry check (`auth_date`).
- Firestore's own rules (`firestore.rules`) deny all direct client reads/writes. Every
  read or write goes through `/api/telegram/auth` or `/api/users`, which independently
  re-validate `initData` before touching the database.
- The webhook endpoint checks the `X-Telegram-Bot-Api-Secret-Token` header against
  `TELEGRAM_WEBHOOK_SECRET` before processing any update.

## Troubleshooting

| Problem | Likely cause |
|---|---|
| "We couldn't sign you in" in the app | `TELEGRAM_BOT_TOKEN` on Vercel doesn't match the bot you're opening, or it's missing |
| Bot doesn't reply to `/start` | Webhook isn't set — rerun `npm run set-webhook`, then check `getWebhookInfo` |
| App shows the browser preview even inside Telegram | The Mini App URL in BotFather doesn't match your `NEXT_PUBLIC_APP_URL`, or the app was opened as a plain link instead of a Web App button |
| Firestore write fails with a permissions error | You're trying to write from the client SDK — all writes must go through the Admin SDK in the API routes; also double check `FIREBASE_ADMIN_*` variables |
| `FIREBASE_ADMIN_PRIVATE_KEY` errors on Vercel | Make sure it's pasted as one line with literal `\n` sequences, wrapped in quotes |

## License

This project was generated for your use — customize and deploy it freely.
