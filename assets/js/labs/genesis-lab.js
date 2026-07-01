// labs/genesis-lab.js — the flagship GRAPHICAL, interactive Phase-0 genesis tool.
// Renders the real 14×14 image as a live grid the reader can read, colour-filter,
// split, and EDIT (click a cell to flip it) — everything recomputes in the browser.
// Driven by the pixel-exact data in content/matrix.js.

import { MATRIX } from '../../../content/matrix.js';
import { esc } from '../util.js';

const N = 14;
const isPrime = (k) => { if (k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
const printable = (s) => [...s].map(ch => { const c = ch.charCodeAt(0); return (c >= 32 && c < 127) ? ch : '·'; }).join('');

export function genesisLab(container) {
  const grid = MATRIX.grid.map(r => r.slice());                 // mutable working copy
  const blueSet = new Set(MATRIX.blue.map(p => p[0] * N + p[1]));
  const yelSet  = new Set(MATRIX.yellow.map(p => p[0] * N + p[1]));
  const fef     = MATRIX.fefefe[0][0] * N + MATRIX.fefefe[0][1];
  const spiral  = MATRIX.spiral;
  const sIdx    = new Map(); spiral.forEach((p, i) => sIdx.set(p[0] * N + p[1], i));
  const st = { colored: true, primes: false, fefefe: true, yinyang: false };

  container.innerHTML = `
    <div class="glab">
      <div class="glab-toolbar">
        <button type="button" class="glab-btn primary" data-act="spiral">▶ Animate the spiral read → URL</button>
        <button type="button" class="glab-btn on" data-t="colored">🟦🟨 Colour cells</button>
        <button type="button" class="glab-btn" data-t="primes">✳ Prime indices (A007522)</button>
        <button type="button" class="glab-btn on" data-t="fefefe">◻ #fefefe seed</button>
        <button type="button" class="glab-btn" data-t="yinyang">☯ Yin-yang split</button>
        <button type="button" class="glab-btn" data-act="reset">↺ Reset image</button>
      </div>
      <div class="glab-stage">
        <div class="glab-gridwrap"><div class="glab-grid" role="grid" aria-label="genesis 14 by 14 grid"></div>
          <div class="glab-read mono" hidden></div>
        </div>
        <div class="glab-side"></div>
      </div>
      <p class="glab-hint faint">Tip: <b>click any cell</b> to flip it black↔white and watch every reading below recompute. Hover a cell for its coordinates &amp; spiral index. This is the genuine Phase-0 image — nothing is faked.</p>
    </div>`;

  const gridEl = container.querySelector('.glab-grid');
  const sideEl = container.querySelector('.glab-side');
  const readEl = container.querySelector('.glab-read');

  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'glab-cell'; b.dataset.k = r * N + c;
    b.addEventListener('click', () => { grid[r][c] ^= 1; render(); });
    gridEl.appendChild(b); cells.push(b);
  }

  const readSpiral = () => {
    let bits = ''; for (const [r, c] of spiral) bits += grid[r][c] ? '1' : '0';
    const txt = (bits.match(/.{8}/g) || []).map(b => String.fromCharCode(parseInt(b, 2))).join('');
    return { bits, txt };
  };
  const colourStream = () => spiral.filter(([r, c]) => blueSet.has(r * N + c) || yelSet.has(r * N + c))
    .map(([r, c]) => blueSet.has(r * N + c) ? '1' : '0').join('');
  const sums = () => ({
    rs: grid.map(row => row.reduce((a, b) => a + b, 0)),
    cs: Array.from({ length: N }, (_, c) => grid.reduce((a, row) => a + row[c], 0)),
  });
  const ybpPrimes = () => {
    const bp = [], yp = [];
    spiral.forEach(([r, c], i) => { const k = r * N + c; if (isPrime(i)) { if (blueSet.has(k)) bp.push(i); else if (yelSet.has(k)) yp.push(i); } });
    return { bp, yp };
  };

  function paintCell(idx) {
    const r = Math.floor(idx / N), c = idx % N, k = idx, d = cells[idx];
    d.className = 'glab-cell' + (grid[r][c] ? ' on' : '');
    if (st.colored && blueSet.has(k)) d.classList.add('blue');
    if (st.colored && yelSet.has(k)) d.classList.add('yellow');
    if (st.fefefe && k === fef) d.classList.add('fef');
    if (st.primes && isPrime(sIdx.get(k))) d.classList.add('prime');
    if (st.yinyang) d.classList.add(r + c < 13 ? 'yy-ul' : 'yy-lr');
    d.title = `(row ${r}, col ${c}) · spiral #${sIdx.get(k)}${blueSet.has(k) ? ' · BLUE' : yelSet.has(k) ? ' · YELLOW' : ''}${k === fef ? ' · #fefefe' : ''}`;
  }

  function render() {
    for (let i = 0; i < cells.length; i++) paintCell(i);
    const { txt } = readSpiral();
    const cstream = colourStream();
    const { rs, cs } = sums();
    const { bp, yp } = ybpPrimes();
    const url = printable(txt).replace(/·+$/, '');
    const ok = url.startsWith('gsmg.io');
    sideEl.innerHTML = `
      <div class="glab-out ${ok ? 'good' : ''}"><div class="glab-out-h">① Spiral → 8-bit bytes → ASCII (the URL)</div>
        <div class="glab-out-v mono big">${esc(url) || '—'}</div>
        <div class="glab-out-s faint">${ok ? 'reads as the Phase-0 web address ✓' : 'flip cells back / Reset to restore the URL'}</div></div>
      <div class="glab-out"><div class="glab-out-h">② matrixsumlist · row-sums &amp; col-sums (live)</div>
        <div class="glab-out-v mono">${rs.join('')}<br>${cs.join('')}</div>
        <div class="glab-out-s faint">total 1-cells: ${rs.reduce((a, b) => a + b, 0)}</div></div>
      <div class="glab-out"><div class="glab-out-h">③ 24-bit colour stream · blue=1 · yellow=0</div>
        <div class="glab-out-v mono">${cstream}</div>
        <div class="glab-out-s faint">= 0x${(parseInt(cstream, 2) || 0).toString(16)} · ${MATRIX.blue.length} blue + ${MATRIX.yellow.length} yellow</div></div>
      <div class="glab-out"><div class="glab-out-h">④ yellowblueprimes · colour cells at PRIME spiral index</div>
        <div class="glab-out-v mono">blue: ${bp.join(', ') || '—'}<br>yellow: ${yp.join(', ') || '—'}</div>
        <div class="glab-out-s faint">these prime indices are exactly OEIS A007522</div></div>`;
  }

  let anim = null;
  function animateSpiral() {
    if (anim) { clearInterval(anim); anim = null; cells.forEach(c => c.classList.remove('path', 'head')); readEl.hidden = true; return; }
    cells.forEach(c => c.classList.remove('path', 'head'));
    readEl.hidden = false; let bits = '', i = 0;
    anim = setInterval(() => {
      if (i >= spiral.length) { clearInterval(anim); anim = null; cells.forEach(c => c.classList.remove('head')); return; }
      const [r, c] = spiral[i], k = r * N + c;
      cells.forEach(c => c.classList.remove('head'));
      cells[k].classList.add('path', 'head');
      bits += grid[r][c] ? '1' : '0';
      const bytes = (bits.match(/.{8}/g) || []).map(b => String.fromCharCode(parseInt(b, 2)));
      readEl.innerHTML = `<b>cell ${i + 1}/196</b> · bits ${bits.length} · so far: <span class="glab-url">${esc(printable(bytes.join('')))}</span>`;
      i++;
    }, 26);
  }

  container.querySelector('.glab-toolbar').addEventListener('click', (e) => {
    const b = e.target.closest('.glab-btn'); if (!b) return;
    if (b.dataset.act === 'spiral') { animateSpiral(); return; }
    if (b.dataset.act === 'reset') { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) grid[r][c] = MATRIX.grid[r][c]; render(); return; }
    const t = b.dataset.t; if (t) { st[t] = !st[t]; b.classList.toggle('on', st[t]); render(); }
  });

  render();
}
