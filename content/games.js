// content/games.js — games configuration.
//
// scoreboardUrl — OPTIONAL global, CHEAT-PROOF Snake scoreboard. A static page can't verify
// scores on its own (anyone could POST a fake number to an open database), so the only honest
// "unhackable" design is server-side replay verification: the client submits the recorded game
// (seed + inputs), and the server RE-SIMULATES it to compute the real score. Deploy the free
// Cloudflare Worker in docs/SCOREBOARD.md (~5 min) and paste its URL here.
//
// Leave it '' and the scoreboard is LOCAL only (per-browser, still tamper-checked client-side by
// re-simulating the replay before saving) — global play just isn't shared until the Worker is up.

export const GAMES = {
  scoreboardUrl: '',     // e.g. 'https://gsmg-snake.<you>.workers.dev'
};
