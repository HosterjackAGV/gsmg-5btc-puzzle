// views/insights.js — "Summary of trials & the insight chain". For each phase:
//   A = trials that carried no insight (the record, collapsed), and
//   B = trials that carried an insight (with the insight spelled out).
// Then C = the complete chain of insights connected into one usable line of reasoning.

import { ATTEMPTS, PHASE_ORDER, PHASE_LABELS, OUTCOMES, byPhase } from '../../../content/attempts.js';
import { esc, qs, qsa } from '../util.js';
import { toItem, initSearch, fmtDate } from '../components/search.js';

// ── C: the connected chain of thought (authored from the 38 verified insights) ──
// Each step cites the trial entries it rests on (deep-links into #/tried).
const CHAIN = [
  { t: `<b>The crypto is fully pinned and the data is authentic.</b> An independent EVP_BytesToKey(SHA-256)+AES-256-CBC harness reproduces Phase 2→3→3.2 byte-for-byte, and the cosmic prize blob appears verbatim on the real 2023-archived SalPhaseIon page. So every attack below runs against genuine, complete data — the puzzle is real, not a transcription artifact.`,
    refs: ['chain-reproduce-phase2-3-32-byteexact', 'cosmic-txt-authenticity-archived-2023', 'verify-embedded-salphaseion-equals-repo'] },
  { t: `<b>The endgame gates on two values + one combine, with zero feedback.</b> The cosmic key needs <code>yellowblueprimes</code>, <code>yinyang</code>, <i>and</i> the combine operation all simultaneously correct; any two-of-three-perfect guess is indistinguishable from random noise. Blind key-spraying is therefore hopeless — progress requires a value that opens a small blob to create a foothold/oracle.`,
    refs: ['cosmic-no-partial-progress-oracle', 'keysweep-pkcs7-chance-calibration'] },
  { t: `<b>The four ingredients are LABELS, not literal words.</b> The soup's 104-bit chunk between <code>dbbi</code> and <code>faed</code> decodes byte-exactly to the literal word "matrixsumlist" (and another to "enter"). By the same self-labeling logic, <code>yellowblueprimes</code> and <code>yinyang</code> are labels whose <i>values must be computed</i> — which is exactly why every literal-word recipe failed.`,
    refs: ['cosmic-matrixsumlist-literal-vs-numeric', 'recover-dbbi-faed-salphaseion-soup-exact'] },
  { t: `<b>dbbi/faed are NOT those values, and are not text at all.</b> All 362,880 (9!) symbol→digit mappings of dbbi decode to garbage; 91 bits cannot hold a 16-char word; faed's Index of Coincidence pins at ~0.118 (random) under every cipher. dbbi behaves like a structured <i>numeric</i> value, faed like high-entropy key/value data — and the creator said faed "may be for another puzzle." The community's "dbbi→yellowblueprimes / faed→yinyang" decode program is dead.`,
    refs: ['dbbi-all-9factorial-substitutions', 'dbbi-binary-prime-value-map', 'dbbi-symbol-frequency-analysis', 'faed-ic-near-random-118', 'faed-format-alignment-compression'] },
  { t: `<b>So the values come from the GENESIS (Phase 0), exactly as the creator's hints say.</b> "Go back to the first puzzle piece," "Yellow has a number and so does Blue," "the prime part" → primes {2,3,5,7}, "some characters need to be zeroed out," and "fefefe = 101010." The 15 blue + 9 yellow cells are deliberately placed on URL byte-boundaries — a built-in <i>pointer</i> mechanism, not incidental coloring. <code>yellowblueprimes</code> is a genesis-derived <i>number</i>.`,
    refs: ['genesis-grid-byte-boundary-pointer', 'hint-image-decoding-primes-fefefe-doors-toe'] },
  { t: `<b>…but the genesis grid hides no separate string.</b> The colored cells are exactly the URL characters' bit-parity, and across all 8 spiral orientations/polarities the grid yields exactly one text reading (the URL). So <code>yellowblueprimes</code> is a <i>derivation</i> (a number from the yellow/blue cells filtered by primes {2,3,5,7}), not a hidden word. The planted <code>#FEFEFE</code> cell sits at grid (row 7, col 4) — counting from <b>0</b>; that's <b>row 8, column 5</b> counting from 1 — a dual-prime index (spiral 163 counted from 0, row-major 103 counted from 1); concretely on-theme, still unexplained.`,
    refs: ['ledger-colored-cells-24bit-message', 'ledger-exhaustive-reread-14x14-matrix', 'genesis-fefefe-cell-located-7-4'] },
  { t: `<b>The prize key is RANDOM — there is no phrase shortcut.</b> "1GSMG1…" is a brute-forced <i>vanity</i> prefix, so the private key is random and cannot be derived from any passphrase. Every brainwallet / split-key / address-derivation path is ruled out: the key exists only inside the cosmic blob.`,
    refs: ['vanity-address-kills-brainwallet'] },
  { t: `<b>The blobs are independent — no "scattered-AES" shortcut.</b> The four AES blobs have their own random salts, share no 16-byte ciphertext block, and XOR to noise. They are independent containers; the puzzle's linkage lives in key-derivation/narrative, not in combining the blobs. Each needs its own passphrase.`,
    refs: ['blob-independence-conclusion', 'blob-repeated-block-shared-block-scan', 'blob-xor-two-80byte-blobs', 'blob-multi-blob-detection-scattered-signature'] },
  { t: `<b>There is no hidden stage and no external rescue.</b> Wayback has no post-cosmic page (the 64-hex "stage" URLs are just the SPA shell); the genesis QR is only the prize-address link — and it is a perfectly standard Byte/UTF-8/level-L QR that reproduces byte-exactly from that URL, so even its error-correction and format bits hide nothing; the famous "SOLVED" posts are fabricated (their keys fail on the real blob). The creator's "another door" is not a discoverable URL.`,
    refs: ['wayback-cdx-gsmg-urls-spa-shell', 'genesis-qr-decoded-blockchain-link', 'genesis-qr-standard-reproduced-from-url'] },
  { t: `<b>Two under-exploited artifacts remain.</b> A fourth, orphaned OpenSSL blob (salt <code>74c974e3</code>, from a hex "Salted__" gsmg.io URL path) and an on-chain layer of 50 OP_RETURN messages (mostly solver dust, a few suggestive phrases) are catalogued but unsolved.`,
    refs: ['urlblob-4th-orphaned-blob-salt-74c974e3', 'opreturn-50-messages-discovered', 'opreturn-soup-token-concat'] },
];
// The actionable conclusion that the chain points to.
const CONCLUSION = [
  `The only foothold <i>with feedback</i> is a small 80-byte blob. <b>salph_inner</b> is bracketed in the soup by "thispassword", "enter", and "four first hint is your last command" → its key is most likely a <i>local</i> value. <b>p32_trailing</b> is self-verifying with no <i>community</i> attack history — though this session has now run the chess-board construction and every phase-3.2-derived string against it (null), so it too is largely exhausted from the <i>known</i> material.`,
  `Compute <code>yellowblueprimes</code> from the genesis the creator-confirmed way — the yellow & blue cell numbers filtered by primes {2,3,5,7}, with "zero out" / "fefefe" as the indexing rule — and validate each candidate by whether <code>sha256(candidate)</code> opens a small blob. (The genesis-<i>numeric</i> candidates reachable from the coloured-cell + primes rule, woven through the full 24-order recipe, are now themselves swept — null — so the missing value lies <i>outside</i> the obvious index/count readings.)`,
  `The creator says "once you hit a yin-yang you'll solve it the same day," and "very last step is a true giveaway" → the combine is trivial; essentially <i>all</i> remaining difficulty is the <code>yinyang</code> value (most plausibly the genesis blue↔yellow duality, or the "Cosmic Duality" book).`,
  `Two creator-named routes stay under-explored: the <b>"theory of everything"</b> alternate path (only its Pi/π reading was ever scripted) and the <b>"another door"</b> — which the Wayback sweep shows is <i>not</i> a discoverable URL, so it must be an in-data branch (an acrostic, or <code>faed</code> as the "second half for another puzzle").`,
  `<b>Bottom line, freshly re-verified.</b> An independent focused re-attack this session — the computed genesis-value recipe, the p32_trailing chess construction, reshaped <code>dbbi</code>/<code>faed</code> field-decode, and the salph_inner oracle — reconfirms the wall from every angle. The barrier is a missing <i>value</i> (the true <code>yinyang</code>) plus lost live infrastructure, not a computation anyone has skipped. This catalog is exhaustion-complete for the known material; the next real move needs a source of feedback that no longer exists locally.`,
];

