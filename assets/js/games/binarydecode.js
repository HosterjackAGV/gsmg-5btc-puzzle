// games/binarydecode.js — "Binary Decoder" UI. Assign each symbol (a/b) a bit so
// the string decodes as 8-bit ASCII to a real word. a=0,b=1 at first; flipped higher
// up so you must deduce it (the SalPhaseIon binary chunks). Scored by the shared sim.

import { makePuzzle, simulate } from './sim/binarydecode.js';
import { esc } from '../util.js';

const MAX_LEVEL = 9;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `bd-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }

export function start(host) {
  const ch = host.challenge, el = host.el;
  let level = ch ? ch.level : 1, seed = ch ? ch.seed : todaySeed();
  let puzzle, map, moves, selected, solved;

  function reset() {
    if (!ch) seed = todaySeed();
    puzzle = makePuzzle(seed, level);
    map = {}; moves = []; selected = 'a'; solved = false;
    render();
  }

  function preview() {
    let all = true, bits = '';
    for (const s of puzzle.symbolString) { const b = map[s]; if (b == null) { all = false; bits += '·'; } else bits += b; }
    let ascii = '';
    if (all) for (let i = 0; i + 8 <= bits.length; i += 8) ascii += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2));
    return { bits, ascii, all };
  }

  function render() {
    const pv = preview();
    const pills = Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('');
    const grouped = [...puzzle.symbolString].map((s, i) => `${i && i % 8 === 0 ? '<span class="bd-gap"></span>' : ''}<span class="bd-sym${s === selected ? ' sel' : ''}${map[s] != null ? ' set' : ''}" data-sym="${s}">${s}</span>`).join('');
    el.innerHTML = `
    <div class="bd">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${pills}</div><button type="button" class="btn ghost sm" id="bd-new">↻ New</button>`}
      </div>
      <p class="fd-rule">Only two symbols — each is one <b>bit</b>. ${puzzle.flipped ? '<b>Which is 0 and which is 1 is scrambled</b> — find the mapping that decodes to a word.' : 'Standard: <span class="mono">a=0, b=1</span>.'} Read 8 bits per letter (ASCII).</p>
      <div class="bd-string">${grouped}</div>
      <div class="cg-stats"><span class="pill">symbols <b>${puzzle.distinct.filter(s => map[s] != null).length}/2</b></span><span class="pill">hints <b>${moves.filter(m => m.hint).length}</b></span><span class="pill best">best <b>${host.bestScore()}</b></span></div>
      <div class="bd-assign">
        ${['a', 'b'].map(s => `<button type="button" class="fd-tile${s === selected ? ' sel' : ''}${map[s] != null ? ' set' : ''}" data-sym="${s}">${s}<span>${map[s] != null ? map[s] : '·'}</span></button>`).join('')}
        <span class="faint sm">select a symbol →</span>
        <button type="button" class="fd-key" data-b="0">0</button>
        <button type="button" class="fd-key" data-b="1">1</button>
        <button type="button" class="fd-key clr" data-b="">⌫</button>
      </div>
      <div class="fd-readout"><div class="faint mono" style="font-size:10px;letter-spacing:.1em">DECODES TO</div><div class="mono gold" id="bd-ascii" style="font-size:17px;min-height:1.3em">${esc(pv.ascii)}</div></div>
      <div class="cg-actions"><button type="button" class="btn teal sm" id="bd-hint">💡 Hint</button><button type="button" class="btn ghost sm" id="bd-clear">⌫ Reset</button></div>
      <div class="cout" id="bd-out"></div>
    </div>`;
    wire();
  }

  function assign(sym, b, isHint) {
    if (solved || (sym !== 'a' && sym !== 'b')) return;
    if (isHint) { map[sym] = puzzle.sym2bit[sym]; moves.push({ hint: sym }); }
    else if (b === '') { if (map[sym] == null) return; delete map[sym]; moves.push({ s: sym, b: '' }); }
    else { map[sym] = +b; moves.push({ s: sym, b: +b }); }
    after();
  }
  function after() {
    render();
    if (puzzle.distinct.every(s => map[s] != null)) {
      const res = simulate(seed, level, moves);
      if (res.solved) win(res);
      else { const o = el.querySelector('#bd-out'); if (o) { o.className = 'cout show bad'; o.textContent = '✗ Not a word — try the other mapping.'; } }
    }
  }
  function win(res) {
    solved = true;
    host.reportResult({ seed, level, moves, score: res.score, solved: true });
    host.confetti(100);
    const o = el.querySelector('#bd-out');
    if (o) { o.className = 'cout show ok'; o.innerHTML = `✓ Decoded “<b>${esc(puzzle.word)}</b>” for ${res.score} pts.${ch ? ' Submit on the Tournament tab.' : (level < MAX_LEVEL ? ' <button class="btn gold sm" id="bd-next">▶ Next level</button>' : '')}`; const n = o.querySelector('#bd-next'); if (n) n.onclick = () => { level++; reset(); }; }
  }
  function doHint() { const s = puzzle.distinct.find(x => map[x] !== puzzle.sym2bit[x]); if (s) assign(s, null, true); }

  let detach = null;
  function wire() {
    if (!ch) { el.querySelector('#bd-new').onclick = () => reset(); el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); }); }
    el.querySelector('#bd-hint').onclick = () => doHint();
    el.querySelector('#bd-clear').onclick = () => { if (solved) return; puzzle.distinct.forEach(s => { if (map[s] != null) { delete map[s]; moves.push({ s, b: '' }); } }); after(); };
    el.querySelectorAll('.bd-sym, .fd-tile').forEach(t => t.onclick = () => { selected = t.dataset.sym; render(); });
    el.querySelectorAll('.fd-key').forEach(k => k.onclick = () => assign(selected, k.dataset.b));

    if (detach) detach();
    const onKey = (e) => { if (!el.isConnected) { detach && detach(); return; } if (e.key === '0' || e.key === '1') { assign(selected, e.key); e.preventDefault(); } else if (e.key === 'Backspace') { assign(selected, ''); e.preventDefault(); } };
    document.addEventListener('keydown', onKey);
    detach = () => document.removeEventListener('keydown', onKey);
  }

  reset();
  return { destroy() { if (detach) detach(); } };
}
