// views/walkthrough.js — THE authoritative, source-merged walkthrough. Renders
// docs/WALKTHROUGH.md (every phase, every value, every image, merged from all public
// repos + the creator hints), then appends the interactive genesis grid and the
// COMPLETE raw ciphertext blobs (nothing truncated).

import { renderMarkdown } from '../md.js';
import { saltOf, decryptBlob, sha256Hex } from '../crypto.js';
import { esc, qs, qsa, on, copy } from '../util.js';
import { byPhase, phaseKeyForHeading, OUTCOMES } from '../../../content/attempts.js';
import { WATCHED } from '../../../content/donations.js';
import { MATRIX } from '../../../content/matrix.js';
import { getPrices, getBalance, statusFor, peek, poll, fmtUsd, fmtAmt } from '../onchain.js';

// The puzzle-relevant passage of "The Warning (Inner Mix)" by Logic (the Phase-1 song).
const LYRICS = `Phase one
The seed is planted when opposites attract
Can you dig it?
It takes the physical to create the physical

Phase two
The flower blossoms through what seems to be a concrete surface
I.e. greed, racism, insanity, physical and social handicaps
These are the things that mob the flower
Red rose or black rose; no in-between

Phase 3
The Judgement
If it were to fall upon you today, which flower would you be?
The red rose or the black?

This is the warning`;

