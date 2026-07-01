// labs/cosmic-recipe.js — build the believed cosmic key from its four ingredients (edit each),
// pick the order + combine operation, and test it LIVE against the real prize blob.

import { BLOBS, aesDecrypt, sha256hex, dig, hex, enc, printable, printScore, isWIF } from './harness.js';
import { esc } from '../util.js';

const ilv = (arr) => { let o = '', i = 0, go = true; while (go) { go = false; for (const s of arr) { if (i < s.length) { o += s[i]; go = true; } } i++; } return o; };
const ORDERS = { master: [0, 1, 2, 3], reversed: [3, 2, 1, 0], soup: [0, 1, 3, 2] };

export function cosmicRecipeLab(container) {
  const opt = (o, sel) => Object.entries(o).map(([k, v]) => `<option value="${esc(k)}"${k === sel ? ' selected' : ''}>${esc(v)}</option>`).join('');
  const ing = [
    { n: 'ybp', label: 'yellowblueprimes', v: '7233147103127' },
    { n: 'msl', label: 'matrixsumlist', v: '6108766549978798108108736759668' },
    { n: 'lw', label: 'lastwordsbeforearchichoice', v: 'lastwordsbeforearchichoice' },
    { n: 'yin', label: 'yinyang', v: 'yinyang' },
  ];
  container.innerHTML = `
    <div class="lab">
      <div class="lab-ings">${ing.map(x => `<label class="lab-f"><span>${esc(x.label)}</span><input class="lab-in mono" data-n="${x.n}" value="${esc(x.v)}" spellcheck="false"></label>`).join('')}</div>
      <div class="lab-grid">
        <label class="lab-f"><span>Order</span><select data-n="order">${opt({ master: 'master hint = phase order (ybp·msl·lw·yin)', reversed: 'reversed', soup: 'soup storage order (ybp·msl·yin·lw)' }, 'master')}</select></label>
        <label class="lab-f"><span>Combine</span><select data-n="op">${opt({ concat: 'concatenate', interleave: 'intertwine (interleave)', shaeach: 'sha256 each, then join', xor: 'XOR of the four hashes' }, 'concat')}</select></label>
        <label class="lab-f"><span>Separator</span><select data-n="sep">${opt({ '': 'none', '·': '·', ' ': 'space', '\n': 'newline' }, '')}</select></label>
      </div>
      <div class="lab-ctrl"><button type="button" class="glab-btn primary" data-act="run">▶ Build key &amp; test on Cosmic</button>
        <span class="faint" style="font-size:12px">Two ingredients (ybp, yinyang) are unconfirmed — expect noise. A WIF = 5 BTC.</span></div>
      <div class="lab-res"></div>
    </div>`;

  const res = container.querySelector('.lab-res');
  const val = (n) => container.querySelector(`[data-n="${n}"]`).value;

  async function run() {
    const btn = container.querySelector('[data-act="run"]'); btn.disabled = true; btn.textContent = 'testing…';
    try {
      const parts = ORDERS[val('order')].map(i => val(ing[i].n));
      const sep = val('sep'), op = val('op');
      let key, assembled;
      if (op === 'concat') { assembled = parts.join(sep); key = await sha256hex(assembled); }
      else if (op === 'interleave') { assembled = ilv(parts); key = await sha256hex(assembled); }
      else if (op === 'shaeach') { const hs = await Promise.all(parts.map(sha256hex)); assembled = hs.join(sep); key = await sha256hex(assembled); }
      else { const hs = await Promise.all(parts.map(p => dig('SHA-256', enc(p)))); const x = new Uint8Array(32); for (const h of hs) for (let i = 0; i < 32; i++) x[i] ^= h[i]; key = hex(x); assembled = '(xor of the four sha256 digests)'; }
      const r = await aesDecrypt(BLOBS.cosmic.b64, key);
      const score = r.ok ? printScore(r.text) : 0, pct = Math.round(score * 100), wif = r.ok && isWIF(r.text), opened = r.ok && score >= 0.85;
      res.innerHTML = `
        <div class="lab-verdict ${opened ? (wif ? 'win' : 'good') : 'bad'}">${!r.ok ? '✕ invalid padding — wrong key' : wif ? '★ WIF PRIVATE KEY — 5 BTC solve!' : opened ? '✓ readable text' : '✕ noise (wrong ingredients/combine)'}</div>
        <div class="lab-meter"><div class="lab-meter-f" style="width:${pct}%;background:${pct >= 85 ? '#3ad29f' : pct >= 60 ? '#e0b64a' : '#e05a6a'}"></div><span>${pct}% printable</span></div>
        <div class="lab-out-h">assembled input</div><div class="lab-out-v mono">${esc(assembled.slice(0, 120))}${assembled.length > 120 ? '…' : ''}</div>
        <div class="lab-out-h">→ sha256 → OpenSSL key</div><div class="lab-out-v mono">${esc(key)}</div>
        <div class="lab-out-h">Cosmic decrypt (first 160)</div><pre class="lab-out-pre mono">${esc(r.ok ? printable(r.text).slice(0, 160) : '(no valid decryption)')}</pre>`;
    } catch (e) { res.innerHTML = `<div class="lab-verdict bad">Error: ${esc(String(e && e.message || e))}</div>`; }
    btn.disabled = false; btn.textContent = '▶ Build key & test on Cosmic';
  }
  container.querySelector('[data-act="run"]').addEventListener('click', run);
  run();
}
