// games/fielddecode.js — "Field Decoder" UI. Assign each symbol to a digit so the
// big number decodes (→ hex → ASCII) to a real word. Standard mapping at low levels
// (o=0, a=1 … i=9); scrambled at higher levels so you must deduce it. Scored by the
// shared sim, so the browser and CI agree exactly.

import { makePuzzle, simulate, STD } from './sim/fielddecode.js';
import { esc } from '../util.js';

const MAX_LEVEL = 12;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `fd-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }
function randSeed() { return 'p-' + Math.floor((Date.now() % 1e7) + Math.random() * 1e7).toString(36); }

export function start(host) {
  const ch = host.challenge;
  const el = host.el;
  let level = ch ? ch.level : 1;
  let seed = ch ? ch.seed : todaySeed();
  let puzzle, map, moves, selected, solved;

  function reset() {
    if (!ch) seed = todaySeed();
    puzzle = makePuzzle(seed, level);
    map = {}; moves = []; selected = null; solved = false;
    render();
  }

  function preview() {
    let all = true, decimal = '';
    for (const c of puzzle.symbolString) { const d = map[c]; if (d == null) { all = false; decimal += '?'; } else decimal += d; }
    let ascii = '';
    if (all) { try { let hex = BigInt(decimal).toString(16); if (hex.length % 2) hex = '0' + hex; for (let i = 0; i < hex.length; i += 2) ascii += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16)); } catch { ascii = '…'; } }
    return { decimal, ascii, all };
  }

  function symString() {
    return [...puzzle.symbolString].map(c => `<span class="fd-sym${c === selected ? ' sel' : ''}${map[c] != null ? ' set' : ''}" data-sym="${c}"><b>${map[c] != null ? map[c] : '·'}</b><i>${c}</i></span>`).join('');
  }
  function distinctRow() {
    return puzzle.distinct.map(c => `<button type="button" class="fd-tile${c === selected ? ' sel' : ''}${map[c] != null ? ' set' : ''}" data-sym="${c}">${c}<span>${map[c] != null ? map[c] : '·'}</span></button>`).join('');
  }
  function pad() { return STD.split('').map((_, d) => `<button type="button" class="fd-key" data-d="${d}">${d}</button>`).join('') + `<button type="button" class="fd-key clr" data-d="">⌫</button>`; }

  function render() {
    const pv = preview();
    const hintsUsed = moves.filter(m => m.hint).length;
    el.innerHTML = `
    <div class="fd">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('')}</div>`}
        ${ch ? '' : '<button type="button" class="btn ghost sm" id="fd-new">↻ New</button>'}
      </div>
      <p class="fd-rule">Each symbol stands for one digit. ${puzzle.permuted ? '<b>The mapping is scrambled</b> — deduce which symbol is which digit so the number decodes to a real word.' : 'Standard mapping: <span class="mono">o=0, a=1 … i=9</span>.'} Then it reads as one big number → hex → letters.</p>
      <div class="fd-string">${symString()}</div>
      <div class="cg-stats"><span class="pill">symbols <b>${puzzle.distinct.filter(c => map[c] != null).length}/${puzzle.distinct.length}</b></span><span class="pill">hints <b>${hintsUsed}</b>/${puzzle.hintBudget} free</span><span class="pill best">best <b>${host.bestScore()}</b></span></div>
      <div class="fd-tray">${distinctRow()}</div>
      <div class="fd-pad">${pad()}</div>
      <div class="fd-readout">
        <div class="faint mono" style="font-size:10px;letter-spacing:.1em">NUMBER</div>
        <div class="mono" id="fd-num" style="font-size:12px;word-break:break-all;color:var(--muted)">${esc(pv.decimal)}</div>
        <div class="faint mono" style="font-size:10px;letter-spacing:.1em;margin-top:6px">DECODES TO</div>
        <div class="mono gold" id="fd-ascii" style="font-size:17px;min-height:1.3em">${esc(pv.ascii)}</div>
      </div>
      <div class="cg-actions"><button type="button" class="btn teal sm" id="fd-hint">💡 Hint</button><button type="button" class="btn ghost sm" id="fd-clear">⌫ Reset</button></div>
      <div class="cout" id="fd-out"></div>
    </div>`;
    wire();
  }

  function assign(sym, d, isHint) {
    if (solved || puzzle.s2d[sym] == null) return;
    if (isHint) { map[sym] = puzzle.s2d[sym]; moves.push({ hint: sym }); }
    else if (d === '') { if (map[sym] == null) return; delete map[sym]; moves.push({ s: sym, d: '' }); }
    else { map[sym] = +d; moves.push({ s: sym, d: +d }); }
    after();
  }
  function after() {
    render();
    if (puzzle.distinct.every(c => map[c] != null)) {
      const res = simulate(seed, level, moves);
      if (res.solved) win(res);
      else { const out = el.querySelector('#fd-out'); if (out) { out.className = 'cout show bad'; out.textContent = '✗ Not a real word yet — keep adjusting the mapping.'; } }
    }
  }
  function win(res) {
    solved = true;
    host.reportResult({ seed, level, moves, score: res.score, solved: true });
    host.confetti(110);
    const out = el.querySelector('#fd-out');
    if (out) { out.className = 'cout show ok'; out.innerHTML = `✓ Decoded “<b>${esc(puzzle.word)}</b>” for ${res.score} pts. ${res.hints} hint(s), ${res.wrong} wrong. ${ch ? 'Submit on the Tournament tab.' : ''}${!ch && level < MAX_LEVEL ? ' <button class="btn gold sm" id="fd-next">▶ Next level</button>' : ''}`; const n = out.querySelector('#fd-next'); if (n) n.onclick = () => { level++; reset(); }; }
  }
  function doHint() { const c = puzzle.distinct.find(s => map[s] !== puzzle.s2d[s]); if (c != null) assign(c, null, true); }

  let detach = null;
  function wire() {
    if (!ch) {
      el.querySelector('#fd-new').onclick = () => reset();
      el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); });
    }
    el.querySelector('#fd-hint').onclick = () => doHint();
    el.querySelector('#fd-clear').onclick = () => { if (solved) return; puzzle.distinct.forEach(c => { if (map[c] != null) { delete map[c]; moves.push({ s: c, d: '' }); } }); after(); };
    el.querySelectorAll('.fd-sym, .fd-tile').forEach(t => t.onclick = () => { selected = (selected === t.dataset.sym) ? null : t.dataset.sym; render(); });
    el.querySelectorAll('.fd-key').forEach(k => k.onclick = () => { if (selected != null) assign(selected, k.dataset.d); });

    if (detach) detach();
    const onKey = (e) => { if (!el.isConnected) { detach && detach(); return; } if (selected == null) return; if (/^[0-9]$/.test(e.key)) { assign(selected, e.key); e.preventDefault(); } else if (e.key === 'Backspace') { assign(selected, ''); e.preventDefault(); } };
    document.addEventListener('keydown', onKey);
    detach = () => document.removeEventListener('keydown', onKey);
  }

  reset();
  return { destroy() { if (detach) detach(); } };
}
