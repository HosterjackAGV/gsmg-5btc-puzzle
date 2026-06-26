// games/vigenere.js — "Vigenère" UI. Recover the repeating key so the ciphertext
// decrypts to readable text. Click a key slot, pick a letter (or type); the live
// decrypt updates. Scored by the shared sim.

import { makePuzzle, simulate, dec, A } from './sim/vigenere.js';
import { esc } from '../util.js';

const MAX_LEVEL = 12;
const pad2 = (n) => String(n).padStart(2, '0');
function todaySeed() { const d = new Date(); return `vg-${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`; }

export function start(host) {
  const ch = host.challenge, el = host.el;
  let level = ch ? ch.level : 1, seed = ch ? ch.seed : todaySeed();
  let puzzle, key, moves, selected, solved;

  function reset() {
    if (!ch) seed = todaySeed();
    puzzle = makePuzzle(seed, level);
    key = Array(puzzle.keyLen).fill(''); moves = []; selected = 0; solved = false;
    render();
  }

  function decryptPreview() {
    let ki = 0;
    return puzzle.ciphertext.replace(/[A-Z]/g, ch2 => {
      const k = key[ki % puzzle.keyLen]; ki++;
      if (!k) return '·';
      return A[(ch2.charCodeAt(0) - 65 - (k.charCodeAt(0) - 65) + 26) % 26];
    });
  }

  function render() {
    const filled = key.filter(Boolean).length;
    const pills = Array.from({ length: MAX_LEVEL }, (_, i) => `<button type="button" class="cg-lvl${i + 1 === level ? ' on' : ''}" data-lvl="${i + 1}">${i + 1}</button>`).join('');
    el.innerHTML = `
    <div class="vg">
      <div class="fd-top">
        ${ch ? `<span class="pill gold">${esc(ch.label || 'Tournament')}</span>` : `<div class="cg-levels"><span class="faint">level</span>${pills}</div><button type="button" class="btn ghost sm" id="vg-new">↻ New</button>`}
      </div>
      <p class="fd-rule">A repeating <b>key</b> shifts each letter by a different amount. Find the ${puzzle.keyLen}-letter key so the gibberish turns into a real sentence. (No frequency aid — reason from the cribs you can read.)</p>
      <div class="vg-ct" id="vg-ct">${esc(puzzle.ciphertext)}</div>
      <div class="cg-stats"><span class="pill">key <b>${filled}/${puzzle.keyLen}</b></span><span class="pill">hints <b>${moves.filter(m => typeof m.hint === 'number').length}</b></span><span class="pill best">best <b>${host.bestScore()}</b></span></div>
      <div class="vg-key">${key.map((k, i) => `<button type="button" class="vg-slot${i === selected ? ' sel' : ''}${k ? ' set' : ''}" data-i="${i}"><b>${esc(k || '·')}</b><i>${i + 1}</i></button>`).join('')}</div>
      <div class="cg-tray" id="vg-tray">${A.split('').map(L => `<button type="button" class="cg-tile" data-g="${L}">${L}</button>`).join('')}</div>
      <div class="fd-readout"><div class="faint mono" style="font-size:10px;letter-spacing:.1em">DECRYPTS TO</div><div class="mono gold" id="vg-pt" style="font-size:15px;word-break:break-word;min-height:1.3em">${esc(decryptPreview())}</div></div>
      <div class="cg-actions"><button type="button" class="btn teal sm" id="vg-hint">💡 Hint</button><button type="button" class="btn ghost sm" id="vg-clear">⌫ Reset</button></div>
      <div class="cout" id="vg-out"></div>
    </div>`;
    wire();
  }

  function assign(i, g, isHint) {
    if (solved || i < 0 || i >= puzzle.keyLen) return;
    if (isHint) { key[i] = puzzle.key[i]; moves.push({ hint: i }); }
    else if (g === '') { if (!key[i]) return; key[i] = ''; moves.push({ i, g: '' }); }
    else { key[i] = g; moves.push({ i, g }); }
    after();
  }
  function after() {
    render();
    if (key.every(Boolean)) {
      const res = simulate(seed, level, moves);
      if (res.solved) win(res);
      else { const o = el.querySelector('#vg-out'); if (o) { o.className = 'cout show bad'; o.textContent = '✗ Still gibberish — adjust the key.'; } }
    }
  }
  function win(res) {
    solved = true;
    host.reportResult({ seed, level, moves, score: res.score, solved: true });
    host.confetti(110);
    const o = el.querySelector('#vg-out');
    if (o) { o.className = 'cout show ok'; o.innerHTML = `✓ Key <b>${esc(puzzle.key)}</b> → “${esc(puzzle.plaintext)}” for ${res.score} pts.${ch ? ' Submit on the Tournament tab.' : (level < MAX_LEVEL ? ' <button class="btn gold sm" id="vg-next">▶ Next level</button>' : '')}`; const n = o.querySelector('#vg-next'); if (n) n.onclick = () => { level++; reset(); }; }
  }
  function doHint() { const i = key.findIndex((k, j) => k !== puzzle.key[j]); if (i >= 0) assign(i, null, true); }

  let detach = null;
  function wire() {
    if (!ch) { el.querySelector('#vg-new').onclick = () => reset(); el.querySelectorAll('.cg-lvl').forEach(b => b.onclick = () => { level = +b.dataset.lvl; reset(); }); }
    el.querySelector('#vg-hint').onclick = () => doHint();
    el.querySelector('#vg-clear').onclick = () => { if (solved) return; for (let i = 0; i < puzzle.keyLen; i++) if (key[i]) { key[i] = ''; moves.push({ i, g: '' }); } after(); };
    el.querySelectorAll('.vg-slot').forEach(s => s.onclick = () => { selected = +s.dataset.i; render(); });
    el.querySelectorAll('#vg-tray .cg-tile').forEach(t => t.onclick = () => assign(selected, t.dataset.g));

    if (detach) detach();
    const onKey = (e) => {
      if (!el.isConnected) { detach && detach(); return; }
      if (/^[a-zA-Z]$/.test(e.key)) { assign(selected, e.key.toUpperCase()); e.preventDefault(); }
      else if (e.key === 'Backspace') { assign(selected, ''); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { selected = (selected + 1) % puzzle.keyLen; render(); }
      else if (e.key === 'ArrowLeft') { selected = (selected + puzzle.keyLen - 1) % puzzle.keyLen; render(); }
    };
    document.addEventListener('keydown', onKey);
    detach = () => document.removeEventListener('keydown', onKey);
  }

  reset();
  return { destroy() { if (detach) detach(); } };
}
