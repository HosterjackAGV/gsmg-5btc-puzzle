// games/scoreboard.js — Snake scoreboard client.
//
// The board is GLOBAL and lives on GitHub (a Gist), written only by the verifier Worker. The client
// NEVER stores the board and NEVER submits a score — it submits the recorded game (seed + inputs),
// the Worker re-simulates it and writes the authoritative score. Nothing here is trusted on the
// player's device. (Only the player's chosen display-name is remembered locally, for convenience.)

import { simulate } from './snake-core.js';
import { MATRIX } from '../../../content/matrix.js';
import { GAMES } from '../../../content/games.js';

const LORE = [
  ...MATRIX.blue.map(([r, c]) => ({ t: 'blue', x: c, y: r })),
  ...MATRIX.yellow.map(([r, c]) => ({ t: 'yellow', x: c, y: r })),
  ...(MATRIX.fefefe || []).map(([r, c]) => ({ t: 'fefefe', x: c, y: r })),
];

export const isConfigured = () => !!GAMES.scoreboardUrl;
export function cleanName(s) {
  return String(s || '').replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'anon';
}
export function fmtTime(ms) {
  const t = Math.round((ms || 0) / 1000), m = Math.floor(t / 60), s = t % 60;
  return m + ':' + String(s).padStart(2, '0');
}
export function fmtDate(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  return isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 10);   // YYYY-MM-DD (UTC)
}
export function verifyReplay(replay) {
  if (!replay || typeof replay.seed !== 'number' || !Array.isArray(replay.inputs)) return null;
  return simulate(replay.seed >>> 0, replay.inputs, LORE);   // local sanity check before bothering the server
}

export async function fetchBoard() {
  if (!GAMES.scoreboardUrl) return { board: [], configured: false };
  try {
    const r = await fetch(GAMES.scoreboardUrl, { cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    return { board: Array.isArray(d.board) ? d.board : [], configured: true, error: r.ok ? null : (d.error || ('server ' + r.status)) };
  } catch { return { board: [], configured: true, error: 'Could not reach the scoreboard server.' }; }
}

export async function submitScore(name, replay) {
  if (!GAMES.scoreboardUrl) return { ok: false, error: 'The global scoreboard isn’t connected yet.' };
  const v = verifyReplay(replay);
  if (!v || v.score <= 0) return { ok: false, error: 'No valid run to submit.' };
  try {
    const r = await fetch(GAMES.scoreboardUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cleanName(name), seed: replay.seed >>> 0, inputs: replay.inputs }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) return { ok: true, board: d.board || [], rank: d.rank, score: d.score, timeMs: d.timeMs };
    return { ok: false, error: d.error || ('server said ' + r.status) };
  } catch { return { ok: false, error: 'Could not reach the scoreboard server.' }; }
}
