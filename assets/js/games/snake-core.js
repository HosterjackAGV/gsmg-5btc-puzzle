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
// Bump this whenever the simulation rules change. The client sends it with each submission and the
// Worker must match — otherwise an out-of-date Worker would re-simulate replays under the wrong rules
// and store wrong scores. On mismatch the Worker refuses the score and asks to be redeployed.
export const RULES_VERSION = 5;

// Player speed steps DOWN (faster) at the SAME score thresholds the enemies use (100/200/500/1000),
// so the snake ramps in lockstep with the glitches — relaxed to start, top speed only deep in.
export function speedMs(score) {
  if (score >= 1000) return 160;    // top speed (where enemies hit 2×)
  if (score >= 500) return 200;
  if (score >= 200) return 240;
  if (score >= 100) return 280;     // first speed-up, where the glitches wake
  return 320;                       // relaxed early game
}

// Enemies: at most 3 on the board, each telegraphed by a 1–3s warning aura before it appears.
// They stay FROZEN until score 100, then move at a fraction of the player's speed that grows with
// score: 1/3 (100), 1/2 (200), 1× (500), 2× + blinking red (1000+).
const MAX_ENEMIES = 3;
const ENEMY_MOVE_SCORE = 100;
const AURA_MIN_MS = 1000, AURA_MAX_MS = 3000;
export function enemyTTL(score) { return 34 + score * 4; }       // they vanish; higher score → linger longer
function enemySteps(score, tick) {                                // enemy moves performed this player-tick
  if (score >= 1000) return 2;
  if (score >= 500) return 1;
  if (score >= 200) return tick % 2 === 0 ? 1 : 0;
  if (score >= ENEMY_MOVE_SCORE) return tick % 3 === 0 ? 1 : 0;
  return 0;
}

// Power-ups vanish; the RARER the power-up, the SHORTER it sits on the field.
const PU_TTL = { blue: 80, m2: 90, m4: 70, m8: 50, m16: 34, fefefe: 48, reset: 26 };
// Multiplier power-ups STACK: while several overlap, the score multiplier is their PRODUCT, and each
// expires on its own timer. Rarity (4× / 32× / 128× rarer than 2×) is in spawnPowerup's weights.
export const MULTS = { m2: 2, m4: 4, m8: 8, m16: 16 };
const MULT_MS = 8000, SHIELD_MS = 6000;
const POWERUP_EVERY = 60;
const MAX_TICKS = 250000, MAX_INPUTS = 200000;

// Special seeds: worth far more points than the length they add. The more points a seed gives, the
// RARER it is (weight) and the SHORTER it lingers (persistMs is real game-time, floor 3s).
export const SEEDS = {
  plus3:  { score: 3,  grow: 1, persistMs: 6000 },
  plus5:  { score: 5,  grow: 2, persistMs: 4000 },
  plus10: { score: 10, grow: 3, persistMs: 3000 },
};
const SEED_EVERY = 45, MAX_SEEDS = 2;

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
    food: null, enemies: [], spawns: [], powerups: [], seeds: [],
    score: 0, tick: 0, timeMs: 0, status: 'playing', flash: null, grow: 0,
    mults: [], shieldExp: 0,
  };
  placeFood(sim);
  return sim;
}

const isShielded = (sim) => sim.timeMs < sim.shieldExp;
export function effMult(sim) { let m = 1; for (const e of sim.mults) if (e.exp > sim.timeMs) m *= e.mult; return m; }

function occupied(sim, x, y) {
  return sim.snake.some(s => s.x === x && s.y === y) || sim.enemies.some(e => e.x === x && e.y === y)
    || sim.spawns.some(s => s.x === x && s.y === y)
    || (sim.food && sim.food.x === x && sim.food.y === y) || sim.powerups.some(p => p.x === x && p.y === y)
    || sim.seeds.some(s => s.x === x && s.y === y);
}
function placeFood(sim) { let x, y, n = 0; do { x = ri(sim.rng, N); y = ri(sim.rng, N); n++; } while (occupied(sim, x, y) && n < 500); sim.food = { x, y }; }
function freeLore(sim, type) { const pool = sim.lore.filter(c => (!type || c.t === type) && !occupied(sim, c.x, c.y)); return pool.length ? pool[ri(sim.rng, pool.length)] : null; }

