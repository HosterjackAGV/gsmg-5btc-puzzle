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
