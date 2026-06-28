// games/snake-core.js — deterministic, render-free Snake simulation.
//
// This is the SINGLE SOURCE OF TRUTH for the rules, used by BOTH the in-browser game and the
// server-side score verifier. Because the whole game is a pure function of (seed, inputs) — a
// seeded PRNG drives every spawn — `simulate(seed, inputs)` reproduces the EXACT score and
// game-time. That is what makes the scoreboard cheat-proof: the server recomputes the score from
// the recorded replay, so a client can never just POST a fake number. (The same file is inlined
// in the Cloudflare Worker verifier — keep them in sync.)

export const N = 14;
export const START_LEN = 3;

// Speed curve: slow at the start, ramping to the human-reaction maximum by score RAMP, then flat.
const SLOW_MS = 230, FAST_MS = 95, RAMP = 50;
export function speedMs(score) {
  return Math.round(Math.max(FAST_MS, SLOW_MS - (SLOW_MS - FAST_MS) * Math.min(1, score / RAMP)));
}
// Enemies stay FROZEN until the score reaches this; then they roam — slowly at first, faster later.
const ENEMY_MOVE_SCORE = 15;
const enemyMoveEvery = (s) => s >= 30 ? 2 : 3;       // ticks per enemy step (lower = faster)
// Enemies always vanish after a while; the higher the score, the longer they linger (more dangerous).
export function enemyTTL(score) { return 34 + score * 4; }
// Power-ups always vanish; the RARER the power-up, the SHORTER it stays on the field.
const PU_TTL = { blue: 80, yellow: 90, fefefe: 48, reset: 26 };
const POWERUP_EVERY = 60, MAX_ENEMIES = 6;
const MAX_TICKS = 250000, MAX_INPUTS = 200000;

// deterministic PRNG (mulberry32)
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const ri = (rng, n) => Math.floor(rng() * n);

// lore = [{ t:'blue'|'yellow'|'fefefe', x, y }] — the genesis "significative boxes" (spawn points).
export function createSim(seed, lore) {
  const sim = {
    rng: mulberry32(seed >>> 0), lore,
    snake: [{ x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }],
    dir: { x: 0, y: -1 }, queue: [],
    food: null, enemies: [], powerups: [],
    score: 0, tick: 0, timeMs: 0, status: 'playing', power: null, flash: null,
  };
  placeFood(sim);
  return sim;
}

function occupied(sim, x, y) {
  return sim.snake.some(s => s.x === x && s.y === y) || sim.enemies.some(e => e.x === x && e.y === y)
    || (sim.food && sim.food.x === x && sim.food.y === y) || sim.powerups.some(p => p.x === x && p.y === y);
}
function placeFood(sim) { let x, y, n = 0; do { x = ri(sim.rng, N); y = ri(sim.rng, N); n++; } while (occupied(sim, x, y) && n < 500); sim.food = { x, y }; }
function freeLore(sim, type) { const pool = sim.lore.filter(c => (!type || c.t === type) && !occupied(sim, c.x, c.y)); return pool.length ? pool[ri(sim.rng, pool.length)] : null; }

function spawnEnemy(sim) {
  if (sim.enemies.length >= MAX_ENEMIES) return;
  const c = freeLore(sim); if (!c) return;
  sim.enemies.push({ x: c.x, y: c.y, dir: [[1, 0], [-1, 0], [0, 1], [0, -1]][ri(sim.rng, 4)], expires: sim.tick + enemyTTL(sim.score) });
  sim.flash = { x: c.x, y: c.y, t: sim.tick };
}
function spawnPowerup(sim) {
  if (sim.powerups.length) return;
  const r = sim.rng();
  let type;
  if (sim.score >= 10 && r < 0.02) type = 'reset';          // incredibly rare: reset length, keep score
  else if (r < 0.10) type = 'fefefe';                       // rare: wipe enemies
  else type = sim.rng() < 0.5 ? 'blue' : 'yellow';
  const want = (type === 'reset' || type === 'fefefe') ? 'fefefe' : type;
  const c = freeLore(sim, want) || freeLore(sim); if (!c) return;
  sim.powerups.push({ x: c.x, y: c.y, type, ttl: sim.tick + (PU_TTL[type] || 70) });
}

// queue a turn — rejects 180° reversals & duplicates, validating against the last queued/current
// direction so a fast double-input can never turn the snake back into its own neck.
export function applyInput(sim, x, y) {
  if (sim.status !== 'playing') return false;
  const last = sim.queue.length ? sim.queue[sim.queue.length - 1] : sim.dir;
  if ((x === -last.x && y === -last.y) || (x === last.x && y === last.y)) return false;
  if (sim.queue.length >= 2) return false;
  sim.queue.push({ x, y }); return true;
}

function die(sim) { sim.status = 'over'; return false; }

