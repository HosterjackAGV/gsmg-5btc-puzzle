// games/scoreboard.js — Snake scoreboard client.
//
// Every score is RE-SIMULATED from its replay before it counts: the displayed/submitted score is
// the verifier's number, never the client's claim. With a Worker URL configured the board is
// global and the WORKER is the authority (so it's cheat-proof for everyone); without one it falls
// back to a local per-browser board (still re-simulated locally so the page can't be poked to fake it).

import { simulate } from './snake-core.js';
import { MATRIX } from '../../../content/matrix.js';
import { GAMES } from '../../../content/games.js';

const LORE = [
  ...MATRIX.blue.map(([r, c]) => ({ t: 'blue', x: c, y: r })),
  ...MATRIX.yellow.map(([r, c]) => ({ t: 'yellow', x: c, y: r })),
  ...(MATRIX.fefefe || []).map(([r, c]) => ({ t: 'fefefe', x: c, y: r })),
];
const KEY = 'gsmg:snake:board';

export function cleanName(s) {
  return String(s || '').replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'anon';
}
export function fmtTime(ms) {
  const t = Math.round((ms || 0) / 1000), m = Math.floor(t / 60), s = t % 60;
  return m + ':' + String(s).padStart(2, '0');
}

// authoritative score for a replay (used both to display honestly and to gate submissions)
export function verifyReplay(replay) {
  if (!replay || typeof replay.seed !== 'number' || !Array.isArray(replay.inputs)) return null;
  return simulate(replay.seed >>> 0, replay.inputs, LORE);
}

function loadLocal() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function saveLocal(b) { try { localStorage.setItem(KEY, JSON.stringify(b.slice(0, 25))); } catch {} }
const sortBoard = (b) => b.sort((a, c) => c.score - a.score || a.timeMs - c.timeMs).slice(0, 25);

export async function fetchBoard() {
  if (GAMES.scoreboardUrl) {
    try {
      const r = await fetch(GAMES.scoreboardUrl, { cache: 'no-store' });
      if (r.ok) { const d = await r.json(); return { global: true, board: d.board || [] }; }
    } catch {}
  }
  return { global: false, board: loadLocal() };
}

export async function submitScore(name, replay) {
  const v = verifyReplay(replay);
  if (!v || v.score <= 0) return { ok: false, error: 'No valid run to submit yet.' };
  const nm = cleanName(name);

  if (GAMES.scoreboardUrl) {
    try {
      const r = await fetch(GAMES.scoreboardUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nm, seed: replay.seed >>> 0, inputs: replay.inputs }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) return { ok: true, global: true, board: d.board || [], rank: d.rank, score: v.score, timeMs: v.timeMs };
      return { ok: false, error: d.error || ('server said ' + r.status) };
    } catch (e) { return { ok: false, error: 'Could not reach the scoreboard server.' }; }
  }

  // local fallback
  const entry = { name: nm, score: v.score, timeMs: v.timeMs, date: Date.now() };
  const board = sortBoard([...loadLocal(), entry]);
  saveLocal(board);
  return { ok: true, global: false, board, rank: board.indexOf(entry) + 1, score: v.score, timeMs: v.timeMs };
}

export const isGlobal = () => !!GAMES.scoreboardUrl;
