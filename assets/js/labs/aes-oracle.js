// labs/aes-oracle.js — decrypt ANY real puzzle blob with ANY candidate + crypto convention, live.
// This is the self-verifying oracle experience: type a guess, watch it open (readable text / WIF) or fail.

import { BLOBS, aesDecrypt, pwForm, printable, printScore, isWIF } from './harness.js';
import { esc } from '../util.js';

export function aesOracleLab(container) {
  const opt = (o, sel) => Object.entries(o).map(([k, v]) => `<option value="${esc(k)}"${k === sel ? ' selected' : ''}>${esc(v)}</option>`).join('');
  container.innerHTML = `
    <div class="lab">
      <div class="lab-grid">
        <label class="lab-f"><span>Blob</span><select data-n="blob">${opt(Object.fromEntries(Object.entries(BLOBS).map(([k, v]) => [k, v.label])), 'phase2')}</select></label>
        <label class="lab-f"><span>Password form</span><select data-n="form">${opt({ sha256hex: 'sha256(answer) — puzzle convention', raw: 'raw answer (no hash)', double: 'sha256(sha256(answer))' }, 'sha256hex')}</select></label>
        <label class="lab-f"><span>KDF digest</span><select data-n="digest">${opt({ 'SHA-256': 'SHA-256 (standard)', 'SHA-512': 'SHA-512', 'SHA-1': 'SHA-1' }, 'SHA-256')}</select></label>
        <label class="lab-f"><span>Key size</span><select data-n="keyBits"><option value="256" selected>AES-256</option><option value="192">AES-192</option><option value="128">AES-128</option></select></label>
      </div>
      <label class="lab-f wide"><span>Candidate answer (edit me)</span><input class="lab-in mono" data-n="answer" value="causality" spellcheck="false" autocomplete="off"></label>
      <div class="lab-ctrl"><button type="button" class="glab-btn primary" data-act="run">▶ Decrypt</button>
        <span class="faint" style="font-size:12px">Try <code>causality</code> on Phase 2 → it opens. Then switch to Cosmic and try anything → noise.</span></div>
      <div class="lab-res"></div>
    </div>`;

  const res = container.querySelector('.lab-res');
  const val = (n) => container.querySelector(`[data-n="${n}"]`).value;

  async function run() {
    const btn = container.querySelector('[data-act="run"]'); btn.disabled = true; btn.textContent = 'decrypting…';
    try {
      const blob = BLOBS[val('blob')];
      const pw = await pwForm(val('answer'), val('form'));
      const r = await aesDecrypt(blob.b64, pw, { digest: val('digest'), keyBits: +val('keyBits') });
      const score = r.ok ? printScore(r.text) : 0;
      const wif = r.ok && isWIF(r.text);
      const opened = r.ok && score >= 0.85;
      const pct = Math.round(score * 100);
      res.innerHTML = `
        <div class="lab-verdict ${opened ? (wif ? 'win' : 'good') : 'bad'}">
          ${!r.ok ? '✕ invalid padding — wrong key (does not decrypt)'
            : wif ? '★ WIF PRIVATE KEY detected — this would be a solve'
            : opened ? '✓ opens to readable text' : '✕ noise — decrypts but not readable (wrong key)'}
        </div>
        <div class="lab-meter" title="printable ratio"><div class="lab-meter-f" style="width:${pct}%;background:${pct >= 85 ? '#3ad29f' : pct >= 60 ? '#e0b64a' : '#e05a6a'}"></div><span>${pct}% printable</span></div>
        <div class="lab-out-h">OpenSSL password used</div><div class="lab-out-v mono">${esc(pw.slice(0, 96))}${pw.length > 96 ? '…' : ''}</div>
        <div class="lab-out-h">Decrypted bytes → ASCII (first 200)</div><pre class="lab-out-pre mono">${esc(r.ok ? printable(r.text).slice(0, 200) : '(no valid decryption)')}</pre>`;
    } catch (e) { res.innerHTML = `<div class="lab-verdict bad">Error: ${esc(String(e && e.message || e))}</div>`; }
    btn.disabled = false; btn.textContent = '▶ Decrypt';
  }
  container.querySelector('[data-act="run"]').addEventListener('click', run);
  run();
}
