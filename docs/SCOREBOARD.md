# Snake scoreboard — global & cheat-proof (free)

The Snake game records every run as a **replay** (a random seed + the exact list of moves). Because the
whole game is a deterministic function of that replay, the score can be **recomputed** from it. That's
the trick to an unhackable scoreboard:

> The client never submits a score — it submits the **replay**. The server **re-simulates** the game and
> works out the real score itself. A faked number simply doesn't survive the re-simulation.

Out of the box the board is **local** (per-browser, still re-simulated before saving). To make it a
**shared, global, cheat-proof** board, deploy the tiny verifier — it's free.

## Deploy the verifier (Cloudflare Worker, ~5 minutes, free)

1. Sign in at <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Create Worker**. Give it a name (e.g. `gsmg-snake`) and **Deploy** the default, then **Edit code**.
2. Replace the code with the contents of [`worker/scoreboard-worker.js`](../worker/scoreboard-worker.js) and **Deploy**.
3. Create the storage: **Workers & Pages → KV → Create a namespace** (e.g. `gsmg-snake-scores`). Then open your Worker → **Settings → Variables → KV Namespace Bindings → Add binding**: variable name **`SCORES`**, namespace = the one you just made. **Deploy** again.
4. Copy the Worker URL (`https://gsmg-snake.<you>.workers.dev`) into [`content/games.js`](../content/games.js):
   ```js
   export const GAMES = { scoreboardUrl: 'https://gsmg-snake.<you>.workers.dev' };
   ```
5. Commit & deploy the site. The scoreboard now shows **· global** and every submission is server-verified.

### Why it's cheat-proof
- The Worker **inlines the exact game simulation** (a verbatim copy of `assets/js/games/snake-core.js`) and re-runs the submitted `(seed, inputs)` to compute the authoritative `score` and `time`. It ignores the client's claimed number entirely.
- A run only counts if the inputs **genuinely produce** that score under the real rules — you can't inject `score: 999999`.
- Storage is **Workers KV**, written only by the Worker (the public can't edit it).
- CORS is open (`*`) so the static site can post to it; that's fine — the Worker is the gatekeeper.

> The one thing no purely client-side game can stop is a **bot that actually plays well** and submits its real replay — that's inherent to any skill game. What this design *does* guarantee is that **only real, reproducible runs** ever reach the board.

> Free-tier limits (100k requests/day) are far beyond what a puzzle-site game needs. KV is eventually consistent; for this traffic that's fine. If you ever want strict atomic ordering, swap the KV read-modify-write for a Durable Object.
