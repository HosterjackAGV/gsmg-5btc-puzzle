// views/games.js — the Games section. First game: Snake on the 14×14 genesis grid.
// Controls: keyboard (arrows/WASD/space) on a PC; swipe on the grid OR an on-screen
// D-pad below it on a phone. The grid sizes itself to the viewport so it never shrinks
// awkwardly, and touch-gestures over it don't scroll the page.

import { qs, qsa, on } from '../util.js';
import { snakeGame } from '../games/snake.js';

export default async function gamesView() {
  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">GAMES</div><h2>Play the grid</h2>
      <p>Mini-games built on the puzzle's own artifacts. First up: <b>Snake</b> on the 14×14 <b>genesis grid</b> — eat the seeds (<i>“the seed is planted”</i>), grab power-ups, and dodge the glitches that crawl out of the <b>blue</b>, <b>yellow</b> and <b>#FEFEFE</b> boxes of Phase 0.</p>
    </div>

    <div class="game-tabs">
      <button type="button" class="game-tab active">🐍 Snake</button>
      <span class="game-tab soon">more soon…</span>
    </div>

    <div class="snake-wrap">
      <div class="snake-hud">
        <div class="sk-stat"><span>Score</span><b id="sk-score">0</b></div>
        <div class="sk-stat"><span>Best</span><b id="sk-best">0</b></div>
        <div class="sk-stat"><span>Level</span><b id="sk-level">1</b></div>
        <div class="sk-stat"><span>Glitches</span><b id="sk-enemies">0</b></div>
        <div class="sk-power" id="sk-power" hidden></div>
      </div>

      <div class="snake-stage">
        <canvas id="sk-canvas" class="snake-canvas" aria-label="Snake game on the genesis grid"></canvas>
        <div class="snake-overlay" id="sk-overlay">
          <div class="ov-card">
            <div class="ov-title" id="sk-ov-title">Snake</div>
            <div class="ov-sub" id="sk-ov-sub">Press <b>Space</b> or <b>tap</b> to start</div>
            <button type="button" class="btn teal" id="sk-ov-btn">▶ Play</button>
          </div>
        </div>
      </div>

      <div class="snake-dpad" id="sk-dpad" aria-label="touch controls">
        <button type="button" class="dpad" data-dir="0,-1" aria-label="up">▲</button>
        <div class="dpad-row">
          <button type="button" class="dpad" data-dir="-1,0" aria-label="left">◀</button>
          <button type="button" class="dpad dpad-act" id="sk-act" aria-label="pause or restart">⏯</button>
          <button type="button" class="dpad" data-dir="1,0" aria-label="right">▶</button>
        </div>
        <button type="button" class="dpad" data-dir="0,1" aria-label="down">▼</button>
      </div>

      <p class="snake-help"><b>PC:</b> arrow keys or WASD · <b>Space</b> = pause/restart.&nbsp; <b>Phone:</b> swipe on the grid or use the pad below.&nbsp; Power-ups: <span class="pu pu-b">🛡 shield</span> <span class="pu pu-y">×2 seeds</span> <span class="pu pu-f">0 = wipe glitches</span>.</p>
    </div>
  </div></section>`;

  function mount(root) {
    const canvas = qs('#sk-canvas', root);
    if (!canvas) return;

    const overlay = qs('#sk-overlay', root), ovTitle = qs('#sk-ov-title', root), ovSub = qs('#sk-ov-sub', root), ovBtn = qs('#sk-ov-btn', root);
    const elScore = qs('#sk-score', root), elBest = qs('#sk-best', root), elLevel = qs('#sk-level', root), elEnemies = qs('#sk-enemies', root), elPower = qs('#sk-power', root);

    const PU = { blue: '🛡 shield', yellow: '×2 seeds', fefefe: '0 wipe' };
    const game = snakeGame(canvas, {
      onHud(s) {
        elScore.textContent = s.score; elBest.textContent = s.best; elLevel.textContent = s.level; elEnemies.textContent = s.enemies;
        if (s.power) { elPower.hidden = false; elPower.textContent = PU[s.power] || s.power; elPower.className = 'sk-power pu-' + s.power[0]; }
        else elPower.hidden = true;
        if (s.status === 'playing') overlay.classList.add('hidden');
        else {
          overlay.classList.remove('hidden');
          if (s.status === 'ready') { ovTitle.textContent = 'Snake'; ovSub.innerHTML = 'Press <b>Space</b> or <b>tap</b> to start'; ovBtn.textContent = '▶ Play'; }
          else if (s.status === 'paused') { ovTitle.textContent = 'Paused'; ovSub.innerHTML = 'Take a breath'; ovBtn.textContent = '▶ Resume'; }
          else if (s.status === 'over') { ovTitle.textContent = 'Game Over'; ovSub.innerHTML = `Score <b>${s.score}</b> · Best <b>${s.best}</b>`; ovBtn.textContent = '↻ Play again'; }
        }
      },
    });

    // ---- keyboard (PC) — self-removes once the view is gone ----
    const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
    function onKey(e) {
      if (!document.body.contains(canvas)) { window.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); return; }
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); game.action(); return; }
      const d = DIRS[e.key];
      if (d) { e.preventDefault(); game.setDir(d[0], d[1]); }
    }
    window.addEventListener('keydown', onKey);
    function onVis() { if (document.visibilityState === 'hidden') game.pause(); }
    document.addEventListener('visibilitychange', onVis);

    // ---- swipe on the grid (phone) — doesn't scroll the page ----
    let sx = 0, sy = 0, mx = 0, my = 0, moved = false;
    canvas.addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = mx = t.clientX; sy = my = t.clientY; moved = false; }, { passive: true });
    canvas.addEventListener('touchmove', (e) => { const t = e.touches[0]; mx = t.clientX; my = t.clientY; moved = true; e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', () => {
      const dx = mx - sx, dy = my - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { game.action(); return; }      // tap = start/pause/restart
      if (Math.abs(dx) > Math.abs(dy)) game.setDir(Math.sign(dx), 0); else game.setDir(0, Math.sign(dy));
    });
    // clicking the grid with a mouse also starts/pauses
    canvas.addEventListener('click', () => { if (!moved) game.action(); });

    // ---- on-screen D-pad ----
    on(qs('#sk-dpad', root), 'click', '.dpad', (e, b) => {
      if (b.id === 'sk-act') return game.action();
      const [x, y] = b.dataset.dir.split(',').map(Number); game.setDir(x, y);
    });
    // suppress the 300ms tap-delay / double-events on touch for the pad
    qsa('.dpad', root).forEach(b => b.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (b.id === 'sk-act') game.action();
      else { const [x, y] = b.dataset.dir.split(',').map(Number); game.setDir(x, y); }
    }, { passive: false }));

    ovBtn.addEventListener('click', () => game.action());
  }

  return { title: 'Games', html, mount };
}
