// labs/analysis-lab.js — the full non-spectral analysis workbench. Paste any string (a block, a
// candidate, anything) and get: symbol frequency, IC, Shannon entropy, factorisation, an
// autocorrelation scan, a colour BITMAP render (reshaped to any factor dims), and live cipher
// transforms. Everything we ran on dbbi/faed, in your hands.

import { PUZZLE, ic } from './harness.js';
import { esc } from '../util.js';

const A2I = (c) => 'abcdefghi'.indexOf(c) + 1;
const factors = (n) => { const f = []; for (let d = 1; d <= n; d++) if (n % d === 0) f.push(d); return f; };
const entropy = (s) => { const f = {}; for (const c of s) f[c] = (f[c] || 0) + 1; let h = 0; for (const k in f) { const p = f[k] / s.length; h -= p * Math.log2(p); } return h; };
const printable = (s) => [...s].map(ch => { const c = ch.charCodeAt(0); return (c >= 32 && c < 127) ? ch : '·'; }).join('');

function transform(s, kind, key) {
  const L = 'abcdefghijklmnopqrstuvwxyz';
  const V = (c) => L.indexOf(c.toLowerCase());
  if (kind === 'reverse') return [...s].reverse().join('');
  if (kind === 'atbash') return [...s].map(c => V(c) >= 0 ? L[25 - V(c)] : c).join('');
  if (kind === 'rot13') return [...s].map(c => V(c) >= 0 ? L[(V(c) + 13) % 26] : c).join('');
  if (kind === 'vigenere' || kind === 'beaufort') {
    const k = (key || 'a').toLowerCase().replace(/[^a-z]/g, '') || 'a'; let j = 0, o = '';
    for (const c of s) { if (V(c) < 0) { o += c; continue; } const kv = V(k[j % k.length]); o += L[kind === 'vigenere' ? (V(c) + kv) % 26 : ((kv - V(c)) % 26 + 26) % 26]; j++; }
    return o;
  }
  if (kind === 'binary') { const bits = [...s].map(c => (A2I(c) || c.charCodeAt(0)) % 2).join(''); return printable((bits.match(/.{1,8}/g) || []).map(b => String.fromCharCode(parseInt(b.padEnd(8, '0'), 2))).join('')); }
  if (kind === 'field') { try { let n = BigInt([...s].map(c => A2I(c) || 0).join('') || '0'); let h = n.toString(16); if (h.length % 2) h = '0' + h; return printable((h.match(/../g) || []).map(x => String.fromCharCode(parseInt(x, 16))).join('')); } catch { return '(overflow)'; } }
  return s;
}

