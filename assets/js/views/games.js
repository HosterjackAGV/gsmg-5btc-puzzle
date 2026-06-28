// views/games.js — the Games section. First game: Snake on the 14×14 genesis grid.
// Keyboard (PC) + swipe / on-screen D-pad (phone). On death you can put your name on the
// scoreboard; scores are verified by re-simulating the recorded game, so they can't be faked.

import { qs, qsa, on } from '../util.js';
import { snakeGame } from '../games/snake.js';
import { fetchBoard, submitScore, fmtTime, isConfigured } from '../games/scoreboard.js';

export default async function gamesView() {
  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">GAMES</div><h2>Play the grid</h2>
      <p>Mini-games built on the puzzle's own artifacts. First up: <b>Snake</b> on the 14×14 <b>genesis grid</b> — eat the seeds (<i>“the seed is planted”</i>), grab power-ups, and dodge the glitches that crawl out of the <b>blue</b>, <b>yellow</b> and <b>#FEFEFE</b> boxes of Phase 0.</p>
    </div>

    <div class="game-tabs"><button type="button" class="game-tab active">🐍 Snake</button><span class="game-tab soon">more soon…</span></div>

    <div class="snake-wrap">
      <div class="snake-hud">
        <div class="sk-stat"><span>Score</span><b id="sk-score">0</b></div>
        <div class="sk-stat"><span>Top</span><b id="sk-top">—</b></div>
        <div class="sk-stat"><span>Time</span><b id="sk-time">0:00</b></div>
        <div class="sk-stat"><span>Level</span><b id="sk-level">1</b></div>
        <div class="sk-stat"><span>Glitches</span><b id="sk-enemies">0</b></div>
        <div class="sk-power" id="sk-power" hidden></div>
      </div>

      <div class="snake-stage">
        <canvas id="sk-canvas" class="snake-canvas" aria-label="Snake on the genesis grid"></canvas>
        <div class="snake-overlay" id="sk-overlay">
          <div class="ov-card">
            <div class="ov-title" id="sk-ov-title">Snake</div>
            <div class="ov-sub" id="sk-ov-sub">Press <b>Space</b> or <b>tap</b> to start</div>
            <div class="ov-submit" id="sk-submit-row" hidden>
              <input id="sk-name" type="text" maxlength="16" placeholder="your name" autocomplete="off" spellcheck="false">
              <button type="button" class="btn teal sm" id="sk-submit">Submit score</button>
            </div>
            <div class="ov-rank" id="sk-rank" hidden></div>
            <button type="button" class="btn ghost sm" id="sk-ov-btn">▶ Play</button>
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

      <p class="snake-help"><b>PC:</b> arrow keys / WASD · <b>Space</b> = pause/restart.&nbsp; <b>Phone:</b> swipe on the grid or use the pad.</p>
    </div>

    <div class="sk-below">
      <div class="scoreboard">
        <div class="sb-head"><h3>🏆 Scoreboard <span class="sb-scope" id="sk-scope"></span></h3></div>
        <div id="sk-board"><p class="faint">loading…</p></div>
      </div>

      <details class="snake-rules" open>
        <summary>📜 Rules — how Snake works here</summary>
        <ul class="rules-list">
          <li><b>Goal:</b> eat the gold <b>seeds</b> 🌱 to grow and score. Each gold seed is <b>+1</b> point and <b>+1</b> length.</li>
          <li><b>Special seeds</b> flash in now and then and <b>fade fast</b> — each is worth more points than the length it adds, and the bigger the bonus the <b>rarer</b> and <b>shorter-lived</b> it is (each lasts at least <b>3&nbsp;seconds</b>; the ring around it shows the time left). Grab them to leap up the board without bloating your snake:
            <ul>
              <li><span class="pu" style="background:#9be870;color:#07120a">+3</span> — <b>+3 points</b>, only <b>+1</b> longer.</li>
              <li><span class="pu" style="background:#ffb454;color:#241200">+5</span> — <b>+5 points</b> (rarer), only <b>+2</b> longer.</li>
              <li><span class="pu" style="background:#ff5fa2;color:#2a0014">+10</span> — <b>+10 points</b> (rarest, gone in ~3s), only <b>+3</b> longer.</li>
            </ul>
          </li>
          <li><b>Move</b> with the <b>arrow keys / WASD</b> (PC) or by <b>swiping</b> the grid / tapping the <b>D-pad</b> (phone). You <b>cannot turn back into your own body</b> — a too-fast reversal is ignored.</li>
          <li><b>Speed</b> starts <b>slow</b> and ramps up as your score climbs, reaching the <b>human-reaction maximum</b> at about <b>score 50</b>, then holds there.</li>
          <li><b>Death:</b> hitting a <b>wall</b>, your <b>own body</b>, or a moving <b>glitch</b> ends the run.</li>
          <li><b>Glitches</b> 👾 spawn from the genesis grid's <b>blue / yellow / #FEFEFE</b> boxes. They sit <b>frozen</b> until <b>score 15</b>, then start <b>chasing</b> you (and move faster from <b>score 30</b>). Every glitch <b>vanishes after a while</b> — and the <b>higher your score, the longer each one lingers</b>.</li>
          <li><b>Your body is a weapon:</b> a glitch that walks into the snake's <b>body</b> is <b>destroyed</b> and leaves a <span class="pu pu-y">×2</span> behind. But a glitch that hits you <b>head-on (the mouth)</b> still <b>kills</b> you — so herd them into your tail, not your face. (A shielded head smashes them instead.)</li>
          <li><b>Power-ups</b> appear on those same boxes and <b>all fade away</b> — the <b>rarer</b> the power-up, the <b>shorter</b> it lingers, so grab the good ones fast:
            <ul>
              <li><span class="pu pu-b">🛡 blue</span> — <b>shield</b>: smash through glitches and your own body for a few seconds.</li>
              <li><span class="pu pu-y">×2 yellow</span> — <b>double seeds</b> for a few seconds.</li>
              <li><span class="pu pu-f">0 white</span> — the rare <b>#FEFEFE</b> drop: <b>wipe every glitch</b> + a bonus (a nod to the “zero out” hint).</li>
              <li><span class="pu pu-r">↺ purple</span> — <b>incredibly rare</b> (score 10+): <b>reset your length</b> back to the start but <b>keep your score</b> — a second wind to push higher.</li>
            </ul>
          </li>
          <li><b>Scoreboard:</b> when you die, enter a name to post your <b>score</b> and <b>run time</b> to the <b>global</b> board — shared by every player and stored on <b>GitHub</b>. <b id="sk-anti"></b></li>
        </ul>
      </details>
    </div>
  </div></section>`;

  function mount(root) {
    const canvas = qs('#sk-canvas', root);
    if (!canvas) return;
    const $ = (s) => qs(s, root);
    const overlay = $('#sk-overlay'), ovTitle = $('#sk-ov-title'), ovSub = $('#sk-ov-sub'), ovBtn = $('#sk-ov-btn');
    const submitRow = $('#sk-submit-row'), nameIn = $('#sk-name'), submitBtn = $('#sk-submit'), rankEl = $('#sk-rank');
    const PU = { blue: '🛡 shield', yellow: '×2 seeds', fefefe: '0 wipe', reset: '↺ reset' };

    $('#sk-scope').textContent = isConfigured() ? '· global · on GitHub' : '· not connected yet';
    $('#sk-anti').textContent = 'The server re-simulates your recorded game to compute the real score, so the board can’t be faked — and nothing is stored on your device.';

    let lastReplay = null, submitted = false;

    const game = snakeGame(canvas, {
      onHud(s) {
        $('#sk-score').textContent = s.score;
        $('#sk-time').textContent = fmtTime(s.timeMs); $('#sk-level').textContent = s.level; $('#sk-enemies').textContent = s.enemies;
        const p = $('#sk-power');
        if (s.power) { p.hidden = false; p.textContent = PU[s.power] || s.power; p.className = 'sk-power pu-' + s.power[0]; } else p.hidden = true;

        if (s.status === 'playing') { overlay.classList.add('hidden'); return; }
        overlay.classList.remove('hidden');
        const over = s.status === 'over';
        submitRow.hidden = !(over && lastReplay && lastReplay.score > 0 && !submitted);
        if (over) {
          ovTitle.textContent = 'Game Over';
          ovSub.innerHTML = `Score <b>${s.score}</b> · Time <b>${fmtTime(s.timeMs)}</b>`;
          ovBtn.textContent = '↻ Play again';
        } else if (s.status === 'paused') { ovTitle.textContent = 'Paused'; ovSub.textContent = 'Take a breath'; ovBtn.textContent = '▶ Resume'; submitRow.hidden = true; rankEl.hidden = true; }
        else { ovTitle.textContent = 'Snake'; ovSub.innerHTML = 'Press <b>Space</b> or <b>tap</b> to start'; ovBtn.textContent = '▶ Play'; submitRow.hidden = true; rankEl.hidden = true; }
      },
      onOver(replay) {
        lastReplay = replay; submitted = false; rankEl.hidden = true;
        try { const n = localStorage.getItem('gsmg:snake:name'); if (n) nameIn.value = n; } catch {}
      },
    });

    // ---- scoreboard (global, lives on GitHub) ----
    function setTop(board) { $('#sk-top').textContent = (board && board.length) ? board[0].score : '—'; }
    async function refreshBoard() {
      const { board, configured, error } = await fetchBoard();
      $('#sk-scope').textContent = configured ? '· global · on GitHub' : '· not connected yet';
      setTop(board);
      renderBoard($('#sk-board'), board, { configured, error });
    }
    refreshBoard();

    submitBtn.addEventListener('click', async () => {
      if (!lastReplay || submitted) return;
      submitBtn.disabled = true; submitBtn.textContent = 'verifying…';
      try { localStorage.setItem('gsmg:snake:name', nameIn.value); } catch {}
      const res = await submitScore(nameIn.value, lastReplay);
      submitBtn.disabled = false; submitBtn.textContent = 'Submit score';
      if (res.ok) {
        submitted = true; submitRow.hidden = true;
        rankEl.hidden = false; rankEl.innerHTML = `✓ Verified on the server — <b>rank #${res.rank}</b> on the global board`;
        if (res.board) { renderBoard($('#sk-board'), res.board, { configured: true }); setTop(res.board); } else refreshBoard();
      } else { rankEl.hidden = false; rankEl.innerHTML = `<span class="sb-err">${res.error || 'could not submit'}</span>`; }
    });
    nameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click(); });

    // ---- keyboard (PC) ----
    const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
    function onKey(e) {
      if (!document.body.contains(canvas)) { window.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); return; }
      if (document.activeElement === nameIn) return;                      // typing a name
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); game.action(); return; }
      const d = DIRS[e.key]; if (d) { e.preventDefault(); game.setDir(d[0], d[1]); }
    }
    window.addEventListener('keydown', onKey);
    function onVis() { if (document.visibilityState === 'hidden') game.pause(); }
    document.addEventListener('visibilitychange', onVis);

    // ---- swipe on the grid (no page-scroll) ----
    let sx = 0, sy = 0, mx = 0, my = 0;
    canvas.addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = mx = t.clientX; sy = my = t.clientY; }, { passive: true });
    canvas.addEventListener('touchmove', (e) => { const t = e.touches[0]; mx = t.clientX; my = t.clientY; e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', () => {
      const dx = mx - sx, dy = my - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { game.action(); return; }
      if (Math.abs(dx) > Math.abs(dy)) game.setDir(Math.sign(dx), 0); else game.setDir(0, Math.sign(dy));
    });
    canvas.addEventListener('click', () => game.action());

    // ---- D-pad ----
    on($('#sk-dpad'), 'click', '.dpad', (e, b) => { if (b.id === 'sk-act') return game.action(); const [x, y] = b.dataset.dir.split(',').map(Number); game.setDir(x, y); });
    qsa('.dpad', root).forEach(b => b.addEventListener('touchstart', (e) => { e.preventDefault(); if (b.id === 'sk-act') game.action(); else { const [x, y] = b.dataset.dir.split(',').map(Number); game.setDir(x, y); } }, { passive: false }));

    ovBtn.addEventListener('click', () => game.action());
  }

  return { title: 'Games', html, mount };
}

function renderBoard(host, board, opts = {}) {
  if (!host) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (!board || !board.length) {
    if (opts.configured === false) { host.innerHTML = '<p class="sb-empty">The global scoreboard isn’t connected yet — see <a href="https://github.com/HosterjackAGV/gsmg-5btc-puzzle/blob/main/docs/SCOREBOARD.md" target="_blank" rel="noopener">docs/SCOREBOARD.md</a> to switch it on (free, ~10 min).</p>'; return; }
    if (opts.error) { host.innerHTML = `<p class="sb-empty">${esc(opts.error)}</p>`; return; }
    host.innerHTML = '<p class="sb-empty">No scores yet — <b>be the first</b>. 🥇</p>'; return;
  }
  const medal = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
  host.innerHTML = `<table class="sb-table"><thead><tr><th>#</th><th>Name</th><th>Score</th><th>Time</th></tr></thead><tbody>${
    board.slice(0, 25).map((e, i) => `<tr><td class="sb-rank">${medal(i)}</td><td class="sb-name">${esc(e.name)}</td><td class="sb-score">${e.score}</td><td class="sb-time">${fmtTime(e.timeMs)}</td></tr>`).join('')
  }</tbody></table>`;
}
