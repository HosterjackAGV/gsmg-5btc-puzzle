// views/walkthrough.js — THE authoritative, source-merged walkthrough. Renders
// docs/WALKTHROUGH.md (every phase, every value, every image, merged from all public
// repos + the creator hints), then appends the interactive genesis grid and the
// COMPLETE raw ciphertext blobs (nothing truncated).

import { renderMarkdown } from '../md.js';
import { saltOf } from '../crypto.js';
import { esc, qs, qsa, on, copy } from '../util.js';
import { byPhase, phaseKeyForHeading, OUTCOMES } from '../../../content/attempts.js';
import { WATCHED } from '../../../content/donations.js';
import { getPrices, getBalance, statusFor, peek, poll, fmtUsd, fmtAmt } from '../onchain.js';

const STATUS = {
  available: { cls: 'st-ok', label: 'available', tip: 'Funds are present and intact.' },
  partly: { cls: 'st-partly', label: 'partly drained', tip: 'Balance is lower than it was at the start of today (UTC).' },
  drained: { cls: 'st-drained', label: 'drained', tip: 'Balance is negligible (under $100).' },
};

const BLOBS = [
  { name: 'phase2', phase: 'Phase 2', note: 'opens with sha256("causality")' },
  { name: 'phase3', phase: 'Phase 3', note: 'opens with the Phase-2 7-part password (hashed)' },
  { name: 'phase32', phase: 'Phase 3.2', note: 'opens with the Phase-3 password (hashed)' },
  { name: 'p32_trailing', phase: 'Phase 3.2 — trailing blob', note: 'embedded at the end of the Phase 3.2 plaintext — UNDECODED' },
  { name: 'salphaseion', phase: 'SalPhaseIon — inner blob', note: 'the inner blob in the soup — UNDECODED' },
  { name: 'salph_inner', phase: 'SalPhaseIon — inner blob (reconstructed)', note: 'reconstructed copy of the inner blob — UNDECODED' },
  { name: 'cosmic', phase: 'Cosmic Duality', note: 'the final lock — OPEN / UNSOLVED' },
];

