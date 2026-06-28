// games/snake.js — Snake on the 14×14 genesis grid, themed to Phase-0 lore.
// Food = seeds ("The Seed Is Planted"). Power-ups and enemies spawn from the
// "significative boxes" of the genesis image: blue cells, yellow cells, and the
// planted #FEFEFE cell. Rendering is on <canvas>; the logic is canvas-independent
// (drawing no-ops when there's no 2D context) so it can run/headless-test cleanly.

import { MATRIX } from '../../../content/matrix.js';

const N = 14, CELL = 40;                 // internal canvas resolution = 560×560
const key = (x, y) => x + ',' + y;
// MATRIX lists are [row,col]; store as "x,y" = "col,row"
const BLUE = new Set(MATRIX.blue.map(([r, c]) => key(c, r)));
const YELLOW = new Set(MATRIX.yellow.map(([r, c]) => key(c, r)));
const FEFEFE = new Set((MATRIX.fefefe || []).map(([r, c]) => key(c, r)));
const LORE = [
  ...[...BLUE].map(s => ['blue', s]),
  ...[...YELLOW].map(s => ['yellow', s]),
  ...[...FEFEFE].map(s => ['fefefe', s]),
];
const C = {
  bgCell: '#0b0e15', line: 'rgba(255,255,255,.05)',
  blueFaint: 'rgba(63,72,204,.30)', yellowFaint: 'rgba(255,242,0,.16)', fefefeFaint: 'rgba(224,85,106,.28)',
  snake: '#2ec8a0', head: '#5fe9c4', food: '#f2c14a', foodGlow: 'rgba(242,193,74,.5)',
  enemy: '#ff5a5a', enemyEye: '#2a0000',
  blue: '#5f8cff', yellow: '#fff200', fefefe: '#ffffff', text: '#e6ecf5',
};

const rng = (n) => Math.floor(Math.random() * n);

