// games/straddle.js — "Checkerboard" UI. Use the straddling checkerboard to decode
// the number string back into a word. Single-digit codes are direct; the two
// straddle digits (the labelled rows) start a two-digit code. Type the decoded word.
// Scored by the shared sim.

import { makePuzzle, simulate } from './sim/straddle.js';
import { esc } from '../util.js';

const MAX_LEVEL = 9;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `st-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }

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

  function boardHTML() {
    const b = puzzle.board;
    const head = '<tr><th></th>' + Array.from({ length: 10 }, (_, d) => `<th>${d}</th>`).join('') + '</tr>';
    const row1 = '<tr><th>·</th>' + Array.from({ length: 10 }, (_, d) => `<td>${b.singles.includes(d) ? (b.decode['' + d] || '') : ''}</td>`).join('') + '</tr>';
    const rowP1 = `<tr><th class="bh">${b.p1}</th>` + Array.from({ length: 10 }, (_, d) => `<td>${b.decode['' + b.p1 + d] || ''}</td>`).join('') + '</tr>';
    const rowP2 = `<tr><th class="bh">${b.p2}</th>` + Array.from({ length: 10 }, (_, d) => `<td>${b.decode['' + b.p2 + d] || ''}</td>`).join('') + '</tr>';
    return `<table class="board straddle">${head}${row1}${rowP1}${rowP2}</table>`;
  }

  function render() {
    const pills = Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('');
    const reveal = hints > 0 ? `<div class="sp-reveal">starts with: <b>${esc(puzzle.word.slice(0, hints))}</b>…</div>` : '';
    el.innerHTML = `
    <div class="st">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${pills}</div><button type="button" class="btn ghost sm" id="st-new">↻ New</button>`}
      </div>
      <p class="fd-rule">Decode with the board. A digit in the top “·” row is one letter on its own. The two labelled rows (<b>${puzzle.board.p1}</b> and <b>${puzzle.board.p2}</b>) are “straddle” digits — they start a <b>two-digit</b> code (the digit + the next one).</p>
      <div class="st-wrap">
        ${boardHTML()}
        <div>
          <div class="faint mono" style="font-size:10px;letter-spacing:.1em">CIPHERTEXT (digits)</div>
          <div class="st-ct mono">${esc(puzzle.ciphertext)}</div>
          ${reveal}
          <div class="console" style="margin-top:10px"><div class="crow"><input class="cin" id="st-in" placeholder="the decoded word…" spellcheck="false" autocomplete="off"><button class="btn gold" id="st-go">Guess</button></div>
            <div class="row" style="margin-top:8px"><button type="button" class="btn ghost sm" id="st-hint">💡 Reveal a letter</button><span class="pill best">best <b>${host.bestScore()}</b></span></div>
            <div class="cout" id="st-out"></div></div>
        </div>
      </div>
    </div>`;
    wire();
  }

  function guess(val) {
    if (solved || !val) return;
    moves.push({ guess: val });
    const res = simulate(seed, level, moves);
    const o = el.querySelector('#st-out');
    if (res.solved) {
      solved = true;
      host.reportResult({ seed, level, moves, score: res.score, solved: true });
      host.confetti(110);
      o.className = 'cout show ok';
      o.innerHTML = `✓ “<b>${esc(puzzle.word)}</b>” for ${res.score} pts.${ch ? ' Submit on the Tournament tab.' : (level < MAX_LEVEL ? ' <button class="btn gold sm" id="st-next">▶ Next level</button>' : '')}`;
      const n = o.querySelector('#st-next'); if (n) n.onclick = () => { level++; reset(); };
    } else { o.className = 'cout show bad'; o.textContent = `✗ "${val}" isn't it — re-read the board, mind the straddle digits.`; }
  }

  function wire() {
    if (!ch) { el.querySelector('#st-new').onclick = () => reset(); el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); }); }
    el.querySelector('#st-hint').onclick = () => { if (solved || hints >= puzzle.word.length) return; hints++; moves.push({ hint: 1 }); render(); };
    const inp = el.querySelector('#st-in'), go = el.querySelector('#st-go');
    go.onclick = () => guess(inp.value.trim());
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go.click(); });
  }

  reset();
  return { destroy() {} };
}