export default async function walkthroughView() {
  let md = '';
  try { const r = await fetch('docs/WALKTHROUGH.md', { cache: 'no-store' }); if (r.ok) md = await r.text(); } catch {}
  const docHtml = md ? renderMarkdown(md)
    : '<div class="note warn"><h4>Walkthrough unavailable</h4><p>Could not load <span class="mono">docs/WALKTHROUGH.md</span>. Serve over http (not file://).</p></div>';

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">WALKTHROUGH</div><h2>The whole puzzle, phase by phase</h2>
      <p>The complete, <b>authoritative, source-merged</b> walkthrough — every phase, every exact value, and every image, assembled from all public sources (the puzzlehunt &amp; Naddiseo repos, the creator's hint posts, and on-chain data), de-duplicated and cross-checked. Solved and reproducible through <b>Phase 3.2</b>; the endgame is <b class="gold">OPEN</b>. Each phase opens with its <b>Input → Method → Output</b>; the full write-up, code, images and sources sit in the collapsible <i>"Full walkthrough"</i> panel, and every phase ends with what's been tried to move it forward. The interactive genesis grid and the complete raw ciphertext blobs follow.</p>
      <div class="row" style="margin-top:6px">
        <a class="btn ghost sm" href="#/reference">📋 Reference sheet (every value)</a>
        <button type="button" class="btn ghost sm" id="wt-jump">↓ Raw artifacts</button>
      </div></div>

    <div class="wt-wallets" id="wt-wallets">
      ${WATCHED.map(w => `<div class="wlt" data-w="${w.id}">
        <div class="wlt-top"><span class="wlt-label">${esc(w.label)}</span>
          <span class="wlt-badge" data-badge="${w.id}"><span class="faint">…</span></span></div>
        <div class="wlt-amt" data-amt="${w.id}"><span class="faint">checking balance…</span></div>
        <div class="wlt-sub">${esc(w.blurb)} <a href="${esc(w.explorer + w.address)}" target="_blank" rel="noopener" class="wlt-x">${esc(w.address.slice(0, 8))}… ↗</a></div>
      </div>`).join('')}
      <div class="wlt-live"><span class="live-dot"></span> on-chain · live</div>
    </div>

    <div class="wt-grid">
      <nav class="wt-toc" id="wt-toc"></nav>
      <article class="md" id="wt-doc">${docHtml}</article>
    </div>

    <hr style="margin:34px 0">
    <div class="sec-head"><div class="sec-num">ARTIFACTS</div><h2 id="artifacts">Complete &amp; verbatim</h2>
      <p>The genesis grid (rendered from the verified bit-data) and the real, unaltered encrypted files — OpenSSL <span class="mono">Salted__</span> base64. Nothing here is truncated.</p></div>

    <h3>🧩 Genesis grid — Phase 0</h3>
    <div id="wt-grid-host"><p class="faint">loading…</p></div>

    <h3 style="margin-top:26px">🔒 Raw ciphertext blobs (in full)</h3>
    <div id="wt-blobs"><p class="faint">loading…</p></div>
  </div></section>`;

  function mount(root) {
    const doc = qs('#wt-doc', root), toc = qs('#wt-toc', root);

    // ---- live prize / halving wallet balances + status badge (top of page) ----
    async function refreshWallets() {
      let prices = {}; try { prices = await getPrices(); } catch { prices = peek('prices') || {}; }
      const btc = prices.bitcoin > 0 ? prices.bitcoin : null;   // a 0/absent price means "no USD", not $0
      await Promise.all(WATCHED.map(async w => {
        let amount = null;
        try { amount = (await getBalance(w)).amount; }
        catch { const c = peek('bal:' + w.id + ':' + w.address); amount = c ? c.amount : null; }
        const usd = amount != null && btc != null ? amount * btc : null;
        const amtEl = qs(`[data-amt="${w.id}"]`, root), badgeEl = qs(`[data-badge="${w.id}"]`, root);
        if (amtEl) amtEl.innerHTML = amount == null
          ? '<span class="faint">unavailable</span>'
          : `<b>${esc(fmtAmt(amount, 8))}</b> BTC${usd != null ? ` <span class="wlt-usd">≈ ${esc(fmtUsd(usd))}</span>` : ''}`;
        if (badgeEl) {
          if (amount == null || usd == null) { badgeEl.innerHTML = '<span class="faint">—</span>'; return; }
          const s = STATUS[statusFor(w, amount, usd).state];
          badgeEl.className = `wlt-badge ${s.cls}`;
          badgeEl.innerHTML = `<span class="st-dot"></span>${esc(s.label)}`;
          badgeEl.title = s.tip;
        }
      }));
    }
    const wltHost = qs('#wt-wallets', root);
    if (wltHost) poll(refreshWallets, 75000, wltHost);   // anchor on the in-view element so polling auto-stops on navigation

    // ---- inject "What was tried to move forward" panel at the END of each phase ----
    if (doc) qsa('h2', doc).forEach(h => {
      const key = phaseKeyForHeading(h.textContent);
      if (!key) return;
      const items = byPhase(key);
      if (!items.length) return;
      const list = items.map(a => {
        const o = OUTCOMES[a.outcome] || OUTCOMES['unverified'];
        return `<li><a href="#/tried/${encodeURIComponent(a.id)}"><span class="tp-title">${esc(a.title)}</span><span class="tbadge ${o.cls} sm">${o.label}</span></a></li>`;
      }).join('');
      const panel = document.createElement('details');
      panel.className = 'tried-panel';
      panel.innerHTML = `<summary>🧪 What was tried to move forward <span class="tp-count">${items.length}</span></summary>
        <p class="tp-note">Every documented attempt tied to this phase — click any to jump to its full input / method / output in <a href="#/tried">What was tried</a>, or see the connected reasoning under <a href="#/insights">Insights</a>.</p>
        <ul class="tried-list">${list}</ul>`;
      // place at the end of the phase: just before the next h2 (or at the end of the doc)
      let next = h.nextElementSibling;
      while (next && next.tagName !== 'H2') next = next.nextElementSibling;
      if (next) next.parentNode.insertBefore(panel, next);
      else doc.appendChild(panel);
    });

    // ---- phase table-of-contents (top-level phase headings only) ----
    if (doc && toc) {
      const heads = qsa('h2', doc).filter(h => h.id);
      toc.innerHTML = `<div class="wt-toc-h">Contents</div>` +
        heads.map(h => `<button type="button" class="wt-toc-link wt-${h.tagName.toLowerCase()}" data-t="${h.id}">${esc(h.textContent)}</button>`).join('');
      on(toc, 'click', '.wt-toc-link', (e, b) => {
        const t = qs('#' + CSS.escape(b.dataset.t), root) || document.getElementById(b.dataset.t);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const jump = qs('#wt-jump', root);
    if (jump) jump.addEventListener('click', () => { const a = qs('#artifacts', root); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

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
        if (!b.text) return '';
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
