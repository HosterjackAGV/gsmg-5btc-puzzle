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
  if (isNaN(d.getTime())) return '—';
  try { return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }   // viewer's own locale + timezone
  catch { return d.toISOString().slice(0, 16).replace('T', ' '); }
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

// ---- admin (only GitHub user HosterjackAGV; verified server-side via GitHub OAuth) ----
const ADMIN_KEY = 'gsmg:snake:admin';
const base = () => (GAMES.scoreboardUrl || '').replace(/\/$/, '');
function decodeToken(t) {
  try {
    const bin = atob(String(t).split('.')[0].replace(/-/g, '+').replace(/_/g, '/'));
    const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(a));
  } catch { return null; }
}
export function captureAdminToken() {                 // grab ?admin=<token> after returning from GitHub OAuth
  try {
    const u = new URL(location.href), t = u.searchParams.get('admin');
    if (!t) return false;
    localStorage.setItem(ADMIN_KEY, t);
    u.searchParams.delete('admin');
    history.replaceState(null, '', u.pathname + (u.search ? u.search : '') + (u.hash || ''));
    return true;
  } catch { return false; }
}
export function adminToken() {
  try {
    const t = localStorage.getItem(ADMIN_KEY); if (!t) return null;
    const p = decodeToken(t);
    if (!p || !p.login || !p.exp || p.exp < Date.now()) { localStorage.removeItem(ADMIN_KEY); return null; }   // server re-verifies anyway
    return t;
  } catch { return null; }
}
export const isAdmin = () => !!adminToken();
export function adminLogin() { const p = decodeToken(adminToken() || ''); return p && p.login; }
export function adminLogout() { try { localStorage.removeItem(ADMIN_KEY); } catch {} }
export const adminLoginUrl = () => base() ? base() + '/auth/login' : null;

export async function wipeBoard() {                   // server re-verifies the admin token before erasing
  if (!base()) return { ok: false, error: 'The scoreboard isn’t connected.' };
  const t = adminToken(); if (!t) return { ok: false, error: 'Not logged in as the admin.' };
  try {
    const r = await fetch(base() + '/wipe', { method: 'POST', headers: { 'Authorization': 'Bearer ' + t } });
    const d = await r.json().catch(() => ({}));
    if (r.ok) return { ok: true, board: d.board || [] };
    if (r.status === 401 || r.status === 403) adminLogout();
    return { ok: false, error: d.error || ('server said ' + r.status) };
  } catch { return { ok: false, error: 'Could not reach the scoreboard server.' }; }
}