function refLinks(ids) {
  const map = Object.fromEntries(ATTEMPTS.map(a => [a.id, a.title]));
  return ids.filter(id => map[id]).map(id => `<a class="chain-ref" href="#/tried/${encodeURIComponent(id)}" title="${esc(map[id])}">↳ ${esc(map[id].slice(0, 38))}${map[id].length > 38 ? '…' : ''}</a>`).join('');
}

export default async function insightsView() {
  const phaseBlocks = PHASE_ORDER.map(ph => {
    const items = byPhase(ph);
    if (!items.length) return '';
    const B = items.filter(a => a.outcome === 'verified-insight');
    const A = items.filter(a => a.outcome !== 'verified-insight');
    const bHtml = B.length ? `
      <h4 class="sum-h sum-b">💡 Insights gained <span class="faint">· ${B.length}</span></h4>
      <ul class="sum-insights">${B.map(a => `<li data-id="${esc(a.id)}"><a href="#/tried/${encodeURIComponent(a.id)}" class="sum-title">${esc(a.title)}</a>${a.author ? ` <span class="tbadge badge-author sm" title="The author — verified Telegram @handle">👤 ${esc(a.author)}</span>` : ''}${a.date ? ` <span class="sum-date">📅 ${esc(fmtDate(a))}</span>` : ''}<div class="sum-ins">${esc(a.insight)}</div></li>`).join('')}</ul>` : '';
    const aHtml = A.length ? `
      <details class="sum-noins"><summary>No insight · ${A.length} trials (tested, ruled out)</summary>
      <ul class="sum-alist">${A.map(a => { const o = OUTCOMES[a.outcome] || OUTCOMES['unverified']; return `<li data-id="${esc(a.id)}"><a href="#/tried/${encodeURIComponent(a.id)}">${esc(a.title)}</a> <span class="tbadge ${o.cls} sm">${o.label}</span>${a.author ? ` <span class="tbadge badge-author sm" title="The author — verified Telegram @handle">👤 ${esc(a.author)}</span>` : ''}${a.date ? ` <span class="sum-date">📅 ${esc(fmtDate(a))}</span>` : ''}</li>`; }).join('')}</ul></details>` : '';
    return `<section class="sum-phase phase-card phase-${ph}"><div class="phase-tag">${({ genesis: 'Phase 0', mrrobot: 'Phase 2', architect: 'Phase 3.2', salphaseion: 'Endgame' })[ph] || ph}</div><h3 id="sum-${ph}">${esc(PHASE_LABELS[ph])}</h3>${bHtml}${aHtml}</section>`;
  }).join('');

  const chainHtml = CHAIN.map((s, i) => `<li class="chain-step"><div class="chain-n">${i + 1}</div><div class="chain-body"><p>${s.t}</p><div class="chain-refs">${refLinks(s.refs)}</div></div></li>`).join('');
  const conclHtml = CONCLUSION.map(c => `<li>${c}</li>`).join('');

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">SUMMARY</div><h2>Trial summary &amp; the insight chain</h2>
      <p>For each phase: the trials that carried <b>no insight</b> (tested and ruled out) and the trials that carried an <b>insight</b> — with the insight spelled out. At the end, all the insights are connected into one <b>usable chain of reasoning</b> that says where the solve most likely lives. Every item links to its full input / method / output in <a href="#/tried">What was tried</a>.</p>
    </div>

    <div id="search-host"></div>

    ${phaseBlocks}

    <hr style="margin:34px 0">
    <div class="sec-head"><div class="sec-num">THE CHAIN</div><h2 id="chain">Every insight, connected — a line of reasoning you can use</h2>
      <p>The verified insights above do not solve the puzzle, but together they form a coherent argument about <i>where</i> the answer must be. Read top to bottom:</p></div>
    <ol class="chain">${chainHtml}</ol>

    <div class="card chain-concl" style="margin-top:18px">
      <h3 style="margin-top:0">⇒ What the chain points to (the usable conclusion)</h3>
      <ol class="concl-list">${conclHtml}</ol>
    </div>
  </div></section>`;

  function mount(root) {
    try { initSearch(root, 'insights', ATTEMPTS.map(a => toItem(a, PHASE_LABELS[a.phase])), { phases: PHASE_ORDER }); } catch (e) { console.error('search', e); }
  }
  return { title: 'Insights', html, mount };
}
