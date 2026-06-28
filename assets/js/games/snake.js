// games/snake.js — the in-browser Snake: renders the deterministic core (snake-core.js) onto a
// <canvas>, drives the tick timing, reads controls, and RECORDS the replay (seed + inputs) so the
// final score can be re-verified server-side. Drawing no-ops when there's no 2D context (headless).

import { MATRIX } from '../../../content/matrix.js';
import { createSim, step as coreStep, applyInput as coreInput, speedMs, N, START_LEN, enemiesMoveAt, SEEDS } from './snake-core.js';

const CELL = 40;                                  // internal canvas resolution = 560×560
const key = (x, y) => x + ',' + y;
const LORE = [
  ...MATRIX.blue.map(([r, c]) => ({ t: 'blue', x: c, y: r })),
  ...MATRIX.yellow.map(([r, c]) => ({ t: 'yellow', x: c, y: r })),
  ...(MATRIX.fefefe || []).map(([r, c]) => ({ t: 'fefefe', x: c, y: r })),
];
const BLUE = new Set(MATRIX.blue.map(([r, c]) => key(c, r)));
const YELLOW = new Set(MATRIX.yellow.map(([r, c]) => key(c, r)));
const FEFEFE = new Set((MATRIX.fefefe || []).map(([r, c]) => key(c, r)));
const C = {
  bgCell: '#0b0e15', line: 'rgba(255,255,255,.05)',
  blueFaint: 'rgba(63,72,204,.30)', yellowFaint: 'rgba(255,242,0,.16)', fefefeFaint: 'rgba(224,85,106,.28)',
  snake: '#2ec8a0', head: '#5fe9c4', food: '#f2c14a', foodGlow: 'rgba(242,193,74,.5)',
  enemy: '#ff5a5a', enemyFrozen: '#8a6a6a', enemyEye: '#2a0000',
  blue: '#5f8cff', yellow: '#fff200', fefefe: '#ffffff', reset: '#c77dff', text: '#e6ecf5',
};
const SEEDC = { plus3: '#9be870', plus5: '#ffb454', plus10: '#ff5fa2' };   // special-seed colours by value
const PUTEXT = { blue: '🛡', yellow: '×2', fefefe: '0', reset: '↺' };

const randSeed = () => (Math.floor(Math.random() * 0xFFFFFFFF) >>> 0);

