// labs/dbbi-faed-lab.js — decode the a–i soup blocks yourself: pick the symbol→digit map,
// the reading order, and the decode target, and watch the output + printability + IC update live.

import { PUZZLE, printable, printScore, ic, hexToAscii } from './harness.js';
import { esc } from '../util.js';

const DIMS = { 91: [7, 13], 570: [19, 30] };

function mapFn(kind, zeroLetter) {
  const L = 'abcdefghi';
  if (kind === 'a1i9') return c => L.indexOf(c) + 1;                 // a=1 … i=9
  if (kind === 'a0i8') return c => L.indexOf(c);                     // a=0 … i=8
  if (kind === 'rev')  return c => 9 - L.indexOf(c);                 // a=9 … i=1
  if (kind === 'zero') { const others = L.split('').filter(x => x !== zeroLetter); const m = { [zeroLetter]: 0 }; others.forEach((x, i) => m[x] = i + 1); return c => m[c]; }
  return c => L.indexOf(c) + 1;
}
function order(s, kind) {
  if (kind === 'fwd') return s;
  if (kind === 'rev') return [...s].reverse().join('');
  if (kind === 'transpose') { const d = DIMS[s.length]; if (!d) return s; const [R, C] = d; let o = ''; for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) o += s[r * C + c] || ''; return o; }
  return s;
}
function decode(digs, target) {
  if (target === 'raw') return digs;
  if (target === 'int-hex-ascii') { try { let n = BigInt(digs.replace(/^0+/, '') || '0'); let h = n.toString(16); if (h.length % 2) h = '0' + h; return hexToAscii(h); } catch { return '(overflow)'; } }
  if (target === 'binary') { const bits = [...digs].map(d => (+d) % 2).join(''); return (bits.match(/.{1,8}/g) || []).map(b => String.fromCharCode(parseInt(b.padEnd(8, '0'), 2))).join(''); }
  if (target === 'a1z26') return [...digs].map(d => String.fromCharCode(96 + ((+d) || 26))).join('');
  return digs;
}

export function dbbiFaedLab(container) {
  const opt = (o, sel) => Object.entries(o).map(([k, v]) => `<option value="${esc(k)}"${k === sel ? ' selected' : ''}>${esc(v)}</option>`).join('');
  container.innerHTML = `
    <div class="lab">
      <div class="lab-grid">
        <label class="lab-f"><span>Block</span><select data-n="block">${opt({ dbbi: 'dbbi (91, structured)', faed: 'faed (570, random)' }, 'dbbi')}</select></label>
        <label class="lab-f"><span>Symbol → digit</span><select data-n="map">${opt({ a1i9: 'a=1 … i=9', a0i8: 'a=0 … i=8', rev: 'a=9 … i=1 (reversed)', zero: 'one letter = 0 (missing zero)' }, 'a1i9')}</select></label>
        <label class="lab-f zonly" hidden><span>Which letter = 0</span><select data-n="zero">${opt(Object.fromEntries('abcdefghi'.split('').map(c => [c, c])), 'b')}</select></label>
        <label class="lab-f"><span>Reading order</span><select data-n="order">${opt({ fwd: 'forward', rev: 'reverse', transpose: 'reshape → read columns' }, 'fwd')}</select></label>
        <label class="lab-f"><span>Decode target</span><select data-n="target">${opt({ 'int-hex-ascii': 'big int → hex → ASCII', binary: 'digit parity → 8-bit ASCII', a1z26: 'digits → letters', raw: 'raw digit string' }, 'int-hex-ascii')}</select></label>
      </div>
      <label class="lab-f wide"><span>The a–i block (edit me)</span><textarea class="lab-in mono" data-n="src" rows="3" spellcheck="false">${esc(PUZZLE.dbbi)}</textarea></label>
      <div class="lab-ctrl"><button type="button" class="glab-btn primary" data-act="run">▶ Decode</button>
        <span class="faint" style="font-size:12px">Every combination has been swept — all noise. See it yourself.</span></div>
      <div class="lab-res"></div>
    </div>`;

  const res = container.querySelector('.lab-res');
  const el = (n) => container.querySelector(`[data-n="${n}"]`);
  const val = (n) => el(n).value;

  el('block').addEventListener('change', () => { el('src').value = PUZZLE[val('block')]; run(); });
  el('map').addEventListener('change', () => { container.querySelector('.zonly').hidden = val('map') !== 'zero'; run(); });

  function run() {
    const s = val('src').replace(/[^a-i]/g, '');
    const digs = [...order(s, val('order'))].map(mapFn(val('map'), val('zero'))).join('');
    const out = decode(digs, val('target'));
    const score = printScore(out), pct = Math.round(score * 100), icv = ic(s);
    res.innerHTML = `
      <div class="lab-meter" title="printable ratio"><div class="lab-meter-f" style="width:${pct}%;background:${pct >= 85 ? '#3ad29f' : pct >= 60 ? '#e0b64a' : '#e05a6a'}"></div><span>${pct}% printable · IC ${icv.toFixed(3)} (flat-9 = 0.111)</span></div>
      <div class="lab-out-h">digit string (${digs.length})</div><div class="lab-out-v mono">${esc(digs.slice(0, 120))}${digs.length > 120 ? '…' : ''}</div>
      <div class="lab-out-h">decoded output</div><pre class="lab-out-pre mono">${esc(printable(out).slice(0, 240)) || '—'}</pre>
      <div class="lab-out-s faint">${score >= 0.85 ? 'readable — you found something!' : 'high-entropy / non-printable — not readable text'}</div>`;
  }
  container.querySelector('[data-act="run"]').addEventListener('click', run);
  run();
}
