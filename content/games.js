// content/games.js — games configuration.
//
// scoreboardUrl — the global Snake scoreboard endpoint (a free Cloudflare Worker). The board is
// PERSISTED ON GITHUB (a Gist) so it's the same for every device and player, and nothing is stored
// or trusted on the player's device. The client submits the recorded game (seed + inputs); the
// Worker RE-SIMULATES it to compute the real score before saving, so fake scores can't get on the
// board. Deploy it once (free, ~10 min) — see docs/SCOREBOARD.md — and paste the worker URL here.
//
// Until it's set, the Games page shows the scoreboard as "not connected yet" (no local fallback —
// the board is intentionally server-only).

export const GAMES = {
  scoreboardUrl: '',     // e.g. 'https://gsmg-snake.<you>.workers.dev'
};
