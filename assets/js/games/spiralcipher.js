// games/spiralcipher.js — "Spiral Cipher" UI. Read the grid in a counter-clockwise
// spiral (Phase 0's move), group the bits into bytes, convert to letters, type the
// word. The grid + spiral order are shown; converting bytes→ASCII is the thinking.
// Scored by the shared sim.

import { makePuzzle, simulate } from './sim/spiralcipher.js';
import { esc } from '../util.js';

const MAX_LEVEL = 9;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `sp-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }

export function start(host) {
  const ch = host.challenge, el = host.el;
  let level = ch ? ch.level : 1, seed = ch ? ch.seed : todaySeed();
  let puzzle, moves, solved, hints;

  function reset() {
    if (!ch) seed = todaySeed();
    puzzle = makePuzzle(seed, level);
    moves = []; solved = false; hints = 0;
    render();
  }

  function spiralBits() { return puzzle.path.map(([r, c]) => puzzle.grid[r][c]).join(''); }
  function bytesHTML() {
    const bits = spiralBits();
    let out = '';
    for (let i = 0; i + 8 <= bits.length; i += 8) out += `<span class="sp-byte">${bits.slice(i, i + 8)}</span>`;
    const rem = bits.length % 8; if (rem) out += `<span class="sp-byte faint">${bits.slice(bits.length - rem)}</span>`;
    return out;
  }

  function gridHTML() {
    let cells = '';
    for (let r = 0; r < puzzle.n; r++) for (let c = 0; c < puzzle.n; c++) cells += `<div class="mcell ${puzzle.grid[r][c] ? 'on' : 'off'}" data-rc="${r},${c}"></div>`;
    return cells;
  }

  function render() {
    const pills = Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('');
    const reveal = hints > 0 ? `<span class="sp-reveal">starts with: <b>${esc(puzzle.word.slice(0, hints))}</b>…</span>` : '';
    el.innerHTML = `
    <div class="sp">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${pills}</div><button type="button" class="btn ghost sm" id="sp-new">↻ New</button>`}
      </div>
      <p class="fd-rule">Read the grid in a <b>counter-clockwise spiral</b> from the top-left (down the left column, along the bottom, up the right, across the top, then inward). Filled = <span class="mono">1</span>, empty = <span class="mono">0</span>. Group into bytes (8 bits) → ASCII letters.</p>
      <div class="pg-spiralwrap">
        <div class="mtx-grid" id="sp-grid" style="grid-template-columns:repeat(${puzzle.n},1fr)">${gridHTML()}</div>
        <div>
          <div class="row" style="gap:8px;margin-bottom:8px"><button type="button" class="btn teal sm" id="sp-trace">▶ Trace spiral</button><button type="button" class="btn ghost sm" id="sp-hint">💡 Reveal a letter</button></div>
          <div class="faint mono" style="font-size:10px;letter-spacing:.1em">SPIRAL BITS → BYTES</div>
          <div class="sp-bytes" id="sp-bytes">${bytesHTML()}</div>
          ${reveal}
          <div class="console" style="margin-top:10px"><div class="crow"><input class="cin" id="sp-in" placeholder="the decoded word…" spellcheck="false" autocomplete="off"><button class="btn gold" id="sp-go">Guess</button></div>
            <div class="cout" id="sp-out"></div></div>
        </div>
      </div>
    </div>`;
    wire();
  }

  function guess(val) {
    if (solved || !val) return;
    moves.push({ guess: val });
    const res = simulate(seed, level, moves);
    const o = el.querySelector('#sp-out');
    if (res.solved) {
      solved = true;
      host.reportResult({ seed, level, moves, score: res.score, solved: true });
      host.confetti(110);
      o.className = 'cout show ok';
      o.innerHTML = `✓ “<b>${esc(puzzle.word)}</b>” for ${res.score} pts.${ch ? ' Submit on the Tournament tab.' : (level < MAX_LEVEL ? ' <button class="btn gold sm" id="sp-next">▶ Next level</button>' : '')}`;
      const n = o.querySelector('#sp-next'); if (n) n.onclick = () => { level++; reset(); };
    } else { o.className = 'cout show bad'; o.textContent = `✗ "${val}" isn't it — re-read the spiral and recheck your bytes.`; }
  }

  function trace() {
    const grid = el.querySelector('#sp-grid');
    const cells = {}; grid.querySelectorAll('.mcell').forEach(c => cells[c.dataset.rc] = c);
    grid.querySelectorAll('.lit,.head').forEach(c => c.classList.remove('lit', 'head'));
    let i = 0;
    const timer = setInterval(() => {
      if (i >= puzzle.path.length || !el.isConnected) { clearInterval(timer); return; }
      grid.querySelectorAll('.head').forEach(c => c.classList.remove('head'));
      const [r, c] = puzzle.path[i]; const cell = cells[r + ',' + c];
      if (cell) { cell.classList.add('lit', 'head'); }
      i++;
    }, Math.max(12, 600 / puzzle.path.length));
  }

  function wire() {
    if (!ch) { el.querySelector('#sp-new').onclick = () => reset(); el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); }); }
    el.querySelector('#sp-trace').onclick = () => trace();
    el.querySelector('#sp-hint').onclick = () => { if (solved || hints >= puzzle.word.length) return; hints++; moves.push({ hint: 1 }); render(); };
    const inp = el.querySelector('#sp-in'), go = el.querySelector('#sp-go');
    go.onclick = () => { const v = inp.value.trim(); guess(v); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go.click(); });
  }

  reset();
  return { destroy() {} };
}
