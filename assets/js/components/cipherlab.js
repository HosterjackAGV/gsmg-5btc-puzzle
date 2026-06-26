// components/cipherlab.js — Phase 3.2 hands-on tools.
//   • Beaufort cipher: a correct, self-inverse implementation (encrypt = decrypt).
//   • VIC / straddling checkerboard: an honest visual EXPLAINER of the board.
//     (The full VIC also uses a transposition step, so the live decode is best
//     done in dcode/CyberChef — we show the board and the known result.)

import { qs, on } from '../util.js';

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Beaufort: for each letter, output = (key - text) mod 26. It is its own inverse.
function beaufort(text, key) {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return text;
  let ki = 0;
  return text.toUpperCase().split('').map(ch => {
    const ti = A.indexOf(ch);
    if (ti < 0) return ch; // pass through non-letters, don't advance key
    const kk = A.indexOf(k[ki % k.length]); ki++;
    return A[(kk - ti + 26) % 26];
  }).join('');
}

// straddling checkerboard board (illustrative), markers 1 & 4
function buildBoard() {
  const alpha = 'FUBCDORALETHINGKYMVPSJQZXW';
  const cols = [0, 2, 3, 5, 6, 7, 8, 9];
  const top = {}; for (let i = 0; i < 8; i++) top[cols[i]] = alpha[i];
  const r1 = {}; for (let i = 0; i < 10; i++) r1[i] = alpha[8 + i] || '';
  const r4 = {}; for (let i = 0; i < 8; i++) r4[i] = alpha[18 + i] || '';
  return { top, r1, r4 };
}

export function cipherLab() {
  const b = buildBoard();
  const row = (label, map) => `<tr><td class="bh">${label}</td>${[0,1,2,3,4,5,6,7,8,9].map(c => `<td>${map[c] || ''}</td>`).join('')}</tr>`;

  const html = `
  <div class="grid cols-2" style="gap:16px">
    <div class="panel">
      <h4 style="margin:0 0 8px">Beaufort cipher <span class="pill teal" style="margin-left:6px">live</span></h4>
      <p class="muted" style="font-size:13px">A cousin of Vigenère, keyed <span class="mono">THEMATRIXHASYOU</span>. Neat property: encrypting and decrypting are the <b>same</b> operation, so run a Beaufort block through it to read the Architect’s message.</p>
      <div class="console"><div class="crow">
        <input class="cin" id="bf-key" placeholder="key" value="THEMATRIXHASYOU" spellcheck="false" style="flex:0 0 160px">
        <input class="cin" id="bf-in" placeholder="paste a Beaufort block…" spellcheck="false">
        <button class="btn gold" id="bf-go">Run</button>
      </div><div class="cout" id="bf-out"></div></div>
      <p class="cnote">Self-inverse check: running the output through again with the same key returns the input.</p>
    </div>

    <div class="panel">
      <h4 style="margin:0 0 8px">VIC straddling checkerboard <span class="pill" style="margin-left:6px">explainer</span></h4>
      <p class="muted" style="font-size:13px">Digits become letters via this board. Common letters get one digit; the marker digits <b>1</b> and <b>4</b> begin two-digit codes for the rest.</p>
      <table class="board"><tbody>
        ${row('·', b.top)}
        ${row('1', b.r1)}
        ${row('4', b.r4)}
      </tbody></table>
      <p class="cnote">The real VIC adds a transposition step, so decode the full number string in <a href="https://www.dcode.fr/vic-cipher" target="_blank" rel="noopener">dcode.fr/VIC</a> or <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener">CyberChef</a>. The confirmed result is: <span class="teal">“IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF…”</span></p>
    </div>
  </div>`;

  function mount(root) {
    const go = qs('#bf-go', root), out = qs('#bf-out', root);
    if (!go) return;
    const run = () => {
      const txt = qs('#bf-in', root).value.trim();
      const key = qs('#bf-key', root).value.trim();
      if (!txt) { out.className = 'cout show bad'; out.textContent = 'Paste some ciphertext (letters).'; return; }
      out.className = 'cout show info'; out.textContent = beaufort(txt, key);
    };
    go.addEventListener('click', run);
    qs('#bf-in', root).addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  }

  return { html, mount };
}