export function step(sim) {
  if (sim.status !== 'playing') return false;
  sim.timeMs += speedMs(sim.score);
  sim.tick++;
  if (sim.queue.length) sim.dir = sim.queue.shift();
  const head = { x: sim.snake[0].x + sim.dir.x, y: sim.snake[0].y + sim.dir.y };
  const shielded = sim.power && sim.power.type === 'blue' && sim.power.until > sim.tick;

  if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) return die(sim);     // wall
  if (sim.snake.some(s => s.x === head.x && s.y === head.y) && !shielded) return die(sim);   // body
  if (sim.enemies.some(e => e.x === head.x && e.y === head.y)) {                    // enemy
    if (!shielded) return die(sim);
    sim.enemies = sim.enemies.filter(e => !(e.x === head.x && e.y === head.y));
  }
  sim.snake.unshift(head);

  if (sim.food && head.x === sim.food.x && head.y === sim.food.y) {
    const dbl = sim.power && sim.power.type === 'yellow' && sim.power.until > sim.tick;
    sim.score += dbl ? 2 : 1;
    if (sim.score % 3 === 0) spawnEnemy(sim);
    placeFood(sim);
  } else sim.snake.pop();

  const pi = sim.powerups.findIndex(p => p.x === head.x && p.y === head.y);
  if (pi >= 0) {
    const p = sim.powerups.splice(pi, 1)[0];
    if (p.type === 'fefefe') { sim.enemies = []; sim.score += 5; sim.flash = { x: head.x, y: head.y, t: sim.tick, big: 1 }; }
    else if (p.type === 'reset') { sim.snake = sim.snake.slice(0, START_LEN); sim.flash = { x: head.x, y: head.y, t: sim.tick, big: 1, reset: 1 }; }
    else sim.power = { type: p.type, until: sim.tick + 45 };
  }
  if (sim.power && sim.power.until <= sim.tick) sim.power = null;
  sim.powerups = sim.powerups.filter(p => p.ttl > sim.tick);

  sim.enemies = sim.enemies.filter(e => e.expires > sim.tick);                      // vanish on expiry
  if (sim.score >= ENEMY_MOVE_SCORE && sim.tick % enemyMoveEvery(sim.score) === 0) moveEnemies(sim);
  if (sim.status !== 'playing') return false;                                       // an enemy reached the mouth
  if (sim.tick % POWERUP_EVERY === 0) spawnPowerup(sim);
  return true;
}

// Enemy turn. An enemy that walks into the snake's HEAD (the mouth) kills it (unless shielded,
// which smashes the enemy). An enemy that walks into the snake's BODY is destroyed and leaves a ×2.
function moveEnemies(sim) {
  const shielded = sim.power && sim.power.type === 'blue' && sim.power.until > sim.tick;
  const survivors = [];
  for (const e of sim.enemies) {
    if (sim.rng() < 0.35) { const h = sim.snake[0]; e.dir = Math.abs(h.x - e.x) > Math.abs(h.y - e.y) ? [Math.sign(h.x - e.x) || 1, 0] : [0, Math.sign(h.y - e.y) || 1]; }
    let nx = e.x + e.dir[0], ny = e.y + e.dir[1];
    if (nx < 0 || nx >= N || ny < 0 || ny >= N) { e.dir = [-e.dir[0], -e.dir[1]]; nx = e.x + e.dir[0]; ny = e.y + e.dir[1]; }
    if (nx < 0 || nx >= N || ny < 0 || ny >= N) { survivors.push(e); continue; }
    if (sim.snake[0].x === nx && sim.snake[0].y === ny) {
      if (!shielded) { e.x = nx; e.y = ny; survivors.push(e); sim.enemies = survivors; sim.status = 'over'; return; }
      continue;
    }
    let hitBody = false;
    for (let i = 1; i < sim.snake.length; i++) if (sim.snake[i].x === nx && sim.snake[i].y === ny) { hitBody = true; break; }
    if (hitBody) { sim.powerups.push({ x: nx, y: ny, type: 'yellow', ttl: sim.tick + PU_TTL.yellow }); continue; }
    e.x = nx; e.y = ny; survivors.push(e);
  }
  sim.enemies = survivors;
}

export const enemiesMoveAt = ENEMY_MOVE_SCORE;

// Re-run a recorded game → the authoritative result. THIS is the anti-cheat check.
export function simulate(seed, inputs, lore) {
  if (!Array.isArray(inputs) || inputs.length > MAX_INPUTS) return null;
  const sim = createSim(seed, lore);
  let ip = 0, guard = 0;
  while (sim.status === 'playing' && sim.tick < MAX_TICKS) {
    while (ip < inputs.length && inputs[ip] && inputs[ip].t === sim.tick) { applyInput(sim, inputs[ip].dx | 0, inputs[ip].dy | 0); ip++; if (++guard > MAX_INPUTS + 10) return null; }
    step(sim);
  }
  return { score: sim.score, ticks: sim.tick, timeMs: sim.timeMs };
}
