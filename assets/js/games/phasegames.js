// games/phasegames.js — interactive, drag-to-play puzzles for each real door.
// Unlike the Arcade (fun/community), these are the REAL phase-solving games:
// finishing one cracks the door, awards XP, and — on the open frontier — runs
// the real crypto and logs a verified attempt that contributes to the puzzle.
//
// Driven entirely by each phase's `play` config in content/phases.js, so adding
// a door's game is data, not new UI. Two engines: `assemble` and `spiral`.

import { MATRIX } from '../../../content/matrix.js';
import * as store from '../store.js';
import { sha256Hex, decryptBlob, tryBlob, attemptId, looksLikeWif, hasSecureCrypto } from '../crypto.js';
import { draggable } from '../engine/drag.js';
import { esc, toast, confetti } from '../util.js';

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

/** Build the interactive game for a phase, or null if it has none.
 *  hooks: { crack() }  — called to mark the door cracked + celebrate. */
export function phaseGame(p) {
  if (!p || !p.play) return null;
  if (p.play.type === 'spiral') return spiralGame(p);
  if (p.play.type === 'assemble') return assembleGame(p);
  return null;
}

// =========================================================================
// ASSEMBLE — drag labelled tiles into ordered slots to rebuild the answer.
// =========================================================================
function assembleGame(p) {
  const cfg = p.play;
  const solution = cfg.tokens.map(t => ({ label: t.label, value: t.value != null ? t.value : t.label }));
  const decoys = (cfg.decoys || []).map(t => ({ label: t.label, value: t.value != null ? t.value : t.label, decoy: true }));
  const pool = shuffle(solution.concat(decoys));
  const target = cfg.targetField ? (p[cfg.targetField] || '') : (cfg.target || '');
  const join = cfg.join != null ? cfg.join : '';
  const N = solution.length;

  const html = `
  <div class="pg pg-assemble" data-phase="${p.id}">
    <p class="pg-intro">${esc(cfg.intro || 'Drag the tiles into the right order.')}</p>
    <div class="pg-slots" id="pg-slots">${Array.from({ length: N }, (_, i) => `<div class="pg-slot" data-i="${i}" aria-label="position ${i + 1}"><span class="pg-num">${i + 1}</span></div>`).join('')}</div>
    <div class="pg-tray" id="pg-tray">${pool.map((t, i) => tileHTML(t, i)).join('')}</div>
    <div class="pg-actions">
      <button type="button" class="btn teal sm" id="pg-hint">💡 Hint</button>
      <button type="button" class="btn ghost sm" id="pg-clear">⌫ Reset</button>
      ${cfg.mode === 'recipe' ? '<button type="button" class="btn gold sm" id="pg-run">⚡ Run recipe</button>' : ''}
      <span class="pg-status faint" id="pg-status"></span>
    </div>
    <div class="cout" id="pg-out"></div>
  </div>`;

  function tileHTML(t, i) {
    return `<button type="button" class="pg-tile${t.decoy ? ' decoy' : ''}" data-tid="${i}" data-val="${esc(t.value)}" title="${esc(t.value)}">${esc(t.label)}</button>`;
  }

  function mount(root, hooks) {
    const slotsEl = root.querySelector('#pg-slots');
    const trayEl = root.querySelector('#pg-tray');
    const statusEl = root.querySelector('#pg-status');
    const out = root.querySelector('#pg-out');
    const placed = new Array(N).fill(null);  // slot index -> {label,value} or null
    let done = false;

    const tileById = (id) => pool[+id];
    const show = (cls, txt) => { out.className = 'cout show ' + cls; out.textContent = txt; };

    function firstEmpty() { return placed.findIndex(x => x === null); }
    function inTray(id) { return !placed.some(t => t && t.poolId === id); }

    function paint() {
      // slots
      slotsEl.querySelectorAll('.pg-slot').forEach(slot => {
        const i = +slot.dataset.i; const t = placed[i];
        slot.classList.toggle('filled', !!t);
        slot.innerHTML = t ? `<span class="pg-tileface" data-pid="${t.poolId}">${esc(t.label)}</span>` : `<span class="pg-num">${i + 1}</span>`;
      });
      // tray: dim tiles already placed
      trayEl.querySelectorAll('.pg-tile').forEach(tile => tile.classList.toggle('spent', !inTray(+tile.dataset.tid)));
      const filled = placed.filter(Boolean).length;
      statusEl.textContent = `${filled}/${N} placed`;
      // recipe mode (real frontier crypto) waits for the explicit Run button so
      // players can arrange before each logged attempt; others auto-check.
      if (filled === N && !done && cfg.mode !== 'recipe') check();
    }

    function placeTile(poolId, slotIndex) {
      if (done) return;
      const t = tileById(poolId); if (!t) return;
      // remove this tile from any slot it currently occupies
      const cur = placed.findIndex(x => x && x.poolId === poolId); if (cur >= 0) placed[cur] = null;
      const target = slotIndex != null ? slotIndex : firstEmpty();
      if (target < 0 || target >= N) { paint(); return; }
      placed[target] = { label: t.label, value: t.value, poolId };
      paint();
    }
    function removeSlot(i) { if (done) return; placed[i] = null; paint(); }

    function check() {
      const joined = placed.map(t => t.value).join(join);
      const ok = cfg.mode === 'recipe' ? false : (norm(joined) === norm(target));
      if (cfg.mode === 'recipe') { runRecipe(joined); return; }
      if (ok) win(joined); else { show('bad', '✗ Not the right order yet — use the hint if you’re stuck.'); }
    }

    async function win(joined) {
      done = true;
      slotsEl.querySelectorAll('.pg-slot').forEach(s => s.classList.add('ok'));
      if (cfg.reveal === 'decrypt' && hasSecureCrypto) {
        show('ok', '⚡ Correct — decrypting the real page…');
        try {
          const key = cfg.keyFromAnswer ? await sha256Hex(p.door.answer) : await sha256Hex(joined);
          const text = await decryptBlob(cfg.revealBlob || p.door.blob, key);
          show('ok', `✓ UNLOCKED — the real page:\n\n${text.slice(0, 1200)}${text.length > 1200 ? '\n\n…(truncated)' : ''}`);
        } catch (e) { show('ok', '✓ Correct order! (Live decrypt unavailable here — open over a server to watch it.)'); }
      } else if (cfg.mode === 'explore') {
        show('ok', `✓ Reassembled: ${esc(joined)}`);
      } else {
        show('ok', `✓ Correct — “${joined.length > 80 ? joined.slice(0, 80) + '…' : joined}”.`);
      }
      confetti();
      if (cfg.mode === 'explore') { store.addXp(p.xp || 40); toast({ ico: '🧩', title: `${p.codename}: chunks assembled`, desc: `+${p.xp || 40} XP`, kind: 'gold' }); }
      else if (hooks && hooks.crack) hooks.crack();
    }

    async function runRecipe(joined) {
      if (done) return;
      if (!hasSecureCrypto) { show('bad', 'The live engine needs a secure context (http://localhost or the published site).'); return; }
      const runBtn = root.querySelector('#pg-run'); if (runBtn) { runBtn.disabled = true; runBtn.textContent = '…testing'; }
      try {
        const key = await sha256Hex(joined);
        const ok = await tryBlob(p.door.blob, key);
        const id = await attemptId(p.door.blob, joined, false);
        store.logAttempt({ id, blob: p.door.blob, recipe: joined, prehash: false, result: ok ? 'unlocked' : 'fail' });
        if (ok) {
          const text = await decryptBlob(p.door.blob, key);
          show('ok', `🏆 VALID DECRYPTION!${looksLikeWif(text) ? ' Looks like a Bitcoin WIF key!' : ''}\n\n${text.slice(0, 1200)}`);
          confetti(220);
          toast({ ico: '🏆', title: 'A blob unlocked!', desc: 'Verify the key — this may be the solve!', kind: 'gold', ttl: 9000 });
          done = true;
        } else {
          show('bad', `✗ fail — invalid padding. Logged as a verified dead-end (fingerprint ${id.slice(0, 12)}…), so it counts toward the shared frontier map.`);
          toast({ ico: '🛰️', title: 'Frontier attempt logged', desc: 'Submit it on the Hive to share.', ttl: 5000 });
        }
      } catch (e) { show('bad', '✗ error: ' + (e.message || e)); }
      finally { if (runBtn) { runBtn.disabled = false; runBtn.textContent = '⚡ Run recipe'; } }
    }

    // ---- interaction: click + drag ----
    pool.forEach((t, id) => {
      const tile = trayEl.querySelector(`.pg-tile[data-tid="${id}"]`);
      if (!tile) return;
      let ghost = null, dragged = false;
      tile.addEventListener('click', () => { if (dragged) { dragged = false; return; } if (inTray(id)) placeTile(id, null); });
      draggable(tile, {
        onStart: (e) => { dragged = false; ghost = mkGhost(t.label); place(ghost, e); tile.classList.add('dragging'); },
        onMove: (e, dx, dy) => { if (Math.abs(dx) > 6 || Math.abs(dy) > 6) dragged = true; if (ghost) place(ghost, e); },
        onDrop: (e, tgt) => { const slot = tgt && tgt.closest ? tgt.closest('.pg-slot') : null; if (slot && dragged) placeTile(id, +slot.dataset.i); },
        onEnd: () => { if (ghost) { ghost.remove(); ghost = null; } tile.classList.remove('dragging'); },
      });
    });
    // click a filled slot to return its tile
    slotsEl.addEventListener('click', (e) => { const face = e.target.closest('.pg-tileface'); if (!face) return; const i = placed.findIndex(t => t && t.poolId === +face.dataset.pid); if (i >= 0) removeSlot(i); });

    root.querySelector('#pg-clear').onclick = () => { if (done) return; placed.fill(null); out.className = 'cout'; paint(); };
    root.querySelector('#pg-hint').onclick = () => {
      if (done) return;
      const i = firstEmpty(); if (i < 0) return;
      const want = solution[i]; const poolId = pool.findIndex((t, k) => t.value === want.value && inTray(k));
      if (poolId >= 0) placeTile(poolId, i);
    };
    const runBtn = root.querySelector('#pg-run'); if (runBtn) runBtn.onclick = () => runRecipe(placed.filter(Boolean).map(t => t.value).join(join));

    paint();
  }

  return { html, mount };
}

