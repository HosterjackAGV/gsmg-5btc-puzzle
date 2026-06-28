# Traffic & view counts

This site shows a **privacy-friendly view counter** on every section and a **total** on the home page, and it can optionally feed a **private traffic dashboard** and show **live concurrent viewers**. Everything runs client-side on the static GitHub Pages site — there is no backend.

All of it is configured in one file: [`content/analytics.js`](../content/analytics.js).

## 1. View counts — on by default, zero setup

Each section's view count comes from a free, **keyless** counter service (Abacus, with CounterAPI as an automatic fallback). It stores **only a number** per section — no cookies, no IP logging, no personal data — so it is GDPR/CCPA-safe and needs no consent banner. A section is counted **once per browser session** (so refreshes don't inflate it); revisits just re-read and display.

Nothing to do — it works as soon as the site is deployed. To turn it off, set `showCounts: false`.

## 2. Your private traffic dashboard — optional, free, ~2 minutes

For the full picture (views per section over time, referrers, countries, screen sizes) use **[GoatCounter](https://www.goatcounter.com)** — free, open-source, and GDPR-friendly (no cookies, no personal data).

1. Sign up at <https://www.goatcounter.com> and pick a site code (you get `https://<code>.goatcounter.com`).
2. Put that code in `content/analytics.js`:
   ```js
   goatcounterCode: 'yourcode',
   ```
3. Deploy. Every section view is now recorded under its own path (`/walkthrough`, `/tried`, …) and visible on your GoatCounter dashboard.

> Alternatives that are equally free/legal if you prefer: **Cloudflare Web Analytics**, **counter.dev**, or self-hosted **Umami/Plausible**. GoatCounter is wired in here because it also exposes per-path counts cleanly.

## 3. Live concurrent viewers — optional, needs a free realtime backend

"X people viewing now" requires a realtime database (a plain static site can't track presence on its own). The free path is **Firebase Realtime Database**:

1. <https://console.firebase.google.com> → **Add project** (free Spark plan) → build **Realtime Database**.
2. Set its **rules** to allow the presence path (read-only data, write only your own heartbeat):
   ```json
   { "rules": { "presence": { ".read": true, "$section": { "$id": { ".write": true } } } } }
   ```
3. Copy the database URL (`https://<project>-default-rtdb.firebaseio.com`) into `content/analytics.js`:
   ```js
   firebaseDbUrl: 'https://<project>-default-rtdb.firebaseio.com',
   ```

Each viewer writes a server-timestamp heartbeat every 20 s under `presence/<section>/<id>`; "live now" counts heartbeats newer than 45 s. Leaving the page best-effort-deletes the entry; stale ones age out of the window. The Firebase config/URL is **not a secret** (security comes from the rules above). Leave `firebaseDbUrl: ''` and the live indicator simply never appears.

> Supabase Realtime (presence channels) and Ably (free tier) work too; both also need a free account + a public key. Firebase is wired in because its REST API needs no SDK.
