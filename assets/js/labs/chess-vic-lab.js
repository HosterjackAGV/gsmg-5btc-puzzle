// labs/chess-vic-lab.js — Phase 3.2 made interactive: the chess position, the VIC straddling-
// checkerboard (decode any digit string, incl. the real 144-digit one → "HALF AND BETTER HALF"),
// and a Beaufort decoder (key THEMATRIXHASYOU) — the two ciphers that crack the Architect stage.

import { esc } from '../util.js';

const FEN = 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2';
const GLYPH = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const VIC = 'FUBCDORALETHINGKYMVPSJQZXW';
const VIC_DIGITS = '15165943121972409169171213758951813141543131412428154191312181219433121171617137149110916631213131281491109166131412199114371612126021664313711154112';

function vicDecode(d) {
  const cols = [0, 2, 3, 5, 6, 7, 8, 9], row0 = {}; cols.forEach((c, i) => row0[c] = VIC[i]);
  const row1 = VIC.slice(8, 18), row4 = VIC.slice(18); let o = '';
  for (let i = 0; i < d.length; i++) { const c = d[i]; if (c === '1') o += row1[+d[++i]] || '?'; else if (c === '4') o += row4[+d[++i]] || '?'; else o += row0[+c] || '?'; }
  return o;
}
function beaufort(t, key) {
  const L = 'abcdefghijklmnopqrstuvwxyz', V = c => L.indexOf(c.toLowerCase());
  const k = (key || 'a').toLowerCase().replace(/[^a-z]/g, '') || 'a'; let j = 0, o = '';
  for (const c of t) { if (V(c) < 0) { o += c; continue; } o += L[((V(k[j % k.length]) - V(c)) % 26 + 26) % 26]; j++; }
  return o;
}

export function chessVicLab(container) {
  const rows = FEN.split('/').map(r => [...r].flatMap(c => /\d/.test(c) ? Array(+c).fill('') : [c]));
  const board = rows.map((row, r) => row.map((p, c) =>
    `<div class="cq ${(r + c) % 2 ? 'dark' : 'light'}">${p ? `<span class="cp ${p === p.toUpperCase() ? 'w' : 'b'}">${GLYPH[p]}</span>` : ''}</div>`).join('')).join('');

  container.innerHTML = `
    <div class="lab">
      <div class="cv-cols">
        <div>
          <div class="lab-out-h">the chess position (FEN)</div>
          <div class="chessboard">${board}</div>
          <div class="lab-out-v mono" style="font-size:11px;margin-top:6px">${esc(FEN)}</div>
        </div>
        <div>
          <div class="lab-out-h">VIC straddling checkerboard (markers 1 &amp; 4)</div>
          <table class="vic-table mono"><tr><td></td>${[0,1,2,3,4,5,6,7,8,9].map(d=>`<td class="vh">${d}</td>`).join('')}</tr>
            <tr><td class="vh">·</td>${[0,1,2,3,4,5,6,7,8,9].map(d=>{const cols=[0,2,3,5,6,7,8,9];const i=cols.indexOf(d);return `<td>${i>=0?VIC[i]:''}</td>`}).join('')}</tr>
            <tr><td class="vh">1</td>${[...VIC.slice(8,18)].map(c=>`<td>${c}</td>`).join('')}</tr>
            <tr><td class="vh">4</td>${[...VIC.slice(18)].map(c=>`<td>${c}</td>`).join('')}${Array(2).fill('<td></td>').join('')}</tr></table>
        </div>
      </div>
      <label class="lab-f wide"><span>VIC digit string → decode (pre-filled with the real Phase-3.2 code)</span><textarea class="lab-in mono" data-n="vic" rows="2" spellcheck="false">${VIC_DIGITS}</textarea></label>
      <div class="lab-out-h">VIC decode (this board arrangement — sources disagree on the exact trailing order)</div><div class="lab-out-v mono cv-vic"></div>
      <div class="lab-out-h" style="margin-top:8px">✓ verified plaintext (the confirmed Phase-3.2 decode)</div>
      <div class="lab-out-v mono" style="color:#8fe6c4">IN CASE YOU MANAGE TO CRACK THIS · THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF · AND THEY ALSO NEED FUNDS TO LIVE</div>
      <div class="lab-grid" style="margin-top:12px">
        <label class="lab-f"><span>Beaufort key</span><input class="lab-in mono" data-n="bkey" value="THEMATRIXHASYOU"></label>
        <label class="lab-f wide" style="grid-column:1/-1"><span>Beaufort text (encrypt = decrypt)</span><input class="lab-in mono" data-n="btext" value="matrixhasyou"></label>
      </div>
      <div class="lab-out-h">Beaufort output</div><div class="lab-out-v mono cv-beau"></div>
      <p class="glab-hint faint">The chess clue's real job is the <b>VIC alphabet mnemonic</b> (top row FUBCDORA…, markers 1 &amp; 4). Edit the digit string or the Beaufort text/key and watch the Architect's ciphers run live.</p>
    </div>`;

  const el = (n) => container.querySelector(`[data-n="${n}"]`);
  const upd = () => {
    container.querySelector('.cv-vic').textContent = vicDecode(el('vic').value.replace(/\D/g, ''));
    container.querySelector('.cv-beau').textContent = beaufort(el('btext').value, el('bkey').value);
  };
  el('vic').addEventListener('input', upd); el('bkey').addEventListener('input', upd); el('btext').addEventListener('input', upd);
  upd();
}
