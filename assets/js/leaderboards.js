// leaderboards.js — merge the two community boards into one "overall" ranking.
// The puzzle Hive (data/leaderboard.json) and the Arcade (data/arcade-leaderboard.json)
// stay fully separate; this only computes a combined standing on top of them, by handle.
//   overall = arcade_points + 50·frontier_attempts + 5·novel_attempts
// Frontier work (the real puzzle) is weighted far above arcade points on purpose.

import { esc, ago } from './util.js';

const key = (h) => String(h || '').trim().toLowerCase();

export async function fetchJSON(url) {
  try { const r = await fetch(url, { cache: 'no-store' }); return r.ok ? await r.json() : null; } catch { return null; }
}

export async function loadBoards() {
  const [puzzle, arcade] = await Promise.all([
    fetchJSON('data/leaderboard.json'),
    fetchJSON('data/arcade-leaderboard.json'),
  ]);
  return { puzzle, arcade, overall: mergeOverall(puzzle, arcade) };
}

export function mergeOverall(puzzle, arcade) {
  const map = new Map();
  const row = (h) => { const k = key(h); if (!map.has(k)) map.set(k, { handle: h, frontier: 0, novel: 0, tries: 0, arcade: 0, games: 0, last: 0 }); return map.get(k); };
  ((puzzle && puzzle.rows) || []).forEach(r => { const o = row(r.handle); o.frontier = r.frontier || 0; o.novel = r.novel || 0; o.tries = r.tries || 0; o.last = Math.max(o.last, r.last || 0); });
  ((arcade && arcade.rows) || []).forEach(r => { const o = row(r.handle); o.arcade = r.total || 0; o.games = Object.keys(r.games || {}).length; o.last = Math.max(o.last, r.last || 0); });
  const rows = [...map.values()].map(o => ({ ...o, score: o.arcade + 50 * o.frontier + 5 * o.novel }));
  rows.sort((a, b) => (b.score - a.score) || (b.last - a.last));
  return rows;
}

export function overallTableHTML(rows) {
  if (!rows || !rows.length) return `<p class="faint center">No champions yet — contribute on the frontier or play a ranked arcade game.</p>`;
  return `<div style="overflow-x:auto"><table class="ref"><thead><tr>
    <th>#</th><th>champion</th><th class="center">overall</th><th class="center">frontier</th><th class="center">novel</th><th class="center">arcade</th><th class="center">last</th>
    </tr></thead><tbody>${rows.map((r, i) => `<tr>
      <td class="lab">${i + 1}</td><td>${esc(r.handle || 'anon')}</td>
      <td class="center gold">${r.score}</td><td class="center teal">${r.frontier}</td>
      <td class="center">${r.novel}</td><td class="center">${r.arcade}</td>
      <td class="faint center">${r.last ? ago(r.last * 1000) : '—'}</td></tr>`).join('')}</tbody></table></div>`;
}
