// games/freqanalysis.js — "Frequency Analysis" UI. The letter histogram of a
// Vigenère ciphertext is flat (a repeating key hides the plaintext). But slice it
// into N columns and each column's Index of Coincidence jumps toward English when N
// is the key length. Read the IC chart, find the smallest spike, commit the key
// length. Scored by the shared sim.

import { makePuzzle, simulate, icForPeriod, lettersOnly, IC_ENGLISH, IC_RANDOM } from './sim/freqanalysis.js';
import { esc } from '../util.js';

const MAX_LEVEL = 9;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `fa-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function start(host) {
  const ch = host.challenge, el = host.el;
  let level = ch ? ch.level : 1, seed = ch ? ch.seed : todaySeed();
  let puzzle, moves, solved;

  function reset() {
    if (!ch) seed = todaySeed();
    puzzle = makePuzzle(seed, level);
    moves = []; solved = false;
    render();
  }

  // height of a bar (0..1) mapping IC over a readable window
  const barH = (ic) => Math.max(0.04, Math.min(1, (ic - 0.030) / (0.072 - 0.030)));

  function icBars() {
    let out = '';
    for (let p = 1; p <= puzzle.maxPeriod; p++) {
      const ic = icForPeriod(puzzle.ciphertext, p);
      const hot = ic > 0.055;
      out += `<button type="button" class="fa-bar${hot ? ' hot' : ''}" data-p="${p}" title="period ${p}: IC ${ic.toFixed(3)}">
        <span class="v" style="height:${(barH(ic) * 100).toFixed(0)}%"></span><i>${p}</i></button>`;
    }
    return out;
  }

  function histBars() {
    const L = lettersOnly(puzzle.ciphertext); const f = {}; let max = 1;
    for (const c of L) { f[c] = (f[c] || 0) + 1; if (f[c] > max) max = f[c]; }
    return A.split('').map(c => `<span class="fa-hb" title="${c}: ${f[c] || 0}"><i style="height:${((f[c] || 0) / max * 100).toFixed(0)}%"></i></span>`).join('');
  }

  function render() {
    const pills = Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('');
    const tries = moves.length;
    el.innerHTML = `
    <div class="fa">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${pills}</div><button type="button" class="btn ghost sm" id="fa-new">↻ New</button>`}
      </div>
      <p class="fd-rule">This was encrypted with a <b>repeating key</b>. Its letter counts look flat (below) — counting won't help. But split it into N columns and measure the <b>Index of Coincidence</b>: at the real key length, each column is a simple cipher and IC jumps toward English (<span class="mono">0.067</span>). <b>Click the shortest period where the IC clearly spikes.</b></p>

      <div class="faint mono" style="font-size:10px;letter-spacing:.1em">CIPHERTEXT</div>
      <div class="fa-ct mono">${esc(puzzle.ciphertext)}</div>

      <div class="fa-grid">
        <div>
          <div class="faint mono" style="font-size:10px;letter-spacing:.1em">INDEX OF COINCIDENCE BY PERIOD — click your guess</div>
          <div class="fa-bars" id="fa-bars">${icBars()}</div>
          <div class="fa-legend"><span class="eng">— English ≈ ${IC_ENGLISH.toFixed(3)}</span><span class="rnd">— random ≈ ${IC_RANDOM.toFixed(3)}</span></div>
        </div>
        <div>
          <div class="faint mono" style="font-size:10px;letter-spacing:.1em">LETTER FREQUENCY (flat = polyalphabetic)</div>
          <div class="fa-hist">${histBars()}</div>
          <div class="cg-stats" style="margin-top:10px"><span class="pill">guesses <b>${tries}</b></span><span class="pill best">best <b>${host.bestScore()}</b></span></div>
        </div>
      </div>
      <div class="cout" id="fa-out"></div>
    </div>`;
    wire();
  }

  function guess(period) {
    if (solved) return;
    moves.push({ guess: period });
    const res = simulate(seed, level, moves);
    const o = el.querySelector('#fa-out');
    if (res.solved) {
      solved = true;
      host.reportResult({ seed, level, moves, score: res.score, solved: true });
      host.confetti(110);
      o.className = 'cout show ok';
      o.innerHTML = `✓ Key length is <b>${puzzle.keyLen}</b> — ${res.score} pts (${res.guesses} guess${res.guesses > 1 ? 'es' : ''}).${ch ? ' Submit on the Tournament tab.' : (level < MAX_LEVEL ? ' <button class="btn gold sm" id="fa-next">▶ Next level</button>' : '')}`;
      const n = o.querySelector('#fa-next'); if (n) n.onclick = () => { level++; reset(); };
    } else {
      o.className = 'cout show bad';
      o.textContent = `✗ Period ${period} isn't the key length. Spikes at multiples of the real period happen too — pick the SHORTEST clear one.`;
      const b = el.querySelector(`.fa-bar[data-p="${period}"]`); if (b) b.classList.add('miss');
    }
  }

  function wire() {
    if (!ch) { el.querySelector('#fa-new').onclick = () => reset(); el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); }); }
    el.querySelectorAll('.fa-bar').forEach(b => b.onclick = () => guess(+b.dataset.p));
  }

  reset();
  return { destroy() {} };
}
