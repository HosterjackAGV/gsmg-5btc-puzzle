// views/walkthrough.js — the plain, complete, source-checked walk through every
// phase. It renders the project's AUDITED reference (docs/VERIFIED-SOLUTIONS.md)
// verbatim — so the walkthrough IS the verified source, with every value tagged
// ✅/⚠️/❌ — then appends the interactive genesis grid and the COMPLETE raw
// ciphertext blobs (nothing truncated). Sourced; no re-typed values, no ellipsis.

import { renderMarkdown } from '../md.js';
import { saltOf } from '../crypto.js';
import { esc, qs, qsa, on, copy, toast } from '../util.js';

const BLOBS = [
  { name: 'phase2', phase: 'Phase 2', note: 'opens with sha256("causality")' },
  { name: 'phase3', phase: 'Phase 3', note: 'opens with the Phase-2 7-part password (hashed)' },
  { name: 'phase32', phase: 'Phase 3.2', note: 'opens with the Phase-3 password (hashed)' },
  { name: 'salphaseion', phase: 'SalPhaseIon', note: 'inner blob — frontier' },
  { name: 'cosmic', phase: 'Cosmic Duality', note: 'the final lock — OPEN' },
];

export default async function walkthroughView() {
  let md = '';
  try { const r = await fetch('docs/VERIFIED-SOLUTIONS.md', { cache: 'no-store' }); if (r.ok) md = await r.text(); } catch {}
  const docHtml = md ? renderMarkdown(md)
    : '<div class="note warn"><h4>Reference unavailable</h4><p>Could not load <span class="mono">docs/VERIFIED-SOLUTIONS.md</span>. On a local copy, serve over http (not file://).</p></div>';

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">WALKTHROUGH</div><h2>The whole puzzle, phase by phase</h2>
      <p>A plain, complete, source-checked walk through every phase — exact inputs and outputs, nothing omitted. This renders the project's independently <b>audited reference</b> verbatim: every value is tagged <b class="teal">✅ confirmed</b> / <b class="gold">⚠️ unverified</b> / <b class="rust">❌ refuted</b>, with sources at the end. The interactive genesis grid and the complete raw ciphertext blobs follow.</p>
      <div class="row" style="margin-top:6px">
        <a class="btn ghost sm" href="#/map">🚪 Solve the doors hands-on</a>
        <a class="btn ghost sm" href="#/effort">🛰️ The open frontier</a>
        <button type="button" class="btn ghost sm" id="wt-jump">↓ Raw artifacts</button>
      </div></div>

    <div class="wt-grid">
      <nav class="wt-toc" id="wt-toc"></nav>
      <article class="md" id="wt-doc">${docHtml}</article>
    </div>

    <hr style="margin:34px 0">
    <div class="sec-head"><div class="sec-num">ARTIFACTS</div><h2 id="artifacts">Complete &amp; verbatim</h2>
      <p>The genesis grid (rendered from the verified bit-data) and the real, unaltered encrypted files — OpenSSL <span class="mono">Salted__</span> base64. Nothing here is truncated.</p></div>

    <h3>🧩 Genesis grid — Phase 0</h3>
    <div id="wt-grid-host"><p class="faint">loading…</p></div>

    <h3 style="margin-top:26px">🔒 Raw ciphertext blobs (all five, in full)</h3>
    <div id="wt-blobs"><p class="faint">loading…</p></div>
  </div></section>`;

  function mount(root) {
    // ---- build the phase table-of-contents from rendered headings ----
    const doc = qs('#wt-doc', root), toc = qs('#wt-toc', root);
    if (doc && toc) {
      const heads = qsa('h2, h3', doc).filter(h => h.id);
      toc.innerHTML = `<div class="wt-toc-h">Contents</div>` +
        heads.map(h => `<button type="button" class="wt-toc-link wt-${h.tagName.toLowerCase()}" data-t="${h.id}">${esc(h.textContent)}</button>`).join('');
      // in-page scroll WITHOUT touching the hash router
      on(toc, 'click', '.wt-toc-link', (e, b) => {
        const t = qs('#' + CSS.escape(b.dataset.t), root) || document.getElementById(b.dataset.t);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // jump-to-artifacts (scroll, not a hash-route)
    const jump = qs('#wt-jump', root);
    if (jump) jump.addEventListener('click', () => { const a = qs('#artifacts', root); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

    // copy buttons inside the rendered doc / artifacts
    on(root, 'click', '.copy', (e, b) => copy(b.dataset.copy, b));

    // ---- interactive genesis grid ----
    const gridHost = qs('#wt-grid-host', root);
    if (gridHost) import('../components/matrix.js')
      .then(m => { const w = m.matrixWidget(); gridHost.innerHTML = w.html; w.mount(gridHost); })
      .catch(() => { gridHost.innerHTML = '<p class="faint">Grid failed to load.</p>'; });

    // ---- complete raw ciphertext blobs ----
    const blobHost = qs('#wt-blobs', root);
    if (blobHost) Promise.all(BLOBS.map(async b => {
      try { const r = await fetch(`ciphertexts/${b.name}.txt`, { cache: 'no-store' }); return { ...b, text: r.ok ? (await r.text()).trim() : null }; }
      catch { return { ...b, text: null }; }
    })).then(list => {
      blobHost.innerHTML = list.map(b => {
        if (!b.text) return `<details class="eli5"><summary>${esc(b.phase)} — <span class="mono">${b.name}.txt</span> <span class="chev">+</span></summary><div class="body"><p class="faint">unavailable</p></div></details>`;
        const salt = saltOf(b.text);
        return `<details class="eli5"><summary>${esc(b.phase)} — <span class="mono">${b.name}.txt</span> · ${b.text.length} chars${salt ? ` · salt <span class="mono gold">${salt}</span>` : ''} <span class="chev">+</span></summary>
          <div class="body">
            <p class="cnote" style="margin-top:0">${esc(b.note)}. The bytes begin <span class="mono">U2FsdGVkX1…</span> = base64 of <span class="mono">Salted__</span>.</p>
            <div class="row" style="margin-bottom:8px"><button class="copy" data-copy="${esc(b.text)}">copy full blob</button></div>
            <pre class="wt-blob mono">${esc(b.text)}</pre>
          </div></details>`;
      }).join('');
    });
  }

  return { title: 'Walkthrough', html, mount };
}
