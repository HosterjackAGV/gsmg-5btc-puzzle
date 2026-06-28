// scoreboard-worker.js — the cheat-proof Snake scoreboard verifier (Cloudflare Worker).
//
// The client submits a RECORDED GAME (seed + inputs), never a score. This Worker re-simulates the
// game with the exact same rules and computes the authoritative score & time itself, so a fake
// number can't get on the board — only a real, reproducible run does. Top scores live in Workers KV.
//
// DEPLOY (free; see docs/SCOREBOARD.md):
//   1. Cloudflare dashboard → Workers & Pages → create a Worker, paste this file.
//   2. Create a KV namespace, bind it to the Worker as the variable name  SCORES.
//   3. Deploy, copy the worker URL into content/games.js → scoreboardUrl.
//
// The simulation below is a verbatim copy of assets/js/games/snake-core.js — keep them in sync.

const N = 14, START_LEN = 3;
const SLOW_MS = 230, FAST_MS = 95, RAMP = 50;
const ENEMY_MOVE_SCORE = 8, POWERUP_TTL = 75, POWERUP_EVERY = 60, MAX_ENEMIES = 6;
const MAX_TICKS = 250000, MAX_INPUTS = 200000;
const speedMs = (s) => Math.round(Math.max(FAST_MS, SLOW_MS - (SLOW_MS - FAST_MS) * Math.min(1, s / RAMP)));
const enemyTTL = (s) => 34 + s * 4;