// =========================================================================
// SPIRAL — drag a read-head along the genesis grid's spiral; bits decode live.
// =========================================================================
function spiralGame(p) {
  const blue = new Set(MATRIX.blue.map(([r, c]) => r + ',' + c));
  const yellow = new Set(MATRIX.yellow.map(([r, c]) => r + ',' + c));
  const cols = MATRIX.grid[0].length;
  let cells = '';
  for (let r = 0; r < MATRIX.grid.length; r++)
    for (let c = 0; c < MATRIX.grid[r].length; c++) {
      const v = MATRIX.grid[r][c];
      const tint = blue.has(r + ',' + c) ? 'blue' : yellow.has(r + ',' + c) ? 'yellow' : '';
      cells += `<div class="mcell ${v ? 'on' : 'off'} ${tint}" data-rc="${r},${c}"></div>`;
    }

  const html = `
  <div class="pg pg-spiral" data-phase="${p.id}">
    <p class="pg-intro">Drag the slider to sweep a reading head along the <b>counter-clockwise spiral</b>. Watch the bits become letters. Reach the end to read the hidden address.</p>
    <div class="pg-spiralwrap">
      <div class="mtx-grid" id="pg-grid" style="grid-template-columns:repeat(${cols},1fr)">${cells}</div>
      <div class="pg-readout">
        <input type="range" id="pg-range" min="0" max="${MATRIX.spiral.length}" value="0" step="1" class="pg-range">
        <div class="faint mono" style="font-size:10px;letter-spacing:.1em;margin-top:8px">BITS</div>
        <div class="mono" id="pg-bits" style="font-size:11px;word-break:break-all;min-height:2.2em;color:var(--muted)"></div>
        <div class="faint mono" style="font-size:10px;letter-spacing:.1em">DECODED</div>
        <div class="mono gold" id="pg-text" style="font-size:16px;min-height:1.4em"></div>
        <button type="button" class="btn gold sm" id="pg-claim" disabled style="margin-top:10px">🔓 Open the door with it</button>
      </div>
    </div>
    <div class="cout" id="pg-out"></div>
  </div>`;

  function mount(root, hooks) {
    const grid = root.querySelector('#pg-grid');
    const range = root.querySelector('#pg-range');
    const bitsEl = root.querySelector('#pg-bits');
    const textEl = root.querySelector('#pg-text');
    const claim = root.querySelector('#pg-claim');
    const out = root.querySelector('#pg-out');
    const cellAt = {};
    grid.querySelectorAll('.mcell').forEach(el => { cellAt[el.dataset.rc] = el; });

    function update(n) {
      grid.querySelectorAll('.mcell.lit, .mcell.head').forEach(el => el.classList.remove('lit', 'head'));
      let bits = '';
      for (let i = 0; i < n; i++) { const [r, c] = MATRIX.spiral[i]; const el = cellAt[r + ',' + c]; if (el) el.classList.add('lit'); bits += MATRIX.grid[r][c]; }
      if (n > 0) { const [hr, hc] = MATRIX.spiral[n - 1]; const he = cellAt[hr + ',' + hc]; if (he) he.classList.add('head'); }
      bitsEl.textContent = bits;
      let s = '';
      for (let k = 0; k + 8 <= bits.length; k += 8) s += String.fromCharCode(parseInt(bits.slice(k, k + 8), 2));
      textEl.textContent = s;
      const complete = n >= MATRIX.spiral.length;
      claim.disabled = !complete;
      if (complete) { out.className = 'cout show ok'; out.textContent = `✓ Decoded: ${s.replace(/ +$/, '')}`; }
    }
    range.addEventListener('input', () => update(+range.value));
    claim.addEventListener('click', () => { confetti(); if (hooks && hooks.crack) hooks.crack(); });
    update(0);
  }
  return { html, mount };
}

function mkGhost(label) { const g = document.createElement('div'); g.className = 'pg-ghost'; g.textContent = label; document.body.appendChild(g); return g; }
function place(g, e) { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }
