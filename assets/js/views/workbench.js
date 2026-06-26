// views/workbench.js — hash anything; try to decrypt any blob with any recipe.
// Logs frontier attempts to the store (verified by the real crypto).

import * as store from '../store.js';
import { sha256Hex, decryptBlob, tryBlob, passFor, attemptId, looksLikeWif, hasSecureCrypto } from '../crypto.js';
import { esc, on, qs, toast, confetti } from '../util.js';

const BLOBS = [
  { id: 'cosmic', label: 'Cosmic Duality', open: true },
  { id: 'salphaseion', label: 'SalPhaseIon inner', open: true },
  { id: 'phase2', label: 'Phase 2' },
  { id: 'phase3', label: 'Phase 3' },
  { id: 'phase32', label: 'Phase 3.2' },
];

export default async function workbenchView() {
  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">THE WORKBENCH</div><h2>Hash &amp; decrypt anything, live</h2>
      <p>The exact crypto the puzzle uses, built into the page. Nothing leaves your browser. This is where you actually work the endgame.</p></div>

    <div class="ctxwarn ${hasSecureCrypto ? '' : 'show'}">In-browser crypto needs a secure context (https or http://localhost). On the published site it just works; opened as a local file it won’t.</div>

    <div class="grid cols-2">
      <div class="card"><h3>SHA-256 fingerprint</h3>
        <p class="muted" style="font-size:13px">Type anything → its 64-character code. This is the function that links every door.</p>
        <div class="console"><div class="crow">
          <input class="cin" id="h-in" placeholder="any text…" spellcheck="false">
          <button class="btn teal" id="h-go">Hash</button>
        </div><div class="cout" id="h-out"></div></div>
      </div>

      <div class="card"><h3>AES decryptor (OpenSSL-compatible)</h3>
        <p class="muted" style="font-size:13px">Choose a blob, enter a passphrase, see if it opens.</p>
        <div class="selrow" id="blobsel">${BLOBS.map((b, n) => `<button class="chip ${b.open ? 'open' : ''} ${n === 0 ? 'active' : ''}" data-blob="${b.id}">${esc(b.label)}</button>`).join('')}</div>
        <div class="console"><div class="crow">
          <input class="cin" id="d-in" placeholder="candidate passphrase / recipe…" spellcheck="false">
          <button class="btn gold" id="d-go">⚡ Try decrypt</button>
        </div>
        <div class="chkrow"><input type="checkbox" id="d-pre" checked><label for="d-pre">SHA-256 the input first (chain mode — mimic the puzzle’s answer → hash → key flow)</label></div>
        <div class="cout" id="d-out"></div></div>
        <p class="cnote">For solved boxes the right answer reveals readable text. For Cosmic Duality every guess fails until the real recipe is found — that’s the open problem.</p>
      </div>
    </div>
  </div></section>`;

  function mount(root) {
    // hash tool
    const hOut = qs('#h-out', root);
    const doHash = async () => {
      const v = qs('#h-in', root).value;
      if (!v) { hOut.className = 'cout show bad'; hOut.textContent = 'Type something.'; return; }
      const hex = await sha256Hex(v);
      store.state._hashed = (store.state._hashed | 0) + 1; // achievement counter
      hOut.className = 'cout show info'; hOut.textContent = hex;
    };
    qs('#h-go', root).addEventListener('click', doHash);
    qs('#h-in', root).addEventListener('keydown', e => { if (e.key === 'Enter') doHash(); });

    // blob selector
    let blob = BLOBS[0].id;
    on(root, 'click', '#blobsel .chip', (e, b) => {
      qs('#blobsel .chip.active', root)?.classList.remove('active');
      b.classList.add('active'); blob = b.dataset.blob;
    });

    // decryptor
    const dOut = qs('#d-out', root), dGo = qs('#d-go', root);
    const doDecrypt = async () => {
      const v = qs('#d-in', root).value.trim();
      const prehash = qs('#d-pre', root).checked;
      if (!v) { dOut.className = 'cout show bad'; dOut.textContent = 'Enter a passphrase.'; return; }
      if (!hasSecureCrypto) { dOut.className = 'cout show bad'; dOut.textContent = 'Insecure context — live engine disabled.'; return; }
      dGo.disabled = true; dGo.textContent = '…';
      try {
        const pass = await passFor(v, prehash);
        const ok = await tryBlob(blob, pass);
        const meta = BLOBS.find(b => b.id === blob);
        if (meta.open) {
          const id = await attemptId(blob, v, prehash);
          store.logAttempt({ id, blob, recipe: v, prehash, result: ok ? 'unlocked' : 'fail' });
        }
        if (ok) {
          const text = await decryptBlob(blob, pass);
          dOut.className = 'cout show ok';
          dOut.textContent = `✓ UNLOCKED${looksLikeWif(text) ? ' — looks like a Bitcoin WIF key!' : ''}\n\n${text.slice(0, 1600)}`;
          confetti(meta.open ? 220 : 90);
          if (meta.open) toast({ ico: '🏆', title: 'A frontier blob opened!', desc: 'Verify the result — this could be the solve.', kind: 'gold', ttl: 9000 });
        } else {
          dOut.className = 'cout show bad';
          dOut.textContent = `✗ fail — invalid padding (wrong passphrase).${meta.open ? '\nLogged as a verified dead-end.' : ''}`;
          if (meta.open) toast({ ico: '🛰️', title: 'Attempt logged', desc: 'Frontier coverage +1' });
        }
      } catch (err) {
        dOut.className = 'cout show bad'; dOut.textContent = '✗ fail — ' + (err.message || 'error');
      } finally { dGo.disabled = false; dGo.textContent = '⚡ Try decrypt'; }
    };
    dGo.addEventListener('click', doDecrypt);
    qs('#d-in', root).addEventListener('keydown', e => { if (e.key === 'Enter') doDecrypt(); });
  }

  return { title: 'Workbench', html, mount };
}