// genesis "significative boxes" (blue / yellow / #FEFEFE cells) — must match content/matrix.js
const LORE = [
  ['blue', 5, 0], ['blue', 2, 1], ['blue', 10, 1], ['blue', 7, 2], ['blue', 4, 3], ['blue', 1, 4], ['blue', 3, 6],
  ['blue', 0, 7], ['blue', 5, 8], ['blue', 13, 8], ['blue', 2, 9], ['blue', 8, 11], ['blue', 1, 12], ['blue', 2, 13], ['blue', 10, 13],
  ['yellow', 13, 0], ['yellow', 9, 4], ['yellow', 6, 5], ['yellow', 10, 5], ['yellow', 11, 6], ['yellow', 12, 7], ['yellow', 6, 9], ['yellow', 7, 10], ['yellow', 9, 12],
  ['fefefe', 4, 7],
].map(([t, x, y]) => ({ t, x, y }));

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ri = (rng, n) => Math.floor(rng() * n);
function occupied(s, x, y) { return s.snake.some(q => q.x === x && q.y === y) || s.enemies.some(e => e.x === x && e.y === y) || (s.food && s.food.x === x && s.food.y === y) || s.powerups.some(p => p.x === x && p.y === y); }
function placeFood(s) { let x, y, n = 0; do { x = ri(s.rng, N); y = ri(s.rng, N); n++; } while (occupied(s, x, y) && n < 500); s.food = { x, y }; }
function freeLore(s, type) { const pool = s.lore.filter(c => (!type || c.t === type) && !occupied(s, c.x, c.y)); return pool.length ? pool[ri(s.rng, pool.length)] : null; }
function spawnEnemy(s) { if (s.enemies.length >= MAX_ENEMIES) return; const c = freeLore(s); if (!c) return; s.enemies.push({ x: c.x, y: c.y, dir: [[1, 0], [-1, 0], [0, 1], [0, -1]][ri(s.rng, 4)], expires: s.tick + enemyTTL(s.score) }); }
function spawnPowerup(s) { if (s.powerups.length) return; const r = s.rng(); let type; if (s.score >= 10 && r < 0.02) type = 'reset'; else if (r < 0.10) type = 'fefefe'; else type = s.rng() < 0.5 ? 'blue' : 'yellow'; const want = (type === 'reset' || type === 'fefefe') ? 'fefefe' : type; const c = freeLore(s, want) || freeLore(s); if (!c) return; s.powerups.push({ x: c.x, y: c.y, type, ttl: s.tick + POWERUP_TTL }); }
function applyInput(s, x, y) { if (s.status !== 'playing') return; const last = s.queue.length ? s.queue[s.queue.length - 1] : s.dir; if ((x === -last.x && y === -last.y) || (x === last.x && y === last.y)) return; if (s.queue.length >= 2) return; s.queue.push({ x, y }); }
function moveEnemies(s) { for (const e of s.enemies) { if (s.rng() < 0.35) { const h = s.snake[0]; e.dir = Math.abs(h.x - e.x) > Math.abs(h.y - e.y) ? [Math.sign(h.x - e.x) || 1, 0] : [0, Math.sign(h.y - e.y) || 1]; } let nx = e.x + e.dir[0], ny = e.y + e.dir[1]; if (nx < 0 || nx >= N || ny < 0 || ny >= N) { e.dir = [-e.dir[0], -e.dir[1]]; nx = e.x + e.dir[0]; ny = e.y + e.dir[1]; } if (nx >= 0 && nx < N && ny >= 0 && ny < N) { e.x = nx; e.y = ny; } } }
function step(s) {
  if (s.status !== 'playing') return false;
  s.timeMs += speedMs(s.score); s.tick++;
  if (s.queue.length) s.dir = s.queue.shift();
  const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
  const shielded = s.power && s.power.type === 'blue' && s.power.until > s.tick;
  if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) { s.status = 'over'; return false; }
  if (s.snake.some(q => q.x === head.x && q.y === head.y) && !shielded) { s.status = 'over'; return false; }
  if (s.enemies.some(e => e.x === head.x && e.y === head.y)) { if (!shielded) { s.status = 'over'; return false; } s.enemies = s.enemies.filter(e => !(e.x === head.x && e.y === head.y)); }
  s.snake.unshift(head);
  if (s.food && head.x === s.food.x && head.y === s.food.y) { const dbl = s.power && s.power.type === 'yellow' && s.power.until > s.tick; s.score += dbl ? 2 : 1; if (s.score % 3 === 0) spawnEnemy(s); placeFood(s); } else s.snake.pop();
  const pi = s.powerups.findIndex(p => p.x === head.x && p.y === head.y);
  if (pi >= 0) { const p = s.powerups.splice(pi, 1)[0]; if (p.type === 'fefefe') { s.enemies = []; s.score += 5; } else if (p.type === 'reset') { s.snake = s.snake.slice(0, START_LEN); } else s.power = { type: p.type, until: s.tick + 45 }; }
  if (s.power && s.power.until <= s.tick) s.power = null;
  s.powerups = s.powerups.filter(p => p.ttl > s.tick);
  s.enemies = s.enemies.filter(e => e.expires > s.tick);
  if (s.score >= ENEMY_MOVE_SCORE && s.tick % 2 === 0) moveEnemies(s);
  if (s.tick % POWERUP_EVERY === 0) spawnPowerup(s);
  if (s.enemies.some(e => e.x === head.x && e.y === head.y) && !shielded) { s.status = 'over'; return false; }
  return true;
}
function simulate(seed, inputs) {
  if (!Array.isArray(inputs) || inputs.length > MAX_INPUTS) return null;
  const s = { rng: mulberry32(seed >>> 0), lore: LORE, snake: [{ x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }], dir: { x: 0, y: -1 }, queue: [], food: null, enemies: [], powerups: [], score: 0, tick: 0, timeMs: 0, status: 'playing', power: null };
  placeFood(s);
  let ip = 0;
  while (s.status === 'playing' && s.tick < MAX_TICKS) {
    while (ip < inputs.length && inputs[ip] && inputs[ip].t === s.tick) { applyInput(s, inputs[ip].dx | 0, inputs[ip].dy | 0); ip++; }
    step(s);
  }
  return { score: s.score, ticks: s.tick, timeMs: s.timeMs };
}

const cleanName = (s) => String(s || '').replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'anon';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', ...CORS } });

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const board = JSON.parse((await env.SCORES.get('board')) || '[]');

    if (request.method === 'GET') return json({ board: board.slice(0, 25) });

    if (request.method === 'POST') {
      let body; try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
      const { name, seed, inputs } = body || {};
      if (typeof seed !== 'number' || !Array.isArray(inputs) || inputs.length > 60000) return json({ error: 'bad replay' }, 400);
      const v = simulate(seed >>> 0, inputs);                       // ← the verification
      if (!v || v.score <= 0) return json({ error: 'replay did not produce a score' }, 400);
      const entry = { name: cleanName(name), score: v.score, timeMs: v.timeMs, date: Date.now() };
      board.push(entry);
      board.sort((a, c) => c.score - a.score || a.timeMs - c.timeMs);
      const top = board.slice(0, 100);
      await env.SCORES.put('board', JSON.stringify(top));
      return json({ ok: true, board: top.slice(0, 25), rank: top.indexOf(entry) + 1, score: v.score, timeMs: v.timeMs });
    }
    return json({ error: 'method' }, 405);
  },
};

// (Cloudflare only uses the default export; these named exports just let the repo's test
//  cross-check that this inlined simulation stays identical to assets/js/games/snake-core.js.)
export { simulate, LORE };
