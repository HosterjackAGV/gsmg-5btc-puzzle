// components/matrix.js — interactive Phase-0 genesis grid.
// Renders the 14×14 grid and animates the counter-clockwise spiral that
// decodes the bits into gsmg.io/theseedisplanted. (Verified: the spiral of
// grid bits → 8-bit ASCII reproduces the URL exactly.)

import { MATRIX } from '../../../content/matrix.js';
import { qs, on } from '../util.js';

export function matrixWidget() {
  const blue = new Set(MATRIX.blue.map(([r, c]) => r + ',' + c));
  const yellow = new Set(MATRIX.yellow.map(([r, c]) => r + ',' + c));

  let cells = '';
  for (let r = 0; r < MATRIX.grid.length; r++) {
    for (let c = 0; c < MATRIX.grid[r].length; c++) {
      const v = MATRIX.grid[r][c];
      const tint = blue.has(r + ',' + c) ? 'blue' : yellow.has(r + ',' + c) ? 'yellow' : '';
      cells += `<div class="mcell ${v ? 'on' : 'off'} ${tint}" data-rc="${r},${c}" title="row ${r}, col ${c} = ${v}"></div>`;
    }
  }

  const html = `
  <div class="mtx">
    <div class="mtx-grid" style="grid-template-columns:repeat(${MATRIX.grid[0].length},1fr)">${cells}</div>
    <div class="mtx-side">
      <p class="muted" style="font-size:13.5px">Each tile is one <b>bit</b> — filled = <span class="mono">1</span>, empty = <span class="mono">0</span>. Read in a <b>counter-clockwise spiral</b> from the top-left, chop into 8-bit bytes, convert to letters.</p>
      <div class="row" style="gap:8px">
        <button class="btn teal sm" id="mtx-go">▶ Trace the spiral</button>
        <button class="btn ghost sm" id="mtx-reset">Reset</button>
      </div>
      <div class="mtx-out">
        <div class="faint mono" style="font-size:10.5px;letter-spacing:.1em">BITS READ</div>
        <div class="mono" id="mtx-bits" style="font-size:11px;word-break:break-all;min-height:2.4em;color:var(--muted)"></div>
        <div class="faint mono" style="font-size:10.5px;letter-spacing:.1em;margin-top:8px">DECODED</div>
        <div class="mono gold" id="mtx-text" style="font-size:15px;min-height:1.4em"></div>
      </div>
      <p class="cnote">The blue & yellow tints aren’t needed for the URL — counting them per row/column makes the separate token <span class="mono">matrixsumlist</span> you’ll meet at the very end.</p>
    </div>
  </div>`;

  function mount(root) {
    const bitsEl = qs('#mtx-bits', root), textEl = qs('#mtx-text', root);
    let timer = null;

    const reset = () => {
      if (timer) { clearInterval(timer); timer = null; }
      root.querySelectorAll('.mcell.lit').forEach(el => el.classList.remove('lit'));
      bitsEl.textContent = ''; textEl.textContent = '';
    };

    on(root, 'click', '#mtx-reset', reset);
    on(root, 'click', '#mtx-go', () => {
      reset();
      let i = 0, bits = '';
      timer = setInterval(() => {
        if (i >= MATRIX.spiral.length) { clearInterval(timer); timer = null; return; }
        const [r, c] = MATRIX.spiral[i];
        const cell = qs(`.mcell[data-rc="${r},${c}"]`, root);
        if (cell) cell.classList.add('lit');
        bits += MATRIX.grid[r][c];
        bitsEl.textContent = bits;
        if (bits.length % 8 === 0) {
          let s = '';
          for (let k = 0; k + 8 <= bits.length; k += 8) s += String.fromCharCode(parseInt(bits.slice(k, k + 8), 2));
          textEl.textContent = s;
        }
        i++;
      }, 22);
    });
  }

  return { html, mount };
}
