// views/walkthrough.js — THE authoritative, source-merged walkthrough. Renders
// docs/WALKTHROUGH.md (every phase, every value, every image, merged from all public
// repos + the creator hints), then appends the interactive genesis grid and the
// COMPLETE raw ciphertext blobs (nothing truncated).

import { renderMarkdown } from '../md.js';
import { saltOf, decryptBlob, sha256Hex } from '../crypto.js';
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
  { name: 'salphaseion', phase: 'SalPhaseIon — inner blob', note: 'the inner blob in the soup — UNDECODED (the reconstructed salph_inner.txt is byte-identical — verified)' },
  { name: 'cosmic', phase: 'Cosmic Duality', note: 'the final lock — OPEN / UNSOLVED' },
];

// The full 7-part / 3-part passwords (used as method+output pieces and as live-decrypt keys).
const P2_PW = 'causalitySafenetLunaHSM111100x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1';
const P3_PW = 'jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple';
const DBBI = 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe';
const FAED = 'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic';
// live-decrypt: blob name → the human answer that (SHA-256-hashed) opens it
const LIVE_KEYS = { phase2: 'causality', phase3: P2_PW, phase32: P3_PW };

// ── the complete, verified per-phase inventory: every Input · Method · Output piece ──
// 'blob' → a raw ciphertext shown below; 'live' → decrypted in-browser; 'open' → unsolved.
const PIECES = [
  { title: 'Phase 0 — Genesis / The Seed Is Planted', status: '✅',
    input:  [{ k: 'Genesis grid', v: 'puzzle.png — a 14×14 grid (196 tiles = 196 bits)' }],
    method: [{ k: 'Read', v: 'counter-clockwise inward spiral of bits → 8-bit ASCII' }],
    output: [{ k: 'Decoded URL', v: 'gsmg.io/theseedisplanted', mono: 1 },
             { k: 'matrixsumlist · row-sums', v: '610876654997879', mono: 1 },
             { k: 'matrixsumlist · col-sums', v: '8108108736759668', mono: 1 }] },
  { title: 'Phase 1 — The Warning', status: '✅',
    input:  [{ k: 'theseedisplanted page', v: 'a hidden password form + scrambled images' }],
    method: [{ k: 'Song', v: '“The Warning” by Logic — the line after the lyric “Phase two”' }],
    output: [{ k: 'Passphrase', v: 'theflowerblossomsthroughwhatseemstobeaconcretesurface', mono: 1 },
             { k: 'Redirect URL', v: 'gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself', mono: 1 }] },
  { title: 'Phase 2 — Mr. Robot', status: '✅',
    input:  [{ k: 'phase2.txt', v: 'OpenSSL AES blob · salt 06286612d43ed7ed', blob: 'phase2' }],
    method: [{ k: '① causality', v: 'causality' }, { k: '② Safenet', v: 'Safenet' }, { k: '③ Luna', v: 'Luna' },
             { k: '④ HSM', v: 'HSM' }, { k: '⑤ EO 11110', v: '11110' },
             { k: '⑥ genesis coinbase (hex)', v: '0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854', mono: 1 },
             { k: '⑦ chess FEN', v: 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1', mono: 1 },
             { k: 'Page key = sha256(causality)', v: 'eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf', mono: 1 }],
    output: [{ k: 'Full 7-part password', v: P2_PW, mono: 1 },
             { k: 'Phase-3 key = sha256(password)', v: '1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5', mono: 1 },
             { k: 'Decrypted page', live: 'phase2' }] },
  { title: 'Phase 3 — Free Will', status: '✅',
    input:  [{ k: 'phase3.txt', v: 'OpenSSL AES blob · salt 9fbc451d13d071f4', blob: 'phase3' }],
    method: [{ k: 'Answer ①', v: 'jacquefresco' }, { k: 'Answer ②', v: 'giveitjustonesecond' }, { k: 'Answer ③', v: 'heisenbergsuncertaintyprinciple' }],
    output: [{ k: 'Full password', v: P3_PW, mono: 1 },
             { k: 'Phase-3.2 key = sha256(password)', v: '250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c', mono: 1 },
             { k: 'Decrypted page', live: 'phase3' }] },
  { title: 'Phase 3.2 — The Architect', status: '✅',
    input:  [{ k: 'phase32.txt', v: 'OpenSSL AES blob · salt eefc4c5befc1656a', blob: 'phase32' },
             { k: 'p32_trailing (embedded)', v: '80-byte AES blob · salt b45a5e3d827593ca', blob: 'p32_trailing', open: 1 }],
    method: [{ k: 'Byte decode', v: 'IBM EBCDIC code page 1141 (“one for one, four for one”)' },
             { k: 'Beaufort key', v: 'THEMATRIXHASYOU', mono: 1 },
             { k: 'VIC alphabet', v: 'FUBCDORA.LETHINGKYMVPS.JQZXW', mono: 1 },
             { k: 'VIC digits', v: '1 and 4' }],
    output: [{ k: 'Decoded message', v: 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE' },
             { k: 'Decrypted page', live: 'phase32' }] },
  { title: 'Decentraland → SalPhaseIon (entry)', status: '✅',
    input:  [{ k: 'Decentraland LAND', v: '−41,−17 · audio_source.wav' }],
    method: [{ k: 'Audio', v: 'stereo split → phase-invert one channel → mono → spectrogram → HASHTHETEXT' },
             { k: 'Hash', v: 'sha256(entry text, 59 chars, no trailing newline)' }],
    output: [{ k: 'Entry text (59 chars)', v: 'GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe', mono: 1 },
             { k: 'Entry hash = SalPhaseIon URL', v: '89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32', mono: 1 }] },
  { title: 'SalPhaseIon — The Inner Sanctum', status: '⚠️ frontier',
    input:  [{ k: 'The “soup”', v: 'a long a–i/o string split by the letter z' },
             { k: 'salphaseion.txt (inner blob)', v: 'AES blob · salt 3ab585348552415d', blob: 'salphaseion', open: 1 }],
    method: [{ k: 'Split', v: 'on the letter z' },
             { k: 'a/b chunks', v: '→ 8-bit binary ASCII' },
             { k: 'a–i+o chunks', v: 'a=1…i=9, o=0 → base-9 → hex → ASCII' }],
    output: [{ k: '✅ Token 1', v: 'matrixsumlist' }, { k: '✅ Token 2', v: 'enter' },
             { k: '✅ Token 3', v: 'lastwordsbeforearchichoice' }, { k: '✅ Token 4', v: 'thispassword' },
             { k: '❌ dbbi — 91 symbols (UNDECODED)', v: DBBI, mono: 1, open: 1 },
             { k: '❌ faed — 570 symbols (UNDECODED)', v: FAED, mono: 1, open: 1 }] },
  { title: 'Cosmic Duality — The Final Lock', status: '❌ OPEN',
    input:  [{ k: 'cosmic.txt', v: 'OpenSSL AES blob · salt 2d3f6fe06dc950e6 — the final lock', blob: 'cosmic', open: 1 }],
    method: [{ k: 'Hypothesised recipe', v: 'sha256(yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang)', open: 1 }],
    output: [{ k: '❌ UNSOLVED', v: 'expected a Bitcoin WIF private key (5/K/L…) controlling 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe', open: 1 },
             { k: 'Master-hint tokens', v: 'wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit · verylaststepisatruegiveaway · promised' }] },
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
      <p>Every concrete piece of every phase, in full — each tagged <b class="pc-in">input</b>, <b class="pc-me">method</b>, or <b class="pc-out">output</b>, with no duplicates. The solved AES pages are <b>decrypted live in your browser</b> to prove them; the genesis grid is rendered from the verified bit-data; the real, unaltered <span class="mono">Salted__</span> base64 blobs follow. Nothing here is truncated.</p></div>

    <h3>📑 Every piece, by phase — input · method · output</h3>
    <div id="wt-pieces"><p class="faint">loading…</p></div>

    <h3 style="margin-top:26px">🧩 Genesis grid — Phase 0</h3>
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

    // ---- complete per-phase pieces ledger (input · method · output), verified ----
    const piecesHost = qs('#wt-pieces', root);
    if (piecesHost) {
      const pieceRow = (p) => {
        if (p.live) return `<div class="pc-piece" data-live="${p.live}"><span class="pc-k">Decrypted page <span class="pc-livetag">live ✓</span></span><span class="pc-v"><span class="faint">decrypting…</span></span></div>`;
        const val = p.mono ? `<span class="mono break">${esc(p.v)}</span>` : esc(p.v);
        return `<div class="pc-piece${p.open ? ' pc-openpiece' : ''}"><span class="pc-k">${esc(p.k)}</span><span class="pc-v">${val}<button class="copy" data-copy="${esc(p.v)}">copy</button></span></div>`;
      };
      const col = (label, cls, arr) => `<div class="pc-col"><div class="pc-lab ${cls}">${label}</div>${arr.map(pieceRow).join('')}</div>`;
      piecesHost.innerHTML = PIECES.map(ph => `<article class="pc-phase">
        <div class="pc-head"><span class="pc-title">${esc(ph.title)}</span><span class="pc-status">${esc(ph.status)}</span></div>
        <div class="pc-cols">${col('Input', 'pc-in', ph.input)}${col('Method', 'pc-me', ph.method)}${col('Output', 'pc-out', ph.output)}</div>
      </article>`).join('');
      // decrypt the three solved AES pages live, in-browser, to prove the outputs verbatim
      Object.entries(LIVE_KEYS).forEach(async ([blob, answer]) => {
        const cell = qs(`[data-live="${blob}"] .pc-v`, piecesHost); if (!cell) return;
        try {
          const pt = await decryptBlob(blob, await sha256Hex(answer));
          cell.innerHTML = `<details class="pc-pt"><summary>${pt.length} chars — decrypted ✓ (read)</summary><div class="row" style="margin:6px 0"><button class="copy" data-copy="${esc(pt)}">copy plaintext</button></div><pre class="wt-blob mono">${esc(pt)}</pre></details>`;
        } catch { cell.innerHTML = '<span class="faint">decrypt needs an http(s) context</span>'; }
      });
    }

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
