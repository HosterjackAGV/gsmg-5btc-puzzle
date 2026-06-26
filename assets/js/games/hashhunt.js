// games/hashhunt.js — "Hash Hunter" UI. A secret word was SHA-256'd; solve the
// riddle and guess it. The hash confirms ONLY an exact match (no partial credit) —
// the whole point: you can't reverse a hash, only guess and check. Scored by the
// shared sim so the browser and CI agree.

import { makePuzzle, simulate } from './sim/hashhunt.js';
import { sha256Hex, hasSecureCrypto } from '../crypto.js';
import { esc } from '../util.js';

const MAX_LEVEL = 9;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `hh-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }

export function start(host) {
  const ch = host.challenge;
  const el = host.el;
  let level = ch ? ch.level : 1;
  let seed = ch ? ch.seed : todaySeed();
  let puzzle, moves, solved;

  async function reset() {
    if (!ch) seed = todaySeed();
    puzzle = makePuzzle(seed, level);
    moves = []; solved = false;
    render();
    let h = '(enable a secure context to see the live hash)';
    if (hasSecureCrypto) { try { h = await sha256Hex(puzzle.answer); } catch {} }
    const t = el.querySelector('#hh-target'); if (t) t.textContent = h;
  }

  function render() {
    const pills = Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('');
    el.innerHTML = `
    <div class="hh">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${pills}</div><button type="button" class="btn ghost sm" id="hh-new">↻ New</button>`}
      </div>
      <p class="fd-rule">A secret word was hashed with SHA-256. You <b>cannot reverse a hash</b> — only guess and check, exactly like every door in this puzzle. Solve the riddle, then guess. Only an exact match opens it.</p>
      <div class="hh-target"><span class="faint mono">target&nbsp;=</span> <span class="mono gold break" id="hh-target">…</span></div>
      <div class="note"><h4>🧩 Riddle</h4><p style="color:var(--paper)">${esc(puzzle.clue)}</p></div>
      <div class="console">
        <div class="crow"><input class="cin" id="hh-in" placeholder="your guess…" spellcheck="false" autocomplete="off"><button class="btn gold" id="hh-go">Guess</button></div>
        <div class="selrow hh-choices">${puzzle.choices.map(w => `<button type="button" class="chip" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div>
        <div class="cout" id="hh-out"></div>
        <div class="hh-log" id="hh-log"></div>
      </div>
    </div>`;
    wire();
  }

  async function guess(val) {
    if (solved || !val) return;
    moves.push({ guess: val });
    const res = simulate(seed, level, moves);
    const out = el.querySelector('#hh-out'), log = el.querySelector('#hh-log');
    let gh = ''; if (hasSecureCrypto) { try { gh = (await sha256Hex(val)).slice(0, 16); } catch {} }
    if (res.solved) {
      solved = true;
      host.reportResult({ seed, level, moves, score: res.score, solved: true });
      host.confetti(120);
      out.className = 'cout show ok';
      out.innerHTML = `✓ MATCH — “<b>${esc(puzzle.answer)}</b>” for ${res.score} pts (${res.guesses} guess${res.guesses > 1 ? 'es' : ''}).${ch ? ' Submit it on the Tournament tab.' : (level < MAX_LEVEL ? ' <button class="btn gold sm" id="hh-next">▶ Next level</button>' : '')}`;
      const n = out.querySelector('#hh-next'); if (n) n.onclick = () => { level++; reset(); };
    } else {
      out.className = 'cout show bad';
      out.textContent = `✗ ${val}${gh ? ' → ' + gh + '…' : ''} ≠ target. No “warmer/colder” — a hash leaks nothing. Re-read the riddle.`;
      if (log) { const row = document.createElement('div'); row.className = 'hh-line'; row.textContent = `✗ ${val}${gh ? '  →  ' + gh + '…' : ''}`; log.prepend(row); while (log.childElementCount > 8) log.lastElementChild.remove(); }
    }
  }

  function wire() {
    if (!ch) {
      el.querySelector('#hh-new').onclick = () => reset();
      el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); });
    }
    const inp = el.querySelector('#hh-in'), go = el.querySelector('#hh-go');
    go.onclick = () => { const v = inp.value.trim(); inp.value = ''; inp.focus(); guess(v); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go.click(); });
    el.querySelectorAll('.hh-choices .chip').forEach(c => c.onclick = () => guess(c.dataset.w));
  }

  reset();
  return { destroy() {} };
}
