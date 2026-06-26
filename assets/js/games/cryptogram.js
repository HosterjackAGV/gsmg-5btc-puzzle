// games/cryptogram.js — "Substitution": break a monoalphabetic cipher by hand.
// Drag a letter tile onto any slot to guess what that cipher letter really is;
// every slot with the same cipher letter fills at once (that's how substitution
// works). Scored by the SHARED sim (games/sim/cryptogram.js) so the number you
// see is exactly what the CI verifier recomputes from your move-log.

import { makePuzzle, simulate, ALPHABET } from './sim/cryptogram.js';
import { draggable } from '../engine/drag.js';
import { esc } from '../util.js';

const MAX_LEVEL = 12;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `daily-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }
function randSeed() { return 'p-' + Math.floor((Date.now() % 1e7) + Math.random() * 1e7).toString(36); }

export function start(host) {
  const el = host.el;
  const ch = host.challenge;                       // tournament round (fixed seed/level) or null
  let level = ch ? ch.level : 1, mode = 'daily', seed = ch ? ch.seed : todaySeed();
  let puzzle, map, moves, selectedC, solved;
  const showFreq = () => !ch && level < 5;          // frequency aid only at low practice levels

  function reset() {
    if (!ch) seed = mode === 'daily' ? todaySeed() : randSeed();
    puzzle = makePuzzle(seed, level);
    map = {}; moves = []; selectedC = null; solved = false;
    render();
  }

  // ---- letter frequency in the ciphertext (a real cryptanalysis aid) ----
  function freq() {
    const f = {};
    for (const ch of puzzle.ciphertext) if (/[A-Z]/.test(ch)) f[ch] = (f[ch] || 0) + 1;
    return f;
  }

  function dupPlains() {
    const seen = {}, dup = {};
    for (const c of puzzle.distinct) { const g = map[c]; if (!g) continue; if (seen[g]) dup[g] = true; seen[g] = true; }
    return dup;
  }

  // ---- rendering ----
  function boardHTML() {
    const dup = dupPlains();
    let out = '', i = 0;
    for (const ch of puzzle.ciphertext) {
      if (ch === ' ') { out += '<span class="cg-space"></span>'; continue; }
      if (!/[A-Z]/.test(ch)) { out += `<span class="cg-punct">${esc(ch)}</span>`; continue; }
      const g = map[ch] || '';
      const ok = g && g === puzzle.c2p[ch];
      const cls = ['cg-slot'];
      if (ch === selectedC) cls.push('sel');
      if (g) cls.push('filled');
      if (ok) cls.push('ok');
      if (g && dup[g] && !ok) cls.push('dup');
      out += `<button type="button" class="${cls.join(' ')}" data-c="${ch}" data-i="${i++}" aria-label="cipher ${ch}">
        <span class="g">${esc(g || '·')}</span><span class="c">${ch}</span></button>`;
    }
    return out;
  }

  function trayHTML() {
    const used = {};
    for (const c of puzzle.distinct) if (map[c]) used[map[c]] = (used[map[c]] || 0) + 1;
    return ALPHABET.split('').map(L =>
      `<button type="button" class="cg-tile${used[L] ? ' used' : ''}" data-g="${L}" aria-label="letter ${L}">${L}${used[L] > 1 ? '<i class="dupdot"></i>' : ''}</button>`
    ).join('');
  }

  function statsHTML() {
    const f = freq();
    const total = puzzle.distinct.length;
    const got = puzzle.distinct.filter(c => map[c] === puzzle.c2p[c]).length;
    const hintsUsed = moves.filter(m => m.hint).length;
    const top = showFreq()
      ? Object.entries(f).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, n]) => `<span class="cg-fchip"><b>${c}</b>×${n}</span>`).join('')
      : `<span class="faint" style="font-size:11px">🔒 no frequency aid at this level — read it by hand</span>`;
    return `<div class="cg-stats">
      <span class="pill">solved letters <b>${got}/${total}</b></span>
      <span class="pill">hints <b>${hintsUsed}</b>/${puzzle.hintBudget} free</span>
      <span class="pill best">your best <b>${host.bestScore()}</b></span>
      <div class="cg-freq" title="how often each cipher letter appears — common ones are usually E T A O">${top}</div>
    </div>`;
  }

  function levelPills() {
    let s = '';
    for (let l = 1; l <= MAX_LEVEL; l++) s += `<button type="button" class="cg-lvl${l === level ? ' on' : ''}" data-lvl="${l}">${l}</button>`;
    return s;
  }

  function render() {
    el.innerHTML = `
    <div class="cg">
      <div class="cg-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `
        <div class="cg-modes">
          <button type="button" class="cg-mode${mode === 'daily' ? ' on' : ''}" data-mode="daily">☀ Daily</button>
          <button type="button" class="cg-mode${mode === 'practice' ? ' on' : ''}" data-mode="practice">∞ Practice</button>
        </div>
        <div class="cg-levels"><span class="faint">level</span>${levelPills()}</div>
        <button type="button" class="btn ghost sm" id="cg-new">↻ New</button>`}
      </div>
      ${statsHTML()}
      <div class="cg-board" id="cg-board">${boardHTML()}</div>
      <div class="cg-actions">
        <button type="button" class="btn teal sm" id="cg-hint">💡 Hint</button>
        <button type="button" class="btn ghost sm" id="cg-clear">⌫ Clear all</button>
        <span class="cg-help faint">Drag a tile onto a letter — or tap a slot then a tile, or just type.</span>
      </div>
      <div class="cg-tray" id="cg-tray">${trayHTML()}</div>
      <div class="cg-result" id="cg-result" hidden></div>
    </div>`;
    wire();
  }

  // update just the dynamic regions (cheaper than a full re-render on each move)
  function refresh() {
    const b = el.querySelector('#cg-board'); if (b) b.innerHTML = boardHTML();
    const t = el.querySelector('#cg-tray'); if (t) { t.innerHTML = trayHTML(); attachTray(t); }
    const s = el.querySelector('.cg-stats'); if (s) s.outerHTML = statsHTML();
  }

  // ---- game actions ----
  function assign(c, g, isHint) {
    if (solved || !puzzle.c2p[c]) return;
    if (isHint) { map[c] = puzzle.c2p[c]; moves.push({ hint: c }); }
    else if (g === '') { if (!map[c]) return; delete map[c]; moves.push({ c, g: '' }); }
    else { if (!/^[A-Z]$/.test(g)) return; map[c] = g; moves.push({ c, g }); }
    afterChange();
  }

  function afterChange() {
    refresh();
    if (puzzle.distinct.length && puzzle.distinct.every(c => map[c] === puzzle.c2p[c])) onSolve();
  }

  function doHint() {
    const f = freq();
    const candidates = puzzle.distinct.filter(c => map[c] !== puzzle.c2p[c]).sort((a, b) => (f[b] || 0) - (f[a] || 0));
    if (candidates.length) assign(candidates[0], null, true);
  }

  function onSolve() {
    solved = true;
    const res = simulate(seed, level, moves);          // authoritative score (== CI)
    host.reportResult({ seed, level, moves, score: res.score, solved: true });
    host.confetti(120);
    const box = el.querySelector('#cg-result');
    if (box) {
      box.hidden = false;
      box.innerHTML = `<div class="note gold"><h4>✅ Cracked it — ${res.score} pts</h4>
        <p>“${esc(puzzle.plaintext)}”</p>
        <p class="faint">${res.hints} hint(s), ${res.wrong} wrong guess(es). ${res.score > host._priorBest ? 'New personal best! ' : ''}${ch ? 'Submit it on the <b>Tournament</b> tab.' : 'Submit your best on the <b>Games board</b> tab.'}</p>
        ${ch ? '' : `<div class="row">
          ${level < MAX_LEVEL ? `<button type="button" class="btn gold sm" id="cg-next">▶ Level ${level + 1}</button>` : ''}
          <button type="button" class="btn ghost sm" id="cg-again">↻ Another</button>
        </div>`}</div>`;
      const nx = box.querySelector('#cg-next'); if (nx) nx.onclick = () => { level++; reset(); };
      const ag = box.querySelector('#cg-again'); if (ag) ag.onclick = () => reset();
    }
    refresh();
  }

  // ---- wiring ----
  let detachKeys = null;
  function attachTray(tray) {
    tray.querySelectorAll('.cg-tile').forEach(tile => {
      let ghost = null, dragged = false;
      // click-to-assign (to the currently selected cipher letter) — but not if a
      // real drag just happened, which would otherwise double-assign.
      tile.addEventListener('click', () => { if (dragged) { dragged = false; return; } if (selectedC) assign(selectedC, tile.dataset.g); });
      // drag-to-assign
      draggable(tile, {
        onStart: (e) => {
          dragged = false;
          ghost = document.createElement('div'); ghost.className = 'cg-ghost'; ghost.textContent = tile.dataset.g;
          document.body.appendChild(ghost); place(ghost, e); tile.classList.add('dragging');
        },
        onMove: (e, dx, dy) => { if (Math.abs(dx) > 6 || Math.abs(dy) > 6) dragged = true; if (ghost) place(ghost, e); },
        onDrop: (e, target) => {
          const slot = target && target.closest ? target.closest('.cg-slot') : null;
          if (slot && dragged) assign(slot.dataset.c, tile.dataset.g);
        },
        onEnd: () => { if (ghost) { ghost.remove(); ghost = null; } tile.classList.remove('dragging'); },
      });
    });
  }
  function place(ghost, e) { ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; }

  function wire() {
    host._priorBest = host.bestScore();
    const nw = el.querySelector('#cg-new'); if (nw) nw.onclick = () => reset();
    el.querySelector('#cg-hint').onclick = () => doHint();
    el.querySelector('#cg-clear').onclick = () => { puzzle.distinct.forEach(c => { if (map[c]) { delete map[c]; moves.push({ c, g: '' }); } }); refresh(); };
    el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); });
    el.querySelectorAll('.cg-mode').forEach(b => b.onclick = () => { mode = b.dataset.mode; reset(); });

    // select a slot (click) -> highlight its cipher letter group
    el.querySelector('#cg-board').addEventListener('click', (e) => {
      const slot = e.target.closest('.cg-slot'); if (!slot) return;
      selectedC = (selectedC === slot.dataset.c) ? null : slot.dataset.c; refresh();
    });

    attachTray(el.querySelector('#cg-tray'));

    // keyboard: with a slot selected, type a letter to assign, Backspace to clear
    if (detachKeys) detachKeys();
    const onKey = (e) => {
      if (!el.isConnected) { detachKeys && detachKeys(); return; }
      if (!selectedC) return;
      if (e.key === 'Backspace' || e.key === 'Delete') { assign(selectedC, ''); e.preventDefault(); }
      else if (/^[a-zA-Z]$/.test(e.key)) { assign(selectedC, e.key.toUpperCase()); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    detachKeys = () => document.removeEventListener('keydown', onKey);
  }

  reset();
  return { destroy() { if (detachKeys) detachKeys(); const g = document.querySelector('.cg-ghost'); if (g) g.remove(); } };
}
