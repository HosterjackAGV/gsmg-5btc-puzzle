// views/games.js — the Games section. First game: Snake on the 14×14 genesis grid.
// Keyboard (PC) + swipe / on-screen D-pad (phone). On death you can put your name on the
// scoreboard; scores are verified by re-simulating the recorded game, so they can't be faked.

import { qs, qsa, on } from '../util.js';
import { snakeGame } from '../games/snake.js';
import { fetchBoard, submitScore, fmtTime, fmtDate, isConfigured, groupBoard, captureAdminToken, isAdmin, adminLogin, adminLoginUrl, adminLogout, wipeBoard } from '../games/scoreboard.js';

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
        <div class="sb-admin" id="sk-admin" hidden></div>
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
          <li><b>Speed</b> steps up at the <b>same milestones as the glitches</b>: relaxed until <b>100</b>, then faster at <b>200</b> and <b>500</b>, reaching the <b>human-reaction maximum at 1000</b>. Slow to start, brutal once you're deep.</li>
          <li><b>Death:</b> hitting a <b>wall</b>, your <b>own body</b>, or a moving <b>glitch</b> ends the run.</li>
          <li><b>Glitches</b> 👾 crawl out of the genesis grid's <b>blue / yellow / #FEFEFE</b> boxes — at most <b>3</b> on the board at once. Each is <b>telegraphed</b>: a fast <b>red aura</b> pulses on the box for <b>1–3 seconds</b> before the glitch appears. They stay <b>frozen</b> until <b>score 100</b>, then hunt — getting faster as you climb:
            <ul>
              <li><b>100+</b> — crawling, about <b>a third</b> of your speed.</li>
              <li><b>200+</b> — <b>half</b> your speed.</li>
              <li><b>500+</b> — <b>your full</b> speed.</li>
              <li><b>1000+</b> — <b>twice</b> your speed, turning <b>blinking bright red</b>.</li>
            </ul>
          </li>
          <li><b>Your body is a weapon:</b> a glitch that walks into the snake's <b>body</b> is <b>destroyed</b> and drops a <span class="pu" style="background:#fff200;color:#201500">×2</span>. But one that hits you <b>head-on (the mouth)</b> still <b>kills</b> you — herd them into your tail, not your face.</li>
          <li><b>Shield</b> 🛡 flips the hunt: while it's up, glitches turn <b>ghostly</b> and <b>flee</b> from you, and you can pass through them and your own body. <b>Head-butt</b> one while shielded and it's smashed, dropping a <span class="pu" style="background:#ffae34;color:#201500">×4</span>.</li>
          <li><b>Power-ups</b> appear on those boxes and <b>all fade</b> (rarer = shorter on the field):
            <ul>
              <li><span class="pu pu-b">🛡 shield</span> — phase through glitches &amp; your own body for a few seconds (and scatter the glitches).</li>
              <li><b>Score multipliers</b> <span class="pu" style="background:#fff200;color:#201500">×2</span> <span class="pu" style="background:#ffae34;color:#201500">×4</span> <span class="pu" style="background:#ff6ad5;color:#201500">×8</span> <span class="pu" style="background:#7cf9ff;color:#072028">×16</span> — ×4 is <b>4×</b> rarer than ×2, ×8 is <b>32×</b> rarer, ×16 is <b>128×</b> rarer.</li>
              <li><span class="pu pu-f">0 white</span> — the rare <b>#FEFEFE</b> drop: <b>wipe every glitch</b> + a bonus (a nod to “zero out”).</li>
              <li><span class="pu pu-r">↺ purple</span> — <b>incredibly rare</b> (score 10+): <b>reset your length</b> to the start but <b>keep your score</b> — a second wind.</li>
            </ul>
          </li>
          <li><b>Multipliers stack.</b> Hold two at once and their effects <b>multiply while they overlap</b> (a ×2 plus a ×4 = <b>×8</b> for as long as both last), and each still <b>expires on its own timer</b>. Your <b>score is the real point total</b> — every seed is worth its points × your current multiplier.</li>
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

    $('#sk-scope').textContent = isConfigured() ? '· global · on GitHub' : '· not connected yet';
    $('#sk-anti').textContent = 'The server re-simulates your recorded game to compute the real score, so the board can’t be faked — and nothing is stored on your device.';

    let lastReplay = null, submitted = false;

    const game = snakeGame(canvas, {
      onHud(s) {
        $('#sk-score').textContent = s.score;
        $('#sk-time').textContent = fmtTime(s.timeMs); $('#sk-level').textContent = s.level; $('#sk-enemies').textContent = s.enemies;
        const p = $('#sk-power'); const bits = [];
        if (s.shield) bits.push('🛡');
        if (s.mult > 1) bits.push('×' + s.mult);
        if (bits.length) { p.hidden = false; p.textContent = bits.join(' '); p.className = 'sk-power' + (s.mult > 1 ? ' pu-mult' : '') + (s.shield ? ' pu-shield' : ''); } else p.hidden = true;

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
    captureAdminToken();                               // grab the admin token if we just came back from GitHub OAuth
    function setTop(board) { $('#sk-top').textContent = (board && board.length) ? board[0].score : '—'; }
    async function refreshBoard() {
      const { board, configured, error } = await fetchBoard();
      $('#sk-scope').textContent = configured ? '· global · on GitHub' : '· not connected yet';
      setTop(board);
      renderBoard($('#sk-board'), board, { configured, error });
    }
    function renderAdmin() {
      const host = $('#sk-admin'); if (!host) return;
      if (!isConfigured()) { host.hidden = true; return; }
      host.hidden = false;
      if (isAdmin()) {
        host.innerHTML = `<span class="sb-admin-who">🔓 admin: <b>${adminLogin() || 'you'}</b></span>` +
          `<button type="button" class="btn danger sm" id="sk-wipe">Erase scoreboard</button>` +
          `<button type="button" class="btn ghost sm" id="sk-logout">Log out</button>`;
        $('#sk-wipe').addEventListener('click', async () => {
          if (!confirm('Erase the ENTIRE global scoreboard for everyone? This cannot be undone.')) return;
          const b = $('#sk-wipe'); b.disabled = true; b.textContent = 'Erasing…';
          const res = await wipeBoard();
          b.disabled = false; b.textContent = 'Erase scoreboard';
          if (res.ok) { renderBoard($('#sk-board'), res.board || [], { configured: true }); setTop(res.board || []); }
          else { alert('Could not erase: ' + (res.error || 'error')); }
          renderAdmin();                               // token may have been cleared if it expired
        });
        $('#sk-logout').addEventListener('click', () => { adminLogout(); renderAdmin(); });
      } else {
        const url = adminLoginUrl();
        host.innerHTML = url ? `<a class="sb-admin-login" href="${url}">🔒 Admin login (GitHub)</a>` : '';
      }
    }
    refreshBoard();
    renderAdmin();

    submitBtn.addEventListener('click', async () => {
      if (!lastReplay || submitted) return;
      submitBtn.disabled = true; submitBtn.textContent = 'verifying…';
      try { localStorage.setItem('gsmg:snake:name', nameIn.value); } catch {}
      const res = await submitScore(nameIn.value, lastReplay);
      submitBtn.disabled = false; submitBtn.textContent = 'Submit score';
      if (res.ok) {
        submitted = true; submitRow.hidden = true;
        rankEl.hidden = false;
        const rk = res.rank ? ` — <b>rank #${res.rank}</b> of all players` : '';
        rankEl.innerHTML = res.isBest
          ? `✓ Verified — <b>new personal best ${res.score}</b>!${rk}`
          : `✓ Verified — saved (your best is <b>${res.best != null ? res.best : res.score}</b>)${rk}`;
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
  const users = groupBoard(board || []);                 // one row per player (their best) + all their games
  if (!users.length) {
    if (opts.configured === false) { host.innerHTML = '<p class="sb-empty">The global scoreboard isn’t connected yet — see <a href="https://github.com/HosterjackAGV/gsmg-5btc-puzzle/blob/main/docs/SCOREBOARD.md" target="_blank" rel="noopener">docs/SCOREBOARD.md</a> to switch it on (free, ~10 min).</p>'; return; }
    if (opts.error) { host.innerHTML = `<p class="sb-empty">${esc(opts.error)}</p>`; return; }
    host.innerHTML = '<p class="sb-empty">No scores yet — <b>be the first</b>. 🥇</p>'; return;
  }
  const medal = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
  host.innerHTML = `<table class="sb-table"><thead><tr><th class="sb-x"></th><th>#</th><th>Name</th><th>Best</th><th>Time</th><th>Date</th></tr></thead><tbody>${
    users.slice(0, 25).map((u, i) => {
      const gs = Array.isArray(u.games) ? u.games : [u];
      const multi = gs.length > 1;
      const head = `<tr class="sb-user${multi ? ' has-games' : ''}" data-u="${i}">` +
        `<td class="sb-x">${multi ? '<span class="sb-exp">▸</span>' : ''}</td>` +
        `<td class="sb-rank">${medal(i)}</td>` +
        `<td class="sb-name">${esc(u.name)}${multi ? ` <span class="sb-count">${gs.length} games</span>` : ''}</td>` +
        `<td class="sb-score">${u.score}</td><td class="sb-time">${fmtTime(u.timeMs)}</td><td class="sb-date">${fmtDate(u.date)}</td></tr>`;
      const sub = multi ? `<tr class="sb-sub" data-sub="${i}" hidden><td></td><td colspan="5"><ol class="sb-games-list">${
        gs.map(g => `<li><span class="sb-g-score">${g.score}</span><span class="sb-time">${fmtTime(g.timeMs)}</span><span class="sb-date">${fmtDate(g.date)}</span></li>`).join('')
      }</ol></td></tr>` : '';
      return head + sub;
    }).join('')
  }</tbody></table>`;
  host.querySelectorAll('.sb-user.has-games').forEach(row => {
    row.addEventListener('click', () => {
      const i = row.getAttribute('data-u'), sub = host.querySelector(`.sb-sub[data-sub="${i}"]`);
      if (!sub) return;
      const nowOpen = sub.hidden; sub.hidden = !nowOpen;
      row.classList.toggle('open', nowOpen);
      const exp = row.querySelector('.sb-exp'); if (exp) exp.textContent = nowOpen ? '▾' : '▸';
    });
  });
}