export function snakeGame(canvas, { onHud = () => {}, onOver = () => {} } = {}) {
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  canvas.width = N * CELL; canvas.height = N * CELL;
  let sim, seed, inputs, status, timer = null, lastTick = 0;   // no device storage — the board lives on GitHub

  function reset() {
    seed = randSeed(); sim = createSim(seed, LORE); inputs = []; status = 'ready';
    hud(); draw();
  }
  const level = () => 1 + Math.floor(sim.score / 5);

  function hud() {
    onHud({
      score: sim.score, status, level: level(),
      enemies: sim.enemies.length, enemiesActive: sim.score >= enemiesMoveAt,
      power: sim.power ? sim.power.type : null,
      timeMs: sim.timeMs,
    });
  }

  function tick() {
    if (status !== 'playing') return;
    const alive = coreStep(sim);
    if (!alive) { status = 'over'; hud(); draw(); onOver({ seed, inputs: inputs.slice(), score: sim.score, timeMs: sim.timeMs, ticks: sim.tick }); return; }
    hud(); draw();
  }

  // ---------- rendering ----------
  const cr = (x, y, p = 0) => [x * CELL + p, y * CELL + p, CELL - 2 * p, CELL - 2 * p];
  const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); };
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const k = key(x, y);
      ctx.fillStyle = BLUE.has(k) ? C.blueFaint : YELLOW.has(k) ? C.yellowFaint : FEFEFE.has(k) ? C.fefefeFaint : C.bgCell;
      ctx.fillRect(...cr(x, y));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x * CELL + .5, y * CELL + .5, CELL - 1, CELL - 1);
    }
    if (sim.flash && sim.tick - sim.flash.t < 6) {
      ctx.fillStyle = `rgba(${sim.flash.reset ? '199,125,255' : '255,255,255'},${0.45 * (1 - (sim.tick - sim.flash.t) / 6)})`;
      ctx.fillRect(...cr(sim.flash.x, sim.flash.y));
    }
    if (sim.food) {
      const [fx, fy, fw] = cr(sim.food.x, sim.food.y, 9);
      ctx.fillStyle = C.foodGlow; ctx.beginPath(); ctx.arc(fx + fw / 2, fy + fw / 2, fw, 0, 7); ctx.fill();
      ctx.fillStyle = C.food; ctx.beginPath(); ctx.arc(fx + fw / 2, fy + fw / 2, fw / 2 + 3, 0, 7); ctx.fill();
    }
    for (const sd of sim.seeds) {                     // special seeds: glowing token, +value label, shrinking timer ring
      const cx = sd.x * CELL + CELL / 2, cy = sd.y * CELL + CELL / 2, col = SEEDC[sd.type] || '#9be870', def = SEEDS[sd.type];
      if (def) { const frac = Math.max(0, Math.min(1, (sd.exp - sim.timeMs) / def.persistMs)); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, CELL * 0.40, -Math.PI / 2, -Math.PI / 2 + frac * 2 * Math.PI); ctx.stroke(); }
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(cx, cy, CELL * 0.30, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#07120a'; ctx.font = `bold ${CELL * 0.32}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('+' + (def ? def.score : ''), cx, cy + 1);
    }
    for (const p of sim.powerups) {
      const [px, py] = cr(p.x, p.y, 6);
      ctx.fillStyle = C[p.type]; ctx.shadowColor = C[p.type]; ctx.shadowBlur = 14; rr(px, py, CELL - 12, CELL - 12, 7); ctx.shadowBlur = 0;
      ctx.fillStyle = (p.type === 'yellow') ? '#222' : (p.type === 'reset') ? '#1a0030' : '#06121f';
      ctx.font = `bold ${CELL * .4}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(PUTEXT[p.type], p.x * CELL + CELL / 2, p.y * CELL + CELL / 2 + 1);
    }
    const moving = sim.score >= enemiesMoveAt;
    for (const e of sim.enemies) {
      const [ex, ey] = cr(e.x, e.y, 5);
      ctx.fillStyle = moving ? C.enemy : C.enemyFrozen; rr(ex, ey, CELL - 10, CELL - 10, 6);
      ctx.fillStyle = C.enemyEye; ctx.fillRect(ex + 7, ey + 9, 5, 5); ctx.fillRect(ex + CELL - 22, ey + 9, 5, 5);
    }
    const shielded = sim.power && sim.power.type === 'blue' && sim.power.until > sim.tick;
    for (let i = sim.snake.length - 1; i >= 0; i--) {
      const s = sim.snake[i];
      ctx.fillStyle = i === 0 ? C.head : C.snake;
      if (shielded && i === 0) { ctx.shadowColor = C.blue; ctx.shadowBlur = 16; }
      rr(...cr(s.x, s.y, 3), 8); ctx.shadowBlur = 0;
    }
    if (sim.snake.length) {
      const h = sim.snake[0]; ctx.fillStyle = '#06241c';
      const cx = h.x * CELL + CELL / 2, cy = h.y * CELL + CELL / 2;
      const ox = sim.dir.x * 6, oy = sim.dir.y * 6, px = -sim.dir.y * 7, py = sim.dir.x * 7;
      ctx.beginPath(); ctx.arc(cx + ox + px, cy + oy + py, 3, 0, 7); ctx.arc(cx + ox - px, cy + oy - py, 3, 0, 7); ctx.fill();
    }
  }

  // ---------- loop ----------
  function loop(ts) {
    if (!document.body.contains(canvas)) { destroy(); return; }
    if (status === 'playing' && ts - lastTick >= speedMs(sim.score)) { lastTick = ts; tick(); }
    timer = requestAnimationFrame(loop);
  }

  // ---------- controls ----------
  function setDir(x, y) {
    if (status === 'ready') start();
    if (status !== 'playing') return;
    const n = sim.queue.length;
    coreInput(sim, x, y);
    if (sim.queue.length > n) inputs.push({ t: sim.tick, dx: x, dy: y });   // record only accepted turns
  }
  function start() { if (status === 'ready' || status === 'paused') { status = 'playing'; lastTick = (typeof performance !== 'undefined' ? performance.now() : 0); hud(); } }
  function pause() { if (status === 'playing') { status = 'paused'; hud(); draw(); } else if (status === 'paused') start(); }
  function action() { if (status === 'over' || status === 'ready') restart(); else pause(); }
  function restart() { reset(); start(); }
  function destroy() { if (timer) cancelAnimationFrame(timer); timer = null; }

  reset();
  timer = requestAnimationFrame(loop);
  return { setDir, start, pause, action, restart, destroy, _tick: tick, _state: () => ({ ...sim, seed, inputs }) };
}
