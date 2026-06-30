# Snake scoreboard — global, on GitHub, cheat-proof (free)

The board is **global**, the **same for every device and player**, and it **lives on GitHub** (in a Gist).
Nothing is stored or trusted on a player's device.

How it stays unhackable: the Snake game records every run as a **replay** (a random seed + the exact list
of moves). Because the whole game is a deterministic function of that replay, the score can be
**recomputed** from it.

> The browser never submits a *score* — it submits the *replay*. A tiny server (a free Cloudflare Worker)
> **re-simulates** the game, computes the real score itself, and writes it to the Gist. A faked number
> simply doesn't survive the re-simulation, and only the server can write the board.

There is **no local fallback** — until the server below is connected, the Games page just shows the
scoreboard as *"not connected yet."* That's intentional (you said: don't trust the player's device).

---

## Set it up once (free, ~10 minutes)

### 1. Make the storage — a GitHub Gist
1. Go to <https://gist.github.com>, create a **secret** gist with **one file** named `scoreboard.json`
   whose contents are exactly `[]`. Create it.
2. Copy the **Gist ID** — it's the long hex string in the URL: `https://gist.github.com/<you>/`**`<GIST_ID>`**.

### 2. Make a token that can touch *only* gists
1. <https://github.com/settings/tokens> → **Generate new token (classic)**.
2. Tick **only** the **`gist`** scope (nothing else — this token can't read or write your repos).
3. Generate and copy it (starts with `ghp_…`).

### 3. Deploy the Worker (Cloudflare)
1. Sign in at <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Create Worker**.
   Name it (e.g. `gsmg-snake`), **Deploy** the default, then **Edit code**.
2. Replace all the code with the contents of
   [`worker/scoreboard-worker.js`](../worker/scoreboard-worker.js) and **Deploy**.
3. Open the Worker → **Settings → Variables and Secrets** and add:
   - **Secret** — name `GH_TOKEN`, value = the `ghp_…` token from step 2.
   - **Variable** — name `GIST_ID`, value = the Gist ID from step 1.
   - *(optional)* **Variable** `GIST_FILE` if you named the file something other than `scoreboard.json`.
   **Deploy** again.

### 4. Point the site at the Worker
Copy the Worker URL (`https://gsmg-snake.<you>.workers.dev`) into
[`content/games.js`](../content/games.js):

```js
export const GAMES = { scoreboardUrl: 'https://gsmg-snake.<you>.workers.dev' };
```

Commit & deploy the site. The scoreboard now reads **· global · on GitHub** and every submission is
server-verified.

---

## ⚠️ Keep the Worker in sync with the game

Scores are verified by **re-simulating your replay on the server**, so the Worker must run the **same
rules** as the game. Whenever the gameplay changes, **redeploy the Worker**: open it in Cloudflare,
paste the latest [`worker/scoreboard-worker.js`](../worker/scoreboard-worker.js), and **Deploy**.

If you forget, you don't get silently-wrong scores anymore: the game sends a `RULES_VERSION` with each
submission and an out-of-date Worker **refuses the score** with a "redeploy me" message instead of saving
a number computed under the old rules. (Bump `RULES_VERSION` in both `snake-core.js` and the Worker when
you change the rules — they're kept equal on purpose.)

## Why it's cheat-proof
- The Worker **inlines the exact game simulation** (a verbatim copy of `assets/js/games/snake-core.js`)
  and re-runs the submitted `(seed, inputs)` to compute the authoritative `score` and `time`. It ignores
  any number the client claims.
- A run only counts if the inputs **genuinely produce** that score under the real rules — you can't inject
  `score: 999999`.
- The board lives in a **Gist on GitHub**, written **only** by the Worker (the token is a server secret),
  so the public can't edit it. Reads are public via the Worker.
- CORS is open (`*`) so the static site can post to it — that's fine; the Worker is the gatekeeper.

> The one thing no purely client-side game can stop is a **bot that actually plays well** and submits its
> real replay — that's inherent to any skill game. What this design *does* guarantee is that **only real,
> reproducible runs** ever reach the board, and that the board itself can't be tampered with.

> **Limits / notes.** Cloudflare free = 100k requests/day and GitHub's API is thousands/hour — far beyond
> a puzzle site's needs. The Worker does a read-modify-write of the Gist per submission; two submissions
> landing in the same instant could rarely drop one — harmless here. A token with only the **gist** scope
> can do nothing to your repository even if it leaked, but you can revoke/rotate it any time.

---

## Admin: an "Erase scoreboard" button only **you** can use (optional)

You can wipe the whole board from the Games page — but **only while signed in to GitHub as `HosterjackAGV`**.
It uses GitHub OAuth: the Worker asks GitHub who you are and only mints an admin session if your login matches.

### One-time setup (free, ~5 min)
1. **Create a GitHub OAuth App** — <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**:
   - *Application name*: anything (e.g. `GSMG Snake admin`).
   - *Homepage URL*: your site (e.g. `https://hosterjackagv.github.io/gsmg-5btc-puzzle/`).
   - *Authorization callback URL*: **`https://scoreboard-worker.hosterjack.workers.dev/auth/callback`**
     (your Worker URL + `/auth/callback`).
   - Register, copy the **Client ID**, then **Generate a new client secret** and copy it.
2. **Add them to the Worker** → *Settings → Variables and Secrets*:
   - **Variable** `GH_OAUTH_ID` = the Client ID.
   - **Secret** `GH_OAUTH_SECRET` = the Client Secret.
   - **Variable** `SITE_URL` = your site base URL, no trailing slash (e.g. `https://hosterjackagv.github.io/gsmg-5btc-puzzle`).
   - *(optional)* **Variable** `ADMIN_LOGIN` if your GitHub login isn't `HosterjackAGV`.
   - **Deploy**.
3. Done. On the Games page a small **🔒 Admin login (GitHub)** link appears under the board. Click it →
   authorize on GitHub → if you're the admin you come back logged in and an **Erase scoreboard** button
   appears. Anyone else is refused at the GitHub step.

### Why only you can erase
- The Worker only mints an admin session **after GitHub confirms your login is `HosterjackAGV`** — the
  decision is made server-side from GitHub's own `/user` API, not from anything the browser claims.
- That session is a token **HMAC-signed with the Worker's secret**, so it can't be forged; it **expires in
  24 h** and can do **nothing but erase** (no score access, no repo access). The Worker re-verifies it on
  every erase. The token rides back in the URL for a blink, then the page strips it from the address bar.

---

## Comments (same Worker, no login)

The same Worker also powers the **anonymous per-attempt comments** under each entry in *What was tried*.
There's nothing extra to set up: comments live in a second file `comments.json` in the **same Gist**
(created automatically on the first post) and reuse the same `GH_TOKEN` + `GIST_ID`. No login is needed —
people post under any name they type; the GitHub token stays on the Worker, never in the page.

To turn it on:
1. **Redeploy** `worker/scoreboard-worker.js` (it now has the `/comments` route) — paste it into your
   Worker and Deploy, exactly like a rules update.
2. Put `<your-worker-url>/comments` into [content/site.js](../content/site.js) → `commentsUrl`.

That's it. `GET /comments` returns every thread; `POST /comments {id,name,text}` appends one (name is
sanitized, text is capped at 1500 chars, a honeypot field drops obvious bots, threads are bounded to the
most recent `MAX_COMMENTS_PER_ID` — default 500). Until the Worker is redeployed, the form shows a
friendly "couldn't load / could not post" message and nothing breaks.