// schedule a warning aura; it becomes a real enemy after a 1–3s telegraph (processSpawns)
function spawnEnemy(sim) {
  if (sim.enemies.length + sim.spawns.length >= MAX_ENEMIES) return;
  const c = freeLore(sim); if (!c) return;
  const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]][ri(sim.rng, 4)];
  const at = sim.timeMs + AURA_MIN_MS + Math.floor(sim.rng() * (AURA_MAX_MS - AURA_MIN_MS + 1));
  sim.spawns.push({ x: c.x, y: c.y, dir, born: sim.timeMs, at });
}
function processSpawns(sim) {
  if (!sim.spawns.length) return;
  const ready = [], keep = [];
  for (const s of sim.spawns) (sim.timeMs >= s.at ? ready : keep).push(s);
  sim.spawns = keep;                                              // remove ready auras from the world first
  for (const s of ready) {
    if (sim.enemies.length >= MAX_ENEMIES) continue;
    if (occupied(sim, s.x, s.y)) continue;                        // snake/food moved onto it → cancel
    sim.enemies.push({ x: s.x, y: s.y, dir: s.dir, expires: sim.tick + enemyTTL(sim.score) });
  }
}

function dropPower(sim, type, x, y) { sim.powerups.push({ x, y, type, ttl: sim.tick + (PU_TTL[type] || 70) }); }
function spawnPowerup(sim) {
  if (sim.powerups.length) return;
  const r = sim.rng();
  let type;
  if (sim.score >= 10 && r < 0.02) type = 'reset';                // incredibly rare: reset length, keep score
  else if (r < 0.10) type = 'fefefe';                             // rare: wipe enemies
  else if (r < 0.30) type = 'blue';                               // shield
  else {                                                          // a multiplier — 4×/32×/128× rarer up the chain
    const m = sim.rng();
    type = m < 0.7758 ? 'm2' : m < 0.9697 ? 'm4' : m < 0.99394 ? 'm8' : 'm16';
  }
  const want = (type === 'reset' || type === 'fefefe') ? 'fefefe' : type === 'blue' ? 'blue' : 'yellow';
  const c = freeLore(sim, want) || freeLore(sim); if (!c) return;
  sim.powerups.push({ x: c.x, y: c.y, type, ttl: sim.tick + (PU_TTL[type] || 70) });
}
function spawnSeed(sim) {
  if (sim.seeds.length >= MAX_SEEDS) return;
  if (sim.rng() >= 0.5) return;                                    // appears only sometimes
  const t = sim.rng();
  const type = t < 0.6 ? 'plus3' : t < 0.9 ? 'plus5' : 'plus10';  // rarer the more points it gives
  const def = SEEDS[type];
  let x, y, n = 0;
  do { x = ri(sim.rng, N); y = ri(sim.rng, N); n++; } while (occupied(sim, x, y) && n < 200);
  if (occupied(sim, x, y)) return;
  sim.seeds.push({ x, y, type, score: def.score, grow: def.grow, exp: sim.timeMs + def.persistMs });
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
  const shielded = isShielded(sim);

  if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) return die(sim);     // wall
  if (sim.snake.some(s => s.x === head.x && s.y === head.y) && !shielded) return die(sim);   // body
  if (sim.enemies.some(e => e.x === head.x && e.y === head.y)) {                    // enemy
    if (!shielded) return die(sim);
    sim.enemies = sim.enemies.filter(e => { if (e.x === head.x && e.y === head.y) { dropPower(sim, 'm4', e.x, e.y); return false; } return true; });  // head-butt → 4×
  }
  sim.snake.unshift(head);

  // eat the permanent seed (+1 score, +1 length) and/or a special seed (more points than length)
  const mult = effMult(sim);
  let scoreGain = 0, growGain = 0, ateFood = false;
  if (sim.food && head.x === sim.food.x && head.y === sim.food.y) { scoreGain += 1; growGain += 1; ateFood = true; }
  const si = sim.seeds.findIndex(s => s.x === head.x && s.y === head.y);
  if (si >= 0) { const sd = sim.seeds.splice(si, 1)[0]; scoreGain += sd.score; growGain += sd.grow; sim.flash = { x: head.x, y: head.y, t: sim.tick, big: 1 }; }
  if (scoreGain > 0) {
    const before = sim.score;
    sim.score += scoreGain * mult;                               // the score is the REAL total: points × active multiplier
    const ne = Math.min(Math.floor(sim.score / 3) - Math.floor(before / 3), MAX_ENEMIES);
    for (let i = 0; i < ne; i++) spawnEnemy(sim);                // ~1 glitch / 3 pts, capped
    if (ateFood) placeFood(sim);
  }
  sim.grow += growGain;                                           // grow length over the next grow ticks
  if (sim.grow > 0) sim.grow--; else sim.snake.pop();

  const pi = sim.powerups.findIndex(p => p.x === head.x && p.y === head.y);
  if (pi >= 0) {
    const p = sim.powerups.splice(pi, 1)[0];
    if (p.type === 'fefefe') { sim.enemies = []; sim.spawns = []; sim.score += 5 * effMult(sim); sim.flash = { x: head.x, y: head.y, t: sim.tick, big: 1 }; }
    else if (p.type === 'reset') { sim.snake = sim.snake.slice(0, START_LEN); sim.grow = 0; sim.flash = { x: head.x, y: head.y, t: sim.tick, big: 1, reset: 1 }; }
    else if (p.type === 'blue') { sim.shieldExp = sim.timeMs + SHIELD_MS; }
    else if (MULTS[p.type]) { sim.mults.push({ mult: MULTS[p.type], exp: sim.timeMs + MULT_MS }); }   // stacks with any active
  }

  sim.mults = sim.mults.filter(e => e.exp > sim.timeMs);
  sim.powerups = sim.powerups.filter(p => p.ttl > sim.tick);
  sim.seeds = sim.seeds.filter(s => s.exp > sim.timeMs);                            // special seeds vanish (real-time)
  sim.enemies = sim.enemies.filter(e => e.expires > sim.tick);                      // glitches vanish on expiry

  const es = enemySteps(sim.score, sim.tick);                                       // 0 / part-time / 1× / 2× the player
  for (let k = 0; k < es && sim.status === 'playing'; k++) moveEnemies(sim);
  if (sim.status !== 'playing') return false;                                       // an enemy reached the mouth
  processSpawns(sim);                                                               // warning auras become enemies
  if (sim.tick % POWERUP_EVERY === 0) spawnPowerup(sim);
  if (sim.tick % SEED_EVERY === 0) spawnSeed(sim);                                  // occasional special seed
  return true;
}

