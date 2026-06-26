// verify-arcade.mjs — re-verifies submitted MINI-GAME scores by RE-SIMULATING the
// player's move-log with the exact deterministic logic the browser ran (games/sim/*),
// then rebuilds data/arcade-leaderboard.json AND data/tournaments.json.
//
// Trust nothing: a claimed score only counts if this script reproduces it from
// (seed, level, moves). Weekly-tournament scores (seed = "tourney|game|week|div")
// are bucketed by (game, week, division) so close-level players compete; the level
// must match the division's level or the score is rejected.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { simulate as cryptogram } from '../../assets/js/games/sim/cryptogram.js';
import { simulate as fielddecode } from '../../assets/js/games/sim/fielddecode.js';
import { simulate as hashhunt } from '../../assets/js/games/sim/hashhunt.js';
import { parseWeeklySeed, levelForDivision, divisionFor } from '../../assets/js/games/divisions.js';

// Keep aligned with games/registry.js (`verifiable: true`) and games/sim/*.
const SIMS = { cryptogram, fielddecode, hashhunt };
const MAX_SCORES = 200, MAX_MOVES = 3000;

const sha256hex = (s) => createHash('sha256').update(String(s)).digest('hex');
function readJSONL(p) {
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8').split('\n').map(l => l.trim()).filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function rebuild() {
  const all = readJSONL('data/arcade-scores.jsonl');

  // ---- overall arcade board: best per (handle, game), summed ----
  const bestHG = new Map();
  for (const r of all) { const k = r.by + '|' + r.game; const cur = bestHG.get(k); if (!cur || r.score > cur.score) bestHG.set(k, r); }
  const byH = new Map();
  for (const r of bestHG.values()) {
    if (!byH.has(r.by)) byH.set(r.by, { handle: r.by, total: 0, games: {}, last: 0 });
    const h = byH.get(r.by); h.games[r.game] = r.score; h.total += r.score; h.last = Math.max(h.last, r.ts || 0);
  }
  const rows = [...byH.values()].map(h => ({ ...h, division: divisionFor(h.total).key }));
  rows.sort((a, b) => (b.total - a.total) || (b.last - a.last));
  writeFileSync('data/arcade-leaderboard.json', JSON.stringify({ updated: Math.floor(Date.now() / 1000), rows, totals: { players: rows.length, scores: all.length, games: Object.keys(SIMS) } }, null, 1));

  // ---- weekly tournaments: best per handle within each (game, week, division) ----
  const tg = new Map(); // "game|week|div" -> Map(handle -> bestScore)
  for (const r of all) {
    if (!r.week || !r.division) continue;
    const k = `${r.game}|${r.week}|${r.division}`;
    if (!tg.has(k)) tg.set(k, new Map());
    const m = tg.get(k); if (!m.has(r.by) || r.score > m.get(r.by)) m.set(r.by, r.score);
  }
  const boards = [...tg.entries()].map(([k, m]) => {
    const [game, week, division] = k.split('|');
    const players = [...m.entries()].map(([handle, score]) => ({ handle, score })).sort((a, b) => b.score - a.score);
    return { game, week, division, players };
  });
  writeFileSync('data/tournaments.json', JSON.stringify({ updated: Math.floor(Date.now() / 1000), boards }, null, 1));

  return { rows, boards };
}

let ev = {}; try { if (existsSync(process.env.GITHUB_EVENT_PATH || '')) { const t = readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8').trim(); if (t) ev = JSON.parse(t); } } catch { ev = {}; }
const issue = ev.issue || {}; const ghUser = (issue.user && issue.user.login) || 'unknown'; const body = issue.body || '';
const m = body.match(/```json\s*gsmg-arcade\s*([\s\S]*?)```/i) || body.match(/```json\s*([\s\S]*?)```/i);

let summary = '';
if (m) {
  let parsed = null; try { parsed = JSON.parse(m[1].trim()); } catch {}
  if (parsed) {
    const handle = (String(parsed.handle || ghUser).slice(0, 32).replace(/[^\w .\-]/g, '')) || ghUser;
    const inS = Array.isArray(parsed.scores) ? parsed.scores.slice(0, MAX_SCORES) : [];
    const existing = readJSONL('data/arcade-scores.jsonl'); const seen = new Set(existing.map(a => a.id));
    let ok = 0, dup = 0, bad = 0; const add = [];
    for (const s of inS) {
      const game = String(s.game || ''); const sim = SIMS[game];
      const seed = String(s.seed || ''); const level = s.level | 0;
      const moves = Array.isArray(s.moves) ? s.moves.slice(0, MAX_MOVES) : [];
      if (!sim || !seed || !level) { bad++; continue; }

      // weekly-tournament scores must use the division's level (anti-sandbagging)
      const wk = parseWeeklySeed(seed);
      if (wk && (wk.game !== game || level !== levelForDivision(wk.division))) { bad++; continue; }

      let res; try { res = sim(seed, level, moves); } catch { bad++; continue; }
      if (!res || !res.solved || !(res.score > 0)) { bad++; continue; }
      const id = sha256hex(`${game}|${seed}|${level}|${JSON.stringify(moves)}`);
      if (seen.has(id)) { dup++; continue; }
      seen.add(id);
      const rec = { id, by: handle, gh: ghUser, game, seed, level, score: res.score, ts: Math.floor(Date.now() / 1000) };
      if (wk) { rec.week = wk.week; rec.division = wk.division; }
      add.push(rec); ok++;
    }
    if (add.length) writeFileSync('data/arcade-scores.jsonl', existing.concat(add).map(o => JSON.stringify(o)).join('\n') + '\n');
    summary = `**Verified ${ok} new score(s)** from \`${handle}\` (GitHub: @${ghUser}).\n\n- new & counted: **${ok}**\n- duplicates already logged: ${dup}\n- invalid/unverifiable/skipped: ${bad}\n`;
  } else summary = 'Could not parse the JSON block.';
} else summary = 'No `json gsmg-arcade` block found.';

const lb = rebuild();
summary += `\nArcade board rebuilt: ${lb.rows.length} players, ${lb.boards.length} active tournament bracket(s).`;
writeFileSync('arcade-summary.txt', summary); console.log(summary);