// Render the 14×14 genesis matrix colored by the puzzle lore (black/white/blue/yellow/#fefefe),
// with a button to strip the colors to plain white for reading. (Data is pixel-exact from puzzle.png.)
function coloredMatrixHTML() {
  const blue = new Set(MATRIX.blue.map(x => x.join(','))), yellow = new Set(MATRIX.yellow.map(x => x.join(',')));
  const fefefe = new Set((MATRIX.fefefe || []).map(x => x.join(',')));
  let cells = '';
  for (let r = 0; r < MATRIX.grid.length; r++) for (let c = 0; c < MATRIX.grid[r].length; c++) {
    const v = MATRIX.grid[r][c], rc = r + ',' + c;
    const cls = blue.has(rc) ? 'cm-blue' : yellow.has(rc) ? 'cm-yellow' : fefefe.has(rc) ? 'cm-fefefe' : (v ? 'cm-on' : 'cm-off');
    cells += `<span class="cm-cell ${cls}" title="row ${r + 1}, col ${c + 1} (from 1) · ${r},${c} (from 0) = ${v}">${v}</span>`;
  }
  return `<div class="cm-wrap">
    <div class="row" style="margin-bottom:8px"><button class="btn ghost sm" type="button" data-cm-plain>Remove colors (plain)</button></div>
    <div class="cm-grid" data-cm-grid>${cells}</div>
    <div class="cm-legend"><span class="cm-cell cm-on">1</span> black = 1 · <span class="cm-cell cm-off">0</span> white = 0 · <span class="cm-cell cm-blue">1</span> blue · <span class="cm-cell cm-yellow">0</span> yellow · <span class="cm-cell cm-fefefe">0</span> #FEFEFE cell (7,4)/(8,5)</div>
  </div>`;
}

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
// The complete SalPhaseIon "soup" (verbatim, as on the page — a space between every character).
const SOUP = 'd b b i b f b h c c b e g b i h a b e b e i h b e g g e g e b e b b g e h h e b h h f b a b f d h b e f f c d b b f c c c g b f b e e g g e c b e d c i b f b f f g i g b e e e a b e a b b a b b a b a b b a a a a b a b b b a b a a a b b b a a b a a b b a b a a b a b b b b a a a a b b b a a b b a b b b a b a b a b b a b b a b a b b a b b a a a b b a b a a b a b b b a a b b a b b b a b a a f a e d g g e e d f c b d a b h h g g c a d c f e d d g f d g b g i g a a e d g g i a f a e c g h g g c d a i h e h a h b a h i g c e i f g b f g e f g a i f a b i f a g a e g e a c g b b e a g f g g e e g g a f b a c g f c d b e i f f a a f c i d a h g d e e f g h h c g g a e g d e b h h e g e g h c e g a d f b d i a g e f c i c g g i f d c g a a g g f b i g a i c f b h e c a e c b c e i a i c e b g b g i e c d e g g f g e g a e d g g f i i c i i i f i f h g g c g f g d c d g g e f c b e e i g e f i b g i b g g g h h f b c g i f d e h e d f d a g i c d b h i c g a i e d a e h a h g h h c i h d g h f h b i i c e c b i i c h i h i i i g i d d g e h h d f d c h c b a f g f b h a h e a g e g e c a f e h g c f g g g g c a g f h h g h b a i h i d i e h h f d e g g d g c i h g g g g g h a d a h i g i g b g e c g e d f c d g g a c c d e h i i c i g f b f f h g g a e i d b b e i b b e i i f d g f d h i e e e i e e e c i f d g d a h d i g g f h e g f i a f f i g g b c b c e h c e a b f b e d b i i b f b f d e d e e h g i g f a a i g g a g b e i i c h i e d i f b e h g b c c a h h b i i b i b b i b d c b a h a i d h f a h i i h i c z a g d a f a o a h e i e c g g c h g i c b b h c g b e h c f c o a b i c f d h h c d b b c a g b d a i o b b g b e a d e d d e z c f o b f d h g d o b d g o o i i g d o c d a o o f i d h z s h a b e f o u r f i r s t h i n t i s y o u r l a s t c o m m a n d U 2 F s d G V k X 1 8 6 t Y U 0 h V J B X X U n B U O 7 C 0 + X 4 K U W n W k C v o Z S x b R D 3 w N s G W V H e f v d r d 9 z a b b a a b a b a b b a b b b a a b b b a b a a a b b a a b a b a b b b a a b a Q v X 0 t 8 v 3 j P B 4 o k p s p x e b R i 6 s E 1 B M l 5 H I 8 R k u + K e j U q T v d W O X 6 n Q j S p e p X w G u N / j J s h a b e f a n s t o o';
// Phase 3.2 — the full Architect speech (the Beaufort-layer output, ending in "ciaobellao").
const ARCH = 'yourlifeisthesumofaremainderofanunbalancedequationinherenttotheprogrammingofthispuzzleyouaretheeventualityofananomalywhichdespitemysinceresteffortsihavebeenunabletoeliminatefromwhatisotherwiseaharmonyofmathematicalprecisionwhileitremainsaburdentosedulouslyavoidititisnotunexpectedandthusnotbeyondameasureofcontrolwhichhasledyouinexorablyhereyouyouhaventansweredmyquestionmequiterightinterestingthatwasquickerthantheotherspleaseifyoufindawaytocompletethelastpartofthepuzzletaketheprivatekeyyouveearneditbutpleasetakethistoheartthatwhatawisemanabovehintedatisworthhundredfourtyoftheinvestmentthatswhatusguysatgsmgaretryingtoaccomplishintheendpleasejusthelpusbuilditinsteadofjustwaistingyourlifetimebyhuntingforworthlesspricesandthrophieslikethisimsorrytotellyouthatyouvecomethisfarbutyoullneverfinishthelasttaskiexpectyoutosaybullshitwelldenialisthemostpredictableofallhumanresponsesbutrestassuredthiswillnotbethelasttimeihavedestroyedarestlesssoulandihavebecomeexceedinglyefficientatitthefunctionoftheyouisnowtoreturntothesourcecodesallowingatemporarydisseminationofthecodeyouhopefullycarryreinsertingtheprimebasicsafterwhichyouwillberequiredtoselectfromovertwentythreecipherssixteenencryptionsandorsevenintertwinedpasswordstofindtheactualprivatekeynotethatalsobruteforcingmightberequiredfailuretocomplywiththisprocesswillresultinacataclysmicsystemcrashkillingyourwillpowerwhichcoupledwiththeexterminationofyourwilltoliveandwillultimatelyresultintheextinctionoftheentirenessofyourselfselfgoodluckneverthelessireallyhopeyouretheoneciaobellao';
// The exact SalPhaseIon soup fragments (verified pixel/parse-exact) that decode to each token.
const SOUP_BIN1 = 'abbabbababbaaaababbbabaaabbbaabaabbabaababbbbaaaabbbaabbabbbabababbabbababbabbaaabbabaababbbaabbabbbabaa';        // → matrixsumlist
const SOUP_AGDA = 'agdafaoaheiecggchgicbbhcgbehcfcoabicfdhhcdbbcagbdaiobbgbeadedde';                                                  // → lastwordsbeforearchichoice
const SOUP_CFOB = 'cfobfdhgdobdgooiigdocdaoofidh';                                                                                  // → thispassword
const SOUP_BIN2 = 'abbaabababbabbbaabbbabaaabbaabababbbaaba';                                                                       // → enter
const BLOB_H1   = 'U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4KUWnWkCvoZSxbRD3wNsGWVHefvdrd9'; // salph_inner 1st half
const BLOB_H2   = 'QvX0t8v3jPB4okpspxebRi6sE1BMl5HI8Rku+KejUqTvdWOX6nQjSpepXwGuN/jJ'; // salph_inner 2nd half