// Enemy turn. They CHASE the head, but FLEE when the player is shielded. Walking into the snake's
// HEAD (the mouth) kills it — unless shielded, which smashes the glitch and drops a 4×. Walking into
// the snake's BODY destroys the glitch and drops a 2×.
function moveEnemies(sim) {
  const shielded = isShielded(sim);
  const survivors = [];
  for (const e of sim.enemies) {
    if (sim.rng() < 0.35) {
      const h = sim.snake[0], sx = Math.sign(h.x - e.x) || 1, sy = Math.sign(h.y - e.y) || 1;
      const tx = shielded ? -sx : sx, ty = shielded ? -sy : sy;                     // flee when the player is shielded
      e.dir = Math.abs(h.x - e.x) > Math.abs(h.y - e.y) ? [tx, 0] : [0, ty];
    }
    let nx = e.x + e.dir[0], ny = e.y + e.dir[1];
    if (nx < 0 || nx >= N || ny < 0 || ny >= N) { e.dir = [-e.dir[0], -e.dir[1]]; nx = e.x + e.dir[0]; ny = e.y + e.dir[1]; }
    if (nx < 0 || nx >= N || ny < 0 || ny >= N) { survivors.push(e); continue; }
    if (sim.snake[0].x === nx && sim.snake[0].y === ny) {
      if (!shielded) { e.x = nx; e.y = ny; survivors.push(e); sim.enemies = survivors; sim.status = 'over'; return; }
      dropPower(sim, 'm4', e.x, e.y);                                               // smashed on a shielded head → 4×
      continue;
    }
    let hitBody = false;
    for (let i = 1; i < sim.snake.length; i++) if (sim.snake[i].x === nx && sim.snake[i].y === ny) { hitBody = true; break; }
    if (hitBody) { dropPower(sim, 'm2', nx, ny); continue; }                        // ran into the body → 2×
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
