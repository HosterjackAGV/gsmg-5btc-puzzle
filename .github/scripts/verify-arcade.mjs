// verify-arcade.mjs — re-verifies submitted MINI-GAME scores by RE-SIMULATING
// the player's move-log with the exact same deterministic logic the browser ran
// (assets/js/games/sim/*), then rebuilds data/arcade-leaderboard.json.
//
// Trust nothing: a claimed score only counts if this script reproduces it from
// (seed, level, moves). The competitive board ranks each player's BEST verified
// score per game, summed into an arcade total. Idle games are not submitted here.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { simulate as cryptogram } from '../../assets/js/games/sim/cryptogram.js';

// Hard-coded set of replay-verifiable games. Keep aligned with games/registry.js
// (the `verifiable: true` entries) and games/sim/*.
const SIMS = { cryptogram };
const MAX_SCORES = 200, MAX_MOVES = 2000;

const sha256hex = (s) => createHash('sha256').update(String(s)).digest('hex');
function readJSONL(p) {
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8').split('\n').map(l => l.trim()).filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function rebuild() {
  const all = readJSONL('data/arcade-scores.jsonl');
  const bestHG = new Map();                     // handle|game -> best record
  for (const r of all) { const k = r.by + '|' + r.game; const cur = bestHG.get(k); if (!cur || r.score > cur.score) bestHG.set(k, r); }
  const byH = new Map();                         // handle -> totals
  for (const r of bestHG.values()) {
    if (!byH.has(r.by)) byH.set(r.by, { handle: r.by, total: 0, games: {}, last: 0 });
    const h = byH.get(r.by); h.games[r.game] = r.score; h.total += r.score; h.last = Math.max(h.last, r.ts || 0);
  }
  const rows = [...byH.values()].sort((a, b) => (b.total - a.total) || (b.last - a.last));
  const lb = { updated: Math.floor(Date.now() / 1000), rows, totals: { players: rows.length, scores: all.length, games: Object.keys(SIMS) } };
  writeFileSync('data/arcade-leaderboard.json', JSON.stringify(lb, null, 1));
  return lb;
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
      let res; try { res = sim(seed, level, moves); } catch { bad++; continue; }
      if (!res || !res.solved || !(res.score > 0)) { bad++; continue; }   // only real solves count
      const id = sha256hex(`${game}|${seed}|${level}|${JSON.stringify(moves)}`);
      if (seen.has(id)) { dup++; continue; }
      seen.add(id); add.push({ id, by: handle, gh: ghUser, game, seed, level, score: res.score, ts: Math.floor(Date.now() / 1000) }); ok++;
    }
    if (add.length) writeFileSync('data/arcade-scores.jsonl', existing.concat(add).map(o => JSON.stringify(o)).join('\n') + '\n');
    summary = `**Verified ${ok} new score(s)** from \`${handle}\` (GitHub: @${ghUser}).\n\n- new & counted: **${ok}**\n- duplicates already logged: ${dup}\n- invalid/unverifiable/skipped: ${bad}\n`;
  } else summary = 'Could not parse the JSON block.';
} else summary = 'No `json gsmg-arcade` block found.';

const lb = rebuild();
summary += `\nArcade board rebuilt: ${lb.rows.length} players, ${lb.totals.scores} verified scores.`;
writeFileSync('arcade-summary.txt', summary); console.log(summary);