// live-decrypt: blob name → the human answer that (SHA-256-hashed) opens it
const LIVE_KEYS = { phase2: 'causality', phase3: P2_PW, phase32: P3_PW };

// ── the complete, verified per-phase inventory: every Input · Method · Output piece ──
// 'blob' → a raw ciphertext shown below; 'live' → decrypted in-browser; 'open' → unsolved.
const PIECES = [
  { title: 'Phase 0 — Genesis / The Seed Is Planted', status: '✅',
    input:  [{ k: 'Genesis image (puzzle.png)', img: 'assets/walkthrough/puzzle.png' },
             { k: 'The 14×14 matrix, colored by the puzzle lore', matrix: true },
             { k: 'Grid summary', v: 'puzzle.png — 14×14 tiles (196 bits); 15 blue, 9 yellow, 1 #FEFEFE cell at (7,4)/(8,5)' }],
    method: [{ k: 'Read', v: 'counter-clockwise inward spiral of bits → 8-bit ASCII' }],
    output: [{ k: 'Decoded URL', v: 'gsmg.io/theseedisplanted', mono: 1 },
             { k: 'matrixsumlist · row-sums', v: '610876654997879', mono: 1 },
             { k: 'matrixsumlist · col-sums', v: '8108108736759668', mono: 1 }] },
  { title: 'Phase 1 — The Warning', status: '✅',
    input:  [{ k: 'theseedisplanted page', v: 'a hidden password form + scrambled images' },
             { k: 'The Warning page — scrambled image tiles', img: 'assets/walkthrough/phase1-assets/warning-logic.png' }],
    method: [{ k: 'Box transcription', v: 'WAR + NING → WARNING · LO + GIC → LOGIC (plus the on-tile lyric fragments “Can you dig it?” and “warning”)' },
             { k: 'Song', v: '“The Warning” by Logic — the line right after the lyric “Phase two”' },
             { k: 'Song lyrics (the puzzle-relevant passage)', v: LYRICS, long: 1 }],
    output: [{ k: 'Passphrase', v: 'theflowerblossomsthroughwhatseemstobeaconcretesurface', mono: 1 },
             { k: 'Redirect URL', v: 'gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself', mono: 1 }] },
  { title: 'Phase 2 — Mr. Robot', status: '✅',
    input:  [{ k: 'phase2.txt', v: 'OpenSSL AES blob · salt 06286612d43ed7ed', blob: 'phase2' }],
    method: [{ k: '① causality', v: 'causality' }, { k: '② Safenet', v: 'Safenet' }, { k: '③ Luna', v: 'Luna' },
             { k: '④ HSM', v: 'HSM' }, { k: '⑤ EO 11110', v: '11110' },
             { k: '⑥ genesis coinbase (hex)', v: '0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854', mono: 1 },
             { k: '⑦ chess FEN', v: 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1', mono: 1 },
             { k: 'Page key = sha256(causality)', v: 'eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf', mono: 1 }],
    output: [{ k: '⑥ genesis-hex decodes to', v: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks' },
             { k: 'Full 7-part password', v: P2_PW, mono: 1 },
             { k: 'Phase-3 key = sha256(password)', v: '1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5', mono: 1 },
             { k: 'Decrypted page (AES)', live: 'phase2' }] },
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
    output: [{ k: 'Decrypted page (AES)', live: 'phase32' },
             { k: 'Beaufort output — the full Architect speech (… ciaobellao)', v: ARCH, long: 1 },
             { k: 'VIC decoded message (final)', v: 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE' }] },
  { title: 'Decentraland → SalPhaseIon (entry)', status: '✅',
    input:  [{ k: 'Decentraland LAND', v: '−41,−17 · audio_source.wav' }],
    method: [{ k: 'Audio', v: 'stereo split → phase-invert one channel → mono → spectrogram → HASHTHETEXT' },
             { k: 'Hash', v: 'sha256(entry text, 59 chars, no trailing newline)' }],
    output: [{ k: 'Entry text (59 chars)', v: 'GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe', mono: 1 },
             { k: 'Entry hash = SalPhaseIon URL', v: '89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32', mono: 1 }] },
  { title: 'SalPhaseIon — The Inner Sanctum', status: '⚠️ frontier',
    input:  [{ k: 'The “soup” (description)', v: 'a long a–i/o string split by the letter z, with two embedded base64 blobs and some plain English' },
             { k: 'Complete raw soup (verbatim, as on the page)', v: SOUP, long: 1 },
             { k: 'salphaseion.txt (inner blob)', v: 'AES blob · salt 3ab585348552415d', blob: 'salphaseion', open: 1 }],
    method: [{ k: 'Split', v: 'on the letter z' },
             { k: 'a/b chunks', v: '→ 8-bit binary ASCII' },
             { k: 'a–i+o chunks', v: 'a=1…i=9, o=0 → base-9 → hex → ASCII' }],
    // the soup decomposes, IN ORDER, into these parts — z = soup separator (dark orange);
    // each decoded part carries a golden collapsible with the raw soup chunk it came from.
    output: [{ k: '① dbbi — 91 symbols · UNDECODED', v: DBBI, mono: 1, open: 1 },
             { k: '② matrixsumlist', v: 'matrixsumlist', source: SOUP_BIN1, srcNote: 'a/b binary (a=0, b=1) → 8-bit ASCII' },
             { k: '③ faed — 570 symbols · UNDECODED', v: FAED, long: 1, open: 1 },
             { z: 1 },
             { k: '④ lastwordsbeforearchichoice', v: 'lastwordsbeforearchichoice', source: SOUP_AGDA, srcNote: 'a–i/o → a=1…i=9,o=0 → big number → hex → ASCII' },
             { z: 1 },
             { k: '⑤ thispassword', v: 'thispassword', source: SOUP_CFOB, srcNote: 'a–i/o → a=1…i=9,o=0 → big number → hex → ASCII' },
             { z: 1 },
             { k: '⑥ shabef → sha256', v: 'sha256', source: 'shabef', srcNote: 'a1z26: b=2, e=5, f=6 → “sha” + “256”' },
             { k: '⑦ ourfirsthintisyourlastcommand', v: 'ourfirsthintisyourlastcommand', note: 'plain text in the soup; the leading “f” is shared with shabef, so it also reads “fourfirsthintisyourlastcommand”' },
             { k: '⑧ salph_inner AES blob — 1st half', v: BLOB_H1, mono: 1, open: 1, note: 'this half + the z + the 2nd half reassemble into the 80-byte salph_inner ciphertext (salt 3ab585348552415d) — the enter binary is nested at the z' },
             { z: 1 },
             { k: '⑨ enter — nested in the blob at the z', v: 'enter', source: SOUP_BIN2, srcNote: 'a/b binary (a=0, b=1) → 8-bit ASCII' },
             { k: '⑩ salph_inner AES blob — 2nd half', v: BLOB_H2, mono: 1, open: 1 },
             { k: '⑪ shabef → sha256 (second marker)', v: 'sha256', source: 'shabef', srcNote: 'a1z26 → sha256' },
             { k: '⑫ anstoo', v: 'anstoo', note: 'trailing plain-text token' }] },
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
      // golden collapsible: the raw soup chunk that decodes to this part
      const srcHtml = (p) => p.source ? `<details class="pc-src"><summary>↳ soup source${p.srcNote ? ' · ' + esc(p.srcNote) : ''} — click</summary><div class="row" style="margin:6px 0"><button class="copy" data-copy="${esc(p.source)}">copy</button></div><pre class="wt-blob mono">${esc(p.source)}</pre></details>` : '';
      const noteHtml = (p) => p.note ? `<div class="pc-note2">${esc(p.note)}</div>` : '';
      const pieceRow = (p) => {
        if (p.z) return `<div class="pc-zrow"><span class="pc-zsep">z</span><span class="pc-zlabel">soup separator</span></div>`;
        if (p.live) return `<div class="pc-piece" data-live="${p.live}"><span class="pc-k">${esc(p.k || 'Decrypted page')} <span class="pc-livetag">live ✓</span></span><span class="pc-v"><span class="faint">decrypting…</span></span></div>`;
        if (p.img) return `<div class="pc-piece"><span class="pc-k">${esc(p.k)}</span><span class="pc-v"><details class="pc-pt"><summary>image — click to view</summary><img class="pc-img" src="${esc(p.img)}" alt="${esc(p.k)}" loading="lazy"></details></span></div>`;
        if (p.matrix) return `<div class="pc-piece"><span class="pc-k">${esc(p.k)}</span><span class="pc-v"><details class="pc-pt"><summary>14×14 matrix — click to view</summary><div data-matrix><span class="faint">building…</span></div></details></span></div>`;
        if (p.long) return `<div class="pc-piece${p.open ? ' pc-openpiece' : ''}"><span class="pc-k">${esc(p.k)}</span><span class="pc-v"><details class="pc-pt"><summary>${p.v.length} chars — click to read${p.open ? ' · UNDECODED' : ''}</summary><div class="row" style="margin:6px 0"><button class="copy" data-copy="${esc(p.v)}">copy</button></div><pre class="wt-blob mono">${esc(p.v)}</pre></details>${noteHtml(p)}</span></div>`;
        const val = p.mono ? `<span class="mono break">${esc(p.v)}</span>` : esc(p.v);
        const blobDetails = p.blob ? `<details class="pc-pt" data-blobtext="${esc(p.blob)}"><summary>full ciphertext — click to read</summary><div class="faint">loading…</div></details>` : '';
        return `<div class="pc-piece${p.open ? ' pc-openpiece' : ''}"><span class="pc-k">${esc(p.k)}</span><span class="pc-v">${val}<button class="copy" data-copy="${esc(p.v)}">copy</button>${blobDetails}${srcHtml(p)}${noteHtml(p)}</span></div>`;
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

      // give every blob input piece its COMPLETE ciphertext as a collapsible
      qsa('[data-blobtext]', piecesHost).forEach(async d => {
        const name = d.dataset.blobtext;
        try {
          const r = await fetch(`ciphertexts/${name}.txt`, { cache: 'no-store' });
          const t = (await r.text()).trim();
          d.innerHTML = `<summary>full ciphertext (${t.length} chars) — click to read</summary><div class="row" style="margin:6px 0"><button class="copy" data-copy="${esc(t)}">copy</button></div><pre class="wt-blob mono">${esc(t)}</pre>`;
        } catch { d.innerHTML = '<summary>full ciphertext unavailable (serve over http)</summary>'; }
      });

      // render the colored genesis matrix + wire its "plain colors" toggle
      const cm = qs('[data-matrix]', piecesHost);
      if (cm) cm.innerHTML = coloredMatrixHTML();
      on(piecesHost, 'click', '[data-cm-plain]', (e, b) => {
        const g = qs('[data-cm-grid]', b.closest('.cm-wrap')); if (!g) return;
        const plain = g.classList.toggle('plain');
        b.textContent = plain ? 'Show colors' : 'Remove colors (plain)';
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