export function analysisLab(container) {
  container.innerHTML = `
    <div class="lab">
      <label class="lab-f wide"><span>Input (any string — a block, a candidate…)</span><textarea class="lab-in mono" data-n="src" rows="3" spellcheck="false">${esc(PUZZLE.dbbi)}</textarea></label>
      <div class="lab-quick"><span class="faint" style="font-size:11px">load:</span>
        <button type="button" class="glab-btn" data-load="dbbi">dbbi</button>
        <button type="button" class="glab-btn" data-load="faed">faed</button>
        <button type="button" class="glab-btn" data-load="incase">INCASE…</button></div>
      <div class="an-stats"></div>
      <div class="an-cols">
        <div><div class="lab-out-h">symbol frequency</div><div class="an-freq"></div></div>
        <div><div class="lab-out-h">autocorrelation (matches at lag 1–48)</div><canvas class="an-auto" width="360" height="90"></canvas></div>
      </div>
      <div class="an-bmp-wrap"><div class="lab-out-h">bitmap render — reshape to <select data-n="dims"></select> · colour = symbol value</div>
        <canvas class="an-bmp" width="420" height="220"></canvas></div>
      <div class="lab-grid">
        <label class="lab-f"><span>Cipher transform</span><select data-n="tf">
          <option value="reverse">reverse</option><option value="atbash">atbash</option><option value="rot13">rot13</option>
          <option value="vigenere">Vigenère (key)</option><option value="beaufort">Beaufort (key)</option>
          <option value="binary">a/b parity → ASCII</option><option value="field">field-decode → hex → ASCII</option></select></label>
        <label class="lab-f"><span>Key (for Vigenère/Beaufort)</span><input class="lab-in mono" data-n="key" value="THEMATRIXHASYOU"></label>
      </div>
      <div class="lab-out-h">transform output</div><pre class="lab-out-pre mono an-tf"></pre>
    </div>`;

  const el = (n) => container.querySelector(`[data-n="${n}"]`);
  const src = () => el('src').value.trim();
  const dimsSel = el('dims');

  function updateDims() {
    const n = src().length, fs = factors(n).filter(d => d > 1 && d < n);
    dimsSel.innerHTML = fs.map(r => `<option value="${r}">${r} × ${n / r}</option>`).join('') || `<option value="1">1 × ${n}</option>`;
    if (fs.length) dimsSel.value = fs[Math.floor(fs.length / 2)];
  }

  function drawFreq() {
    const s = src(), f = {}; for (const c of s) f[c] = (f[c] || 0) + 1;
    const max = Math.max(1, ...Object.values(f));
    container.querySelector('.an-freq').innerHTML = Object.entries(f).sort((a, b) => b[1] - a[1]).map(([k, v]) =>
      `<div class="fb"><span class="fb-k mono">${esc(k)}</span><span class="fb-bar" style="width:${Math.round(v / max * 100)}%"></span><span class="fb-v">${v}</span></div>`).join('');
  }
  function drawAuto() {
    const s = src(), c = container.querySelector('.an-auto'), g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height); const maxLag = 48, bw = c.width / maxLag;
    let mx = 1; const vals = [];
    for (let lag = 1; lag <= maxLag; lag++) { let m = 0; for (let i = 0; i + lag < s.length; i++) if (s[i] === s[i + lag]) m++; vals.push(m); mx = Math.max(mx, m); }
    vals.forEach((m, i) => { const h = m / mx * (c.height - 4); g.fillStyle = m === mx ? '#7ff0e6' : '#3a6ea8'; g.fillRect(i * bw, c.height - h, bw - 1, h); });
  }
  function drawBmp() {
    const s = src(), c = container.querySelector('.an-bmp'), g = c.getContext('2d');
    const R = +dimsSel.value || 1, C = Math.ceil(s.length / R), cw = c.width / C, ch = c.height / R;
    g.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < s.length; i++) {
      const r = Math.floor(i / C), col = i % C, v = (A2I(s[i]) || (s.charCodeAt(i) % 9)) / 9;
      g.fillStyle = `hsl(${200 - v * 200},70%,${20 + v * 55}%)`;
      g.fillRect(col * cw, r * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }
  function drawStats() {
    const s = src(), n = s.length, dist = new Set(s).size;
    container.querySelector('.an-stats').innerHTML =
      `<span class="an-chip">length <b>${n}</b></span><span class="an-chip">distinct <b>${dist}</b></span>` +
      `<span class="an-chip">IC <b>${ic(s).toFixed(3)}</b> <span class="faint">(flat-${dist}=${(1 / dist).toFixed(3)})</span></span>` +
      `<span class="an-chip">entropy <b>${entropy(s).toFixed(2)}</b> bits/sym</span>` +
      `<span class="an-chip">factors <b>${factors(n).join(', ')}</b></span>`;
  }
  function drawTf() { container.querySelector('.an-tf').textContent = transform(src(), el('tf').value, el('key').value).slice(0, 300) || '—'; }

  function all() { drawStats(); drawFreq(); drawAuto(); drawBmp(); drawTf(); }
  function reDims() { updateDims(); drawBmp(); }

  el('src').addEventListener('input', () => { updateDims(); all(); });
  dimsSel.addEventListener('change', drawBmp);
  el('tf').addEventListener('change', drawTf); el('key').addEventListener('input', drawTf);
  container.querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => { el('src').value = PUZZLE[b.dataset.load]; updateDims(); all(); }));
  updateDims(); all();
}