export function snakeGame(canvas, { onHud = () => {} } = {}) {
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  canvas.width = N * CELL; canvas.height = N * CELL;

  let snake, dir, qdir, food, powerups, enemies, score, best, status, baseMs, ticks, power, flash;
  best = +(localStorage.getItem('gsmg:snake:best') || 0);
  let timer = null, lastTick = 0;

  // ---------- helpers ----------
  const occupied = (x, y) =>
    snake.some(s => s.x === x && s.y === y) ||
    enemies.some(e => e.x === x && e.y === y) ||
    (food && food.x === x && food.y === y) ||
    powerups.some(p => p.x === x && p.y === y);

  function freeLore(type) {
    const pool = LORE.filter(([t, s]) => (!type || t === type))
      .map(([t, s]) => { const [x, y] = s.split(',').map(Number); return { t, x, y }; })
      .filter(c => !occupied(c.x, c.y));
    return pool.length ? pool[rng(pool.length)] : null;
  }
  function placeFood() {
    let x, y, tries = 0;
    do { x = rng(N); y = rng(N); tries++; } while (occupied(x, y) && tries < 400);
    food = { x, y };
  }
  function spawnEnemy() {
    if (enemies.length >= 6) return;
    const c = freeLore();                       // from a significative box (blue/yellow/fefefe)
    if (!c) return;
    enemies.push({ x: c.x, y: c.y, dir: [[1, 0], [-1, 0], [0, 1], [0, -1]][rng(4)], born: ticks });
    flash = { x: c.x, y: c.y, t: ticks };
  }
  function spawnPowerup() {
    if (powerups.length) return;
    const types = ['blue', 'yellow', 'fefefe'];
    // bias toward blue/yellow; fefefe is rare
    const type = Math.random() < 0.18 && FEFEFE.size ? 'fefefe' : (Math.random() < 0.5 ? 'blue' : 'yellow');
    const c = freeLore(type) || freeLore();
    if (!c) return;
    powerups.push({ x: c.x, y: c.y, type: c.t, ttl: ticks + 70 });
  }

  function reset() {
    snake = [{ x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }];
    dir = { x: 0, y: -1 }; qdir = null;
    powerups = []; enemies = []; score = 0; baseMs = 150; ticks = 0; power = null; flash = null;
    placeFood();
    status = 'ready';
    hud(); draw();
  }

  const speedMs = () => Math.max(70, baseMs - Math.floor(score / 5) * 6);

  function hud() {
    onHud({
      score, best, status,
      level: 1 + Math.floor(score / 5),
      enemies: enemies.length,
      power: power ? power.type : null,
      powerLeft: power ? Math.max(0, power.until - ticks) : 0,
    });
  }

  // ---------- the tick (one snake step) ----------
  function tick() {
    if (status !== 'playing') return;
    ticks++;
    if (qdir) { dir = qdir; qdir = null; }
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const shielded = power && power.type === 'blue' && power.until > ticks;

    // walls
    if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) return over();
    // self
    if (snake.some(s => s.x === head.x && s.y === head.y) && !shielded) return over();
    // enemy
    if (enemies.some(e => e.x === head.x && e.y === head.y)) {
      if (!shielded) return over();
      enemies = enemies.filter(e => !(e.x === head.x && e.y === head.y));  // shield smashes it
    }

    snake.unshift(head);

    // food
    if (food && head.x === food.x && head.y === food.y) {
      const dbl = power && power.type === 'yellow' && power.until > ticks;
      score += dbl ? 2 : 1;
      if (score % 3 === 0) spawnEnemy();           // difficulty ramps with score
      placeFood();
    } else {
      snake.pop();
    }

    // power-up pickup
    const pi = powerups.findIndex(p => p.x === head.x && p.y === head.y);
    if (pi >= 0) {
      const p = powerups.splice(pi, 1)[0];
      if (p.type === 'fefefe') { enemies = []; score += 5; flash = { x: head.x, y: head.y, t: ticks, big: 1 }; }
      else power = { type: p.type, until: ticks + 45 };  // blue=shield, yellow=double, ~6s
    }
    if (power && power.until <= ticks) power = null;
    powerups = powerups.filter(p => p.ttl > ticks);

    // enemies move every 2nd tick (slower than the snake), bounce off walls
    if (ticks % 2 === 0) moveEnemies();

    // periodic power-up
    if (ticks % 60 === 0) spawnPowerup();

    // enemy caught up to the snake?
    if (enemies.some(e => e.x === head.x && e.y === head.y) && !shielded) return over();

    if (score > best) { best = score; try { localStorage.setItem('gsmg:snake:best', best); } catch {} }
    hud(); draw();
  }

  function moveEnemies() {
    for (const e of enemies) {
      // 35% chance to re-target toward the snake head, else keep/curve
      if (Math.random() < 0.35) {
        const h = snake[0];
        e.dir = Math.abs(h.x - e.x) > Math.abs(h.y - e.y)
          ? [Math.sign(h.x - e.x) || 1, 0] : [0, Math.sign(h.y - e.y) || 1];
      }
      let nx = e.x + e.dir[0], ny = e.y + e.dir[1];
      if (nx < 0 || nx >= N || ny < 0 || ny >= N) { e.dir = [-e.dir[0], -e.dir[1]]; nx = e.x + e.dir[0]; ny = e.y + e.dir[1]; }
      if (nx >= 0 && nx < N && ny >= 0 && ny < N) { e.x = nx; e.y = ny; }
    }
  }

  function over() {
    status = 'over'; power = null;
    if (score > best) { best = score; try { localStorage.setItem('gsmg:snake:best', best); } catch {} }
    hud(); draw();
  }

  // ---------- rendering ----------
  function cellRect(x, y, pad = 0) { return [x * CELL + pad, y * CELL + pad, CELL - 2 * pad, CELL - 2 * pad]; }
  function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // backdrop: faint genesis grid (lore cells tinted so you can see the spawn boxes)
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const k = key(x, y);
      ctx.fillStyle = BLUE.has(k) ? C.blueFaint : YELLOW.has(k) ? C.yellowFaint : FEFEFE.has(k) ? C.fefefeFaint : C.bgCell;
      ctx.fillRect(...cellRect(x, y));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x * CELL + .5, y * CELL + .5, CELL - 1, CELL - 1);
    }
    // spawn flash
    if (flash && ticks - flash.t < 6) {
      ctx.fillStyle = `rgba(255,255,255,${0.4 * (1 - (ticks - flash.t) / 6)})`;
      ctx.fillRect(...cellRect(flash.x, flash.y));
    }
    // food (seed)
    if (food) {
      const [fx, fy, fw, fh] = cellRect(food.x, food.y, 9);
      ctx.fillStyle = C.foodGlow; ctx.beginPath(); ctx.arc(fx + fw / 2, fy + fh / 2, fw, 0, 7); ctx.fill();
      ctx.fillStyle = C.food; ctx.beginPath(); ctx.arc(fx + fw / 2, fy + fh / 2, fw / 2 + 3, 0, 7); ctx.fill();
    }
    // power-ups
    for (const p of powerups) {
      const [px, py] = cellRect(p.x, p.y, 6);
      ctx.fillStyle = C[p.type]; ctx.shadowColor = C[p.type]; ctx.shadowBlur = 14;
      rrect(px, py, CELL - 12, CELL - 12, 7); ctx.shadowBlur = 0;
      ctx.fillStyle = p.type === 'yellow' ? '#222' : '#06121f'; ctx.font = `bold ${CELL * .42}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.type === 'blue' ? '🛡' : p.type === 'yellow' ? '×2' : '0', p.x * CELL + CELL / 2, p.y * CELL + CELL / 2 + 1);
    }
    // enemies
    for (const e of enemies) {
      const [ex, ey] = cellRect(e.x, e.y, 5);
      ctx.fillStyle = C.enemy; rrect(ex, ey, CELL - 10, CELL - 10, 6);
      ctx.fillStyle = C.enemyEye;
      ctx.fillRect(ex + 7, ey + 9, 5, 5); ctx.fillRect(ex + CELL - 22, ey + 9, 5, 5);
    }
    // snake
    const shielded = power && power.type === 'blue' && power.until > ticks;
    for (let i = snake.length - 1; i >= 0; i--) {
      const s = snake[i];
      ctx.fillStyle = i === 0 ? C.head : C.snake;
      if (shielded && i === 0) { ctx.shadowColor = C.blue; ctx.shadowBlur = 16; }
      rrect(...cellRect(s.x, s.y, 3), 8); ctx.shadowBlur = 0;
    }
    // head eyes
    if (snake.length) {
      const h = snake[0]; ctx.fillStyle = '#06241c';
      const cx = h.x * CELL + CELL / 2, cy = h.y * CELL + CELL / 2;
      const ox = dir.x * 6, oy = dir.y * 6, px = -dir.y * 7, py = dir.x * 7;
      ctx.beginPath(); ctx.arc(cx + ox + px, cy + oy + py, 3, 0, 7); ctx.arc(cx + ox - px, cy + oy - py, 3, 0, 7); ctx.fill();
    }
  }

  // ---------- loop ----------
  function loop(ts) {
    if (!document.body.contains(canvas)) { destroy(); return; }
    if (status === 'playing' && ts - lastTick >= speedMs()) { lastTick = ts; tick(); }
    timer = requestAnimationFrame(loop);
  }

  // ---------- public controls ----------
  function setDir(x, y) {
    if (status === 'ready') start();
    if (status !== 'playing') return;
    const cur = qdir || dir;
    if (x === -cur.x && y === -cur.y) return;     // no 180° reversal
    if (x === cur.x && y === cur.y) return;
    qdir = { x, y };
  }
  function start() { if (status === 'ready' || status === 'paused') { status = 'playing'; lastTick = performance.now(); hud(); } }
  function pause() { if (status === 'playing') { status = 'paused'; hud(); draw(); } else if (status === 'paused') start(); }
  function action() { if (status === 'over' || status === 'ready') restart(); else pause(); }
  function restart() { reset(); status = 'ready'; start(); }
  function destroy() { if (timer) cancelAnimationFrame(timer); timer = null; }

  reset();
  timer = requestAnimationFrame(loop);
  return { setDir, start, pause, action, restart, destroy, _tick: tick, _state: () => ({ snake, enemies, powerups, food, score, status, power }) };
}
