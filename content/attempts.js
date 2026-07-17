// attempts.js — the "What Was Tried" catalog: every documented attempt to advance
// the puzzle endgame, by the community and by this project. Each entry is rendered
// in the #/tried view (deep-linkable by id) and surfaced per-phase in the walkthrough's
// "What was tried to move forward" panels.
//
// outcome ∈ 'unverified' | 'verified-fail' | 'verified-insight'
// phase   ∈ 'genesis' | 'mrrobot' | 'architect' | 'salphaseion'
// author  ∈ (optional) the VERIFIED Telegram @handle of the contributor who uncovered it; rendered as
//           a "The author" badge. Only set when the handle is confidently confirmed (the export stores
//           numeric sender IDs, so most contributors can't be resolved to a handle — left unset then).
// authors ∈ (optional) array of contributor handles/labels (rendered as multiple 👤 badges) — use when
//           more than one person, or the research engine, is credited.
// date    ∈ (optional) 'YYYY-MM-DD' when the attempt was made/recorded (set dateApprox:true for ~year).
// history ∈ (optional) the lineage/timeline of the attempt — how it arose, what it followed from.
// evidence∈ (optional) the receipts — Telegram msg-ids + dates, the reproduction (test count + result),
//           or on-chain proof. Kept SELF-CONTAINED (no private/gitignored paths — this is a public page).

export const PHASE_LABELS = {
  genesis:     'Phase 0 — Genesis image (matrix · yellowblueprimes · QR)',
  mrrobot:     'Phase 2 — Mr. Robot',
  architect:   'Phase 3.2 — The Architect & the trailing blob',
  salphaseion: 'SalPhaseIon & Cosmic Duality — the open endgame',
};
export const PHASE_ORDER = ['genesis', 'mrrobot', 'architect', 'salphaseion'];

export const OUTCOMES = {
  'unverified':       { label: 'Unverified',            cls: 'badge-unverified', desc: 'attempted or claimed, but not rigorously tested here' },
  'verified-fail':    { label: 'Verified fail',         cls: 'badge-fail',       desc: 'rigorously tested and confirmed it does not advance' },
  'verified-insight': { label: 'Verified — new insight', cls: 'badge-insight',   desc: 'tested; did not solve, but produced a genuine new finding' },
};

// Map a walkthrough phase-heading text to a phase key (used to attach panels).
export function phaseKeyForHeading(text) {
  const t = String(text).toLowerCase();
  if (t.includes('decentraland')) return null;       // mentions SalPhaseIon but has no trials of its own
  if (t.includes('genesis') || t.includes('seed is planted')) return 'genesis';
  if (t.includes('mr. robot') || t.includes('mr robot')) return 'mrrobot';
  if (t.includes('architect')) return 'architect';
  if (t.includes('salphaseion') || t.includes('cosmic')) return 'salphaseion';
  return null;
}

export const byPhase = (p) => ATTEMPTS.filter(a => a.phase === p);

// ── the catalog (the counters in the views are computed from ATTEMPTS.length) ──
export const ATTEMPTS = [
 {
  "id": "web-x2sh-equation-ec-point-misread",
  "phase": "mrrobot",
  "category": "Phase-2 keypad equation",
  "title": "The Phase-2 \"X 2 S H 4 Y 0 Q B 15\" equation read as secp256k1 point coordinates",
  "who": "community",
  "author": "u/Sandalphon69",
  "date": "2019-10",
  "dateApprox": true,
  "source": "Reddit — r/bitcoinpuzzles (u/Sandalphon69)",
  "sourceQuote": "treating the leftover X and Y as the coordinates of a point on an elliptic curve",
  "history": "An early (2019) reading of the Phase-2 keypad equation: resolve the lettered residues via their Mr-Robot clues (S=Klingon 2+5*6=32, B=Intel i5 -> 5^2=25, Q=qwerty 82, H unresolved), then treat the leftover X and Y as the (x,y) coordinates of a point on the secp256k1 curve.",
  "input": "The phase-2 plaintext line \"# X 2 S H 4 Y 0 Q B 15 #\".",
  "method": "Map the four solvable letters to numbers, then interpret X and Y as an elliptic-curve point / candidate key material.",
  "provenance": "The equation is verbatim in the phase-2 plaintext (reproduced by our OpenSSL/EVP harness). The EC-point reading is from a 2019 Reddit thread.",
  "output": "No point is ever produced — the author never resolves H and concedes \"no clue how to connect it all together\".",
  "evidence": "Refuted by the confirmed solve: substituting S=32,H=42,Q=82,B=25 and reversing (\"worst gear\") yields the GEOGRAPHIC coordinate 51 52'28.0\"N, 4 24'23.2\"E (SafeNet/Gemalto HQ) — a consistency check, not an EC point or key. (Walkthrough §2.4.)",
  "outcome": "verified-fail",
  "insight": "X and Y are geographic coordinates, not secp256k1 coordinates; the equation is a SafeNet/Luna/HSM consistency check, never a key.",
  "links": [
   {
    "label": "Reddit — r/bitcoinpuzzles",
    "href": "https://www.reddit.com/r/bitcoinpuzzles/comments/dfwcqk/gsmgio_5_btc_puzzle/f4lkyp6/"
   }
  ]
 },
 {
  "id": "web-n82biv-lsb-passphrase",
  "phase": "salphaseion",
  "category": "SalPhaseIon image / stego",
  "title": "LSB-stego token \"N82BIV\" from the SalPhaseIon image as an endgame passphrase",
  "who": "community",
  "author": "community",
  "date": "2025",
  "dateApprox": true,
  "source": "Reddit — r/bitcoinpuzzles (2025)",
  "sourceQuote": "LSB reveals BMP + EXE + GZIP signatures plus the token N82BIV",
  "history": "A 2025 proposal: LSB-extract a 6-char token \"N82BIV\" from the SalPhaseIon image and use it (and its concatenations with known Phase-1 constants) as the cosmic/salph_inner passphrase.",
  "input": "The claimed LSB token N82BIV; the Phase-1 constant GSMGIO5BTCPUZZLECHALLENGE1; the HASHTHETEXT instruction.",
  "method": "aes-256-cbc (-md sha256) with pass = sha256(\"N82BIV\"), and sha256(\"GSMGIO5BTCPUZZLECHALLENGE1\"+\"N82BIV\"), sha256(\"HASHTHETEXT\"+\"N82BIV\"), plus literal/lowercase and reversed-order variants, against cosmic / salph_inner / p32_trailing.",
  "provenance": "Blobs from ciphertexts/ (research/lib/data.mjs, matching docs/WALKTHROUGH.md); tested via research/lib/gsmg.mjs, deepInspect-armed.",
  "output": "13 candidates × {literal, sha256hex} × 3 blobs = 87 KAT-gated tests → 0 readable, 0 nested-Salted__, 0 WIF.",
  "evidence": "Reproduced in-harness (deepInspect: no Salted__ prefix, no embedded WIF, no readable plaintext). The \"three stego signatures at once\" is a textbook LSB false-positive and N82BIV appears nowhere else in the puzzle.",
  "outcome": "verified-fail",
  "insight": "The N82BIV token keys none of the blobs, alone or concatenated with the known Phase-1/HASHTHETEXT constants.",
  "links": [
   {
    "label": "Reddit — r/bitcoinpuzzles",
    "href": "https://www.reddit.com/r/bitcoinpuzzles/comments/dfwcqk/gsmgio_5_btc_puzzle/mkabpp7/"
   }
  ]
 },
 {
  "id": "web-causality-brainwallet-trivia",
  "phase": "mrrobot",
  "category": "On-chain trivia",
  "title": "sha256(\"causality\") is a valid — but puzzle-irrelevant — brainwallet key (→ 1JZBwaA29Cgy…)",
  "who": "community",
  "author": "community",
  "date": "2020",
  "dateApprox": true,
  "source": "Reddit — r/bitcoinpuzzles",
  "sourceQuote": "sha256(\"causality\") is a valid private key",
  "history": "A recurring observation that the Phase-2 password sha256(\"causality\") — which our harness confirms decrypts phase2 — is ALSO, trivially, a valid secp256k1 private key.",
  "input": "sha256(\"causality\") = eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf.",
  "method": "Treat the 32-byte hash as a raw private key; derive the P2PKH address (compressed + uncompressed).",
  "provenance": "Derived in-harness with node:crypto secp256k1 (validated: privkey=1 → 1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm).",
  "output": "Uncompressed → 1JZBwaA29CgyrtPz7SbsvXZkSKswaAkfmP ; compressed → 1Jqq37KkZEt4F3Dt6qXdtyiMEFBBdawbkJ. NEITHER is a GSMG address.",
  "evidence": "Any 32-byte value < the curve order is a valid secp256k1 key, so producing \"a valid address\" is meaningless. The prize key is a RANDOM vanity key (1GSMG1 prefix), unreachable by any brainwallet/phrase.",
  "outcome": "verified-insight",
  "insight": "Documented so it is not re-chased as progress: sha256(any-word) is always a valid key; it says nothing about the puzzle.",
  "links": [
   {
    "label": "Reddit — r/bitcoinpuzzles",
    "href": "https://www.reddit.com/r/bitcoinpuzzles/comments/dfwcqk/gsmgio_5_btc_puzzle/fb1apom/"
   }
  ]
 },
 {
  "id": "web-gsmgio-kit-bip39-extraction",
  "phase": "salphaseion",
  "category": "Endgame — mnemonic extraction",
  "title": "gsmgio_puzzle_kit: 18-word BIP39 extraction from the soup + word-order brute force to the prize",
  "who": "community",
  "author": "bidcoinauction",
  "date": "2025",
  "dateApprox": true,
  "source": "GitHub — bidcoinauction/gsmgio_puzzle_kit",
  "sourceQuote": "grid-carve → ROT13 + column concat → 18 two-char pairs → Base36 → mod 2048 → BIP39",
  "history": "A community GitHub kit that grid-carves the decrypted SalPhaseIon binary, ROT13s and column-concatenates it into 18 two-char pairs, Base36-decodes mod 2048 into BIP39 indices, then brute-forces the WORD ORDER, checking each derived address against the prize address.",
  "input": "salphaseion_decrypted.bin; the extracted 18 words [argue, because, bright, capital, charge, chest, either, foam, forward, frost, grant, guilt, initial, juice, lumber, memory, miracle, mountain].",
  "method": "Assemble the 18 words into a BIP39 mnemonic across orderings/derivation paths; derive addresses; compare to 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe.",
  "provenance": "The 1GSMG1 prefix is a documented VANITY prefix (see the vanity-address card) — verified on-chain.",
  "output": "Ordering left \"unsolved\" by the author; structurally cannot succeed.",
  "evidence": "A vanity-prefix key is RANDOM by construction, so it is not derivable from any BIP39 mnemonic; no word ordering can reach the prize address. (Any \"18 valid BIP39 words\" fall out of enough carving — a false signal.)",
  "outcome": "verified-fail",
  "insight": "BIP39 extraction is structurally doomed for a vanity-prefix prize key; the kit never claims a solve.",
  "links": [
   {
    "label": "GitHub — gsmgio_puzzle_kit",
    "href": "https://github.com/bidcoinauction/gsmgio_puzzle_kit"
   }
  ]
 },
 {
  "id": "web-4f7a1e-fabrication-cluster",
  "phase": "salphaseion",
  "category": "Fabrications / debunk",
  "title": "The \"4f7a1e → 103×103 → Half & Better Half\" solution family is a fabrication cluster — every derived key refuted on-chain",
  "who": "community",
  "author": "community",
  "date": "2026",
  "dateApprox": true,
  "source": "GitHub issues #28/#32/#38/#68/#69/#72/#80/#81/#84/#88/#91/#92/#94/#97 + bitcointalk 5532424 + Wayback",
  "sourceQuote": "1327 bytes → 103×103 matrix → Base-38 → Half (32) + Better Half (32) private keys",
  "history": "A 2025–2026 web-wide cluster of \"solutions\" (GitHub, bitcointalk, Wayback) all descend from ONE fictitious artifact: a 1327-byte \"cosmic decrypt\" with SHA256 4f7a1e4e…c081 (the fake \"4f7a1e page\"). From it, various posts derive a 103×103 bit matrix, Base-38 decode, and two \"Half / Better Half\" private keys — and several escalate to prize-diversion scams and fake CTF flags.",
  "input": "The two posted keys 0423d9115a1dc756d5d08d2de880ab508bd4745fc97709f4fcb513f2cb8fcc35 and 48cc46e66bdd36b09ae344552f606a761f9d90681f20dfefe2b43db18b623971; posted WIFs (disbee00 5KFoZe…, kaibuzz0 5Kb8k…, bare 5HpHag…=privkey 1).",
  "method": "Derive P2PKH (compressed + uncompressed) from every posted key/WIF and compare to the prize address; check the prize on-chain.",
  "provenance": "Derived in-harness with node:crypto secp256k1 (validated against the canonical privkey=1 → 1EHNa6Q… result).",
  "output": "HALF → 15E3pcDDXSKhvi3CLVhRTHEgd8dbVKvSZg / 1JG648yaB7Wp2dpUfcZoRSD4q35oq47vCu ; BETTER-HALF → 1FhbJnrdq1FmeiXrpTqnpQ8jvYV7naze96 / 145ZQ9siLrsXBKf465wjdyQYAP5dRwhRhQ ; disbee00 → 1Gc3DN94M7rMYj5MpLtWW3sucriaCWFd7y ; SovereignKey → 1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj ; bare 5HpHag → 1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm. NONE is the prize 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe.",
  "evidence": "The real cosmic blob is 1328 bytes (83 AES blocks) with first ciphertext byte 0xd3 — there is NO 1327-byte \"4f7a1e\" decrypt. The prize address is unspent/unclaimed on-chain, so every \"funded/spent Half & Better Half\" claim is false by construction. Extends the existing 103×103 debunk to the full web cluster.",
  "outcome": "verified-fail",
  "insight": "A large, self-consistent body of \"GSMG solved\" content is fabricated from one fake decrypt; all derived keys map to non-prize (and one to the privkey=1 decoy). Treat any 4f7a1e / 103×103 / Half-Better-Half key as a hoax.",
  "links": [
   {
    "label": "bitcointalk 5532424",
    "href": "https://bitcointalk.org/index.php?topic=5532424.0"
   },
   {
    "label": "Existing 103×103 debunk (this catalog)",
    "href": "#/tried?id=cosmic-1327-byte-blob-103x103-matrix"
   }
  ]
 },
 {
  "id": "community-interleave-dbbi-faed-by-matrixsumlist",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number",
  "title": "matrixsumlist as an instruction to intertwine dbbi & faed before decoding",
  "who": "community",
  "author": "id:1690548820",
  "date": "2024-02-21",
  "time": "06:41 UTC",
  "source": "Telegram — GSMG Puzzle Solvers, msg #21241",
  "sourceQuote": "im 100% sure that matrixsumlist is an instruction on how to intertwine dbbi and faed before it decrypts like cfobfdhgdobdgooiigdocdaoofidh",
  "history": "A community reading of 'matrixsumlist' not as a value but as a WEAVING instruction: interleave the two undecoded a–i blocks dbbi (91) and faed (570) into one string — driven by the row/column sums — and only then run the confirmed field-decode, expecting a readable chunk like the sibling 'thispassword' block (cfob…).",
  "input": "dbbi (91 a–i symbols) and faed (570), and the genesis row-sums [6,10,8,7,6,6,5,4,9,9,7,8,7,9] / col-sums as the weave sizes.",
  "method": "Interleave dbbi & faed several principled ways (alternate char-by-char both orders; concatenate both orders; chunk-weave taking row-sum / col-sum letters alternately) → run the confirmed a–i field-decode (letters→digits a=1..i=9 → big integer → hex → ASCII) on the merged string → score printable ratio + a theme regex (via research/lib/gsmg.mjs).",
  "provenance": "dbbi and faed are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the weave sizes are the genesis row/column sums from content/matrix.js; the interpretation is from msg #21241.",
  "output": "7 interleave variants → 0 readable, 0 thematic (best printable ratio 0.415, garbage).",
  "evidence": "Byte-exact field-decode (verified to reproduce the sibling tokens thispassword/lastwordsbeforearchichoice). No dbbi+faed weaving field-decodes to text.",
  "outcome": "verified-fail",
  "insight": "Reading matrixsumlist as a weave instruction for dbbi+faed does not produce a decodable chunk — one more dbbi/faed decode reading closed.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "community-matrixsumlist-from-fefefe-room101",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "matrixsumlist read starting from the #fefefe 'room 101' square (with 4 re-inserted zeros) = a 59-digit decimal",
  "who": "community",
  "author": "@janusz_baran",
  "date": "2023-02-02",
  "time": "05:18 UTC",
  "source": "Telegram — GSMG Puzzle Solvers, msg #8434",
  "sourceQuote": "just start checking matrix from 101 room, you need to start from here NEO, room is fefefe and you will have sumlist … 40585734329412479690520338541901772425587069158131163878976. in the first phase, four zeros were omitted from the matrix",
  "history": "A community proposal that 'matrixsumlist' is obtained by reading/summing the genesis matrix STARTING at the #fefefe cell (the Matrix 'room 101'), with four zeros re-inserted that were 'omitted' in Phase 1 — yielding one specific 59-digit decimal.",
  "input": "The genesis grid (content/matrix.js), the #fefefe cell at [row 7, col 4] as the start point, and the asserted value 40585734329412479690520338541901772425587069158131163878976.",
  "method": "Take the asserted decimal (and sha256hex of it) as the openssl `enc -aes-256-cbc -md sha256` passphrase against cosmic / salph_inner / p32_trailing, and slot it in as the matrixsumlist ingredient of the cosmic combine. A readable/WIF decrypt would be the solve.",
  "provenance": "The #fefefe cell and grid come from content/matrix.js (pixel-verified against puzzle.png); the reading rule and the 59-digit value are from @janusz_baran's msg #8434.",
  "output": "The value (literal + sha256hex) on all three open blobs → 6 tests → 0 valid padding, 0 readable.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 (research/lib/gsmg.mjs).",
  "outcome": "verified-fail",
  "insight": "The 'read matrixsumlist from the #fefefe room 101 with four re-inserted zeros' value does not key any blob — one more matrixsumlist byte-form ruled out.",
  "links": [
   {
    "label": "Walkthrough — genesis grid & #fefefe cell",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "community-yellow-plane-reversed-not-prime",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "Yellow colour-plane as a 196-bit array, reversed + bitwise-NOT → a 60-digit prime as yellowblueprimes",
  "who": "community",
  "author": "@barrystyle",
  "date": "2023-12-12",
  "time": "16:57 UTC",
  "source": "Telegram — GSMG Puzzle Solvers, msg #17348 (with #14035)",
  "sourceQuote": "100433436204244105573859228564110291168344943733122168512511 or ffffdfffffff7ffefffffbfff7ffeeffdffffffffffffdfff … thats off one of the colours … prime number right off the bat",
  "history": "A community derivation of yellowblueprimes: parse the yellow colour plane of the genesis image as a left-to-right 196-bit array, reverse the bitstream and apply bitwise-NOT, read as a big integer — which comes out prime (100433436204244105573859228564110291168344943733122168512511 = hex ffffdfffffff7ffefffffbfff7ffeeffdffffffffffffdfff).",
  "input": "The 9 yellow cells of the genesis grid (content/matrix.js) as a 196-bit plane, and the asserted prime 100433436204244105573859228564110291168344943733122168512511.",
  "method": "Take the asserted value (and its hex form, and sha256hex of each) as the openssl aes-256-cbc -md sha256 passphrase against cosmic / salph_inner / p32_trailing, and as a candidate yellowblueprimes ingredient. A readable/WIF decrypt would be the solve.",
  "provenance": "The yellow-cell positions come from content/matrix.js (pixel-verified against puzzle.png); the reverse+NOT rule and the prime value are from @barrystyle's msgs #17348/#14035.",
  "output": "The value + hex form (literal + sha256hex) on all three open blobs → 12 tests → 0 valid padding, 0 readable.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 (research/lib/gsmg.mjs).",
  "outcome": "verified-fail",
  "insight": "The reversed+NOT yellow-plane prime does not key any blob — one more yellowblueprimes derivation ruled out; yellowblueprimes stays unverifiable without a cosmic oracle.",
  "links": [
   {
    "label": "Walkthrough — genesis colored cells",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — cosmic ingredients",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "community-yellowblueprimes-color-inversion-or",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "Yin-yang color-inversion + OR with inverse-#fefefe → the 'harmonic primes' 69119 / 16382137 as yellowblueprimes",
  "who": "community",
  "author": "@janusz_baran",
  "date": "2023-11-26",
  "time": "22:10 UTC",
  "source": "Telegram — GSMG Puzzle Solvers group, msg #16869 (with follow-up #16889, 2023-11-27 06:07 UTC)",
  "sourceQuote": "Night turns into day. Yellow into blue. Reverse the colors. Yellow will become blue with a value of 000dff. Perform OR operations using the inverse of Fefefe (010101). The result will be Harmonic Primes 69119. … inverse it. yin yang … invert, invert linear, invert values. later use OR and you get prime numbers … 16382137, 69119 or maybe for AND 257.",
  "history": "One of many community attempts to DERIVE the unknown 'yellowblueprimes' cosmic ingredient from the genesis (bunny) image's colored cells. @janusz_baran proposed a yin-yang color-inversion: swap yellow↔blue, set the new colour to 0x000dff, then bitwise-OR each colored cell with the inverse of the #fefefe cell (0x010101), claiming the result is a prime (69119, or 16382137; 257 under AND).",
  "input": "The 24 colored cells of the genesis grid (15 blue + 9 yellow, from content/matrix.js), the single #fefefe cell at [row 7, col 4], and the asserted candidate primes 69119, 16382137 and 257.",
  "method": "Reproduce the colour-inversion (yin-yang) transform, OR/AND each colored cell with the inverse of #fefefe, and take the asserted 'harmonic primes'. Then test each value — 69119, 16382137, 257 — as the openssl `enc -aes-256-cbc -md sha256` passphrase (literal and sha256hex) against cosmic, salph_inner and p32_trailing (a readable/WIF decrypt would be the solve), via the byte-exact harness in research/lib/gsmg.mjs.",
  "provenance": "Colored-cell positions and the #fefefe cell come from the genesis image (content/matrix.js, re-verified pixel-exact against puzzle.png). The transform, the colour value 0x000dff, the inverse-#fefefe 0x010101 and the three candidate primes are all from @janusz_baran's messages #16869/#16889. The blobs come from ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "output": "69119, 16382137 and 257 (each literal + sha256hex) on all three open blobs → 18 tests → 0 valid padding, 0 readable. The colour-inversion 'harmonic primes' do not key any blob.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 (research/lib/gsmg.mjs). Provenance: Telegram msg #16869 (2023-11-26 22:10:44 UTC) + #16889 (2023-11-27 06:07:02 UTC), sender @janusz_baran.",
  "outcome": "verified-fail",
  "insight": "The yin-yang colour-inversion + OR/AND-with-inverse-#fefefe derivation yields 'primes' (69119/16382137/257) that open none of the blobs — one more community yellowblueprimes derivation ruled out. yellowblueprimes remains unverifiable in isolation (cosmic has no partial oracle).",
  "links": [
   {
    "label": "Walkthrough — genesis grid & colored cells",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — cosmic ingredients",
    "href": "#/reference"
   }
  ],
  "image": "assets/walkthrough/community-images/rabbit-grid-yellow-blue-swapped.png",
  "imageAlt": "followthewhiterabbit genesis grid with yellow and blue colours swapped, rabbit visible in the centre",
  "imageCaption": "Community diagram (Telegram — id:5260693904, 2023-11-26, msg #16870): the followthewhiterabbit genesis grid with yellow and blue swapped — the 'Night turns into day. Yellow into blue. Reverse the colors.' reading this card's colour-inversion (yin-yang) transform reproduces."
 },
 {
  "id": "engine-p32-board-as-data",
  "phase": "architect",
  "category": "engine — p32_trailing key",
  "title": "The Phase-2 chess board used as DATA does not key the p32_trailing blob",
  "who": "this project",
  "date": "2026-07-10",
  "history": "Phase-3.2's chess clue ('a fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen') back-references the Phase-2 chess board. Its phrase-hash, VIC-alphabet, and VIC-checkerboard readings were already closed. The one flagged-untried reading was the board POSITION used as raw DATA — only the FEN *string* had ever been hashed (for Phase-2).",
  "input": "The CONFIRMED Phase-2 FEN board field B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 (20 occupied squares).",
  "method": "Parsed the FEN into 15 principled key constructions — occupied-square algebraic list (FEN order + sorted), (file,rank) coordinate-number string, board-without-slashes, upper-cased list, both kings' squares, the moved piece (c6/Rc6/rookc6), a 64-bit occupancy bitmask c182045454929228 (hex/dec/0x-prefixed), occupied-count 20, board-width 8. Each tested (literal + sha256hex) on p32_trailing / salph_inner / cosmic via byte-exact AES-256-CBC / EVP-SHA256.",
  "output": "90 tests → 3 chance valid-paddings (ratios 0.30–0.37, garbage — far below the readable bar), 0 readable hits. FOLLOW-UP (2026-07-13, attempt 0155): the CONSTRUCTED-BOARD reading was also tested — the raw FEN STRING (not just board-as-data) of a family of boards: the confirmed post-buddhist board, the original pre-buddhist board (…6R1…w…), horizontal/vertical flips, 180-rotation, transpose, and minimal 'sad' king(+queen) boards — × {raw, sha256, sha256², + Phase-3.2-answer concat} × case/space/suffix variants = 126 distinct FENs, 1260 decrypts on p32_trailing + cosmic → 4 chance valid-pads, 0 flags (no readable / WIF / two-key / prize-address).",
  "evidence": "Byte-exact harness (research/lib/gsmg.mjs); FEN parse self-verified (20 occupied squares match the documented count); the constructed-board sweep is scratchpad r46 with the KAT-gated address/self-auth/WIF detector. No board-as-data OR board-as-FEN-string construction yields a readable/keyed plaintext on any blob.",
  "outcome": "verified-fail",
  "insight": "Using the confirmed Phase-2 chess board — as raw DATA (coordinates, occupancy bitmask, king squares, moved-piece) OR as a raw FEN STRING of the board and its principled CONSTRUCTIONS (pre/post-buddhist, flips, 180-rotation, transpose, minimal king+queen 'sad' boards, ±Phase-3.2 concat) — does not key p32_trailing or cosmic. This closes the repo's #1 open lead in its natural/logic-pinned forms (a multi-agent diverse-lens reframe surfaced 'construct the sad board' as the sole genuinely-untried survivor; verifying it in-harness returns null). What remains is only an UNBOUNDED blind board search: the sad-board clue pins no exact squares and the referenced board has no queen, so an exact intended position — if one exists — needs a genuinely new creator datum, not more sweeping.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-10",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "engine-nihilist-matrix-sumlist-combine",
  "phase": "salphaseion",
  "category": "engine — cosmic combine",
  "title": "'matrixsumlist' as a Nihilist cipher (Polybius MATRIX + key SUMLIST) does not key cosmic",
  "who": "this project",
  "date": "2026-07-10",
  "history": "A community image reads 'matrixsumlist' as a Nihilist cipher instruction — a Polybius square keyed MATRIX with Nihilist key SUMLIST — rather than a literal value. This tests that reading as the endgame combine.",
  "input": "Polybius square (keyword MATRIX, I/J merged) + Nihilist key SUMLIST; 7 thematic base strings (yinyang, yellowblueprimes, the VIC sentence, the 4-label master-hint string, half-and-better-half, cosmic-duality).",
  "method": "Nihilist-encipher each base (Polybius-code each letter to a 2-digit number, add the repeating SUMLIST key) → number string; test (literal + sha256hex) on cosmic / salph_inner / p32_trailing.",
  "output": "42 tests → 0 readable hits. (nihilist('YINYANG','SUMLIST')=99665289278645.)",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256; the Nihilist-enciphered strings produce no readable plaintext on any blob.",
  "outcome": "verified-fail",
  "insight": "Reading 'matrixsumlist' as a Nihilist cipher (MATRIX Polybius + SUMLIST key) rather than a literal value does not produce a cosmic or 80-byte-blob key from the natural thematic bases — one more combine reading closed.",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-10",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "engine-cipher-combine-beaufort-thematrixhasyou",
  "phase": "salphaseion",
  "category": "engine — cosmic combine",
  "title": "Cipher combine (Beaufort/Vigenère + THEMATRIXHASYOU) does not key cosmic/the blobs",
  "who": "this project",
  "date": "2026-07-10",
  "history": "The Architect speech names '16 encryptions', suggesting the endgame combine may be cipher-based, not a single hash. The puzzle's one confirmed cipher motif is Beaufort keyed THEMATRIXHASYOU (phase 3.2). This tests that construction on the endgame bases.",
  "input": "6 thematic base strings (the 4-label master-hint string; the VIC sentence 'privatekeysbelongtohalfandbetterhalf'; 'returntothesourcecodesreinsertingtheprimebasics'; lastwordsbeforearchichoice; yinyang; halfandbetterhalf).",
  "method": "Vigenère and Beaufort encipher each base with key THEMATRIXHASYOU; test the ciphertext (upper/lower, literal + sha256hex) on cosmic / salph_inner / p32_trailing.",
  "output": "144 tests → 0 readable hits.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256; the confirmed Beaufort/Vigenère key produces no readable plaintext on any blob from these bases.",
  "outcome": "verified-fail",
  "insight": "The puzzle's own confirmed cipher (Beaufort/THEMATRIXHASYOU) does not, on the natural thematic bases, produce a cosmic or 80-byte-blob key. Combined with the closed hash-combine space, the endgame resists both the hash and the confirmed-cipher combine families — the remaining cipher space is astronomically large and, without a partial oracle, not blindly searchable. This maps the wall precisely: the missing piece is a specific construction (or a corrected ingredient) that no amount of undirected search will surface.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-10",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "engine-architect-speech-endgame-process",
  "phase": "architect",
  "category": "engine — creator intel",
  "title": "The Architect speech is the creator's endgame process description (brute-force sanctioned; 7 passwords)",
  "who": "this project",
  "date": "2026-07-10",
  "history": "Re-reading the confirmed phase-3.2 Beaufort plaintext (the Architect monologue) as OPERATIONAL instructions rather than flavour, and re-checking the unresolved cosmic ingredient #3.",
  "input": "The full phase-3.2 Architect speech (creator-authored, ✅ confirmed) and the cosmic ingredient labels.",
  "method": "Read the speech for endgame instructions; test the alternative reading of ingredient #3 = lastwordsbeforearchichoice as the actual last speech words ('…ciao bella o' / 'return to the source codes…') rather than the literal token, across cosmic + the 80-byte blobs.",
  "output": "Verbatim endgame instruction found: 'RETURN TO THE SOURCE CODES … REINSERTING THE PRIME BASICS … SELECT FROM OVER 23 CIPHERS, 16 ENCRYPTIONS AND/OR 7 INTERTWINED PASSWORDS … NOTE THAT ALSO BRUTE FORCING MIGHT BE REQUIRED.' The speech-span reading of ingredient #3 was tested (189 tests) → 0 readable hits.",
  "evidence": "docs/WALKTHROUGH.md §3.2 (the confirmed Beaufort output); the 189-test recipe sweep of the speech-span #3 reading was null.",
  "outcome": "verified-insight",
  "insight": "The creator himself SANCTIONS brute-force ('brute forcing might be required') and frames the endgame as a SELECT-from-many-ciphers/encryptions/passwords process — not a single elegant hash. The number 7 ('seven intertwined passwords') echoes phase-2's 7-answer concatenation, suggesting the final key may be a 7-part structure, and 'reinserting the prime basics' narrates the prime/zero-out operation on a 'source' string. Ingredient #3's exact value (literal token vs the speech span) remains unresolved; the speech-span reading does not open the blobs. TESTED (the '7-part structure' musing): the literal 'seven intertwined passwords' read as a character-braid (round-robin interleave) of the 7 CONFIRMED Phase-2 parts [causality · Safenet · Luna · HSM · 11110 · 0x-coinbase-hex · full chess FEN] — parts byte-verified against the real phase-3 key 1a57c572…30d5 — keys NEITHER self-verifying oracle across ALL 7!=5040 orderings (20,160 tests, 72 chance valid-pads, 0 readable; @DaneelOlivaw). So the reuse-the-Phase-2-seven, char-braided reading is closed on both oracles; a 7-part endgame password would have to be a DIFFERENT seven and/or a different 'intertwine'.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-10",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "engine-nested-detection-no-partial-oracle",
  "phase": "salphaseion",
  "category": "engine — blob structure",
  "title": "No multi-layer / partial oracle: nested-blob & readable-intermediate detection across all determinable keys",
  "who": "this project",
  "date": "2026-07-10",
  "history": "Community key tests only checked for READABLE plaintext. But if a blob were multi-layer, the correct outer key would produce an inner Salted__ blob (binary, low printable ratio) that a readability check misses — and a sequential decrypt could produce a readable intermediate (a partial oracle). Neither had been checked.",
  "input": "cosmic and the two 80-byte blobs; all determinable keys — the soup tokens (matrixsumlist, enter, lastwordsbeforearchichoice, thispassword, shabef, anstoo, 'our first hint is your last command'), the matrixsumlist byte-forms, the chain keys, the VIC sentence, and principled token combines.",
  "method": "Decrypt each blob with each key (literal + sha256hex) and flag (a) a nested inner blob (plaintext begins 'Salted__'/'U2FsdGVk') or (b) a readable intermediate (printable ratio ≥ 0.7).",
  "output": "192 attempts → 0 nested inner blobs, 0 readable intermediates.  ·  [merged: “cosmic is not a nested / multi-layer AES with the candidate ingredient keys”] 92 attempts → no nested Salted__ blob, no readable intermediate, 0 readable hits.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256; the nested-blob signature and any ratio≥0.7 intermediate are absent for every determinable key on every blob.",
  "outcome": "verified-fail",
  "insight": "There is no hidden multi-layer outer-crack or sequential-decrypt partial oracle reachable from the known determinable keys — closing the possibility that the community 'missed' a nested foothold by only checking for readable text. The blobs' resistance is genuine, not a detection gap; the endgame's lack of a partial oracle is confirmed.",
  "author": "@DaneelOlivaw",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-10"
 },
 {
  "id": "engine-false-creator-hints-ruled-out",
  "phase": "salphaseion",
  "category": "engine — provenance / false-lead rulings",
  "title": "Three widely-cited 'creator hints' ruled out by decode/context",
  "who": "this project",
  "date": "2026-07-09",
  "history": "A full read of the creator's messages surfaced three items repeatedly treated as endgame hints that do not survive scrutiny.",
  "input": "The creator's 2026-01-01 binary message; the 2020 'Only -41,-17 matters' line; the 'last number of pi' and the {30},{2},{77} 'private key' lines.",
  "method": "Decode the binary (standard 8-bit ASCII); read each line in its reply context; check the numeric/temporal claims.",
  "output": "2026-01-01 binary decodes to 'Happy new year! Make the best of everything. Oh, and here's a \"tiny hint\" <3.' — a joke, no content. '-41,-17' is a Decentraland game parcel coordinate (reply context). 'last number of pi' is banter; {30},{2},{77} is a Cyberpunk-2077 joke a community member posted.",
  "evidence": "Binary msg decodes to 77 ASCII bytes (the greeting); '-41,-17' reply-chain concerns the Decentraland parcel; {30},{2},{77} is community (a solver mimicking the {1},{4},{21} format), not the creator.",
  "outcome": "verified-insight",
  "insight": "These three are NOT endgame hints — decoding/context rules them out, sparing solvers the dead ends.",
  "provenance": "Canonical puzzle data — the genesis grid (content/matrix.js), the soup blocks, and the Salted__ blobs in ciphertexts/ — per docs/WALKTHROUGH.md.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-09",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "engine-posted-key-material-not-gsmg",
  "phase": "salphaseion",
  "category": "engine — on-chain / key-material verification",
  "title": "No posted or puzzle-derived private key controls a GSMG address — posted WIFs/mnemonic, brainwallet phrases, dbbi/faed bytes, and split-key halves all checked (KAT-gated secp256k1), zero matches",
  "who": "this project",
  "date": "2026-07-09",
  "history": "The corpus contains several posted private keys, a 24-word BIP39 mnemonic (from a faed→btcseed decode with a claimed-valid checksum), and addresses. Each was address-derived and compared to the prize wallets.",
  "input": "A 24-word BIP39 mnemonic; WIFs 5Jpc…, 5K2JB… (msg 4132), L4Jay…; address 145ZQ…. Targets: prize 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe, peeled 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa.",
  "method": "KAT-gated secp256k1 address derivation (P2PKH compressed+uncompressed; BIP44/49/84 + legacy paths for the mnemonic); on-chain balance lookup via a public explorer.",
  "output": "0 of 13 derived addresses match a GSMG wallet. The mnemonic's checksum is valid but controls nothing GSMG. WIF 5K2JB… derives to 1GSMG1JWgqeum… — a 1GSMG1J-prefix VANITY DECOY (0 tx on-chain, ~1/38B by chance so deliberately crafted).  ·  [merged: “Brainwallet sweep: sha256(puzzle phrase) used directly as a Bitcoin private key vs the three known GSMG addresses”] ZERO matches across all 86,310 derivations. No puzzle-vocabulary phrase hashes to any of the three GSMG addresses.  ·  [merged: “dbbi / faed decoded bytes tried directly as the secp256k1 private key”] No match for any of the ~17 scalar forms. dbbi/faed bytes are NOT the private key (and separately NOT a valid key for any of the AES blobs).  ·  [merged: “Split-key 'HALF and BETTER HALF' combinations as a private key vs the GSMG addresses”] ZERO matches across all 1,204 split-key derivations. The 'half + better half' combination does not reconstruct any GSMG address key.",
  "evidence": "Derivation KAT: privkey=1 → 1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm. On-chain: prize holds 1.2563451 BTC (unclaimed); decoy 1GSMG1JWgqeum… = 0 balance / 0 tx.",
  "outcome": "verified-fail",
  "insight": "No posted key material is the prize key (as expected — the prize address is a vanity address, so its key is random and lives only inside the cosmic blob). The 1GSMG1J 'decoy' WIF is an empty vanity address that merely mimics the prize prefix.",
  "author": "@DaneelOlivaw",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-09"
 },
 {
  "id": "engine-corpus-no-engineered-solution",
  "phase": "salphaseion",
  "category": "engine — corpus audit",
  "title": "Full 57k-message audit: the community corpus contains no author-derived solution",
  "who": "this project",
  "date": "2026-07-09",
  "history": "Every message in the GSMG solvers' Telegram (≈57,000) was read and consolidated by theme, with each finding adversarially re-checked against its cited message ids.",
  "input": "The complete Telegram corpus; themes yellowblueprimes, yinyang, matrixsumlist, dbbi, faed, cosmic-combine, the 80-byte blobs, primes/zero-out.",
  "method": "Parallel theme-mining + independent adversarial verification (skeptics re-read cited ids to drop hallucinations and fix provenance).",
  "output": "Every concrete endgame derivation is a community GUESS — self-refuted by its own author or already closed. The creator never supplied a value or method for any endgame token.",
  "evidence": "≈1,400 findings across 15 themes verified against msg ids; creator (Jrk) statements confirm only that primes matter and 'some characters need to be zeroed out' — no value.",
  "outcome": "verified-insight",
  "insight": "The endgame is not solvable by re-running community material; it needs a genuinely new, engineered derivation. All prior concrete attempts are guesswork.",
  "provenance": "Canonical puzzle data — the genesis grid (content/matrix.js), the soup blocks, and the Salted__ blobs in ciphertexts/ — per docs/WALKTHROUGH.md.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "source": "Independent research — Hosterjack (@DaneelOlivaw), 2026-07-09",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "ledger-image-forensics-genesis-png",
  "phase": "genesis",
  "category": "image & QR forensics",
  "title": "Image forensics on the genesis PNG",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #4876",
  "input": "The genesis img_puzzle.png. Operations: palette histogram, per-channel LSB extraction, trailing-data scan past the IEND marker, location of the #FEFEFE cell.",
  "method": "Ran standard steganography forensics on the genesis image: palette analysis, per-channel least-significant-bit extraction, scanning for data appended after the PNG's IEND end marker, and locating the off-white #FEFEFE planted cell.",
  "output": "Fully accounted for; no recoverable stego. (Caveat: the copy in hand is recompressed -- a pristine original PNG remains the only open possibility.)",
  "outcome": "verified-insight",
  "insight": "Standard stego forensics finds no hidden payload in the (recompressed) genesis PNG -- every element is accounted for, leaving only a pristine original PNG as an untested edge case.",
  "author": "@x7x7x7x6",
  "date": "2020-10-25",
  "dateApprox": false,
  "time": "19:51 UTC",
  "sourceQuote": "as for the \"Roses are white...\" hint, i think its not about steganography — i checked the IDAT chunk byte-by-byte and there is no payload. what we know is that one square has FEFEFE color, and that's all.",
  "provenance": "The genesis image puzzle.png (assets/walkthrough/); the PNG IDAT byte-analysis is @x7x7x7x6's.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "genesis-qr-standard-reproduced-from-url",
  "phase": "genesis",
  "category": "image & QR forensics",
  "title": "QR reproduced byte-exact from the prize-address URL (Byte/UTF-8/Auto mask/7% EC) — no hidden bits",
  "who": "community",
  "source": "Community cross-check (a solver re-encoded the prize-address URL and compared the QR module-for-module); catalogued in docs/ATTEMPTS.md",
  "input": "The QR code in puzzle.png and the string https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe. Standard encoder config: Byte mode, UTF-8, mask = Auto, error-correction level L (7%).",
  "method": "Re-encoded the URL with a standard QR encoder using Byte/UTF-8/Auto-mask/level-L and compared the resulting modules against the QR in the image — the data bits, the Reed-Solomon error-correction (redundancy) bits, the format/version 'service' bits, and the chosen mask — module for module. (Independently re-derived here: that URL at level-L produces a version-4, 33x33 QR.)",
  "output": "The puzzle's QR is a standard version-4 (33x33) Byte-mode, level-L code that reproduces from the URL with NOT A SINGLE BIT swapped — every data, error-correction and format bit matches the textbook encoding. Nothing is smuggled into the redundancy, the mask, or the format bits.",
  "outcome": "verified-insight",
  "insight": "The genesis QR is a perfectly standard QR of the blockchain.com prize-address URL (Byte/UTF-8/Auto-mask/EC-level-L, version 4) — byte-exactly reproducible, so its error-correction and format/service bits carry zero hidden data. This definitively closes the 'is there steganography in the QR' question, hardening the plain-decode result: the QR is just a convenience link to the prize address, not a puzzle input.",
  "author": "The Community",
  "provenance": "On-chain data for the GSMG prize (1GSMG1JC9…) and split-off (17ucy1K9…) addresses via blockstream / the Wayback CDX; posted key material from the Telegram group.",
  "links": [
   {
    "label": "Prize address",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ]
 },
 {
  "id": "genesis-fefefe-cell-located-7-4",
  "phase": "genesis",
  "category": "image & QR forensics",
  "title": "The #FEFEFE marked cell LOCATED at (row 7, col 4) [0-based; = row 8, col 5 from 1], a dual-prime index",
  "who": "this project",
  "source": "this session (image forensics on img_puzzle.png)",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Original genesis image img_puzzle.png (1048x1556). Community claim (Telegram, 2021-03-01, from a solver -- NOT the creator; Jrk's only reply that day was 'Ancient spelling, one of the many many typos'): '104 is the fefefe square. fefefe is 101010.' Palette scan for an off-white cell rendered 254,254,254 instead of 255,255,255.",
  "method": "Ran a pixel-by-pixel palette histogram and per-cell color scan over the 14x14 grid to find the single planted off-white cell. Computed its spiral index and row-major index to test the creator's '104' / 'array indexing' claim. The cell's grid value and indices were then checked against dbbi/faed/matrixsumlist as a possible 'zero-out' pointer.",
  "output": "Exactly ONE cell is 254,254,254 (vs 255,255,255 everywhere else): grid (row 7, col 4) — counting rows/cols from 0; that is row 8, col 5 counting from 1 — grid value 0 (white). Its spiral index = 163 (PRIME) counting from 0 / 164 counting from 1; row-major index = 102 (0-based) / 103 (1-based). It sits at a DUAL-PRIME index, though the two primes come from DIFFERENT origins: spiral 163 (counted from 0) and row-major 103 (counted from 1) are both prime. Spiral 164 is not divisible by 8, so it tags a single BIT (the 4th bit of URL char 21 = 'n', counting chars from 1), unlike blue/yellow which tag whole chars. Note: row-major 104 (1-based) is the adjacent cell (row 7, col 5) [0-based; = row 8, col 6 from 1] — the creator's '104' may intend that neighbor (verify on a pristine PNG).",
  "outcome": "verified-insight",
  "insight": "The planted #FEFEFE cell is exactly at grid (row 7, col 4) counting from 0 (= row 8, col 5 counting from 1), a dual-prime index — spiral 163 (0-based) and row-major 103 (1-based) are both prime — tagging a single bit rather than a whole character; concretely on-theme with 'the prime part' though no decode follows from it yet.",
  "provenance": "The genesis 14×14 grid and its colored / #fefefe cells (content/matrix.js, re-verified pixel-exact against assets/walkthrough/puzzle.png).",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "genesis-qr-decoded-blockchain-link",
  "phase": "genesis",
  "category": "image & QR forensics",
  "title": "The genesis QR decodes to the prize-address blockchain.com URL — nothing hidden",
  "who": "this project",
  "source": "this session (image forensics on img_puzzle.png)",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The square QR code in the bottom-left of img_puzzle.png, flush to the left edge (which had defeated earlier crops/recompressed copies).",
  "method": "Decoded the QR from the full-edge image (earlier attempts failed because the code is flush to the left margin and got cropped). Pixel analysis also re-checked the palette for any hidden third color.",
  "output": "The QR decodes to https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe — a public blockchain-explorer link to the prize address, with no extra payload. Palette shows only white/black/blue/yellow plus the red border (no hidden third color). The genesis image is fully accounted for.  ·  [merged: “Direct decode of the pristine QR confirms it holds only the prize-address URL — nothing hidden”] One QRCODE, payload = https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe (sha256 ac3ff50c…). No hidden payload, no second symbol, no alternate string. As a key: 36 tests → 0 valid padding, 0 readable.",
  "outcome": "verified-insight",
  "insight": "The genesis QR code resolves to a plain blockchain.com link to the prize address (no hidden door), closing the long-open question of whether the QR carried a secret payload.",
  "author": "@DaneelOlivaw",
  "provenance": "On-chain data for the GSMG prize (1GSMG1JC9…) and split-off (17ucy1K9…) addresses via blockstream / the Wayback CDX; posted key material from the Telegram group.",
  "links": [
   {
    "label": "Prize address",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ]
 },
 {
  "id": "yellowblue-indices-oeis-a007522-primes",
  "phase": "genesis",
  "category": "matrix re-read",
  "title": "Blue/yellow colored cells sit on the ≡−1 (mod 8) spiral positions; A007522 (primes ≡ −1 mod 8) is their prime subset — incl. 103",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #49487",
  "date": "2025-09-23",
  "dateApprox": false,
  "input": "The genesis grid's blue + yellow colored-cell indices vs OEIS A007522 = primes of the form 8n+7 (primes congruent to -1 mod 8): 7, 23, 31, 47, 71, 79, 103, 127, 151, 167, 191, 199, 223, 239, ... (14 of them below 256).",
  "method": "Compared the prime indices of the blue/yellow squares against named OEIS prime sequences; A007522 (8n+7 primes) lines up -- the first 11 primes of A007522 are reported to match the primes at the blue+yellow square indices.",
  "output": "A concrete, NAMED candidate for the 'yellowblueprimes' prime set: A007522 (primes = -1 mod 8), with 49 (=7x7) primes in range, 14 below 256 -- and notably it CONTAINS 103 (a prime that also surfaces in the -- separately debunked -- community '103x103 reshape' claim about the endgame blob; see cosmic-1327-byte-blob-103x103-matrix). A specific, checkable prime list to test against dbbi/faed and the genesis Y/B cells, where prior public work used only the small primes {2,3,5,7}.",
  "outcome": "unverified",
  "insight": "VERIFIED structure (this project): the 24 colored cells sit at 0-based spiral indices {7,15,23,…,191} — every 8th position, i.e. ≡ −1 (mod 8), the URL byte-boundaries. A007522 (primes ≡ 7 mod 8) is exactly the PRIME SUBSET of those positions: 11 within the 196-cell grid (7,23,31,47,71,79,103,127,151,167,191) and 14 below 256 — and it does include 103. CORRECTION: the earlier '49 (=7×7) primes in range' figure is inaccurate (A007522 has 14 below 256, 11 inside the grid). As a standalone key the A007522 values were tested null (see dbbi-zero-out-prime-schemes). Stays UNVERIFIED: like every cosmic ingredient, whether A007522 is the intended 'yellowblueprimes' set can only be confirmed inside the combine (no standalone oracle) — but the positional structure is now confirmed.",
  "author": "id:142464266",
  "time": "13:28 UTC",
  "sourceQuote": "I found a prime list that hasn't been mentioned before, which aligns perfectly with the puzzle. The first 11 primes in this list match the primes found in the indices of the blue + yellow squares. https://oeis.org/A007522",
  "provenance": "Blue + yellow cell indices from the genesis grid (content/matrix.js, pixel-verified against puzzle.png); the A007522 sequence (primes ≡ 7 mod 8) from oeis.org.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "OEIS A007522",
    "href": "https://oeis.org/A007522"
   }
  ]
 },
 {
  "id": "genesis-grid-byte-boundary-pointer",
  "phase": "genesis",
  "category": "matrix structure",
  "title": "Blue/yellow cells sit on byte boundaries — each tags one URL character",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "content/matrix.js: 14x14 grid (196 cells), 15 blue cells, 9 yellow cells, 0 red, plus the explicit 196-entry CCW spiral reading path. URL produced by the spiral = 'gsmg.io/theseedisplanted' (24 chars = 192 bits + 4 trailing spiral cells).",
  "method": "Computed the spiral index of every colored cell and divided by 8. Every single blue and yellow cell lands at spiral position congruent to 7 mod 8 — i.e. exactly on the least-significant bit of one of the 24 URL bytes. This means the coloring is not random decoration but a deliberate pointer: each colored cell tags exactly one whole URL character (charindex = (spiral1)//8). Blue tags 1-indexed char positions {1,2,3,4,6,7,8,11,12,13,14,16,17,20,23}; yellow tags {5,9,10,15,18,19,21,22,24}; together they partition all 24 positions.",
  "output": "Confirmed: 100% of colored cells sit on mod-8 byte boundaries; blue+yellow partition all 24 URL character positions with no overlap and no gap. The placement is a designed char-SELECT mechanism, not noise.",
  "outcome": "verified-insight",
  "insight": "The 15 blue + 9 yellow cells are deliberately placed exactly on URL byte boundaries so each tags one whole URL character, partitioning all 24 positions — a built-in pointer/selection mechanism rather than incidental coloring.",
  "provenance": "The genesis 14×14 grid and its colored / #fefefe cells (content/matrix.js, re-verified pixel-exact against assets/walkthrough/puzzle.png).",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "genesis-colors-equal-url-bit-parity",
  "phase": "genesis",
  "category": "matrix structure",
  "title": "The colored cells are exactly the URL characters' LSB parities — no separate hidden color message",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "source": "this session",
  "date": "2020-05-08",
  "dateApprox": false,
  "input": "Blue cells (15) and yellow cells (9) read in spiral order as a 24-bit stream (blue=1/yellow=0 and the inverse), versus the per-character LSB parity of the 24 URL bytes of 'gsmg.io/theseedisplanted'.",
  "method": "Read the colored cells in spiral order as a standalone 24-bit payload under both polarities (B=1/Y=0 and B=0/Y=1), packed into 3 bytes, and compared bit-for-bit against the LSB parity of each URL character. Re-derived independently 3 times. The goal was to see whether the colors carry an extra hidden message beyond the URL.",
  "output": "The 24-bit color stream is EXACTLY the LSB parities of the URL characters: blue cells sit on 1-bits, yellow on 0-bits. Zero extra information — the colors are fully explained by (and redundant with) the URL.  ·  [merged: “Colored cells as an independent 24-bit message”] They are exactly the LSB parities of the URL characters -- zero extra information.",
  "outcome": "verified-fail",
  "insight": "",
  "authors": [
   "@x7x7x7x6"
  ],
  "time": "17:11 UTC",
  "sourceQuote": "what info can yellow/blue carry? it's 24 bits but they were not chosen arbitrarily by the authors — they could not cipher a message into them since their coloring was dictated by \"gsmg.io/theseedisplanted\".",
  "provenance": "The 24 colored cells of the genesis grid (content/matrix.js) vs the 24 characters of the decoded URL \"gsmg.io/theseedisplanted\".",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "genesis-matrix-cellular-rules-paths",
  "phase": "genesis",
  "category": "matrix structure",
  "title": "Game-of-Life (B1357/S1357) evolution + turtle-path / numerology renderings of the matrix — chaotic noise",
  "who": "community",
  "author": "The Community",
  "source": "dead-end ledger",
  "input": "The 14x14 binary parity bitmap; the matrix evolved under Game-of-Life rule B1357/S1357; a/b-to-direction turtle paths drawn over the grid.",
  "method": "Built the parity bitmap and evolved the matrix generation-by-generation under the '1357' cellular-automaton rule, rendering every state to an image to look for a glyph/message; separately mapped symbols to numpad directions and drew paths. Reasoning: maybe a hidden image or yin-yang glyph emerges from the grid under a rule or path.",
  "output": "Chaotic noise in every generation — no readable state; the turtle path is a connected but meaningless blob explained by direction bias alone. No glyph, no message.  ·  [merged: “Game of Life B1357/S1357 parity bitmap + matrix evolution”] Chaotic noise -- no readable state at any generation.",
  "outcome": "verified-fail",
  "insight": "",
  "authors": [
   "@dgoschmidt"
  ],
  "date": "2025-06-13",
  "dateApprox": false,
  "time": "02:02 UTC",
  "sourceQuote": "Jrk Bgrt (creator), 2024-04-10 14:21: \"1357 blocks to go … survival if 1,3,5 or 7 neighbors alive and birth if 1,3,5 or 7 neighbors alive\" — i.e. a Game-of-Life B1357/S1357 rule (relayed by @dgoschmidt).",
  "provenance": "The genesis 14×14 grid (content/matrix.js) evolved under the B1357/S1357 rule; the rule quote is the CREATOR (Jrk Bgrt = @SoWut), relayed by @dgoschmidt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "genesis-matrix-prime-position-reads",
  "phase": "genesis",
  "category": "matrix structure",
  "title": "Exhaustive re-read of the 14×14 grid (all spiral orientations/polarities + row/col/diagonal + prime spiral positions) — only the URL is text",
  "who": "this project",
  "source": "this session / dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "14x14 grid as a bit stream in spiral order (196 bits). Primes <=196 (44 prime positions). Also all 8 spiral start/direction orientations x 2 bit polarities, plus row-major, column-major and diagonal scans.",
  "method": "Extracted the grid bits at the 44 prime spiral positions as a candidate 'prime basics' source, and separately re-read the whole grid in every spiral orientation/polarity and in row/column/diagonal order, scoring each output for readable text. Reasoning: the creator repeatedly cites 'the prime part' and 'if you know how the array is indexed', so prime-indexed cells or an alternate index order might surface a second message.",
  "output": "Only one reading of the grid is text — the URL. Prime-position bit extraction and every alternate orientation/polarity produced noise. The grid is information-full but holds no hidden second message.  ·  [merged: “Exhaustive re-read of the 14x14 genesis matrix”] Only one reading is text -- the URL gsmg.io/theseedisplanted. The grid is information-full; there is no hidden second message in it.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The genesis 14×14 grid and its colored / #fefefe cells (content/matrix.js, re-verified pixel-exact against assets/walkthrough/puzzle.png).",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "genesis-yellowblueprimes-lens-4156-sweep",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "yellowblueprimes derived from the genesis colored cells / primes — swept alone and inside the cosmic recipe (~4,156 candidates) — 0 opens",
  "who": "this project",
  "source": "this session (lens_ybp.py, lens_attack.py)",
  "date": "2020-01-01",
  "dateApprox": true,
  "input": "A much larger derived-value set built from the genesis matrix: blue/yellow counts (15/9), index-sums, index-concatenations, grid row/col-coordinate sums, spiral-position sums, prime-filtered index subsets and their sums, colored-cell grid-bit reads, URL chars at prime / small-prime positions, URL with non-prime (or prime) positions zeroed out, and paired blue-number+yellow-number combinations (e.g. '159','915'). Combined with matrixsumlist variants ('matrixsumlist', '610876654997879'+'8108108736759668', concatenated form), lastwordsbeforearchichoice, yinyang∈{yinyang,'yin yang'}, seps {'' . space}, and double-sha (shabef) hashing.",
  "method": "Each derived value was tested alone (literal/sha/raw/double/raw-double) on the two 80-byte oracle blobs and cosmic, then folded into the canonical 4-ingredient cosmic key across orders, separators and single vs double sha. Success criterion: printable ratio >0.92 or >=2 dictionary words in the decrypt. This operationalized the 2020 'Yellow has a number and so does Blue' + 'zero out characters' + primes hints into thousands of concrete recipes.",
  "output": "~4,156 distinct candidate strings / ~16,620 key-attempts: every multi-blob 'hit' was chance PKCS7 noise (printable ~0.30-0.49). No clean result; >>> NO CLEAN RESULT <<<. The exact derivation of yellowblueprimes is unsettled ('too many combinations').  ·  [merged: “yellowblueprimes candidate sweep (~89 derived values) vs the blobs”] Zero valid hits. No candidate opened any blob to readable text or produced a valid PKCS7 plaintext above chance. yellowblueprimes value remains unknown.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "genesis-firstpiece-text-keys",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "Genesis 'first piece' strings (URL, grid rows, prime literals) as blob keys",
  "who": "this project",
  "source": "this session (firstpiece.py)",
  "date": "2020-01-01",
  "dateApprox": true,
  "input": "Candidate strings derived from the first puzzle piece: 'gsmg.io/theseedisplanted', 'theseedisplanted', the 14x14 grid rows joined (with/without spaces), the SalPhaseIon page hash 89727c59..., the GSMGIO5BTC...challenge string, 'yellowblueprimes', 'yellow', 'blue', and prime literals '235711131719' / '2357111317192329' / '23571113171923'. Each tested in 6 hashing forms (literal, sha256hex, raw-sha, double-sha, hex-of-hex, raw-of-hex) against salph_inner and p32_trailing.",
  "method": "The 2020 hint says to 'go back to the first puzzle piece', so every concrete string the genesis piece yields was tested as a passphrase on the two instantly-verifiable 80-byte oracle blobs, in all standard key-derivation forms. Success = printable ratio >0.90.",
  "output": "0 hits across all candidates and all 6 hashing forms. No genesis-derived first-piece string is a blob passphrase.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "genesis-matrixsumlist-row-col-sums",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "matrixsumlist = genesis row/col sums — 24 principled byte-forms enumerated; neither the literal word nor any numeric form is a standalone or recipe key",
  "who": "this project",
  "source": "this session (matrix.py)",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "14x14 grid row-sums [6,10,8,7,6,6,5,4,9,9,7,8,7,9] and column-sums [8,10,8,10,8,7,3,6,7,5,9,6,6,8]. Naive concatenations: rows='610876654997879', cols='8108108736759668'.",
  "method": "Computed the genesis row and column sums and concatenated them to produce the literal value of the cosmic ingredient 'matrixsumlist'. Tested this concatenation (and variants) thousands of times as part of the cosmic recipe. Flagged the format as lossy: the value 10 makes '6108...' parse two ways (single-digit vs zero-padded two-digit), so the exact byte-form feeding sha256 is uncertain.",
  "output": "Row/col sums confirmed; the concatenation was hashed thousands of times within the cosmic recipe with 0 hits. The exact byte-format (one-digit vs two-digit, rows-first vs cols-first vs interleaved vs 28-value list) is ambiguous and could alone break an otherwise-correct recipe.  ·  [merged: “matrixsumlist as literal word vs. as the numeric row/col sums”] 0 hits under either the literal-word or the numeric-sums form, across all orders/separators and all 3 blobs.  ·  [merged: “matrixsumlist: the full principled byte-form space enumerated (24 forms) — none is a standalone key”] 24 forms, 144 tests → 0 valid padding, 0 readable hits.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@DaneelOlivaw",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "genesis-yinyang-from-duality",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "yinyang derived from genesis duality / Cosmic Duality book / faed complement",
  "who": "this project",
  "source": "this session (yinyang_cands.py)",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "yinyang candidates: literal forms (yinyang, 'yin yang', YinYang, tao, taiji, taijitu); the faed yin-yang complement map (a<->i, b<->h, c<->g, d<->f, e fixed) applied to the 570-symbol faed block and its digit form; faed binary maps under thresholds 4/5/6 and parity; faed split into two 285-symbol halves; and the genesis blue<->yellow / 0<->1 / black<->white duality, plus the real 'Cosmic Duality' book (Mysteries of the Unknown, yin-yang of two galaxies) as a thematic source.",
  "method": "The creator's '...you'll solve it the same day once you hit a ying yang' makes yinyang the sole bottleneck, with the most on-theme source being the genesis blue/yellow duality and the faed complement. Generated complement/threshold/parity/half candidates and literal/book forms, hashed each (literal/sha/double-sha) and tested against cosmic and the two oracle blobs.",
  "output": "Complement and literal yinyang tests all failed (0 hits). The genesis duality and the book yield no verified yinyang value AS A KEY. GROUNDING (2026-07-13, attempt 0165): the community yinyang guess 95101/10195 IS grounded in the genesis grid's 0/1 duality — the 14×14 grid has EXACTLY 101 ones and 95 zeros (196 cells), so the split is 10195 (ones-zeros) / 95101 (zeros-ones). Consistent: the 101 'on' cells are exactly why every row-sum and col-sum totals 101 (= matrixsumlist).",
  "outcome": "verified-fail",
  "insight": "yinyang = 95101/10195 is now GROUNDED as the genesis grid's binary (0/1) duality split — 101 ones and 95 zeros. This completes the grounding of all FOUR master-hint ingredients from known sources: matrixsumlist (grid row/col sums), yellowblueprimes (grid colored-cell prime spiral-positions), yinyang (grid 0/1 split), and lastwordsbeforearchichoice (the Architect speech). The two 'duality' ingredients (ybp, yinyang) are BOTH genesis-grid quantities. Yet the 4-ingredient combine is dead in every tested form with these exact grounded values — so the wall is DEFINITIVELY the combine OPERATION (or a transform of the values), not unknown ingredient values.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "chain-reproduce-phase2-3-32-byteexact",
  "phase": "architect",
  "category": "solved-chain verification",
  "title": "Reproduced the full phase2 -> phase3 -> phase3.2 AES chain byte-exact with own OpenSSL/EVP harness",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Three repo ciphertext blobs (ciphertexts/phase2.txt, phase3.txt, phase32.txt). Keys: phase2 = sha256hex('causality'); phase3 = the audit key 1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5 (= sha256 of the 7-part Mr-Robot password); phase3.2 = sha256hex('jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple') = 250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c.",
  "method": "Built a standalone Python harness (gsmg.py) that re-implements OpenSSL's `enc -aes-256-cbc -md sha256`: it strips/base64-decodes each blob, reads the 8-byte Salted__ salt, derives key+IV via EVP_BytesToKey with SHA-256 (D1=sha256(pw+salt); Di=sha256(Di-1+pw+salt)), then AES-256-CBC decrypts and validates PKCS7. Ran the known answer-strings (chain.py) for all three stages to confirm each decrypts cleanly and the chain is reproducible outside the original repo tooling.",
  "output": "All three stages decrypt with valid PKCS7 and produce the expected plaintext (phase2 -> Mr-Robot riddle; phase3 -> 7-part-password stage; phase3.2 -> the EBCDIC/Beaufort Architect speech + VIC digit block). Confirms the published solved chain is byte-exact and independently reproducible.",
  "outcome": "verified-insight",
  "insight": "An independent from-scratch EVP_BytesToKey(SHA-256)+AES-256-CBC harness reproduces phase2/3/3.2 exactly, fixing the precise crypto format (salt-prefixed OpenSSL, pass = sha256hex(answer)) used by every blob in the puzzle.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "architect-ebcdic-cp1141-codepage-debate",
  "phase": "architect",
  "category": "decode provenance",
  "title": "Is the EBCDIC / CP1141 code page a real decode step, or just a coincidence of the a-z range? (community debate)",
  "who": "community",
  "author": "id:370469246",
  "source": "Telegram — GSMG Puzzle Solvers, msg #3856 (cp1141 point later raised by @TrinitasUnitas, msg #5572)",
  "date": "2020-05-11",
  "dateApprox": false,
  "input": "The Phase 3.2 'Beaufort blob' (the Architect speech). Sparky's critique: the post-AES bytes use only 26 distinct values, which is simply a property of a lowercase a-z alphabet, so reading an 'EBCDIC 1141 code page' into it is unjustified -- a Beaufort (a wrapped negative shift over a-z) is the real operation and the code page is a post-hoc rationalisation nobody verified for themselves. Counter (the blob's poster, and @CoruNethron): CP1141 is literally the transform in the working pipeline, and CP273 (German/Dutch = 1141 plus the EUR sign) is itself a hint.",
  "method": "Re-examined whether the EBCDIC/CP1141 step carries meaning or is mechanical. @CoruNethron posted a full reproducible one-liner of the Phase 2->3->3.2 chain whose final stage is `... | tail -c+448 | head -c 1539 | iconv -f ISO-8859-1 -t CP1141 | beaufort --decrypt --key=thematrixhasyou --alphabet=abcdefghijklmnopqrstuvwxyz` -- i.e. reinterpret the Latin-1 bytes AS CP1141, then Beaufort-decrypt with key 'thematrixhasyou' over the plain a-z alphabet. He notes you can pipe the bytes through iconv in the 'wrong' code page directly and read the plaintext (he reports it begins 'yourlifeisthesum...'). Reference Beaufort impl: github.com/jwerle/libbeaufort.",
  "output": "Unresolved, with both sides partly right. The code-page step is unquestionably PRESENT and reproducible: this project's own harness and Denis's one-liner both run `iconv ... CP1141` before the Beaufort (key 'thematrixhasyou'), so 'zero use of a code page' overstates it. But Sparky's caution lands too -- 26 distinct byte values follow automatically from an a-z Beaufort, so that property is NOT independent evidence that 'EBCDIC 1141' encodes a hidden clue; the code page may be a mechanical byte-reinterpretation that happens to land the a-z range rather than a deep signal.",
  "outcome": "verified-insight",
  "insight": "CP1141 + Beaufort (key 'thematrixhasyou', alphabet a-z) is the real, reproducible Phase 3.2 decode -- but the much-repeated 'EBCDIC 1141' framing is over-read: a Beaufort over a-z trivially yields only 26 distinct values, so that fact alone is not evidence the code page is a meaningful clue rather than a mechanical byte-reinterpretation step.",
  "time": "13:51 UTC",
  "sourceQuote": "in the standard config it's a false negative because of the ebcdic bytes. you can either patch & recompile it, write some script … or use go-openssl-bruteforce",
  "provenance": "The Phase-3.2 ciphertext decrypts to EBCDIC (cp1141-family) bytes before the Beaufort/VIC layer; the false-negative concerns OpenSSL's default codepage handling. Correcting an earlier mis-attribution to @CoruNethron — the actual origin is id:370469246.",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (EBCDIC → Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "go-openssl-bruteforce",
    "href": "https://github.com/deltaclock/go-openssl-bruteforce"
   }
  ]
 },
 {
  "id": "discover-p32-trailing-blob-end-of-phase32",
  "phase": "architect",
  "category": "the p32_trailing blob",
  "title": "DISCOVERED the undocumented 80-byte p32_trailing AES blob embedded at the END of the phase-3.2 plaintext",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The decrypted phase-3.2 plaintext (saved to phase32_plain.bin). Searched it for the OpenSSL base64 magic prefix 'U2FsdGVkX1'. Recovered blob (b64): U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46zgKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4 -> salt b45a5e3d827593ca, 80 ciphertext bytes (5 AES blocks).",
  "method": "After reproducing phase3.2, scanned the full plaintext for any embedded 'Salted__' base64 (extract.py: find('U2FsdGVkX1'), then collect the contiguous base64 run). Found a base64 blob sitting AFTER the Architect speech/VIC text at the very tail of the plaintext, distinct from the on-page salphaseion blob. Decoded it, confirmed the Salted__ header and an 80-byte ciphertext, and cross-checked that it is NOT equal to ciphertexts/salphaseion.txt.",
  "output": "A genuine fourth/extra OpenSSL aes-256-cbc blob (salt b45a5e3d827593ca, 80 bytes) that the community walkthroughs never noted or decoded. Being 80 bytes (<=79 readable plaintext bytes), a correct key would be instantly self-verifying -> a built-in oracle. It resisted all keys tried so far (chess/VIC/speech-derived, dictionary).",
  "outcome": "verified-insight",
  "insight": "There is a previously-unnoticed 80-byte AES blob (salt b45a5e3d827593ca) appended to the phase-3.2 plaintext itself, giving a fresh, self-verifying decryption oracle with no community attack history.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "vic-straddling-checkerboard-reverse-engineering",
  "phase": "architect",
  "category": "the p32_trailing blob",
  "title": "VIC straddling-checkerboard reverse-engineering — the chess clue is just the VIC-alphabet mnemonic",
  "who": "this project",
  "source": "this session (vic.py round-trip verification)",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "VIC alphabet FUBCDORA.LETHINGKYMVPS.JQZXW with markers (1,4); the 144-digit phase-3.2 VIC code string (151659431219…154112); target known plaintext beginning 'INCASEYOUMANAGE…' → full decode 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE'.",
  "method": "Reverse-engineered the straddling checkerboard from the chess clue's letter-groups and decoded the 144-digit VIC string under both marker orientations (1,4) and (4,1) to find which construction reproduces the known Architect plaintext. Reasoning: confirming the board round-trips the existing plaintext proves whether the chess clue carries any NEW data (a board position) or whether its entire purpose was already spent in establishing the VIC alphabet.",
  "output": "The reconstructed checkerboard correctly round-trips the 144-digit string to the known VIC plaintext, confirming the chess clue's sole cryptographic role is the VIC-alphabet mnemonic (markers 1&4, top row FUBCDORA, etc.) — it encodes no separate board state or coordinate key. Note: the alphabet's tail is reconstruction-ambiguous (…JQZXW vs …ZJQWX.), a documented minor uncertainty, but neither variant yields a p32_trailing key.",
  "outcome": "verified-insight",
  "insight": "The phase-3.2 chess clue ('fubcd-king & oracle-queen…') is purely the VIC straddling-checkerboard mnemonic — the reconstructed board round-trips the known 144-digit VIC string to the Architect plaintext, so it carries no separate board-position key for p32_trailing.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "image": "assets/walkthrough/community-images/vic-straddling-checkerboard-decoder.jpg",
  "imageAlt": "VIC Cipher Decoder loaded with the phase-3.2 144-digit numeric string and a straddling-checkerboard alphabet",
  "imageCaption": "@Heellrzz, 2024-03-28 (Telegram msg #23359): the phase-3.2 144-digit numeric string loaded into a VIC / straddling-checkerboard decoder with the keyed alphabet FUBCDORA.LETHINGKYMVPS.JQZXW and markers 1,4 — the exact configuration this card reverse-engineers.",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-p32-288-phase32-answers",
  "phase": "architect",
  "category": "the p32_trailing blob",
  "title": "The phase-3.2 chess/VIC clue does not key p32_trailing — alphabet-as-passphrase, VIC digit-string, checkerboard construction, and checkerboard-encoded phrases all null",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The 80-byte p32_trailing blob (salt b45a5e3d827593ca, b64 U2FsdGVkX1+0Wl49...mdC0NAv4) found at the very end of the phase-3.2 plaintext. Keyed with 288 strings derived locally from phase 3.2: the THEMATRIXHASYOU Beaufort key, the custom VIC alphabet FUBCDORA.LETHINGKYMVPS.JQZXW (and the ambiguous ...ZJQWX. rebuild), the chess clue 'A fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen' (and fubcdking/oraclequeen/sadboard fragments), the raw VIC 144-digit string (fwd/rev), CIAO BELLA O, HALF AND BETTER HALF, the phase-2 chess FEN B5KR/1r5B/2R5/..., REINSERTING THE PRIME BASICS / RETURN TO THE SOURCE CODES, 140/hundredfourty, privatekeynote, etc. Each as literal, sha256hex, raw-sha, double-sha, hex-of-hex (attack_p32.py, chessclue.py).",
  "method": "p32_trailing is a self-verifying oracle (a correct key yields <=79 readable bytes instantly) and the chess sentence immediately preceding it suggested its key is a phase-3.2 construction. Every plausible phase-3.2 answer/alphabet/board phrase was normalized and hashed in the puzzle's conventions and used to decrypt the blob.",
  "output": "0 readable decrypts. No phase-3.2-derived string -- including the literal pre-Beaufort EBCDIC letter string and the VIC digit string forward and reversed -- opens p32_trailing. The chess lead is closed: no specific board position is given to construct a non-phrase key.  ·  [merged: “p32_trailing (trailing 80-byte phase-3.2 blob) vs chess-clue / VIC-alphabet keys”] 264 decrypt tests → 0 valid padding (2 chance false-positives on p32_trailing shown to be garbage). No readable plaintext.  ·  [merged: “p32_trailing chess-clue CONSTRUCTIVE attack — build the VIC straddling-checkerboard and run the chess clue through it”] Across all consolidated chess/VIC scripts (hundreds of candidate keys × 4-5 hash forms × the 80-byte blobs) ZERO produced a PKCS7-valid readable plaintext. The VIC checkerboard build verified correct (it round-trips the known Architect VIC plaintext), proving the clue's only real function is to define the VIC alphabet that was already consumed in phase 3.2 — there is no specific board POSITION/coordinate set encoded to build a key from. The chess/p32_trailing lead is closed.  ·  [merged: “p32_trailing vs VIC-checkerboard-encoded thematic phrases (board construction)”] 180 tests → 0 valid padding, 0 readable hits.  ·  Also refuted a specific community claim (#5624, 2021, @PversisZomBeeez) that p32_trailing is “not AES” and decodes to words (‘beat’/‘amigo’/‘neo’) via base64→ascii / base58 / reordering the two halves: 11 non-AES interpretations of the blob → 0 of the claimed words, all high-entropy garbage. p32_trailing is genuine AES ciphertext, not a re-encoded message.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@DaneelOlivaw",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "hint-image-decoding-primes-fefefe-doors-toe",
  "phase": "salphaseion",
  "category": "creator-hint & narrative decode",
  "title": "Hint-image / creator-hint decoding — primes 2,3,5,7, 'zero out', fefefe=101010, 'another door', 'theory of everything'",
  "who": "this project",
  "source": "this session (hints/ images + creator Telegram timeline)",
  "date": "2021-03-01",
  "input": "The creator's hint images and Telegram timeline (saved as hints/ + the mh_top/mh_bot/mh_last PNGs). Key extracted statements: 2021-03-01 'which primes 2,3,5,7 we need use' / 'You are at THE PRIME PART already???' / 'too many combinations'; 2021-03-01b 'fefefe is 101010 … if you know how the array is indexed'; 2021-12-25 'prime numbers required to proceed … some characters need to be zeroed out'; 2020-08-02 / 2021-12-02 / 2021-12-25 'there is ANOTHER DOOR' (nobody found) and 'the second half [faed] will probably be used for ANOTHER PUZZLE, or not at all'; 2020-01-14 'Yellow has a number and so does Blue'; 2023 'the theory of everything is also still a valid path' / 'a prime number is very important'.",
  "method": "Transcribed and cross-referenced the full creator hint timeline (images + Telegram) to extract the precise operational instructions for the endgame rather than treating them as flavor. Reasoning: these hints name the exact mechanism — primes {2,3,5,7}, 'zero out characters', the binary rule fefefe=101010 (so the per-symbol bit map f=1/e=0), an unfound 'another door', and an alternate 'theory of everything' path — so pinning the verbatim wording is what makes the dbbi/faed and yinyang attacks targetable.",
  "output": "Compiled the verbatim instruction set: primes 2,3,5,7 are 'the prime part'; certain characters must be 'zeroed out'; fefefe=101010 establishes the binary digit map and ties to 'how the array is indexed'; an unfound 'another door' exists; faed may be a separate puzzle entirely; 'theory of everything' is a named alternate path; 'a prime number is very important'. These guided (but did not solve) every dbbi/faed prime/zero-out attack; no decode tested against them produced text.",
  "outcome": "verified-insight",
  "insight": "PROVENANCE (corrected 2026-07-02): the creator (Jrk) confirmed only that a 'PRIME PART' exists (his reply 'You are at the prime part already???'), plus 'zero out some characters', 'another door', faed possibly being a separate puzzle, and 'theory of everything' as a named path. The specific prime SET {2,3,5,7} and the 'fefefe=101010 / 104 is the fefefe square' equation were COMMUNITY inferences (a solver's Telegram messages, id394589394), NOT creator statements — Jrk's only same-day reply was 'Ancient spelling, one of the many many typos'. Much endgame work is keyed on these, so treat {2,3,5,7} and fefefe=101010 as unconfirmed working assumptions, not creator instructions.",
  "provenance": "The genesis 14×14 grid and its colored / #fefefe cells (content/matrix.js, re-verified pixel-exact against assets/walkthrough/puzzle.png).",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "rulers-riddle-john-mcafee",
  "phase": "salphaseion",
  "category": "creator-hint & narrative decode",
  "title": "The 'competition / rulers' riddle resolves to John McAfee (Norton → McAfee wordplay; Belize; POTUS runs)",
  "who": "community",
  "author": "@zeroxcolombo",
  "source": "Telegram — GSMG Puzzle Solvers, msg #40518",
  "date": "2025-05-13",
  "dateApprox": false,
  "input": "The endgame's cryptic 'competition' / 'rulers' reference (cf. the Thevenin/Norton 'equivalent ... competition ... tried to become a ruler of a piece of land' phrasing seen in the chat).",
  "method": "Resolve the wordplay: 'competition' -> Edward Norton -> Norton antivirus -> its rival McAfee antivirus -> John McAfee; corroborated by 'ruler of a piece of land' (McAfee lived in Belize, home of Belikin beer) and his two US-presidential (POTUS) campaign runs.",
  "output": "The riddle's hidden referent is John McAfee. A narrative/lore decode (not itself a key) that pins a previously-unexplained personal reference in the endgame and yields concrete password/keyword candidates (McAfee / Belize / Belikin). Flagged by its author as a top finding absent from the public github.",
  "outcome": "unverified",
  "insight": "Sub-check (this project): the derived keyword candidates (mcafee / johnmcafee / McAfee / norton / edwardnorton / belize / belikin / potus / whackd / …) were tested as keys on cosmic / salph_inner / p32_trailing → 0 valid padding. The McAfee identification is a NARRATIVE / wordplay reading with no byte-exact test, so it stays UNVERIFIED by nature — a lore interpretation that yields candidate keywords, not a decode.",
  "time": "14:56 UTC",
  "sourceQuote": "Wiseman above hinted about “stop short-term thinking”. It’s about John mcafee",
  "provenance": "The Architect speech line \"what a wiseman above hinted at is worth hundred fourty\"; the John-McAfee reading is @zeroxcolombo's. Correcting an earlier mis-attribution to @CoruNethron.",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect speech)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "verify-embedded-salphaseion-equals-repo",
  "phase": "salphaseion",
  "category": "solved-chain verification",
  "title": "CORRECTION: the phase-3.2 plaintext contains ONE embedded Salted__ blob (p32_trailing) — the salph_inner (salphaseion.txt) blob lives in the SalPhaseIon SOUP, not here",
  "who": "this project",
  "source": "this session; corrected 2026-07-02 after re-decrypting phase32.txt (independent-solver cross-check)",
  "date": "2026-07-02",
  "input": "Every 'U2FsdGVkX1' base64 run in the AES-decrypted phase-3.2 plaintext (decrypt of phase32.txt under key 250f3772…), vs ciphertexts/p32_trailing.txt and ciphertexts/salphaseion.txt.",
  "method": "Re-decrypted phase32.txt and scanned the 2422-byte plaintext for embedded Salted__ blobs, and separately reassembled the SalPhaseIon soup's inner blob. This CORRECTS an earlier version of this entry, which wrongly claimed the 3.2 plaintext held TWO blobs including the salphaseion one.",
  "output": "The phase-3.2 plaintext contains EXACTLY ONE embedded Salted__ blob: p32_trailing (starts 'U2FsdGVkX1+0Wl49…', its first 64-char line ending 'iuW2a46z'), matching ciphertexts/p32_trailing.txt. The salph_inner blob (== ciphertexts/salphaseion.txt, which ends 'GuN/jJ') is NOT in the 3.2 plaintext -- it is embedded in the SalPhaseIon SOUP (base64 split across the 'z' separators + the nested 'enter' binary), as the soup-reconstruction entry documents.",
  "outcome": "verified-insight",
  "insight": "p32_trailing is the SOLE Salted__ blob embedded in the phase-3.2 plaintext -- a distinct artifact from the soup's salph_inner blob. (An earlier version of this entry mis-stated that the 3.2 plaintext held two blobs including salphaseion; in fact the salphaseion/salph_inner blob is reassembled from the SOUP, not the 3.2 plaintext.)",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "reconstruct-salph-inner-blob-stray-z-enter-binary",
  "phase": "salphaseion",
  "category": "soup reconstruction",
  "title": "Reconstructed the salph_inner 80-byte blob from soup fragments (stray-'z' + embedded 'enter' binary removed)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "post-z soup chunks 3 and 4. Chunk 3 = 'shabe' + 'fourfirsthintisyourlastcommand' + blobpart1. Chunk 4 = enter-binary (40 a/b chars = 8-bit ASCII of 'enter') + blobpart2 + suffix 'shabefanstoo'. Concatenated b64 -> Salted__ blob, salt 3ab585348552415d, 80 ciphertext bytes.",
  "method": "The inner blob's base64 is broken across the 'z' token separators and has the word 'enter' (as a 40-char a/b binary string) spliced INTO the middle of the base64. Reconstructed it (inner.py/inner2.py): stripped the leading plaintext 'shabefourfirsthintisyourlastcommand' from chunk 3 to get blobpart1, stripped the leading 40-char 'enter' binary and the trailing 'shabefanstoo' from chunk 4 to get blobpart2, and joined blobpart1+blobpart2. Verified the result base64-decodes to a valid 'Salted__' header with an 80-byte ciphertext.",
  "output": "A clean, valid OpenSSL aes-256-cbc blob: salt 3ab585348552415d, 80 bytes (5 blocks) — the salph_inner oracle. With its sibling p32_trailing it is one of the two small self-verifying blobs. It resisted ~thousands of candidate keys (soup tokens, first-hint phrases, ybp/yinyang candidates) -> 0 PKCS7-valid readable hits.",
  "outcome": "verified-insight",
  "insight": "The salph_inner base64 is deliberately fragmented across 'z' separators with the 'enter' binary inserted mid-blob; removing the stray 'z' and the embedded 'enter' binary is required to assemble the real 80-byte blob (salt 3ab585348552415d).",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "recover-dbbi-faed-salphaseion-soup-exact",
  "phase": "salphaseion",
  "category": "soup reconstruction",
  "title": "Recovered the EXACT dbbi (91) & faed (570) strings and the full SalPhaseIon soup structure",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The SalPhaseIon notebook soup (salphaseion.ipynb, fenced block, spaces/newlines stripped). dbbi (91 = 7x13 symbols, alphabet a-i, no 'o'): dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe. faed (570 = 2x3x5x19 symbols): faedggeedfcbdabhh...ahaidhfahiihic (full string saved to faed.txt).",
  "method": "Parsed the soup (parse_soup.py): located the first 'z' to split off the leading pre-z chunk, computed the a/b bit-pattern of the word 'matrixsumlist' (8-bit ASCII, a=0/b=1, 104 bits), found that pattern inside pre-z, and split pre-z into [dbbi][matrixsumlist-binary][faed]. Then split post-z on 'z' to recover the agda (->lastwordsbeforearchichoice), cfob (->thispassword), shabef, and the inner-blob region. Saved dbbi.txt and faed.txt verbatim and confirmed both alphabets contain a-i with no 'o'.",
  "output": "Exact verbatim dbbi (91 syms) and faed (570 syms) strings plus the full soup order: [dbbi][binary1=matrixsumlist][faed] z [agda->lastwordsbeforearchichoice] z [cfob->thispassword] z 'shabef' 'four first hint is your last command' [salph_inner blob, split by z + binary2=enter] 'shabef' 'anstoo'. The 104-bit binary1 literally spells the WORD 'matrixsumlist'. FIELD-BLOCK self-labeling proven byte-exact too (2026-07-13, attempt 0145): the a-i/o blocks decode a=1..i=9,o=0 -> decimal -> BigInt -> hex -> ASCII, giving thispassword ('cfob…fidh' -> hex 7468697370617373776f7264 = \"thispassword\", printable 1.000) and lastwords -> \"lastwordsbeforearchichoice\" (printable 1.000). Under the SAME chain dbbi (0.421) and faed (0.329) are the ONLY blocks that do NOT self-decode.",
  "outcome": "verified-insight",
  "insight": "The soup tokens are SELF-LABELING signposts: the binary blocks (a=0/b=1, 8-bit ASCII) spell 'matrixsumlist'/'enter', and the field blocks (a=1..i=9,o=0 -> decimal -> hex -> ASCII) spell 'thispassword'/'lastwordsbeforearchichoice' byte-exactly. So every soup block announces its own role — EXCEPT dbbi & faed, which alone yield garbage under the confirmed chain (printable 0.42/0.33). That is the structural signature that dbbi & faed carry the puzzle's two hidden values (yellowblueprimes/yinyang = the 'half & better half'), while the labels around them are instructions, not secrets. Consequence (attempt 0145, 135 decrypts, 0 valid-pad): testing a signpost block's own value (raw/field-decode/hex) as the oracle passphrase is null by construction — the missing piece is the INDEX that turns dbbi/faed into their values ('if you know how the array is indexed'), not any label decode.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "stray-z-enter-marker-finding",
  "phase": "salphaseion",
  "category": "soup reconstruction",
  "title": "The stray-'z' / embedded-'enter' finding as a possible delimiter/offset signal",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The two soup constructs flanking salph_inner: the 'z' separators that fragment the inner-blob base64, and the 'enter' word encoded as a 40-bit a/b binary spliced inside the base64 (between blobpart1 and blobpart2). 'enter' is NOT one of the four cosmic ingredients.",
  "method": "Noted during reconstruction that 'enter' is encoded the same self-labeling way as 'matrixsumlist' (a/b 8-bit ASCII) but sits INSIDE the inner-blob base64 rather than standing alone, and that 'z' marks the split points. Considered whether the split position / 'enter' marker is a deliberate pointer (a UI 'enter the password' command, or a byte-offset delimiter) versus mere noise, and tested 'enter'/'thispassword'/'enterthispassword' as inner-blob keys.",
  "output": "'enter' decodes cleanly to its literal word (self-labeling, like matrixsumlist) and its splice position is reproducible, but using 'enter', 'thispassword', 'enterthispassword' (literal / sha256hex / raw-sha) as the salph_inner passphrase produced 0 PKCS7-valid readable decrypts. The marker's purpose (delimiter vs pointer) remains undetermined.",
  "outcome": "verified-insight",
  "insight": "The word 'enter' is encoded (a/b binary) and embedded INSIDE the salph_inner base64 at the 'z' split point — a structural feature distinct from the standalone soup tokens, suggesting a deliberate delimiter/'enter the password' marker rather than a cosmic ingredient.",
  "provenance": "The SalPhaseIon soup and its tokens (matrixsumlist / enter / lastwordsbeforearchichoice / thispassword), plus the salph_inner blob — all from the SalPhaseIon page (ciphertexts/ + research/lib/data.mjs).",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "faed-deinterleave-factors-and-lag253",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "De-interleave faed at its factors and at autocorrelation lag-253",
  "who": "this project + community + community",
  "source": "this session + dead-end ledger + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "faed (570 = 2*3*5*19) de-interleaved into 2,3,5,6,10,15,19,30 strands; each strand field-decoded plus concatenations plus reversed strands. Separately, autocorrelation found a z~3.8 peak at lag 253 (weak echo near 505), so faed was split/aligned on a 253 period to expose a repeated substring.",
  "method": "If faed is an interleaving (fractionation) of multiple shorter messages, splitting on a true factor period should re-assemble readable strands. The lag-253 autocorrelation spike was investigated as a possible repeated key/plaintext period that would betray structure.",
  "output": "All factor de-interleavings are garbage (printability ~0.2-0.42). The lag-253 peak has no literal repeated substring behind it and sits at the Bonferroni significance floor -> parked as noise, not a real period. [Also documented separately as \"Autocorrelation lag-253 peak in faed\" (dead-end ledger): Scanned faed's autocorrelation for repeats and found a notable z~3.8 spike at lag 253, then investigated whether a literal repeated substring sits behind it. Result: No literal repeated substring behind the lag-253 peak; it sits at the Bonferroni multiple-testing floor -- parked as noise, not a lead. Insight: faed's striking lag-253 autocorrelation peak (z~3.8) has no literal repeated substring behind it and sits at the Bonferroni significance floor -- it is a multiple-testing artefact, not a real period.] [Also documented separately as \"De-interleave dbbi and faed into strands by their factors\" (dead-end ledger): Treated the blocks as multiple intertwined sub-messages (the creator's 'intertwined' language) and pulled out every-Nth symbol for each factor N, then field-decoded each strand and combinations of strands. Result: Garbage (printability ~0.2-0.42).]",
  "outcome": "verified-insight",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-all-9factorial-substitutions",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "Exhaustive 9! symbol→digit permutation sweep of dbbi (725,760 decodes) and faed (362,880) — no permutation yields text",
  "who": "this project + community",
  "source": "this session + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi (91 symbols); every one of the 9! = 362,880 bijections from {a..i} to a 9-digit alphabet, run for BOTH digit ranges 0-8 and 1-9 (725,760 total decodes), each field-decoded to bytes and scored for printability/English.",
  "method": "Rather than guess the symbol->digit mapping, brute-force ALL of them. For each of the 362,880 permutations, build the integer, convert to hex/ASCII, and score the result for printable ratio and dictionary words. If dbbi were monoalphabetically enciphered text, exactly one permutation would surface readable English.",
  "output": "ALL 362,880 (and the full 725,760 with both digit ranges) scored as garbage; max printable ~0.74, max meaningful-English 0.52 - i.e. pure chance, no permutation yields text. This is the decisive proof that dbbi is NOT monoalphabetic text under field-decode. [Also documented separately as \"ALL 9! monoalphabetic substitutions x 2 digit ranges on dbbi\" (dead-end ledger): Brute-forced the entire monoalphabetic key space: every possible assignment of the nine symbols to nine digits, in both digit ranges, each followed by the int->hex->ASCII field decode, to definitively rule out any single-symbol substitution. Result: Zero produced English (out of 725,760 decodes).]  ·  [merged: “9! monoalphabetic permutation sweep of the faed field-decode”] All 362,880 decodes scored as garbage (max printable ~0.52 for faed); no permutation yields English. (Companion dbbi sweep maxed ~0.74, also garbage.)",
  "outcome": "verified-insight",
  "insight": "The full 9! brute force proves dbbi is not a substitution-enciphered word: no symbol->digit mapping makes it readable, so its payload must be numeric/binary, not text.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-transposition-times-substitution",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "All transposition layouts x all 9! substitutions of dbbi (3.27M decodes)",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi (91 symbols); 9 transposition layouts (7x13 / 13x7 grids read as rows/cols/diagonals/spiral/boustrophedon) x every 9! substitution = 3,265,920 decodes.",
  "method": "Combine the two classical attacks: first re-order the symbols by a transposition path, then try every monoalphabetic substitution on the re-ordered string, then field-decode and score. Covers the case where dbbi is a transposed AND substituted cipher.",
  "output": "Zero produced English across all 3,265,920 decodes - garbage everywhere. [Also documented separately as \"ALL transposition x substitution on dbbi (3.27M decodes)\" (dead-end ledger): Crossed the full monoalphabetic key space with 9 grid/transposition layouts, so any combination of 'rearrange then substitute' was covered, then field-decoded all 3.27M results. Result: Zero produced English.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "ledger-be-binary-channel-dbbi",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "b/e binary channel and presence channel in dbbi",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi. Channel 1: b vs e as a bit. Channel 2: colored-vs-not as a bit.",
  "method": "Treated the two dominant symbols as a binary channel (b=0/e=1) and separately the colored-vs-uncolored status as another bit channel, reading each as a hidden bitstream.",
  "output": "Garbage.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The b/e-as-binary channel reading is community.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "ledger-cosmic-duality-vic-on-blocks",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "Cosmic Duality book / VIC cipher applied to the blocks",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed. Applied the Phase-3.2 VIC straddling-checkerboard (alphabet FUBCDORA.LETHINGKYMVPS.JQZXW) and book-cipher readings.",
  "method": "Reused the Phase-3.2 VIC checkerboard cipher and Cosmic Duality book-cipher readings on dbbi and faed, on the theory that the same cipher machinery from the architect phase continues into the soup blocks.",
  "output": "Garbage -- both the VIC and book-cipher readings eliminated.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The \"Cosmic Duality\" book + VIC checkerboard framing is community.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "dbbi-base81-pairs",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "dbbi adjacent symbol pairs as base-81 digits",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi; adjacent symbol pairs (9x9=81 combinations) read as base-81 digits.",
  "method": "Since each symbol is base-9, a pair is a base-81 digit; read consecutive pairs as a base-81 number / byte stream to see if a coarser radix reveals structure.",
  "output": "Garbage. [Also documented separately as \"Base-81 digit-pair reading of dbbi\" (dead-end ledger): Combined adjacent base-9 symbols into base-81 digits, on the idea that the real alphabet is two-symbol units, then decoded the resulting base-81 stream. Result: Garbage.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-as-number-passphrase",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "dbbi & faed derived numeric / binary / field-decode / sha forms tried directly as AES passphrases for the blobs — 0 hits",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Values derived from dbbi: the big decimal (a-i->1-9 concatenation), the prime->0 bitstream as bytes/hex/decimal/inverted, hex(int(bits)), field-decode int->hex string; each tested as literal, sha256hex, raw-sha256 and double-sha passphrase plus raw-byte passphrases, vs cosmic/salph_inner/p32_trailing.",
  "method": "Test the hypothesis that dbbi's decoded value IS the yellowblueprimes/yinyang key - feed its numeric and binary forms directly as the AES passphrase (in every standard KDF form) to the three open blobs, watching for a valid PKCS7 + readable plaintext.",
  "output": "Zero valid PKCS7-with-text hits on any blob; the dbbi-derived bytes are NOT a blob key (also confirmed not the private key against the prize address across ~17 scalar forms).  ·  [merged: “faed literal/digits/bits/sha forms as AES passphrases for the blobs”] Zero readable hits across all faed-derived forms x {literal, sha, raw-sha, double-sha} x both blobs; at most chance-level PKCS7 passes decrypting to garbage. faed-derived bytes are NOT the blob keys.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "faed-dbbi-repeating-key",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "dbbi used as a repeating key over faed (community 'dbbi keys faed')",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #63520",
  "input": "faed (570 symbols) with dbbi (91 symbols) as a repeating Vigenere-style key: add / subtract / Beaufort, dbbi forward and reversed, with and without its 4-symbol header, plus pairwise operation on the shared 91-symbol prefix.",
  "method": "Because dbbi physically precedes faed in the soup and is shorter, the community theory was that dbbi is the key that deciphers faed. Every additive/subtractive/Beaufort combination and orientation was applied and the result's Index of Coincidence measured.",
  "output": "IoC collapses to 0.108-0.114 (uniform) under every variant -> the 'dbbi keys faed' idea is dead in its additive form. [Also documented separately as \"dbbi used as a repeating polyalphabetic key over faed\" (dead-end ledger): Tested the popular community idea that 'dbbi keys faed' (the first block decrypts the second). They cycled dbbi as a Vigenere-style key over faed using modular add, subtract, and Beaufort, in both orientations and header variants, to see if any alignment produced English. Result: The Index of Coincidence collapses to 0.108-0.114 (uniform/random), so the additive 'dbbi keys faed' idea is dead in its additive form.]",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@theseedisplanted",
  "date": "2026-05-22",
  "time": "10:02 UTC",
  "sourceQuote": "dbbi row sums form a repeating key — faed is 570 char = 38*15, so splitting it 38 rows of 15 letters and summed; XORing those sums with the key gives text, applying zero masks (zeroed-out hint) from blue/yellow positions of the 14x14 matrix reveals SENDTHE, BLUE, TOSETHEX",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "dbbi-field-decode-int-hex-ascii",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "Direct 'house-method' field-decode (a→1…i→9 → big integer → hex → ASCII) of dbbi and faed — garbage (both lack 'o'=0)",
  "who": "this project + community",
  "source": "this session + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The 91-symbol dbbi string 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe' (alphabet a-i, no 'o'); mapping a=1..i=9.",
  "method": "Applied the verified 'house' field-decode that solved the soup's z-fields (agda, cfob, shabef): substitute each letter for its 1-9 digit, read the whole string as one decimal integer, convert to hexadecimal, then to ASCII bytes. The reasoning: if dbbi were a word like the other chunks, this exact method would reveal it.",
  "output": "Garbage. dbbi contains NO 'o' (=0), so unlike the word-chunks it cannot field-decode to any text containing a zero digit; the resulting bytes were non-printable. Baseline 'plain' decode scored far below readable. [Also documented separately as \"Direct base-9 / base-16 / octal field-decode of dbbi and faed\" (dead-end ledger): Applied the exact 'house method' that successfully solved the earlier z-fields of the soup: map each letter a..i to a digit, read the whole block as one big integer, convert that integer to hexadecimal, then to ASCII text. They reasoned that if the same decoder solved the agda/cfob word-chunks it should solve dbbi/faed too. Result: Garbage. The method fundamentally cannot fire here because dbbi/faed contain no 'o' symbol (the symbol that maps to 0), and the verified field method needs an 'o'=0 to produce the zeros present in the target words.]  ·  [merged: “faed a1z26 field-decode to one big integer -> 237 random bytes”] ~237 bytes of statistically random output; no printable English. Field-decode cannot fire correctly because faed (like dbbi) conspicuously contains no 'o' (=0 in the alphabet), so the integer never lands on text containing zeros.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-primality-factoring",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "Primality and factoring of dbbi as a number",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi read as a single number in base-9 and base-10.",
  "method": "If the 'prime number is very important' hint points at dbbi itself, the number might be prime or factor into meaningful primes. Tested primality and factored it in both bases.",
  "output": "Not prime. base-9 factors = 5*11*53; base-10 factors with only small factor 5. Carries no obvious key. [Also documented separately as \"Primality and factoring of dbbi as a number\" (dead-end ledger): Tested whether dbbi-as-a-number is prime or has meaningful factors, on the 'prime is very important' theme, hoping a factorization would yield a key, period, or offset. Result: Not prime; only small factors (base-9: 5*11*53; base-10: divisible by 5). Carries no obvious key.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-search-literal-yellowblueprimes",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "Search dbbi for the literal string 'yellowblueprimes' in any base",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi; target substring 'yellowblueprimes' encoded in any base representation.",
  "method": "Directly test whether dbbi simply contains the word it is hypothesized to hold, by encoding 'yellowblueprimes' in each base and searching dbbi's representations.",
  "output": "Absent in every base - dbbi does not literally contain the word. [Also documented separately as \"Search dbbi for the literal string 'yellowblueprimes'\" (dead-end ledger): Checked directly whether dbbi contains the word 'yellowblueprimes' (the hypothesized payload) encoded in any base representation, to confirm or kill the 'dbbi spells the word' assumption. Result: Absent in every base.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "faed-yinyang-self-complement-halves",
  "phase": "salphaseion",
  "category": "dbbi / faed — field & number decode",
  "title": "Yin-yang self-complement test of the two 285-symbol halves",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "faed split into two halves of 285 symbols each (570/2 = 285). Yin-yang complement map a<->i, b<->h, c<->g, d<->f, e fixed. Compared half-A against complement(half-B) and measured matching IC/correlation; also applied the complement standalone and chained with prime-zeroing.",
  "method": "The 'yinyang' ingredient suggests a duality/complement structure, so the hypothesis was that faed encodes its two conjugate halves such that one half is the yin-yang complement of the other (a self-complementary payload). If true, complementing one half would align it with the other.",
  "output": "The two halves match only at ~0.10 (chance level) -> faed is NOT a yin/yang self-complement. The standalone complement substitution and the complement-then-zero chained variants also produced garbage.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-binary-prime-value-map",
  "phase": "salphaseion",
  "category": "dbbi / faed — binary & bitmap",
  "title": "Binary bit-map sweep of dbbi & faed — symbol→bit subsets × grids × 7/8-bit ASCII — noise",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi (91 symbols); the community-derived rule 'fefefe is 101010' (a solver's claim, not a creator hint), verified to reproduce: f(6)->1, e(5)->0, i.e. symbol whose a1z26 value is prime {2,3,5,7}->0 else ->1, giving a 91-bit string. Swept all subsets of {2,3,5,7} as the zero-set, both polarities, widths 7 and 8, plus rules even/odd/>=5/f-only.",
  "method": "Map each symbol to one bit per the creator's confirmed fefefe rule, producing a 91-bit stream, then chop into 7- or 8-bit chars to read ASCII. Try every variant of which prime values become 0 and both inversions, since the creator said 'if you know how the array is indexed'.",
  "output": "All readings noise; the fefefe sanity check confirmed 'fefefe'->'101010' correctly, but no width/subset/polarity produced readable text. Note: 91 bits holds at most 13 chars (8-bit) - mathematically too little to encode the 16-char 'yellowblueprimes'.  ·  [merged: “Exhaustive faed binary bit-map sweep (2^9 assignments x grids x 7/8-bit)”] No candidate reached even 3 dictionary-word hits with meaning; all readings are noise. faed-as-binary yields no text.",
  "outcome": "verified-insight",
  "insight": "The fefefe binary rule is byte-exactly correct (fefefe->101010) but 91 bits caps the payload at ~13 chars, so dbbi cannot itself contain the literal 16-char word - it must yield a computed number.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-bitmap-render",
  "phase": "salphaseion",
  "category": "dbbi / faed — binary & bitmap",
  "title": "Bitmap rendering of dbbi (prime-value bits on 7x13/13x7 grids)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi prime-value bitstream laid out on 7x13 and 13x7 grids, both polarities; rendered to PNG (dbbimap_prime0_7x13.png, dbbimap_prime0_13x7.png, dbbimap_prime1_*.png).",
  "method": "If dbbi encodes a glyph (a yin-yang symbol, a QR-like mark, letters), the prime-value bits drawn as black/white pixels on the correct grid should show it. Rendered all four grid/polarity combinations as images for visual inspection.",
  "output": "No glyph, no yin-yang, no letterforms - the bitmaps are visually meaningless noise (consistent with the turtle/path-draw render in the ledger that also produced only a direction-biased blob).",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-grid-reindex-binary",
  "phase": "salphaseion",
  "category": "dbbi / faed — binary & bitmap",
  "title": "Genesis-spiral / grid re-index of dbbi & faed then decode — every read order × decode × prime zero-out → noise",
  "who": "this project + community",
  "source": "this session + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi as 7x13 and 13x7 grids; reading orders rows, cols, rows_rev, cols_rev, transpose, boustrophedon, diagonal, spiral_cw, spiral_ccw; each then mapped via 5 bit-rules (prime0, prime1, even1, odd1, ge5) x reverse x widths 7/8 x lsb/msb.",
  "method": "Honor the creator's 'if you know how the array is indexed' hint by re-ordering the 91 symbols along every plausible 2D path before applying the binary rule and reading ASCII. Each resulting candidate string also tested as a passphrase against the cosmic, salph_inner and p32_trailing blobs.",
  "output": "Every reading was noise (no printable-text candidate scored above chance); zero of the candidate strings opened any blob to readable plaintext (BLOB HITS: 0). [Also documented separately as \"All grid reads of dbbi (7x13 and 13x7)\" (dead-end ledger): Exhaustively re-read dbbi as a rectangle in every standard scan order, since the creator emphasized 'how the array is indexed', to find a reading order that exposes text. Result: Garbage.]  ·  [merged: “Genesis-spiral array-reindex of dbbi/faed + field-decode yields no readable text (80 variants)”] 80 variants → 0 readable (best printable ratio 0.605), 0 thematic hits.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@DaneelOlivaw",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "dbbi-matrixsumlist-104-mask",
  "phase": "salphaseion",
  "category": "dbbi / faed — binary & bitmap",
  "title": "matrixsumlist used as a mask / index / Vigenère key over dbbi & faed — no decode, no blob key",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi prime-value bitstream (91 bits, both polarities); MSL = ASCII bits of the literal word 'matrixsumlist' (104 bits). Operations: XOR MSL (repeated) onto the dbbi bits; select dbbi symbols where the 104-bit 'a/b' mask is 1 vs 0 (using first 91 of 104); widths 7/8.",
  "method": "matrixsumlist physically SITS BETWEEN dbbi and faed in the soup and is 104 bits, matching the community '104 is the fefefe square' claim (a solver's inference, not a creator hint) - so test it as the 'array index'/mask that selects or XORs exactly the dbbi characters to keep or zero. Re-decode the masked/XORed bits and also test outputs as blob keys.",
  "output": "All noise; no readable text and zero blob hits. The mask-over-dbbi interpretation does not fire.  ·  [merged: “matrixsumlist used as a mask/index over dbbi & faed decodes nothing”] 96 tests → 0 readable field-decode (best printable ratio 0.524, garbage), 0 valid-padding as a key.  ·  [merged: “matrixsumlist as a Vigenere key / mask over the blocks”] Score 0.43 versus a 0.95 control -- noise.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@DaneelOlivaw",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "dbbi-zero-dominant-be",
  "phase": "salphaseion",
  "category": "dbbi / faed — zero-out schemes",
  "title": "Remove / zero the dominant symbols b and e",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi; symbols b and e together make up ~47% of the 91 characters. Variants: delete b+e, or set them to 0, then re-decode.",
  "method": "Since b and e dominate the frequency table, test whether they are filler/spacer symbols to be stripped or zeroed, leaving a sparser payload that field-decodes to text.",
  "output": "Garbage. [Also documented separately as \"Remove / zero the dominant symbols b and e in dbbi\" (dead-end ledger): Noticed b and e dominate the histogram (~47%) and treated them as filler/noise: removed them, and separately forced them to zero, then re-decoded, on the theory the real message hides among the rarer symbols. Result: Garbage.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-single-zero-insertion-sweep",
  "phase": "salphaseion",
  "category": "dbbi / faed — zero-out schemes",
  "title": "Single zero-insertion at every position (and prime positions) then field-decode",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi (91 symbols); insert exactly one '0' at each of the 92 possible positions, and separately at each prime position, then field-decode.",
  "method": "Test the minimal version of the 'missing zero' hypothesis: maybe just one zero digit was removed. Insert a single 0 at every candidate slot and re-run the int->hex->ASCII decode, scoring each for readable text.",
  "output": "Garbage at every insertion point. [Also documented separately as \"Single zero-insertion sweep across dbbi\" (dead-end ledger): Since dbbi lacks the 'o'=0 symbol, they inserted a single zero at every candidate position (and at prime positions) and field-decoded, testing whether one missing zero in the right slot unlocks readable text. Result: Garbage at every insertion point.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-zero-out-prime-schemes",
  "phase": "salphaseion",
  "category": "dbbi / faed — zero-out schemes",
  "title": "Prime zero-out / 'reinsert the prime basics' schemes (zero by prime value, at prime positions, insert/replace) + field-decode of dbbi & faed — all garbage",
  "who": "this project + community",
  "source": "this session + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi (91 symbols). (A) zero symbols whose value is prime - all subsets of {b,c,e,g}=values{2,3,5,7}, plus each single symbol a-i; (B) zero at prime POSITIONS, 0-indexed and 1-indexed, replace vs insert a '0'; (C) zero only at positions {2,3,5,7} and combos; then field-decode each.",
  "method": "Act on the creator hints 'some characters need to be zeroed out' and 'reinsert the prime basics'. Force selected symbols to the digit 0 (the digit dbbi conspicuously lacks) - either by symbol value, by position, replacing or inserting - so the field-decode can land on text containing zeros, then convert int->hex->ASCII and score.",
  "output": "All garbage; top printable ~0.46. The creator's literal 'zero out'/'reinsert primes' instruction, cleanly tested across value/position/insert/replace variants, fails. [Also documented separately as \"Prime-position select & zero, both 0-index and 1-index\" (dead-end ledger): The creator repeatedly stressed primes and 'zeroing out characters', so they treated the prime-numbered positions as special: at each prime index they either kept the symbol, deleted it, or forced it to zero, then field-decoded the result. They tried both index origins because the off-by-one is ambiguous. Result: 0.000 English under every single combination of operation x index-base x decoder.]  ·  [merged: “dbbi & faed field-decode with prime zero-out and dual combination — no ASCII”] 14 variants → all garbage (printable ratios 0.34–0.47; no words). Verified prime coincidences with no decode: faed value-sum = 3079 (prime); 570−91 = 479 (prime); 570+91 = 661 (prime).  ·  [merged: “'Reinsert the prime basics' (Architect's literal instruction)”] Printability <=0.46 -- the author's literal instruction, cleanly tested, fails.  ·  Also tested the A007522 index set specifically (primes ≡ 7 mod 8 — the genesis colored-cell / #fefefe indices, incl. 103): select / zero-out / complement at those positions over dbbi & faed (0- and 1-based) → field-decode = garbage (best ratio 0.455), and the selected substrings key no blob (72 tests) → 0.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@DaneelOlivaw",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "dbbi-faed-bifid-dbifhceg-btcseed",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Bifid on faed with a dbbi-derived alphabet ('dbifhceg') — surfaces a 'btcseed' fragment",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #43247/#43248",
  "date": "2025-06-12",
  "dateApprox": false,
  "input": "faed as ciphertext; key/alphabet derived from dbbi -- its first 13 symbols with duplicates removed give the 8-letter Bifid keyword 'dbifhceg'. dbbi is also split into 7 parts (the size of matrixsumlist), used as successive keys.",
  "method": "The popular 'dbbi keys faed, it's a dual system' theory applied with Bifid instead of Vigenere: run a Bifid decode of faed using the dbbi-derived 'dbifhceg' alphabet, feeding dbbi's 7 parts in turn (the first part keys faed, its output keys the next, and so on).",
  "output": "Surfaces suggestive fragments -- a first part reads as 'btcseed...', the next 'can...' -- but no coherent full plaintext or usable key emerges, and a Trifid + XOR follow-up on the tail found nothing substantial. Like the OTP 'YOUWON' run, a tantalising partial that has not been made to close. @CoruNethron later analysed the Bifid cipher's properties and judged the 'btcseed' hit to be coincidental, not load-bearing.  ·  [merged: “Bifid cipher with multiple 9-squares and periods”] Garbage.",
  "outcome": "unverified",
  "insight": "Sub-check (this project): the Bifid construction is under-specified — an 8-letter 'dbifhceg' alphabet does not fix a 5×5/6×6 Polybius square and the '7-part chaining' order is ambiguous — so the exact 'btcseed' fragment could not be reproduced deterministically. The tokens btcseed / dbifhceg key no blob (tested null). A 7-char 'btcseed' run inside a 570-char Bifid output is well within chance, and no coherent full plaintext emerges, so this stays UNVERIFIED (suggestive, not conclusive).",
  "author": "id:6424118990",
  "time": "00:30 UTC",
  "sourceQuote": "after using various ciphers I found that a small portion of \"faed...\" can be decoded via Bifid cipher using a period of 570, with the first characters of \"dbbib...\" (deduped to \"dbifhceg\") as the alphabet keyword. Result begins \"btcseed…\".",
  "provenance": "dbbi (91) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup; the Bifid alphabet keyword and period are from @6424118990's derivation.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "dbbi-otp-incase-key-youwon",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "dbbi − the 91-char INCASE… phase-3.2 plaintext (mod 26) = 'YOUWON' + a 64-char tail — an engineered easter-egg, not a key",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #23799",
  "date": "2024-04-06",
  "dateApprox": false,
  "input": "dbbi (the 91-char string dbbibfbhccbeg...beeeabe) as ciphertext; key = the 91-char Phase-3.2 line INCASEYOUMANAGETOCRACKTHISTHEPRIVATEKEYSBELONGTOHALFANDBETTERHALFANDTHEYALSONEEDFUNDSTOLIVE, used as a one-time pad (A-Z Vigenere-style subtraction, e.g. via boxentriq's OTP tool).",
  "method": "dbbi and the 'INCASE...' sentence are BOTH exactly 91 characters, so treat the sentence as a same-length one-time-pad key over dbbi and read the result.",
  "output": "Result = VOZIJBDTIQBRGVEOMZNBC + YOUWON + XCPKWGBNAXDGJGDUNNVMPABTAFPAAXMJYLZBUWERDNXYDESKUOBXCAMVDJLQTSGA. It contains the literal word 'YOUWON', and EXACTLY 64 characters follow it (21 + 6 + 64 = 91) -- 64 hex chars being the length of a Bitcoin private key. The 21- and 64-char chunks around it are not legible. Unconfirmed and possibly coincidental, but flagged by its author as the only run to surface a real word out of dbbi, and the 64-char tail is suggestive.  ·  [merged: “dbbi is engineered against the phase-3.2 plaintext: (dbbi − plaintext) mod 26 spells YOUWON”] Result = VOZIJBDTIQBRGVEOMZNBC · YOUWON · (64-char tail). 'YOUWON' at position 21 is not chance (~1 in 33,000).",
  "outcome": "verified-insight",
  "insight": "VERIFIED in-harness (@DaneelOlivaw): dbbi (a=0..i=8) − the 91-char INCASE phase-3.2 plaintext, mod 26, reproduces EXACTLY 'VOZIJBDTIQBRGVEOMZNBC' + 'YOUWON' + a 64-char tail. YOUWON, the tail, and the full 91-char string were tested as keys (literal + sha256) on cosmic / salph_inner / p32_trailing = 30 tests, 0 valid padding → a designed easter-egg (a creator taunt), not key material. COMPANION-REVEAL test: 48 principled variations of the SAME relationship (value-base a=0/1, modulus 26/9, direction, orientation, op ∈ {d−p, p−d, d+p}) surface ONLY 'YOUWON' across every letter-output (chance baseline 1.4%, so exactly the one designed hit) — no 'yingyang' or any other thematic companion — and all 48 derived outputs as keys → 288 tests, 0 valid padding. Corollary: because dbbi uses only a–i (values 0–8), the non-YOUWON positions are mathematically FORCED (out[i] = dbbi[i] − INCASE[i]), so the tail is not a hidden channel — YOUWON is the SOLE engineered reveal here. INDEPENDENCE check (attempt 0148): dbbi is NOT a re-encoding of INCASE — the same INCASE letter maps to up to 7 different dbbi symbols, only 40/91 positions match the per-letter mode, and H(dbbi│INCASE)=1.74 bits/symbol (~158 bits of dbbi's ~2.88-bit content is INDEPENDENT of INCASE). So dbbi carries genuine information of its OWN; the YOUWON↔INCASE overlay is a designed easter-egg riding on an independently-meaningful block, not the block's whole content — the dbbi-as-ingredient decode targets real, un-consumed content. BORROW-RAIL corroboration (attempt 0170, verifying community solver Vasilis/id:8926654030's method byte-exact — sha256(dbbi)=71fe4625…, sha256(A)=f1785730… both confirmed): the UNDERFLOW bits of the subtraction (1 where dbbi_i<M91_i) have their UNIQUE longest run — exactly 7 ones — starting at index 21, the same index as YOUWON (21=C(7,2); split 21/49/21, middle 49=7²). A THIRD signal converges there (attempt 0173): the phase-3.2 INCASE plaintext M91's VIC-checkerboard codeword-width bits (FUBCDORA top row = 0, else 1) have their UNIQUE 9-ones longest run ALSO starting at index 21. So dbbi AND the authored INCASE line were engineered so that THREE independent structural signals (mod-26 difference -> YOUWON@21, borrow-rail 7-run@21, M91 vic-rail 9-run@21) all flag position 21 -- reinforcing YOUWON as a deliberate design. A community 'YOU WON — BE MODEST' EXTENSION (Vasilis) reproduces the YOUWON parts exactly but its 'BE MODEST' rests on the already-coincidental faed→'BTCSEED' bifid hit plus an admitted 'reach' (reading K's bifid coords (2,5)→BE backward from the known phrase); 'youwonbemodest' and its variants open no blob (0169), so it is at most a SECOND creator taunt, not the passphrase. The workbench below lets you try the variations yourself.",
  "author": "id:6424118990",
  "time": "15:27 UTC",
  "sourceQuote": "dbbib... and INCASEYOUMANAGETOCRACKTHIS... have the same character length and could correlate — dbbi minus that Phase-3.2 plaintext (mod 26) surfaces YOUWON.",
  "provenance": "dbbi (91 chars) from the SalPhaseIon soup; the 91-char \"INCASE…\" string is the Phase-3.2 VIC plaintext.",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect / VIC)",
    "href": "#/walkthrough"
   }
  ],
  "authors": [
   "@DaneelOlivaw"
  ],
  "history": "The community (id:6424118990) surfaced the dbbi↔INCASE one-time-pad. @DaneelOlivaw reproduced it byte-exact (the YOUWON window) and then tested it for a COMPANION reveal: 48 principled variations of the same designed relationship."
 },
 {
  "id": "ledger-seven-intertwined-passwords-dbbi",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "'Seven intertwined passwords' de-interleave of dbbi",
  "who": "community",
  "source": "Community reading of the Architect speech line “seven intertwined passwords” (msg #6100/#10039); de-interleave attempt catalogued in docs/ATTEMPTS.md",
  "input": "dbbi (91 = 7x13). De-interleaved into 7 strands of 13 symbols each; each strand field-decoded plus the concatenation.",
  "method": "Mapped the Architect's 'seven intertwined passwords' onto dbbi's 7x13 factorization: pulled out 7 interleaved strands of 13 symbols and field-decoded each strand individually and concatenated, treating each strand as one of the seven passwords.",
  "output": "Garbage.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The \"seven intertwined passwords\" phrase is from the Architect speech (msg #6100/#10039); the de-interleave attempt is community.",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect speech)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "ledger-columnar-transposition-grid-factorisations",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Columnar transposition over grid factorisations of dbbi and faed",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #38162",
  "input": "dbbi as 7x13 and 13x7; faed as 19x30, 30x19, 10x57, 6x95 and other factor pairs. Read orders: row, column, diagonal, spiral, boustrophedon.",
  "method": "Since 91=7x13 and 570=2x3x5x19 factor cleanly, they laid each block out as a rectangle and re-read it in every standard transposition order, looking for a reading that produces text.",
  "output": "Garbage in every reading.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@KingofCrow",
  "date": "2025-04-14",
  "time": "14:36 UTC",
  "sourceQuote": "Set of 3 to base 9 make a grid and use columnar transposition",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "ledger-trit-pair-balanced-ternary",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Trit-pair / balanced-ternary split (9 = 3^2)",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #54045",
  "input": "dbbi and faed. Each base-9 symbol split into two base-3 digits; read as a 3x3 Polybius square and as a balanced-ternary stream.",
  "method": "Because 9 = 3^2, each base-9 symbol decomposes into a pair of base-3 trits. They split every symbol into two trits and read the trit stream as a 3x3 Polybius fractionation and as balanced ternary, hunting for hidden structure at the trit level.",
  "output": "Printability ~0.38-0.46 -- garbage.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@piandonehalf",
  "date": "2026-01-02",
  "time": "22:25 UTC",
  "sourceQuote": "a sort of balanced ternary?",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "ledger-vigenere-beaufort-incase-alphabet",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Vigenere / Beaufort against the INCASE checkerboard alphabet",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed as ciphertext; key = the INCASE checkerboard ordering. Both cipher directions (encrypt/decrypt sense).",
  "method": "Treated the INCASE straddling-checkerboard letter ordering as a polyalphabetic key and ran Vigenere and Beaufort over each block in both directions, on the theory the checkerboard ordering from an earlier phase was the keystream.",
  "output": "Garbage.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The INCASE… checkerboard alphabet is the Phase-3.2 VIC line.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "dbbi-vigenere-beaufort-brute",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Vigenère / Beaufort over the dbbi (& faed) a–i field — brute periods 1–6 and the 'reinsert the prime basics' additive-prime-key reading — 0 English",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi; 597,870 keys x both directions (Vigenere add and Beaufort), periods 1 through 6, each followed by field-decode and English scoring.",
  "method": "Treat dbbi as polyalphabetically enciphered and brute every short key, including using the INCASE/VIC checkerboard ordering and matrixsumlist/genesis-URL/cell-stream as keys, to recover plaintext.",
  "output": "Zero English across ~600k keys; control with a known-good text scored 0.95 while dbbi readings stayed <=0.43. [Also documented separately as \"Vigenere / Beaufort brute force, periods 1-6, on dbbi\" (dead-end ledger): Exhaustively brute-forced every short polyalphabetic key up to period 6 in both cipher directions, field-decoded each output, and scored for English, to rule out short-key polyalphabetic encipherment of dbbi. Result: Zero English.]  ·  [merged: “'Reinsert the prime basics' as a prime Vigenère over dbbi/faed does not decode them”] 72 variants → 0 readable (best printable ratio 0.632), 0 thematic hits.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "@DaneelOlivaw",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "ledger-vigenere-colored-prime-bits-duality-bits",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Vigenere against colored-prime bits and full 24-bit duality stream",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed as ciphertext. Keys: the blue/yellow LSB sequence (colored-prime bits) and the whole 24-bit colored stream from the genesis grid.",
  "method": "Built keystreams from the genesis colored-cell bits (the blue=1/yellow=0 parities and the full 24-bit stream) and used them as Vigenere keys, on the theory that the colors encode yellowblueprimes/yinyang key material.",
  "output": "Noise.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The colored-prime bits / 24-bit duality stream come from the genesis grid colored cells (content/matrix.js).",
  "links": [
   {
    "label": "Walkthrough — genesis colored cells",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "ledger-vigenere-matrixsumlist-url-cellstream",
  "phase": "salphaseion",
  "category": "polyalphabetic & fractionation",
  "title": "Vigenere against matrixsumlist / genesis URL / spiral cell-stream",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed as ciphertext. Keys: the matrixsumlist row+col sum digits, the decoded genesis URL bytes (gsmg.io/theseedisplanted), and the 196-cell spiral cell stream.",
  "method": "Used three genesis-derived byte sources as Vigenere keys over the blocks, reasoning the key should come from Phase 0 material the creator keeps pointing back to. Scored against a known-good control to calibrate.",
  "output": "Noise (score <=0.43 versus a 0.95 known-good control).",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The matrixsumlist / genesis-URL / spiral cell-stream keys come from content/matrix.js.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "ledger-yinyang-complement-standalone",
  "phase": "salphaseion",
  "category": "yinyang / complement",
  "title": "Yin-yang complement substitution (a<->i, b<->h, c<->g, d<->f, e fixed)",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed. Mapping: a<->i, b<->h, c<->g, d<->f, e fixed (the duality/complement map).",
  "method": "Applied the yin-yang duality complement (each symbol swapped with its mirror around the center 'e') standalone, on the theory that 'yinyang' literally means apply the complement to the blocks.",
  "output": "Fail. [Also documented separately as \"Yin-yang complement chained with prime zeroing\" (dead-end ledger): Combined the duality complement with the prime 'zero out' instruction, sequencing them (complement -> then zero/insert at primes) in fresh permutations to cover orderings the earlier standalone tests missed. Result: Fail.]",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The yin-yang complement substitution (a↔i, b↔h, …) is a community reading of the \"duality\" theme.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "dbbi-compression-fileformat-probe",
  "phase": "salphaseion",
  "category": "dbbi / faed — statistical",
  "title": "Compression / file-format magic-header probe on dbbi-as-bytes",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi mapped to bytes under 4 byte-mappings; checked for gzip/zlib/bzip2/xz/zip/OpenSSL 'Salted__' magic and run through every decompressor.",
  "method": "Test whether dbbi is a packaged/compressed file rather than text or cipher, by scanning for known magic headers in several byte interpretations and attempting decompression.",
  "output": "No magic header found and nothing decompresses; byte-entropy 5.0-5.25/8 indicates structured-but-not-packaged data. [Also documented separately as \"Compression / file-format magic probe on dbbi-as-bytes\" (dead-end ledger): Tested whether dbbi is actually a packaged/compressed file by scanning four byte-interpretations for known file-format magic bytes and attempting every standard decompressor. Result: No magic header, nothing decompresses. Byte-entropy 5.0-5.25 out of 8 -- structured, but not a packaged file. Insight: dbbi's byte entropy of 5.0-5.25/8 shows it is structured (non-random) yet is provably not any standard compressed/packaged file format.]",
  "outcome": "verified-insight",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "faed-format-alignment-compression",
  "phase": "salphaseion",
  "category": "dbbi / faed — statistical",
  "title": "faed format/alignment/compression probe (Salted__, block alignment, magic headers)",
  "who": "this project + community",
  "source": "this session + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "faed-as-bytes in candidate byte-mappings. Checked for an OpenSSL 'Salted__' header, 16-byte AES block alignment, and gzip/zlib/bzip2/xz/zip compressed-file magic; attempted decompressors.",
  "method": "If faed were an encrypted file or a compressed container rather than a cipher of text, it would carry a recognizable header or align to a block boundary. This screens whether faed is a packaged binary artifact before spending effort on linguistic cipher attacks.",
  "output": "Not an OpenSSL-AES 'Salted__' blob, not 16-byte block-aligned, not any known compressed format; nothing decompresses. Statistically faed reads as a high-entropy value/key, consistent with the creator's 'may be for another puzzle, or not at all' remark. [Also documented separately as \"Format & alignment check on faed\" (dead-end ledger): Checked whether faed is itself a packaged ciphertext or file: looked for the OpenSSL 'Salted__' prefix, AES 16-byte block alignment, and known compression magic bytes. Result: Not OpenSSL-AES, not block-aligned, not a known compressed format -- statistically a high-entropy value/key. Insight: faed is not an OpenSSL/AES blob, not 16-byte block-aligned, and not a known compressed format -- statistically it behaves as a high-entropy value or key, not a container.]",
  "outcome": "verified-insight",
  "insight": "faed is not a Salted__ AES blob, not block-aligned, and not a compressed container -- combined with its random IC, it behaves like a standalone high-entropy value/key (matching the creator's note that the 'second half will probably be used for ANOTHER PUZZLE, or not at all').",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "faed-ic-near-random-118",
  "phase": "salphaseion",
  "category": "dbbi / faed — statistical",
  "title": "faed Index of Coincidence ~0.118 (near-random) battery",
  "who": "this project + community",
  "source": "this session + dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The 570-symbol faed string. Measured Index of Coincidence (IC) on the raw string and under candidate monoalphabetic substitutions, transpositions, and polyalphabetic periods 1-30.",
  "method": "If faed were enciphered natural-language English, its IC would be elevated (English ~0.066 on 26 letters; for a 9-symbol alphabet a substituted/transposed English text holds an IC well above uniform ~0.111). An IC pinned at the uniform-random floor across all periods proves no monoalphabetic/polyalphabetic English is hiding inside. This was run as the decisive screening test before deeper cipher work.",
  "output": "IC stays ~0.118 (uniform-random floor for 9 symbols) across all tested periods 1-30 -> decisively rules out faed being enciphered English. [Also documented separately as \"IC-invariance battery on faed\" (dead-end ledger): Measured the Index of Coincidence of faed across many candidate transforms to decide whether it could be enciphered natural-language English, which would show an elevated IC. Result: IC stays ~0.118 (random) under all transforms -- decisively rules out faed being enciphered English. Insight: faed's IC pins at ~0.118 (random) under all substitutions/transpositions/periods 1-30, decisively proving faed is NOT enciphered English text -- it is high-entropy value/key data.]",
  "outcome": "verified-insight",
  "insight": "faed is statistically NOT enciphered English (IC ~0.118 across all periods 1-30); it behaves like a high-entropy value/key, not a substitution/transposition ciphertext. REFINEMENT (2026-07-13, attempt 0147): the near-uniform IC MASKS a real 1st-order bias — a chi-square test vs uniform gives 43.7 on df8 (crit 26 @ p.001), driven by a g-spike (107 vs 63 expected) and a systematic bias toward larger digits (values 5-9 avg ~73 vs 1-4 avg ~51). But autocorrelation (peak |0.10|), serial-correlation (0.003) and deflate (0.449 = the random baseline's 0.451) show NO higher-order structure. So faed is 1st-order biased, 2nd-order flat = a high-entropy NUMERIC value (not text, not white noise). By contrast dbbi is genuinely structured (chi2 40.2, entropy 90.9% of max, deflate 0.593, b-dominant) — a message-bearing half. The 'half & better half' are asymmetric in KIND: dbbi hides a MESSAGE, faed hides a VALUE/KEY.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-symbol-frequency-analysis",
  "phase": "salphaseion",
  "category": "dbbi / faed — statistical",
  "title": "dbbi statistical characterization — frequency/bigram, Index of Coincidence, autocorrelation and column-IC period detection",
  "who": "this project + community",
  "source": "dead-end ledger",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi 91-symbol frequency table (b and e together ~47%); bigram 'be' over-represented (~2.3 sigma); whole-string IC = 0.151; per-column IC for periods 1-30; autocorrelation lags 7/14/21/28 and lag-7 vs a frequency-preserving null.",
  "method": "Statistically characterize dbbi: measure letter and bigram frequencies, index of coincidence, look for a Vigenere period via column-IC spikes, tokenize on the over-represented 'be' couplet, and test autocorrelation against a histogram-preserving shuffle to distinguish real periodicity from frequency skew.",
  "output": "b/e dominate and 'be' is a genuine ~2.3-sigma couplet, but split-on-'be' fields look nothing like primes; no reliable Vigenere period (period-13/26/29 'spikes' are 3-7-symbol small-sample artefacts); lag-7 autocorr only z~1.95 with no harmonics - mostly the b/e skew. dbbi is structured but not enciphered English. [Also documented separately as \"Couplet / bigram tokenisation of dbbi (split on 'be')\" (dead-end ledger): Because 'be' appears far more often than chance (~2.3 sigma), they hypothesized it is a delimiter, split dbbi on it, and decoded the resulting fields, hoping they would read as a list of primes. Result: Irregular fields whose values look nothing like primes -- tokenisation negative.]  ·  [merged: “Autocorrelation of dbbi with a frequency-preserving null”] lag-7 only z~1.95 with no harmonics at 14/21/28 -- weak, and mostly explained by the b/e skew.  ·  [merged: “Column-IC period detection on dbbi, periods 1-30”] No reliable period -- the apparent spikes at period 13/26/29 are small-sample artefacts (only 3-7 symbols per column).",
  "outcome": "verified-insight",
  "insight": "dbbi has real internal structure (b/e dominance, a ~2.3-sigma 'be' bigram, byte-entropy ~5.0-5.25/8) yet no cipher period or readable tokenization - it behaves like a structured numeric/key value, not enciphered text.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "dbbi-yellowblue-prime-index-rabbit-cells",
  "phase": "salphaseion",
  "category": "dbbi / faed — exotic transforms",
  "title": "dbbi Yellow/Blue prime-index vs the genesis rabbit Y/B cells -- reported ~20-bit match did NOT reproduce (statistical artifact)",
  "who": "community",
  "author": "@CoruNethron",
  "source": "Telegram — GSMG Puzzle Solvers, msg #33995/#33996",
  "date": "2024-12-12",
  "dateApprox": false,
  "input": "dbbi (dbbibfbhccbeg...beeeabe), the genesis 14x14 rabbit grid's yellow & blue cells (spiral order, blue=1/yellow=0 = 111101110011110110010010), and the prime positions used for 'yellowblueprimes'.",
  "method": "REPORTED rule: index dbbi by prime-number positions while treating certain 'be' occurrences as a SINGLE index, then line the resulting yellow/blue sequence up against the genesis grid's Y/B colored cells. Because the rule was under-specified, it was reconstructed here exhaustively: 1,764 concrete interpretations across 4 independent lenses (be-collapse-then-prime-index; prime-index-then-be-merge; single-scan digraph-emit; broad freeform) x {0-based and 1-based primes} x {~10 symbol->bit mappings incl. b/be->1, prime-value->0, parity} x {forward/reversed dbbi} x {spiral Y/B target, its reverse, blue-position set, yellow-position set}.",
  "output": "REPORTED: the first ~20 bits match the rabbit grid's Y/B cells, suggesting dbbi carries the same Yellow/Blue-prime pointer structure. TESTED HERE (2026-07-02): the exhaustive reconstruction could NOT reproduce a 20-bit leading match. Best leading agreement anywhere was only 10 bits -- and only against the REVERSED target with post-hoc knob-tuning; the most literal reading of the rule yields 0-6 leading matching bits. No interpretation reached even 11 leading bits.",
  "outcome": "verified-fail",
  "insight": "The reported '~20-bit match' does not reproduce under exhaustive reconstruction, and the apparent agreement is a statistical artifact: the genesis Y/B target opens with a 1-dense prefix (11110111...), so ANY rule that emits mostly 1s early trivially matches the first several bits without encoding real structure. dbbi is not shown to carry the genesis Y/B pointer sequence. Retained -- attributed and honestly labelled -- as a community report that was tested here and did not hold.",
  "time": "20:40 UTC",
  "sourceQuote": "But no one yellow is prime … Ow. 9 yellows total",
  "provenance": "dbbi (91 a–i symbols) from the SalPhaseIon soup, and the 9 yellow / 15 blue cells of the genesis grid (content/matrix.js); the Y/B prime-index reading is @CoruNethron's.",
  "links": [
   {
    "label": "Walkthrough — genesis colored cells & dbbi",
    "href": "#/walkthrough"
   }
  ],
  "image": "assets/walkthrough/community-images/genesis-prime-cells-5yellow-7blue.jpg",
  "imageAlt": "Genesis followthewhiterabbit grid with only prime-position cells left colored: 5 yellow, 7 blue",
  "imageCaption": "Community diagram (Telegram — id:5260693904, 2024-10-09, msg #27695): the followthewhiterabbit genesis grid re-coloured so only the cells on prime positions keep their colour — leaving 5 yellow and 7 blue. A direct visual of the \"prime-index the Y/B cells\" reading this card tests."
 },
 {
  "id": "dbbi-ebcdic-vic-transforms",
  "phase": "salphaseion",
  "category": "dbbi / faed — exotic transforms",
  "title": "EBCDIC (cp1141 family), VIC checkerboard, genesis-spiral transforms on dbbi",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "dbbi field-decoded bytes (digit maps 0-8 and 1-9) decoded through EBCDIC codecs cp500/cp037/cp1140/cp1026/cp273/cp424/cp875 (cp1141 unavailable in Python, nearest German/Intl pages used); the Phase-3.2 VIC alphabet FUBCDORA.LETHINGKYMVPS.JQZXW as a monoalphabetic key; the genesis matrix.js CCW spiral path as the reindexer.",
  "method": "Re-apply the exact transforms that worked elsewhere in the chain: EBCDIC cp1141 + Beaufort cracked Phase-3.2, and the VIC alphabet decoded its digit block - so run dbbi's bytes through EBCDIC code pages and its symbols through the VIC permutation and the genesis spiral, on the theory the same machinery is reused.",
  "output": "Garbage under every code page, the VIC alphabet, and the spiral reindex; outputs fed to the blob oracle produced zero hits. Both EBCDIC and VIC/book-cipher readings of dbbi eliminated.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "ledger-iching-loshu-flying-star",
  "phase": "salphaseion",
  "category": "dbbi / faed — exotic transforms",
  "title": "I Ching / Lo Shu nine-palace flying-star transform",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed. Operations: complement substitution, flying-star transposition, 180-degree spatial map, trigram/hexagram parity; then assembly + direct hash.",
  "method": "Treated the base-9 structure as the Lo Shu 3x3 nine-palace magic square and applied I Ching flying-star transpositions, 180-degree rotation, and trigram/hexagram parity readings, which the analysts flagged as the strongest remaining untested numerology lead.",
  "output": "Noise -- the strongest 'untested' lead, now closed.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The I-Ching / Lo-Shu nine-palace flying-star transform is a community proposal.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "ledger-nonary-digital-root-999",
  "phase": "salphaseion",
  "category": "dbbi / faed — exotic transforms",
  "title": "Nonary / digital-root '999' (Zero Escape) scheme",
  "who": "community",
  "source": "Community dead-end ledger (group discussion; compiled in docs/ATTEMPTS.md)",
  "input": "dbbi and faed partitioned into door-groups; 9s zeroed; running digital-root computed; 'first-or-zero' rule; then assembly + direct hash.",
  "method": "Inspired by the '999'/Zero Escape and nine-theme hints, they grouped symbols into 'doors', zeroed out the 9s, ran a running digital-root reduction, applied a first-or-zero rule, then both assembled a key and hashed directly.",
  "output": "Noise.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "The Community",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt. The nonary / digital-root \"999\" (Zero Escape) scheme is a community proposal.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "ledger-turtle-numpad-path-drawing",
  "phase": "salphaseion",
  "category": "dbbi / faed — exotic transforms",
  "title": "Turtle / numpad path-drawing of the symbol streams",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #33517",
  "input": "dbbi (91 moves) and faed (570 moves). Symbols a-i mapped to numpad directions; paths drawn on a grid and rendered to an image.",
  "method": "Mapped each a-i symbol to a numeric-keypad direction and walked a turtle across a grid, drawing the 91-move and 570-move paths, hoping the trace would form a glyph, a yin-yang symbol, or a readable shape.",
  "output": "A connected but meaningless blob (explained entirely by direction bias) -- no glyph, no yin-yang.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "id:6953392511",
  "date": "2024-12-02",
  "time": "15:04 UTC",
  "sourceQuote": "Directions on that numpad",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "cosmic-no-partial-progress-oracle",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Structural 'no partial-progress oracle' on the cosmic recipe",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Cross-cutting structural observation over the entire cosmic-recipe search (~20,000 targeted attempts + full 370k-word dictionary × {literal, sha256hex} ≈ 1.5M decrypts). The cosmic key requires THREE unknowns simultaneously: the value of yellowblueprimes, the value of yinyang, AND the exact combine operation/separator.",
  "method": "Across every recipe family above, results were analyzed for any signal short of a full solve. Because each test reduces to AES-256-CBC decryption, and AES only yields valid PKCS7 + readable text when the ENTIRE passphrase is exactly right, two-of-three components perfect still produces pure random bytes. This was confirmed empirically: no recipe ever scored above chance printability, with no gradient toward a solution.",
  "output": "Confirmed: the cosmic recipe has NO partial-progress oracle — the search is multiplicative and feedback-free. Two-of-three ingredients/combine correct yields zero distinguishable signal, which is precisely why ~1.5M decrypts produced no gradient and why cleverness alone cannot close it (matching the Architect's 'brute forcing might be required').",
  "outcome": "verified-insight",
  "insight": "The cosmic blob provides no partial-progress feedback: the key needs yellowblueprimes, yinyang, AND the combine operation all simultaneously correct, so any two-of-three-perfect attempt is indistinguishable from random — a multiplicative, feedback-free search with no oracle to guide it.",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-3ingredient-omit-yinyang",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "3-ingredient recipe omitting yinyang (faed may be 'another puzzle')",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Recipes built from only THREE ingredients {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice} (yinyang/faed dropped), in candidate value-forms and orders, hashed and tested vs all 3 blobs (recipe.py / combine families; ybp value-candidates from genesis prime/blue/yellow char readings).",
  "method": "The creator stated 'the second half [faed] will probably be used for ANOTHER PUZZLE, or not at all,' so the cosmic recipe was tried WITHOUT the yinyang slot — combining only the three remaining ingredients (with yellowblueprimes drawn from genesis prime/colored-cell char readings) to test the hypothesis that yinyang is not actually a cosmic ingredient.",
  "output": "0 hits. Dropping yinyang does not yield a working recipe; the 3-ingredient assemblies decrypt to garbage on all blobs.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-kdf-variants-md5-sha1-sha512-pbkdf2",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Alternate KDFs (MD5/SHA-1/SHA-512 EVP, PBKDF2) on top candidate keys",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Top candidate passphrases (soup tokens, ingredients, 'our first hint is your last command', causality, hashthetext, theseedisplanted, the entry string, etc.) run through non-standard KDFs: MD5-EVP, SHA-1/SHA-512-EVP, and PBKDF2-HMAC-{sha256,sha1} with {1, 1k, 10k} iterations; also trailing-newline passphrase variants. Tested vs salph_inner & p32_trailing (and cosmic in the berserk KDF pass) (kdf_variants.py, lens4_salph.py, ENDGAME §8c).",
  "method": "All confirmed blobs use OpenSSL EVP_BytesToKey with SHA-256, but to rule out a different key-derivation the strongest candidate passphrases were re-run through MD5/SHA-1/SHA-512 EVP and PBKDF2 (varied iteration counts), plus trailing-newline forms (a common OpenSSL pitfall).",
  "output": "0 hits under any alternate KDF. Cosmic and the small blobs use standard SHA-256 EVP (matching the rest of the chain); no MD5/SHA1/SHA512/PBKDF2 derivation of any candidate opens them. [Also documented separately as \"Non-standard KDFs (MD5/SHA-1/SHA-512 EVP, PBKDF2) on cosmic + small blobs with top keys\" (this session): The whole verified chain uses OpenSSL EVP_BytesToKey with SHA-256, but a wrong KDF assumption would make even a correct passphrase fail. berserk1.py re-derived key+IV under alternative message-digests and PBKDF2 to rule out a KDF mismatch, scoring any plaintext for >0.85 printability. Result: 0 readable decrypts. Cosmic and the small blobs use standard SHA-256 EVP, matching the rest of the chain; no KDF variant unlocks anything.]",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-double-sha-shabef",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Double-SHA ('shabef' = sha256 applied twice / N times)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The recipe assembly hashed with sha256 nested N times, N∈{2,5,6} (the soup token 'shabef' = a1z26 sha + b,e,f = 2,5,6 → sha256, appearing TWICE in the soup). Applied to the 4-ingredient concat (and per-ingredient forms) as the EVP passphrase, vs cosmic/salph_inner/p32_trailing (n5_recipe.py, combine_unknowns.py, literal_recipe.py double-sha form).",
  "method": "'shabef' brackets the inner-blob region twice and decodes to 'sha256' with the digits {2,5,6}; this was read as a possible instruction to apply sha256 two (or 2/5/6) times. The assembled recipe string was therefore iterated through sha256 multiple times and the resulting hex/raw digest used as the passphrase.",
  "output": "0 hits for any N on any blob. Double/multi-sha of the recipe does not open the blobs.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-xor-7-token-issue56",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Issue #56 XOR-of-7-tokens recipe reproduced and refuted",
  "who": "community",
  "source": "GitHub — puzzlehunt/gsmgio-5btc-puzzle, issue #56",
  "input": "The exact 7-token XOR recipe from issue #56: XOR of sha256 of each of [matrixsumlist, enter, lastwordsbeforearchichoice, thispassword, matrixsumlist, yourlastcommand, secondanswer] → 32-byte key. The claimed 'next-page' plaintext SHA target was 4f7a1e4efe4bf6c5581e32505c019657cb7b030e90232d33f011aca6a5e9c081. Reproduced in xor7.py and tested as EVP passphrase (raw + hex), and as a direct AES key with IV∈{0, salt}.",
  "method": "Issue #56 claimed the cosmic key is the XOR of seven token hashes. The recipe was reproduced exactly, the resulting 32-byte XOR computed, and used both as an EVP passphrase and as a direct AES-256 key (IVs zero and salt) against cosmic, salph_inner and p32_trailing. Also swept variations: token pools sized 4–8, all permutations of the 4 core tokens plus extras, as EVP-raw and direct key.",
  "output": "Does not reproduce its own claimed plaintext SHA (4f7a1e…). Decrypts nothing readable on any blob — every result is PKCS7-fail or random bytes. The recipe is FALSE. (Separately, the '4f7a1e…' Wayback 'next page' is itself a 530 server error, never real content; and the tokens yourlastcommand/secondanswer originated as on-chain solver dust, not creator hints.)",
  "outcome": "verified-fail",
  "insight": "",
  "author": "dgk5902a-boop",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "GitHub — issue #56",
    "href": "https://github.com/puzzlehunt/gsmgio-5btc-puzzle/issues/56"
   },
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "date": "2025-08-31"
 },
 {
  "id": "cosmic-master-key-818af53d-issue69",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Issue #69 'master key' 818af53d… tested under every interpretation and refuted",
  "who": "community",
  "source": "GitHub — puzzlehunt/gsmgio-5btc-puzzle, issue #69",
  "input": "The claimed 64-hex master key 818af53daa3028449f125a2e4f47259ddf9b9d86e59ce6c4993a67ffd76bb402, tested against cosmic, salph_inner, p32_trailing as: (A) EVP passphrase in 4 forms {literal 64-ascii, sha256(hex64), raw-sha256-of-32-bytes, double-sha} under md5 & sha256 KDFs; (B) the raw 32 bytes as a DIRECT AES-256 key with 6 IVs {0, salt+0pad, salt*2, sha(key)[:16], key[:16], key[16:32]}; (C) ascii[:32] as a direct key with IV∈{0,salt}. (adv_verify_69.py)",
  "method": "Issue #69 posted a single 'master key' allegedly decrypting cosmic. Because the issue's quoted 'decrypted payload' was just a copy-paste of the already-known phase-3.2 VIC text, it was independently re-derived (de-obfuscating tel:-markdown links) and adversarially tested under every plausible cryptographic interpretation — EVP passphrase, direct key, multiple IVs and KDFs — counting a WIN only as meaningful printable plaintext, not mere PKCS7-validity.",
  "output": "ZERO meaningful/printable hits across all interpretations and all 3 blobs (cosmic padding-fails under EVP-hex, raw-key/IV=0, raw-key/IV=salt and ECB). The quoted 'payload' is fabricated (it is the phase-3.2 VIC sentence). The key fails the small 80-byte oracle blobs too, where a correct key would be instantly obvious. FABRICATED.",
  "outcome": "verified-fail",
  "insight": "",
  "author": "nightidn641",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "GitHub — issue #69",
    "href": "https://github.com/puzzlehunt/gsmgio-5btc-puzzle/issues/69"
   },
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "date": "2025-12-27"
 },
 {
  "id": "cosmic-4ingredient-literal-sha256-all-orders",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Literal 4-ingredient words → sha256 (every order and separator) — the password is not the literal words",
  "who": "this project",
  "source": "this session",
  "date": "2023-01-01",
  "dateApprox": true,
  "input": "The four named cosmic ingredients as their LITERAL label words: yellowblueprimes . matrixsumlist . lastwordsbeforearchichoice . yinyang. All 24 permutations (4!) of the four words, joined with each of 8 separators {'', '.', ' ', '-', '_', '+', ',', '\\n'}. Tested against all 3 open blobs (cosmic 1328B, salph_inner 80B, p32_trailing 80B). ~6,900 assemblies (literal_recipe.py).",
  "method": "The 2023 reverse-binary master hint names four ingredients to combine. The simplest reading is that the puzzle wants sha256 of the four literal label words concatenated. Each assembled string was run through 5 key-forms (sha256hex, raw-sha256-hex, double-sha hex, sha-of-hex, and the literal string itself) as the OpenSSL EVP passphrase, then AES-256-CBC decrypted and the plaintext scored for printable/PKCS7-valid text.",
  "output": "0 hits on any of the 3 blobs. Best printable score remained at chance level (~0.59). No assembly produced valid readable plaintext.  ·  [merged: “~750 + 96 literal-word ingredient assemblies vs the real blob”] Only chance-level PKCS7 passes, all decrypting to garbage. The password is not the literal words.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-per-ingredient-sha-then-concat-and-xor",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Per-ingredient SHA then concat, and XOR-of-N-ingredient-hashes",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Two structural combine variants: (a) sha256hex each of the 4 ingredients then concatenate the four 64-hex digests (then optionally re-sha); (b) XOR of the 4 per-ingredient sha256 digests → 32-byte key, used as EVP-raw passphrase and as direct AES key. Also generalized to XOR-of-N token hashes, N=4..8. Ingredient values included dbbi/faed raw-byte and field-decoded forms (combine_unknowns.py, final_recipes.py, combine_values.py).",
  "method": "Beyond plain concatenation, the recipe might combine ingredients by hashing each separately. Two natural schemes were tested: concatenating the per-ingredient hashes (then sha), and XOR-ing the per-ingredient hashes into one 32-byte key. dbbi was treated as the yellowblueprimes raw/field-decoded ingredient and faed as yinyang, in addition to the literal words.",
  "output": "0 hits. Neither per-ingredient-sha-then-concat nor XOR-of-N-hashes (as EVP passphrase or direct key) opens any blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-include-enter-thispassword-tokens",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Recipe including the unused soup tokens 'enter' and 'thispassword'",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The 4 master ingredients plus the two 'unused' soup tokens, in combinations: all 24 permutations of {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang} × extra ∈ {∅, ['enter'], ['thispassword'], ['enter','thispassword']}; also the on-chain soup-4 string 'matrixsumlistenterlastwordsbeforearchichoicethispassword'. Forms {sha256hex, literal, raw-sha, double-sha} vs all 3 blobs (combine_values.py §C, literal_recipe.py).",
  "method": "The soup contains two decoded tokens — 'enter' and 'thispassword' — that are NOT among the 4 master ingredients, suggesting they might be additional recipe components (e.g. 'enter this password'). They were appended/interleaved into the 4-ingredient assembly in every order and hashed, plus the exact soup-order concatenation that solvers posted on-chain.",
  "output": "0 hits on any blob. Adding enter/thispassword to the recipe produces no readable decrypt.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-phase-chain-key-reuse",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "Reusing the phase-2/3/3.2/entry chain keys as cosmic ingredients/keys",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The verified phase chain keys used as passphrase material on the blobs: phase2 sha256('causality')=eb3efb…e5bf; phase3 1a57c572…30d5; phase3.2 sha256('jacquefresco…principle')=250f3772…ce4c; SalPhaseIon entry sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe')=89727c59…6a32. Tested literal, as sha256-of-key, and (for 64-hex) as direct 32-byte AES keys with IV∈{0, salt*2} (combine_values.py, final_recipes.py, attack_double.py).",
  "method": "The Architect speaks of 'seven intertwined passwords' and reusing earlier material, so each already-solved phase key was tried directly as the cosmic/small-blob passphrase, as a hashed passphrase, and (being 64-hex) as a raw AES key. attack_double.py additionally checked whether any chain key produces a nested 'Salted__' header (double encryption).",
  "output": "0 hits on any blob; no chain key yields readable plaintext, and no first-layer decrypt produces a 'Salted__' inner header. Chain-key reuse does not open the endgame blobs.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-full-master-hint-string-as-key",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "The full master-hint string (ingredients + taunt block) as the key",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The complete 161-byte (=7·23) master-hint string: the 4 ingredients followed by the trailing taunt block wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit · verylaststepisatruegiveaway · promised (taunt lengths [25,39,27,8]). Tested as a single passphrase in forms {literal, sha256hex, raw-sha, double-sha}, with separators, vs all 3 blobs (literal_recipe.py 'taunt', combine_values.py PHR pool).",
  "method": "Rather than treating the taunts as flavor, the entire reverse-binary master-hint payload (ingredients + four taunt phrases) was concatenated and hashed as one passphrase, on the theory that the whole 161-byte string is the key material. Each taunt phrase was also tried individually as literal/sha passphrase.",
  "output": "0 hits. Neither the full master-hint string nor any individual taunt phrase opens any blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-ybp-yinyang-as-rawbytes-from-dbbi-faed",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "dbbi/faed raw and decoded values slotted directly as the yellowblueprimes/yinyang cosmic ingredients — 0 opens",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "yellowblueprimes := dbbi in forms {literal, a-i→1-9 digits, field-decoded bytes hex, sha256(dbbi)}; yinyang := faed in forms {literal, digits, field-decoded hex, complement, sha256(faed), 'yinyang'}; slotted with matrixsumlist-numeric and lastwordsbeforearchichoice in both ingredient orders; combined via sha256(concat), XOR-of-sha, and shabef-nesting (combine_unknowns.py, n5_recipe.py).",
  "method": "Since dbbi/faed are believed to ENCODE yellowblueprimes/yinyang, the creator might concatenate their decoded bytes (not words). Each dbbi/faed byte-interpretation was substituted into the recipe and combined three ways (sha256-concat, XOR-of-per-ingredient-sha, multi-sha) against all 3 blobs, gating on printable+English plaintext.",
  "output": "0 hits across all dbbi/faed byte-forms, orders and combine operations. Best printable ratios stayed at chance for every blob.  ·  [merged: “Blocks read straight as base-9 numbers fed into the cosmic hash”] Zero valid PKCS7 against the real SalPhaseIon blob.  ·  [merged: “faed (and its base-9 integer forms) used directly as the cosmic passphrase/ingredient”] Zero valid PKCS7 against the real SalPhaseIon blob across the numeric assemblies; all garbage. faed-as-ingredient does not fire the combine.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-1327-byte-blob-103x103-matrix",
  "phase": "salphaseion",
  "category": "cosmic duality structure",
  "title": "DEBUNK: the '1327-byte Cosmic Duality decrypt → 103×103 matrix' claim rests on a FABRICATED decrypt (issue #56's fake 4f7a1e page); only the arithmetic is real",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #60205",
  "date": "2026-02-26",
  "dateApprox": false,
  "input": "A community claim that the AES-decrypted Cosmic Duality output is a 1327-byte blob with SHA256 4f7a1e4efe4bf6c5581e32505c019657cb7b030e90232d33f011aca6a5e9c081, reshaped into a 103x103 bit grid. CRITICAL PREMISE CHECK: the cosmic blob is UNSOLVED, so no such decrypt is known to exist; that 4f7a1e hash is the fabricated 'next page' from GitHub issue #56 -- its only Wayback capture is a 530 server error (never real content), and no cosmic key produces a plaintext hashing to it (see cosmic-xor-7-token-issue56 and ENDGAME-ANALYSIS.md 7/8c).",
  "method": "Separated the arithmetic from the premise. ARITHMETIC (true): 1327 bytes = 10616 bits = 103*103 (=10609) + 7 leftover bits, so ANY 1327-byte stream folds into a 103x103 grid with 7 spare bits, and 103 is prime. PREMISE (false): there is no verified 1327-byte Cosmic Duality decrypt to reshape -- the endgame is open -- and the specific decrypt cited is the issue-#56 fabrication this catalog independently refutes.",
  "output": "The reshape is numerology applied to a NON-EXISTENT plaintext. The only real content is the arithmetic (any 1327-byte stream reshapes to 103^2+7 bits; 103 happens to be prime). There is no known cosmic decrypt, and the cited 4f7a1e 'decrypt' is fabricated -- so this is NOT a structural finding about the real endgame, and '103' is not a verified lead. Logged as a cautionary correction. (Same lineage: GitHub issue #84's 'reshape / 35 blocks' talk traces back through the same Bitcointalk thread.)",
  "outcome": "verified-fail",
  "insight": "A widely-repeated claim that dissolves under scrutiny: '103x103' is correct arithmetic applied to a FAKE decrypt (issue #56's 4f7a1e 'next page', a Wayback 530 error). Because the cosmic blob is unsolved there is no plaintext to reshape, so the 103-is-prime coincidence proves nothing about the endgame. Kept as a debunk so the number 103 is not mistaken for a verified structural lead.",
  "author": "@VadikShaa",
  "time": "22:06 UTC",
  "sourceQuote": "My matrix uses 10609 bits. 10609 bits require 1327 bytes minimum. If your decrypted output is 1328 bytes (AES block multiple), then one byte is likely padding/unused. So the relevant payload for the matrix is 1327 bytes → a 103×103 matrix.",
  "provenance": "The cosmic blob's 1328-byte ciphertext (ciphertexts/cosmic.txt); 103×103 = 10609 is @VadikShaa's claim.",
  "links": [
   {
    "label": "Reference — cosmic blob",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "blob-independence-conclusion",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Decisive conclusion: the four blobs are cryptographically independent containers",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Synthesis of all blob-combination negatives: no shared 16-byte blocks, random 80B-XOR (printable 0.48), random salt-concat, no multi-blob key (4 chance events), no cross-keying, no ciphertext-concat decrypt.",
  "method": "The combined structural evidence was evaluated against the 'one scattered AES' hypothesis. Each blob is standard OpenSSL aes-256-cbc -md sha256 with its OWN random 8-byte salt, so each requires its OWN passphrase; the connection between blobs is at the key-derivation/narrative layer (shared ingredients feeding different blobs), not at the ciphertext/salt layer.",
  "output": "The four blobs are provably independent — NOT fragments of one cipher. Mixing the blobs or their salts unlocks nothing; the path forward is each blob's individual passphrase (cosmic via yellowblueprimes/yinyang, salph_inner via enter/thispassword/first-hint, p32_trailing via the chess construction, urlblob via its provenance).",
  "outcome": "verified-insight",
  "insight": "The four AES blobs are cryptographically independent containers (own random salts, no shared structure), so the puzzle's linkage lives in key-derivation/narrative, not in combining the blobs.",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-multi-blob-detection-scattered-signature",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Multi-blob detection — explicit search for any key opening >=2 blobs",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Across the full ~35,000-combination value sweep, each candidate hashed {sha256hex, literal, raw-sha256, double-sha256} and tested against all 4 blobs, flagging any key that yields PKCS7-valid output on 2 or more blobs.",
  "method": "A key that opens two-plus blobs would be the unmistakable signature of one scattered AES message. The harness logged every multi-blob event and scored its plaintext for readability rather than relying on PKCS7 alone.",
  "output": "Exactly 4 multi-blob PKCS7 events occurred — ALL chance noise (printable 0.30-0.49, i.e. random bytes), and ~3 such events are statistically expected at this test volume. No candidate opened any blob to readable text.",
  "outcome": "verified-insight",
  "insight": "The ~4 keys that PKCS7-validated on >=2 blobs were all random-byte noise (printable 0.30-0.49) at the chance-expected rate, so no single key unlocks multiple blobs.",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-repeated-block-shared-block-scan",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Repeated-block / shared 16-byte ciphertext block scan across all blobs",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "All 16-byte ciphertext blocks of cosmic (83), salph_inner (5), p32_trailing (5), urlblob (6), compared within and across blobs.",
  "method": "In CBC, identical plaintext blocks under the same key/IV produce identical ciphertext blocks; a shared message scattered across blobs would likely leave repeated blocks. Every 16-byte block was hashed and compared within each blob and across all pairs.",
  "output": "No 16-byte ciphertext block is shared across any pair of blobs (and no telling internal repeats). The blobs do not encrypt the same plaintext under the same key/IV.",
  "outcome": "verified-insight",
  "insight": "No 16-byte ciphertext block is shared across any blob pair, decisively ruling out a single scattered plaintext encrypted under a common key/IV.",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "urlblob-4th-orphaned-blob-salt-74c974e3",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "The 4th blob (urlblob, salt 74c974e3f92e64b5, 96-byte ct): located in a gsmg.io 'Salted__' URL path, recovered in full & committed reproducibly, and swept null — an orphaned, independent container",
  "who": "this project",
  "source": "this session (Wayback CDX hex URL + urlblob.bin)",
  "date": "2026-02-07",
  "input": "A hex-encoded Salted__ blob found as a literal gsmg.io URL path in the CDX: gsmg.io/53616c7465645f5f74c974e3f92e64b5…0607 (captured 2026-02-07, returns the SPA shell). Decoded to urlblob.bin (112 bytes total) = magic 'Salted__' + salt 74c974e3f92e64b5 + 96-byte ciphertext (6 AES blocks). This is the FOURTH distinct OpenSSL blob, alongside cosmic (2d3f6fe0…), salph_inner (3ab58534…) and p32_trailing (b45a5e3d…).",
  "method": "Spotted a long hex string used as a URL path in the Wayback CDX, recognized its prefix 53616c7465645f5f as ASCII 'Salted__' (the OpenSSL enc magic), and hex-decoded it to recover a complete fourth AES-256-CBC blob with its own random salt. Reasoning: a self-contained 96-byte blob would be an instantly-verifiable oracle (a correct key yields ≤95 readable bytes), so it was worth cataloguing and adding to the candidate-key sweeps.",
  "output": "Recovered urlblob.bin: salt 74c974e3f92e64b5, 96-byte ciphertext. It is a genuine standalone OpenSSL blob but is orphaned — provenance is only a community-posted URL path (the page itself returns the empty SPA shell), and no tested key decrypts it. Structural analysis (BLOB-COMBINATION) confirms it shares no ciphertext blocks with the other three blobs, so it is an independent container, not a fragment of cosmic.  ·  [merged: “The 4th blob (urlblob) recovered in full, committed reproducibly, and re-swept null with the byte-exact harness”] 76 tests → 0 valid padding, 0 readable hits. The prior null is re-confirmed under the authoritative byte-exact harness; the artifact is now reproducible.",
  "outcome": "verified-insight",
  "insight": "A fourth, previously-uncatalogued OpenSSL blob exists (salt 74c974e3f92e64b5, 96-byte ct) recovered by hex-decoding a 'Salted__' gsmg.io URL path; it is a real but orphaned, independent container that no tested key opens.",
  "author": "@DaneelOlivaw",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "blob-xor-two-80byte-blobs",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "XOR of the two equal-size 80-byte blobs (salph_inner xor p32_trailing)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "salph_inner ciphertext (80 bytes, salt 3ab585348552415d) XOR p32_trailing ciphertext (80 bytes, salt b45a5e3d827593ca).",
  "method": "If two blobs encrypted the same plaintext under the same keystream (e.g. key/IV reuse), their XOR would cancel the keystream and expose plaintext-XOR-plaintext structure. The two only equal-length blobs were XORed byte-for-byte and the result scored for printability.",
  "output": "Result is high-entropy garbage (printable ratio 0.48). No shared keystream or plaintext — confirms the two blobs are independently keyed.",
  "outcome": "verified-insight",
  "insight": "The two 80-byte blobs share no keystream/plaintext (XOR printable 0.48), proving they were not encrypted with a reused key/IV.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-aes-key-wrap-format-hypothesis",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "The 'Salted__' prefix does NOT prove aes-256-cbc — an unsolved blob could be openssl AES-KEY-WRAP (id-aes256-wrap-pad)",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #62405",
  "date": "2026-05-04",
  "dateApprox": false,
  "input": "The unsolved 'Salted__' blobs (U2FsdGVkX18..., notably the small 80-byte salph_inner / p32_trailing), universally assumed to be aes-256-cbc.",
  "method": "Showed that `openssl enc` writes the SAME 'Salted__' + 8-byte-salt header for ANY -pass-driven cipher (EVP_BytesToKey), including the RFC-3394 AES key-wrap cipher -id-aes256-wrap-pad. Demonstration: `openssl enc -id-aes256-wrap-pad -e -pass pass:<hex> -in keyfile | base64` produces a U2FsdGVkX18... blob, recovered by `base64 -d | openssl enc -id-aes256-wrap-pad -d -pass pass:<hex>`. So the Salted__ prefix alone does not identify the cipher mode.",
  "output": "A format hypothesis the catalog had not recorded: a blob that yields only noise under aes-256-cbc might instead be an AES-KEY-WRAP container holding a RAW (private) key rather than narrative text -- a natural fit for the small 80-byte blobs where 'the key is inside the blob'. Untested against the actual blobs here; worth running `-id-aes256-wrap-pad -d` over the unsolved blobs with the candidate passphrases.",
  "outcome": "unverified",
  "insight": "Sub-check (this project): all three open blobs begin with the literal 'Salted__' magic and are length ≡ 0 (mod 8) — they ARE OpenSSL `enc -aes-256-cbc` salted containers, which rules out the OUTER blob being a raw AES-KEY-WRAP (id-aes256-wrap-pad) container (that format carries no Salted__ prefix). The still-open, useful part of the hypothesis is about the DECRYPTED plaintext possibly being a wrapped/raw key rather than narrative text — which cannot be confirmed or refuted until the correct passphrase is found. Stays UNVERIFIED (untestable until decrypt).",
  "author": "@sha256ppy",
  "time": "05:33 UTC",
  "sourceQuote": "you can generate a key with openssl … then you can wrap it (there are multiple wrap functions): openssl enc -id-aes256-wrap-pad -e -pass pass:… — so the Salted__ header does not prove aes-256-cbc.",
  "provenance": "The unsolved Salted__ blobs (cosmic / salph_inner / p32_trailing) in ciphertexts/; the OpenSSL wrap-cipher demonstration is @sha256ppy's.",
  "links": [
   {
    "label": "Reference — the AES blobs",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "endgame-bip38-ec-multiply-hypothesis",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "The endgame may encode a BIP38 (EC-multiply) passphrase-protected key — 'shabef four first' = BIP38's addresshash step",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #24861",
  "date": "2024-04-20",
  "dateApprox": false,
  "input": "The Phase-3.2 / INCASE / salph instructions and their oddly specific phrasing: '23 ciphers, 16 encryptions and/or 7 intertwined passwords', '24 random bytes', 'shabefourfirsthintisyourlastcommand', 'shabefanstoo', and the 'half and better half' two-key framing.",
  "method": "Read those instructions as the construction of a BIP38 passphrase-protected private key in EC-multiply mode (record = 0x01 0x43 + flagbyte + addresshash[4] + ownerentropy[8] + encryptedpart1[8] + encryptedpart2[16]). Concretely: 'shabef FOUR FIRST hint is your last command' -> take the FIRST FOUR bytes of SHA256(SHA256(generated address)) = BIP38's addresshash; 'shabef ans too' -> the double-SHA; '7 intertwined passwords' -> seedb[16..23] XOR derivedhalf1[16..31] with key = derivedhalf2.",
  "output": "A concrete format hypothesis the catalog had not recorded: the final key may be a BIP38 EC-multiply container rather than plaintext -- which would explain the 'half and better half' two-key framing (the BIP38 owner/intermediate split) and the otherwise-strange 'addresshash' / 'four first' phrasing. This is arguably the most-supported endgame-format lead in the whole group history: it was asserted outright as early as 2024-04 ('it IS a bip38 challenge -- the challenge is finding the passphrase of a BIP38 wallet using the given private key and public key'), and solvers reconstructed the exact EC-multiply record -- Base58Check of 0x01 0x43 + flagbyte + addresshash + ownerentropy + encryptedpart1[0..7] + encryptedpart2 (39 bytes). It dovetails with the 'half and better half' two-key split, the '7 (intertwined) passwords' solvers say they recovered, and -- independently -- the textual hint 'scrypt IO lock' read off theseedisplanted's on-page elements ('S' in the black box, 'crypto', 'lock', 'lO'), since BIP38's KDF is exactly scrypt. Still untested to an actual key here, but it is the leading structural hypothesis for the final format.",
  "outcome": "unverified",
  "insight": "Sub-check (this project): the blobs are confirmed OpenSSL 'Salted__' AES-CBC containers, not base58 '6P…' strings, so the OUTER form is not BIP38. The hypothesis is really about the DECRYPTED plaintext possibly being a BIP38 EC-multiply key — which would fit the 'half and better half' two-key framing — and is untestable until the blob is decrypted. Stays UNVERIFIED (a plaintext-format prediction, not a decode).",
  "author": "@theseedisplanted",
  "time": "23:20 UTC",
  "sourceQuote": "it is a bip38 challenge. challenge is finding passphrase of bip38 wallet using given private key and public key",
  "provenance": "A structural hypothesis about the endgame format; the \"half and better half\" two-key framing comes from the Phase-3.2 VIC line.",
  "links": [
   {
    "label": "Reference — cosmic ingredients",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "blob-3salt-2salt-subset-keys",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "3-salt and 2-salt subset concatenations as key material",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "All ordered 3-permutations (24-byte) and 2-permutations (16-byte) of the same four salts, used as EVP passphrase (raw and hex) on each of the 4 blobs.",
  "method": "Same scattered-key hypothesis but allowing that only some salts form the key. Subset concatenations were fed as EVP_BytesToKey passphrases (raw bytes and hex string) and, where length permitted, as direct key material against every blob.",
  "output": "No readable plaintext on any blob. Subset salt concatenations are also random and carry no usable key structure.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-ciphertext-concatenation-decrypt",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Concatenate all four ciphertexts and decrypt as one blob",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "All 24 orderings of the 4 ciphertexts joined into one byte stream, decrypted using each blob's own salt plus chain keys (eb3efb51..., 250f3772..., 89727c59...) and token keys (thispassword, yinyang).",
  "method": "Tests the literal reading that the blobs are fragments of one larger ciphertext that was split and scattered. Every permutation of the four ciphertexts was concatenated and run through EVP decryption under each candidate salt and key.",
  "output": "No ordering decrypted to printable text. Concatenated ciphertexts do not form one coherent cipher under any salt/key tried.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-cross-keying-ct-as-key",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Cross-blob keying — one blob's ciphertext used as the key for another",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "For every ordered pair (src, dst) of the 4 blobs: src's ciphertext in forms ct-sha=sha256(ct), ct-shahex, ct-first32=ct[:32], ct-b64=base64(ct), used as the passphrase/key for dst.",
  "method": "Hypothesis that the blobs chain — decrypting one yields the key to the next. Each source blob's raw ciphertext (and several derived forms) was used as the EVP passphrase, and the 32-byte forms also as a direct AES key with zero IV, against every other blob.",
  "output": "No cross-pair decryption produced readable text. There is no observable chaining: no blob's ciphertext keys any other blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-value-combos-cross-type",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Cross-type value pairs (every token x every sum/salt/number/phrase)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Every token x every {sum, salt, number, phrase}, both orders, separators in {'', '+', '_'}, hashed in four conventions, tested vs all 4 blobs. Total across the value sweep ~35,000 combinations.",
  "method": "Broadens the combination hypothesis across categories — e.g. a token joined to a number or a salt. Each cross-type pair in both orders and three separators was hashed four ways and used as an EVP passphrase against every blob, with explicit logging of any key opening >=2 blobs.",
  "output": "No cross-type pair produced readable plaintext on any blob. Every apparent PKCS7-valid result was chance noise.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-4salts-as-aes256-key-all-orderings",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Four 8-byte salts concatenated into a 32-byte AES-256 key, all orderings, direct + EVP",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The 4 OpenSSL salts: cosmic=2d3f6fe06dc950e6, salph_inner=3ab585348552415d, p32_trailing=b45a5e3d827593ca, urlblob=74c974e3f92e64b5. Concatenated 8+8+8+8 = 32 bytes, tried in all 24 permutations against all 4 blobs.",
  "method": "Hypothesis: the four blobs are one 'scattered' AES message and the four salts are really the 256-bit key split four ways. Each 32-byte ordering was used (a) as a DIRECT AES-256-CBC key with IV in {all-zero, salt||salt, key[:16]}, (b) as an EVP_BytesToKey raw passphrase, (c) as a hex-string passphrase, and (d) as sha256(key) — on every blob. About 1008 tests.",
  "output": "No decrypt produced printable text (printable ratio gate >0.85 never met). The 4 concatenated salts are random bytes with no ASCII/base58/word structure and are not a usable key on any blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-salt-math-xor-sum-sha",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Salt arithmetic (XOR / byte-sum / sha256-of-concat) as a derived key",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "xor4 = byte-wise XOR of all 4 salts (8 bytes); sum4 = byte-sum mod 256 of the 4 salts (8 bytes); sha-concat4 = sha256(salt_cosmic||salt_salph||salt_p32||salt_url) (32 bytes). Tested on all 4 blobs.",
  "method": "If a single key were hidden across the salts via a simple combiner, recovering it might need XOR, modular sum, or hashing the concatenation. Each derived value was used as an EVP passphrase (raw and hex), and the 32-byte sha form additionally as a direct AES key with zero IV, on every blob.",
  "output": "No blob decrypted to printable text under any of the three salt-math derivations. Salt math yields random keys.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-four-ingredients-plus-enter-thispassword",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "The 4 narrative ingredients combined with enter/thispassword, all orders",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The 4 ingredients {yellowblueprimes, matrixsumlist (concat 610876654997879+8108108736759668 and arithmetic sum 8718985391757547), lastwordsbeforearchichoice, yinyang} in all 24 orders, each crossed with {none, enter, thispassword, both}, separators {'', '.', ' ', '+'}.",
  "method": "Directly encodes the SalPhaseIon master-hint recipe (the four named ingredients plus the 'enter/thispassword' framing) as a passphrase. Each ordering+suffix+separator was hashed (sha256, double-sha) and tested as the EVP passphrase against cosmic, salph_inner, and p32_trailing.",
  "output": "No ordering or suffix combination decrypted any blob to readable text. The plain recipe-concatenation does not derive any blob's passphrase.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-value-combos-within-type",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "Within-type value combinations (tokens, sums+salts, numbers) as passphrases",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "2- and 3-permutations within each type: TOKENS {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang, enter, thispassword}; SUMS+SALTS; NUMBERS {11110,140,104,91,570,23,16,7,1141,2357,42}; SALTS.",
  "method": "Tests that the answer is two or three same-category loose ends combined. Each within-type permutation was joined (separators '', '+', '_'), hashed in four conventions {sha256hex, literal, raw-sha256, double-sha256}, and tested as a passphrase against all 4 blobs.",
  "output": "No within-type combination opened any blob to readable text. Part of the ~35,000-combination sweep that produced zero real hits.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "blob-xor-of-n-sha256-hashes",
  "phase": "salphaseion",
  "category": "blob combination & format",
  "title": "XOR of N sha256 token-hashes as a 32-byte key (issue #56 style)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "XOR of sha256 of N tokens for N=4..8 drawn from {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang, thispassword, enter, sha256, itsinfront..., 8718985391757547, shabef}; the 32-byte XOR used as EVP raw/hex passphrase and as a direct key (IV=zero and IV=salt||0).",
  "method": "Implements the community 'XOR the hashes together' idea: hash each chosen token, XOR the digests into one 256-bit value, and use it as the key. Every N-combination's XOR was tested in four key roles against the three open blobs.",
  "output": "No XOR-of-hashes key produced readable plaintext on any blob. The XOR-combiner hypothesis yields random keys.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-pkcs7-chance-calibration",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "Valid PKCS7 padding is not a solve: the 80-byte blobs pad-validate at the ~1/256 chance rate with garbage plaintext — only readable content counts as a hit",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Across all of the above sweeps (token battery, harvested phrases, ~1.5M-word dictionary, 288 phase-3.2 answers, Matrix quotes, chain keys, page-hash) the detection threshold was: PKCS7 padding valid AND printable ratio > ~0.90 (English-word scoring for the strict harnesses). The combine/blob-combination work separately logged 4 multi-blob PKCS7 events out of ~35,000 combinations.",
  "method": "AES-CBC with a random key produces a structurally-valid PKCS7 pad by pure chance roughly 1 time in 256 (the last byte landing on 0x01 etc.), and those decrypts are still random bytes. Every sweep therefore treats 'PKCS7-valid' as NECESSARY but NOT sufficient, and only flags decrypts whose CONTENT is readable English/printable. This calibration is what distinguishes a real key-hit from background noise in a feedback-free search.",
  "output": "Every PKCS7-valid survivor in every sweep decrypted to garbage (printable ~0.30-0.59), exactly the ~1/256 chance rate expected. The 4 multi-blob PKCS7 coincidences in the combination work scored 0.30-0.49 (random) versus ~3 expected by chance -- confirming no key ever produced readable content. The bound holds: no open blob has been opened.  ·  [merged: “Valid AES padding ≠ a solve: the 80-byte blobs pad-validate ~1 in 200 keys by chance”] Measured 10/2000 = 0.50% random keys give valid padding (≈ theory). Every such plaintext is high-entropy garbage (printable ratio 0.32–0.46).",
  "outcome": "verified-insight",
  "insight": "PKCS7-valid-but-garbage decrypts occur at the chance rate (~1/256 per try, ~3 multi-blob coincidences expected over ~35k combinations), so padding-validity alone is meaningless and only readable-content scoring constitutes a hit -- which never occurred.",
  "author": "@DaneelOlivaw",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "keysweep-full-english-dictionary-1p5m",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "Full ~370k-word English dictionary sweep (~1.5M decrypts)",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The entire ~370,000-entry English word list (words.txt). Each word tested in up to four forms (literal, sha256hex, raw-sha32, double-sha) against the open blobs, predominantly the two 80-byte oracle blobs salph_inner and p32_trailing (dictattack.py). Total on the order of ~1.5 million AES decrypt attempts.",
  "method": "A brute-force last resort taking the Architect's 'BRUTE FORCING MIGHT BE REQUIRED' literally: if the key is any ordinary English word, the 80-byte blobs (only 5 AES blocks) are cheap to test exhaustively. Each derived key decrypts the ciphertext; results are kept only if printable ratio exceeds 0.90 (a real English plaintext would score ~0.99).",
  "output": "0 strong hits. The single best printable score across the whole dictionary was ~0.59 -- exactly what random bytes produce, i.e. pure chance, not a near-miss. No dictionary word is the passphrase for any open blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "Candidate passphrases (community-surfaced + puzzle-derived) tested against the open blobs in ciphertexts/ via the byte-exact harness (research/lib/gsmg.mjs).",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-harvested-plaintext-phrases",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "Harvested phrases from every decrypted plaintext + Architect speech + VIC sentence",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Every word (>=3 chars) and every normalized whole-line phrase harvested from the project's two write-ups (puzzlehunt.md, naddiseo.md) and from the recovered plaintexts: the full ~300-word Architect speech ('YOUR LIFE IS THE SUM OF A REMAINDER...CIAO BELLA O', including the misspellings WAISTING/THROPHIES/PRICES), the VIC sentence 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF...NEED FUNDS TO LIVE', plus memorable assembled phrases (reinsertingtheprimebasics, returntothesourcecodes, privatekeynote, hopeyouretheone, ciaobellao, hundredfourty, beautifulstrategicposition, etc.). Hundreds of candidates, each in many normalizations (upper/lower/alpha-only/alnum-only/no-space) and each tested as literal, sha256hex, raw-sha32, double-sha32, and sha-of-hex (attack_harvest.py, fullspeech.py, lens_attack.py).",
  "method": "The hypothesis is that the blob key is a phrase that already appears in plaintext the solver has decrypted (the puzzle is self-referential: earlier answers feed later keys). Every line/word was collapsed to a canonical form, hashed in the puzzle's standard ways, and used to derive the AES key for each blob; outputs were scored against an English-word list (not just printable) so a real plaintext would surface.",
  "output": "0 readable decrypts across all three blobs. No phrase from the speech, the VIC sentence, or the write-ups produced English or a WIF; all PKCS7 survivors were garbage.  ·  Also tested the confirmed Phase-3.2 VIC line WHOLE (not just fragments): 'INCASEYOUMANAGE…HALFANDBETTERHALF…FUNDSTOLIVE' + 7 fragments × {literal, sha256hex} on all 3 open blobs (48 tests) → 0.  ·  Also swept the 'it's in front of your eyes' iconic/thematic phrases directly on cosmic + the two 80-byte oracles (a single key on cosmic is itself self-verifying): THEMATRIXHASYOU (all cases), the four ingredient NAMES concatenated, the Architect signature lines (unbalanced-equation / denial / hope-delusion), cosmicduality / salphaseion, thereisnospoon / freeyourmind / followthewhiterabbit / wakeupneo, halfandbetterhalf — 120 tests → 0 valid padding, 0 readable.  ·  Also tested a specific community recipe (#21960, 2024): sha256(base58(‘tocrackthiskeysbelongbetterhalf’)) and variants on salph_inner/cosmic (48 tests) → 0 readable.  ·  Also ran the recurring community proposal (#9660/#9994, @Mikejones90212, 2023) EXHAUSTIVELY: all 2^15 = 32,768 capitalizations of THEMATRIXHASYOU → sha256 → decrypt salph_inner + cosmic (65,536 decrypts) → 267 valid-paddings (0.41%, the chance floor), 0 readable; plus sha256(Beaufort(known-answer, THEMATRIXHASYOU)) × 7 answers (42 tests) → 0. The 'it's a capitalization variant of the phase-3.2 key' thread is closed by a complete brute-force.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-matrix-reloaded-quotes",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "Matrix Reloaded Architect quotes as passphrases",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "Canonical Matrix Reloaded Architect quotes (lens_attack.py): 'The problem is choice' / theproblemischoice, 'Choice. The problem is choice.', 'Ergo, vis-a-vis, concordantly', 'There are only two possible explanations', 'You are here because Zion is about to be destroyed', 'Your life is the sum of a remainder of an unbalanced equation', 'Denial is the most predictable of all human responses', 'Hope. It is the quintessential human delusion', 'The matrix is older than you know'. Each in multiple normalizations and as literal/sha256hex/raw-sha/double-sha against salph_inner and p32_trailing.",
  "method": "The phase-3.2 speech is a paraphrase of the Matrix Reloaded Architect monologue, so the canonical movie quotes (which the puzzle author clearly drew on) were tested as candidate blob keys, hashed in the puzzle's standard ways and scored for real dictionary words.",
  "output": "0 readable decrypts. No Matrix Reloaded quote, in any normalization or hash form, opens either 80-byte blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-token-battery-named-tokens",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "Named-token passphrase battery against cosmic / salph_inner / p32_trailing",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "A hand-curated battery of ~40 puzzle-vocabulary tokens (battery.py / finalbattery.py): the four soup tokens (thispassword, lastwordsbeforearchichoice, enter, matrixsumlist), the two unknown ingredient labels (yellowblueprimes, yinyang), causality, THEMATRIXHASYOU and case/whitespace variants, the SalPhaseIon entry string GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe, its hash 89727c59..., halfandbetterhalf/half/betterhalf, salphaseion/cosmicduality, freewill, thechoiceisanillusion, the four master-hint taunts, oneforonefourforone, fubcdking/oracle/queen, anstoo/shabef/fanstoo. Each tested in two forms (literal string AND its 64-char sha256-hex), plus raw-sha32, against all three blobs.",
  "method": "Each token is run through OpenSSL-equivalent EVP_BytesToKey(SHA-256) to derive the AES-256-CBC key+IV from the blob's own salt, the ciphertext is decrypted, PKCS7 padding checked, and the result scored for printable bytes. The reasoning: these are the only strings the puzzle ever names as 'passwords' or ingredients, so if a small blob's key is one of them a correct decrypt would be instantly readable (<=79 bytes).",
  "output": "0 readable decrypts. The few PKCS7-valid results decrypted to high-entropy garbage (printable ratio ~0.30-0.49, i.e. random bytes). No token opened cosmic, salph_inner, or p32_trailing.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-chain-keys-reused",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "Reusing the verified phase chain keys as blob passphrases",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The already-verified per-phase AES keys reused as passphrases on the open blobs (sweep.py, chains.py, attack_double.py): phase3 key 1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5, phase3.2 key 250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c, sha256('causality') (phase2), plus chained/nested-hash combinations of the soup tokens (sha256(sha256hex(a)+b), progressive ingredient chains, double/triple-sha to depth 7). Each tested as literal, hex, raw, double, against cosmic / salph_inner / p32_trailing.",
  "method": "Some puzzle chains reuse the previous stage's key/answer as the next key, so each verified chain key (and hashes thereof) was used to derive AES keys for the open blobs. attack_double.py additionally checked whether any first-layer decrypt yields a fresh 'Salted__' header (double-encryption), which would chain into a second decrypt.",
  "output": "0 readable decrypts and 0 nested 'Salted__' headers. No reused chain key opens any open blob; the blobs are not encrypted under a previous phase's key, and no layer-1 decrypt produced a second valid OpenSSL blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "keysweep-page-hash-89727c59",
  "phase": "salphaseion",
  "category": "key sweep (passphrase battery)",
  "title": "SalPhaseIon page-hash 89727c59 as a blob passphrase",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The SalPhaseIon entry hash 89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32 = sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe') -- the URL path of the page that hosts cosmic. Tested as literal passphrase, as the pre-image string, and as sha256-of-the-hash, against cosmic / salph_inner / p32_trailing (battery.py, firsthint.py, lens2_salph.py, final_recipes.py).",
  "method": "The narrative 'our first hint is your last command' suggested the last OpenSSL pass used (the page hash that opened SalPhaseIon) might be the key to the next blob. The hash and its pre-image were hashed in the puzzle's conventions and used to derive the AES keys for the open blobs.",
  "output": "0 readable decrypts. The page hash 89727c59... does not open cosmic or either 80-byte blob; it is purely the page URL, carrying no further key.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four OpenSSL Salted__ blobs (cosmic 2d3f6fe0 · salph_inner 3ab58534 · p32_trailing b45a5e3d · urlblob 74c974e3) in ciphertexts/.",
  "links": [
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "cosmic-txt-authenticity-archived-2023",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "cosmic.txt authenticity confirmed against the archived 2023 SalPhaseIon page",
  "who": "this project",
  "source": "this session (Wayback capture of gsmg.io/89727c59…, 2023-06-01)",
  "date": "2023-06-01",
  "input": "The local prize blob ciphertexts/cosmic.txt (OpenSSL Salted__ blob, salt 2d3f6fe06dc950e6, 1328-byte ciphertext, base64 begins U2FsdGVkX18tP2/g…) versus the archived SalPhaseIon page at gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32, captured 2023-06-01 at exactly 4592 bytes (the SalPhaseIon entry-hash = sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe') = 89727c59…).",
  "method": "Located the only REAL archived SalPhaseIon page (small 4592-byte capture, dated 2023, not the later SPA shell) and compared its embedded content to the working files used in this project. Reasoning: if the local cosmic blob and the soup match the page the creator actually published, then the dataset every attack runs against is authentic and complete — ruling out the possibility that we are attacking corrupted or fabricated ciphertext.",
  "output": "The 2023 archived page contains exactly this project's SalPhaseIon soup AND the cosmic AES blob beginning U2FsdGVkX18tP2/g… — byte-for-byte matching cosmic.txt. This confirms cosmic.txt is authentic creator-published data and the soup/blob inputs are complete and uncorrupted.",
  "outcome": "verified-insight",
  "insight": "The cosmic prize blob (salt 2d3f6fe06dc950e6, 1328B, U2FsdGVkX18tP2/g…) is provably authentic: it appears verbatim on the real 2023-archived SalPhaseIon page, so all cryptanalysis is running against genuine, complete data.",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "onchain-ecdsa-nonce-reuse-ruled-out",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "ECDSA nonce-reuse (repeated-r) key recovery checked on the GSMG signatures + prize address — no reuse",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #34925",
  "date": "2024-12-31",
  "dateApprox": false,
  "input": "The on-chain ECDSA signatures of the GSMG creator's spends (pre/post-halving) and the prize address. The classic repeated-nonce leak: if two signatures share the same r (same nonce k), the signer's private key is directly recoverable from (r, s1, s2, z1, z2) modulo the secp256k1 order n.",
  "method": "Extracted the r values from the relevant signatures (e.g. r1=dbe31ca9440892ab... vs r2=1df5cf8403c93099...) and checked for a repeated nonce; ran the standard sympy mod_inverse recovery end-to-end (including WIF output), validated against a known nonce-reuse demo address 1BFhrfTTZP3Nw4BNy4eX4KFLsn9ZeijcMm, and tested the prize address directly.",
  "output": "No repeated nonce: the r values differ across the GSMG signatures, so the key cannot be recovered this way, and the prize address yielded nothing ('already tested with the prize address ... nope'). The recovery math is correct; there is simply no exploitable repeated-r on the relevant addresses.",
  "outcome": "verified-insight",
  "insight": "The GSMG signatures use distinct ECDSA nonces (no repeated r), so the on-chain nonce-reuse key-recovery shortcut is closed -- consistent with the prize key being random (vanity address) and obtainable only from the cosmic blob.",
  "author": "@sha256ppy",
  "time": "08:55 UTC",
  "sourceQuote": "what i was testing was if they reused the r values on the signatures after halving — different r values, hence the key could not be retrieved through that vulnerability.",
  "provenance": "On-chain ECDSA signatures of the GSMG prize / split addresses (blockstream); the r-value check is @sha256ppy's.",
  "links": [
   {
    "label": "Prize address (blockchain.com)",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ]
 },
 {
  "id": "opreturn-50-messages-discovered",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "On-chain OP_RETURN layer: 50 distinct messages mined from the prize and split-off addresses",
  "who": "this project",
  "source": "on-chain",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "All OP_RETURN outputs on prize 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe and split-off 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa (blockstream.info), 50 distinct payloads, mostly 546-sat solver dust.",
  "method": "Bitcoin transactions can carry short text in OP_RETURN outputs. Every OP_RETURN on the two funded GSMG addresses was harvested and catalogued, because this layer (never catalogued in any walkthrough) records years of community guesses and possibly creator hints. The messages were classified into thematic pointers, encoded payloads, solver addresses, and bravado.",
  "output": "A 50-message catalogue (opreturns.md) covering Matrix-theme tokens (redpill, iamtheone, leavethematrix, THEMATRIXHASYOU, ALPHANOISES=anagram of SALPHASEION), soup tokens, two encoded payloads, and several suggestive pointers. A genuinely un-mined record of community attempts and a few possible pointers.",
  "outcome": "verified-insight",
  "insight": "A previously-uncatalogued on-chain OP_RETURN layer of 50 messages exists on the GSMG addresses, recording years of solver dust plus a handful of suggestive pointer phrases.",
  "provenance": "On-chain data for the GSMG prize (1GSMG1JC9…) and split-off (17ucy1K9…) addresses via blockstream / the Wayback CDX; posted key material from the Telegram group.",
  "links": [
   {
    "label": "Prize address",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "opreturn-soup-token-concat",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "OP_RETURN 'matrixsumlistenterlastwordsbeforearchichoicethispassword' (soup-4 concat) as a key",
  "who": "this project",
  "source": "on-chain",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "OP_RETURN payload 'matrixsumlistenterlastwordsbeforearchichoicethispassword' — the four SOUP tokens concatenated in soup order (posted on BOTH addresses by multiple solvers). Also the related solver tokens yourlastcommand / secondanswer / yourlastcommandsecondanswer and 'fourfirsthintisyourlastcommand' / 'fanstoo'.",
  "method": "This is a community recipe attempt that uses the soup-order four tokens (including the 'unused' enter + thispassword), distinct from the master-hint four ingredients. It was tested as a passphrase in literal and sha forms against the AES blobs; the related solver tokens were also recorded as the origin of issue #56's (refuted) recipe.",
  "output": "0 hits as a blob key in literal/sha forms. Confirmed these tokens (yourlastcommand, secondanswer) originated as solver dust on-chain, not creator hints — clarifying that issue #56's recipe was built from community-posted strings.",
  "outcome": "verified-insight",
  "insight": "Issue #56's recipe tokens (yourlastcommand, secondanswer) are provably solver dust posted on-chain, not creator hints, and the soup-4 concat is not a blob key.",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "vanity-address-kills-brainwallet",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "The 1GSMG1 prefix proves the prize address is a VANITY address, so its private key is random",
  "who": "this project",
  "source": "this session",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "The prize address 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe, whose leading characters spell '1GSMG1' (the project's own brand).",
  "method": "A human-readable prefix like '1GSMG1' cannot occur by chance in a normally-derived key; it can only be produced by brute-forcing random keys until one yields the desired address prefix (a 'vanity' generation). That means the private key behind the prize address is RANDOM, not derived from any phrase or puzzle answer. This structurally explains why the brainwallet and split-key sweeps must fail, and confirms the only path to the key is decrypting the cosmic blob that contains it.",
  "output": "Definitive structural conclusion: brainwallet / address-derivation approaches are impossible by construction. The key exists only inside the cosmic AES blob.",
  "outcome": "verified-insight",
  "insight": "The 1GSMG1 prefix is a brute-forced vanity prefix, so the prize private key is random and cannot be derived from any phrase, ruling out every brainwallet/split-key/address-derivation path.",
  "provenance": "On-chain data for the GSMG prize (1GSMG1JC9…) and split-off (17ucy1K9…) addresses via blockstream / the Wayback CDX; posted key material from the Telegram group.",
  "links": [
   {
    "label": "Prize address",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "wayback-cdx-gsmg-urls-spa-shell",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "Wayback Machine CDX of all gsmg.io URLs — no hidden stage; the 64-hex 'stage' pages are just the SPA shell",
  "who": "this project",
  "source": "this session (cdx_full.txt, 397 captured URLs)",
  "date": "2020-11-12",
  "input": "The complete Internet Archive CDX index for the domain gsmg.io (397 distinct captured URL/timestamp rows, saved as cdx_full.txt). Of interest: the genuinely-small real puzzle pages — gsmg.io/theseedisplanted (1245 bytes, captured 2020-11-12), gsmg.io/choiceisanillusion...iwroteitmyself (7253 bytes, 2020), and the SalPhaseIon page gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32 (4592 bytes, captured 2023-06-01) — versus the dozens of 64-hex 'stage' URLs, /final_stage, /followthewhiterabbit, /TheArchitectChoice, /banking-war, /cryptogic etc., all captured 2024-2026 at ~11,800-12,900 bytes each.",
  "method": "Pulled the full CDX (capture index) for gsmg.io from the Wayback Machine and sorted every archived URL by capture date and stored byte-size, looking for any genuine post-cosmic puzzle stage hidden in the archive. Reasoning: a real puzzle page has small, specific content (like theseedisplanted's 1245 bytes); a single-page-app (SPA) shell that just renders 'page not found / app boot' is large and identical regardless of path. Compared sizes and dates to separate authored pages from community URL-guesses that the server simply answered with the generic app.",
  "output": "Only THREE small, dated (2020-2023) pages are real authored stages (1245B / 7253B / 4592B). Every 2024+ URL — the ~10 64-hex 'stage' pages, /final_stage, /followthewhiterabbit, /TheArchitectChoice, the hex-Salted__ blob paths — returns the identical ~12KB SPA shell, i.e. they are community URL-guesses the server answered generically, NOT real stages. gsmg.io/door.png (11,735B) and /static/images/door.png are unrelated binaries; the Phase-1 tile-fragment guess URLs (/banking-war, /cryptogic, /dig-i) all return the same empty shell. No hidden door or post-cosmic stage exists in the archive.",
  "outcome": "verified-insight",
  "insight": "There is no hidden post-cosmic stage on gsmg.io: only theseedisplanted (1245B), the Phase-2 page (7253B) and the SalPhaseIon page (4592B) are real authored content; every 64-hex 'stage' URL is just the generic ~12KB SPA shell returned for any path.",
  "provenance": "On-chain data for the GSMG prize (1GSMG1JC9…) and split-off (17ucy1K9…) addresses via blockstream / the Wayback CDX; posted key material from the Telegram group.",
  "links": [
   {
    "label": "Prize address",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "opreturn-fromn0e-half-betterhalf-pi",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "OP_RETURN 'FromN0EHalfABetterHalfBuiltItBellaCiao1_1Pi...' as a combine hint / key",
  "who": "this project",
  "source": "on-chain",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "OP_RETURN payload 'FromN0EHalfABetterHalfBuiltItBellaCiao1_1Pi36y7LJugXwFNDVjR1p8p5JoB7eN5zSZ' = 'From Neo, Half A Better Half Built It, Bella Ciao, 1_1, Pi, [30-char base58 tail]'.",
  "method": "This message ties the Architect's HALF/BETTER HALF + CIAO BELLA themes to two concrete numbers '1_1' and 'Pi' plus a base58 tail, making it the strongest candidate combine-operator hint. Its components (1_1 as ratio/underscore-concat, Pi as 3.14159/'theory of everything', the base58 tail) were tested as keys/combine operators against the blobs.",
  "output": "0 hits vs cosmic / salph_inner / p32_trailing. The 1_1 / Pi combine idea and base58 tail did not open any blob.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "opreturn-little-prince-quote",
  "phase": "salphaseion",
  "category": "on-chain forensics",
  "title": "OP_RETURN 'itisonlywiththeheart...invisibletotheeye' (Little Prince) tested as a key",
  "who": "this project",
  "source": "on-chain",
  "date": "2026-06-01",
  "dateApprox": true,
  "input": "OP_RETURN payload 'itisonlywiththeheartthatoneseesrightlywhatisessentialisinvisibletotheeye' and its short form 'whatisessentialisinvisibletotheeye'.",
  "method": "This Little Prince quote on-chain directly echoes the master-hint taunt 'its in front of your eyes but youre not seeing it', suggesting the answer is 'invisible/seen with the heart'. The full quote and short form were tested as passphrases (literal / sha forms) against the cosmic and small blobs.",
  "output": "0 hits vs cosmic / salph_inner / p32_trailing. Suggestive as a thematic pointer but not a working key.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "On-chain data for the GSMG prize (1GSMG1JC9…) and split-off (17ucy1K9…) addresses via blockstream / the Wayback CDX; posted key material from the Telegram group.",
  "links": [
   {
    "label": "Prize address",
    "href": "https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "grid-dbbi-mixed-origin-zero-vs-one-indexing",
  "phase": "genesis",
  "category": "genesis derivations",
  "title": "Mixed 0-based / 1-based indexing ('zero out = which origin?') across the grid + dbbi/faed",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "source": "this session — proposed by @DaneelOlivaw (Hosterjack); systematic mixed-origin index sweep",
  "date": "2026-06-30",
  "input": "The planted #FEFEFE cell only becomes a DUAL-prime index because its two prime indices come from DIFFERENT counting origins -- spiral 163 (counting from 0) and row-major 103 (counting from 1). Hypothesis: the creator's 'some characters need to be zeroed out' / 'if you know how the array is indexed' hints mean some indices are read 0-based and others 1-based -- e.g. the COLOUR decides the origin (yellow = 0 = 'zeroed', blue = 1). Artifacts: the 24 genesis colored cells (15 blue + 9 yellow) and dbbi (91) / faed (570).",
  "method": "Built candidate 'yellowblueprimes' values from every combination of {index-type (spiral / row-major / URL-position / row / col) x per-cell origin (all-0, all-1, colour-decides-origin both ways) x prime-selection (keep / drop / zero-out primes, keep {2,3,5,7}) x reduction (concat / sum / sorted / prime-mask / parity)} = 851 distinct values; and applied 20 per-position mixed-origin rules to dbbi/faed themselves (origin flipped by position-primality or value-primality = a literal 'zero out'). Each candidate was field-decoded (checked for readable text) and tested as an OpenSSL/sha256 passphrase against cosmic / salph_inner / p32_trailing, plus 8,000 cosmic combines pairing each candidate with a yin-yang battery. ~13,300 AES decrypts, gated on READABLE plaintext (>= 85% printable + an English-word check), not merely valid PKCS7 padding.",
  "output": "Zero readable hits. dbbi/faed mixed-origin decodes all sit at 30-47% printable (the random floor) with 0 English words; no candidate opens any blob. The only padding-valid results were 52 vs 51.2 expected by pure chance (1/256) -- i.e. exactly the noise floor, confirming the harness is sound and nothing beat chance.",
  "outcome": "verified-insight",
  "insight": "The 0-vs-1 'origin ambiguity = zero out' is a coherent, previously-unrecorded reading of the creator's hints -- but it is UNTESTABLE to confirm directly: yellowblueprimes has no standalone oracle (only the cosmic combine validates it, and that also needs the unknown yinyang + combine op). The exhaustive sweep rules these specific values out as direct keys and simple cosmic ingredients -- not the idea itself. Mixed-origin indexing would only become testable if it opened a small blob directly (it does not) or decoded dbbi to text directly (it does not).",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "genesis-yinyang-architecture-cover-logo-a007522",
  "phase": "salphaseion",
  "category": "duality / yin-yang architecture",
  "title": "The genesis image IS a yin-yang (blue upper-left, yellow lower-right) -- matching the Cosmic Duality book cover AND the GSMG logo; yellowblueprimes/yinyang = the two A007522 prime-halves of one picture",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "source": "this session -- @DaneelOlivaw's observation that the Cosmic Duality book cover and the GSMG logo both depict a yin-yang, followed by spatial-geometry + A007522 analysis of the genesis grid",
  "date": "2026-06-30",
  "input": "Three artifacts read together: (1) the genesis 14x14 grid with its 15 blue + 9 yellow cells and the planted #FEFEFE cell; (2) the 'Cosmic Duality' book cover (archive.org cosmicdualitymys0000time) associated with the creators' 'yinyang' hint -- a yin-yang of TWO galaxies, a white dot in the dark half and a yellow/orange dot in the purple half; (3) the GSMG logo inside puzzle.png -- a white spiral/galaxy swirl set in a hexagon, itself a yin-yang.",
  "method": "Instead of treating 'yinyang' as a string to brute, read it as the SYMBOL the creators point at and test whether the genesis encodes that duality geometrically. Computed the spatial distribution of blue vs yellow cells (quadrant + anti-diagonal split); cross-referenced the cover's two-galaxy geometry and the logo's spiral; checked the letter G = ASCII 103 against the #FEFEFE cell's row-major index; then re-derived 'yellowblueprimes'/'yinyang' under 41 spiral re-indexings (corner, fefefe-origin, two-galaxy, every winding and origin) plus the yin-yang interlock recipes -- ~90,000 AES decrypts gated on READABLE plaintext / WIF, across cosmic / salph_inner / p32_trailing.",
  "output": "The genesis IS the cover's yin-yang: BLUE cells cluster upper-left (9 of 15 on the upper-left side of the anti-diagonal), YELLOW cells lower-right (8 of 9) -- the two teardrops split by the S-curve, mirroring the two galaxies. The GSMG logo (a spiral inside a hexagon) is a third, independent yin-yang. The logo's letter G = 7th letter = lowercase 'g' = ASCII 103 = the #FEFEFE cell's row-major position (the planted 'seed' carries the creators' own initial), and 103 is also a blue spiral index. Critically, the blue/yellow PRIME spiral-indices equal A007522 (7,23,31,47,71,79,103,127,151,167,191) ONLY under the verified corner spiral -- every alternative (center-out / two-galaxy) spiral scatters them -- so the two ingredients must come from the verified-spiral A007522 cells, split by colour. All ~90,000 decrypts sat at the noise floor (no readable / WIF hit).",
  "outcome": "verified-insight",
  "insight": "Three independent witnesses -- the genesis grid geometry, the Cosmic Duality book cover, and the GSMG logo -- all depict the SAME yin-yang, establishing the endgame architecture: 'yellowblueprimes' and 'yinyang' are the two complementary prime-halves (A007522, split blue/yellow) of one picture, the 'half and better half'. This reframes the endgame from 'find two unknown strings' into 'how do the two known halves of one picture interlock', and rules out alternative spiral readings (only the verified spiral yields A007522). It does NOT solve Cosmic Duality: with no partial-progress oracle, the exact byte-encoding of the two halves plus the combine step cannot be confirmed by reasoning alone -- that is the irreducible last mile.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "dbbi-faed-exhaustive-decode-ic-characterization",
  "phase": "salphaseion",
  "category": "soup blocks (dbbi / faed)",
  "title": "dbbi/faed exhaustively decoded + statistically characterized: dbbi is STRUCTURED (IC 0.15), faed is RANDOM (IC 0.118, likely encrypted / 'another puzzle')",
  "who": "this project",
  "source": "this session -- full decode sweep + information-theory characterization of the two undecoded a-i soup blocks",
  "date": "2026-07-01",
  "input": "The two undecoded SalPhaseIon soup blocks: dbbi (91 = 7x13 symbols, a-i alphabet, no 'o'/zero) and faed (570 = 2*3*5*19 symbols, a-i, no 'o'). Community guess: dbbi -> yellowblueprimes, faed -> yinyang. Creator hints in play: 'some characters need to be zeroed out', 'if you know how the array is indexed', 'fefefe is 101010', 'the prime part 2,3,5,7', and 'the second half will probably be used for another puzzle, or not at all'.",
  "method": "Ran the full decode space, self-verifying against the real blobs: field-decode (a=1..i=9 -> int -> hex -> ASCII), ALL 362,880 (9!) symbol->digit permutations INCLUDING a zero (handling the missing-'o'), each-letter-as-the-zero, zero-insertion by every prime/position rule, keyed ciphers (Vigenere/Beaufort/affine), b/e-as-delimiter field readings, delta coding, base-9 pairs, reshape 7x13 / 19x30 with row/col/diagonal/spiral/boustrophedon reads, and bitmap render. Every candidate was gated on readable ASCII / English words AND tested as an AES key (raw + sha256 + double-sha, sha256 + md5 KDF) against cosmic / salph_inner / p32_trailing. Also computed each block's Index of Coincidence. ~2.25M decrypts this pass, on top of the ledger's ~1.5M.",
  "output": "Zero readable decodes, zero blob keys -- max printable ~0.74 (dbbi) / 0.52 (faed), the noise floor, with no English words. The decisive result is statistical: dbbi IC = 0.151 (ABOVE flat-9's 0.111 -> STRUCTURED; heavily skewed, b=27%, e=20%) while faed IC = 0.118 (~= flat-random -> HIGH ENTROPY, near-uniform). dbbi as binary is only 91 bits (max ~13 chars) -- too small to hold the 16-char word 'yellowblueprimes', so if it encodes anything it is a computed NUMBER.",
  "outcome": "verified-insight",
  "insight": "The two blocks have OPPOSITE natures: dbbi is a real, structured encoding (probably a numeric value, not the literal word) whose scheme matches nothing in the puzzle's toolkit; faed is statistically indistinguishable from random -> it is ENCRYPTED or filler, not a plain encoding, matching the creator's 'faed is for another puzzle, or not at all'. This strongly suggests the popular dbbi->yellowblueprimes / faed->yinyang mapping is the WRONG door: yellowblueprimes is meant to be COMPUTED from the genesis ('go back to the first piece'), and faed likely does not feed cosmic at all. Neither block has a standalone oracle, so no decode can be confirmed here even if found.",
  "provenance": "dbbi (91 symbols) and faed (570) are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the open blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon soup",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "image": "assets/walkthrough/community-images/dbbi-faed-symbol-frequencies.jpg",
  "imageAlt": "Symbol-frequency tables for dbbi (91 symbols) and faed (570 symbols)",
  "imageCaption": "@tobi0000, 2024-11-15 (Telegram msg #30267): symbol-frequency tables for dbbi (top, 91 symbols) and faed (bottom, 570). Verified byte-exact against the real blocks — dbbi b=25/e=18/f=10/g=10/c=8/h=8/i=5/d=4/a=3; faed g=107/i=75/e=69/h=58/f=57/a=54/c=52/b=49/d=49 — the uneven spectra this card characterises (dbbi structured, faed near-flat/random).",
  "author": "@DaneelOlivaw"
 },
 {
  "id": "salph-inner-exhaustive-self-verifying-attack",
  "phase": "salphaseion",
  "category": "soup blocks (salph_inner AES)",
  "title": "salph_inner (80-byte self-verifying oracle) resists every soup-grammar / first-hint / combination key; its reconstruction is confirmed byte-correct (80-byte ct)",
  "who": "this project",
  "source": "this session -- @DaneelOlivaw asked to focus a large parallel attack on the one self-verifying blob; 14 independent hypothesis families",
  "date": "2026-07-01",
  "input": "salph_inner: OpenSSL AES-256-CBC, Salted__, salt 3ab585348552415d, 80-byte ciphertext (5 blocks) -> decrypts to <=79 bytes. It sits between the soup's two 'shabef' (=sha256) markers, after 'our first hint is your last command', so a correct key yields readable text INSTANTLY -- a self-verifying oracle. The creator's tell 'breaking salphation should give the feeling of the phase name' (SalPhaseIon ~ salvation) implies the plaintext reads salvation-themed.",
  "method": "Fourteen independent families each ran their own decrypt sweep against the real blob, gated on readable plaintext (>=0.80 printable or English words): the 2020 'Roses are White' poem in every normalization/acrostic; the soup framing tokens + play-order assembly; the other six pieces assembled in phase/reverse/soup order; all prior-phase passwords/hashes/URLs; salvation/Matrix theme vocabulary; genesis-computed yellowblueprimes; a cross-convention crypto sweep (md5/sha1/sha256/sha512 KDF x aes-128/192/256 x IV=0); numeric hints; a 400-word puzzle dictionary + 2-word combos; Matrix/Mr-Robot quotes; container-structural derivations; double/multi-hash (the two-shabef idea); a 33M-key short brute-force (ints 0..1,000,000 + 1-4 char alnum); and encoding transforms. Password forms per candidate: raw, sha256hex, double-sha, md5. Any hit was independently re-verified by a separate adversarial pass.",
  "output": "~33.5 million decrypts, 0 readable opens, 0 confirmed hits. Best printable across everything was 0.62 -- the expected ~4.6-sigma fluke from 33M random 80-byte AES outputs (noise floor ~0.37), containing no words. salph_inner did not open under any known/derivable value or crypto convention.  ·  [merged: “salph_inner (80-byte SalPhaseIon inner blob) vs its exact soup-grammar keys”] 144 tests → 0 readable hits.  ·  [merged: “'our first hint' read as the 2020 Roses poem does not key salph_inner”] 66 tests → 0 valid padding, 0 readable hits.  ·  [merged: “salph_inner reconstruction verified byte-correct; soup-token combination keys are null”] Reconstruction (part1+z+part2) is byte-identical to the stored blob and decodes to Salted__ + salt 3ab585348552415d + 80-byte ct (valid); the no-z form gives an invalid 79-byte ct. Combination sweep: 24 keys, 48 tests → 0 valid padding, 0 readable.",
  "outcome": "verified-fail",
  "insight": "The one endgame blob that is SELF-VERIFYING -- where a correct guess announces itself instantly -- resisted the largest, most diverse legitimate attack run here (~33.5M decrypts, 14 families, cross-convention). Strong evidence that salph_inner's key is NOT reconstructible from the known puzzle material: it depends on an unknown we cannot compute (the true yellowblueprimes value, or content from the unfound 'other door'). Combined with dbbi (structured but scheme-less) and faed (encrypted), the three undecoded parts form a sealed knot with no oracle entry point.",
  "provenance": "The SalPhaseIon soup and its tokens (matrixsumlist / enter / lastwordsbeforearchichoice / thispassword), plus the salph_inner blob — all from the SalPhaseIon page (ciphertexts/ + research/lib/data.mjs).",
  "links": [
   {
    "label": "Walkthrough — SalPhaseIon",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "salphaseion-soup-seven-part-structure-phase-order",
  "phase": "salphaseion",
  "category": "soup structure & order",
  "title": "The SalPhaseIon soup is a 7-part password (the Architect's 'seven intertwined passwords') — concatenating the 7 tokens keys nothing",
  "who": "this project",
  "source": "this session -- @DaneelOlivaw's question about whether the soup's order relates to the phase/subphase order",
  "date": "2026-07-01",
  "input": "The full SalPhaseIon soup in order: [dbbi][matrixsumlist(binary)][faed] z [lastwordsbeforearchichoice] z [thispassword] z 'shabef' 'our first hint is your last command' [salph_inner blob + 'enter'] 'shabef' 'anstoo'. The master-hint cosmic recipe order: yellowblueprimes . matrixsumlist . lastwordsbeforearchichoice . yinyang. The Architect speech: 'select from over 23 ciphers, 16 encryptions and/or seven intertwined passwords'.",
  "method": "Catalogued every phase/subphase and its part-count/order (Phase 2 = 7 parts; Phase 3 = 3; Cosmic = 4 named), then compared structure and order against the soup. Mapped each cosmic ingredient to the phase it comes from and tested whether the recipe order equals the phase chronology. Tested the ordering hypotheses (phase / reversed / soup / first-last-swap) x matrixsumlist byte-form variants against cosmic, and the two-stage salph_inner idea.",
  "output": "The soup holds SEVEN data pieces (dbbi, matrixsumlist, faed, lastwords, thispassword, salph_inner, enter) -- matching Phase 2's SEVEN-part password and the Architect's 'seven intertwined passwords'. The master-hint recipe order (ybp . matrixsumlist . lastwords . yinyang) is exactly the PHASE chronology (ybp + matrixsumlist from Genesis P0, lastwords from the Architect P3.2, yinyang from the endgame), while the soup STORES them scrambled (yinyang/lastwords swapped). 'our first hint is your last command' plus the reverse-binary master hint are reversal markers pointing the final step back to the genesis. The two 'shabef' (=sha256) bracket salph_inner -> a two-stage sha (only single-sha had been tried). All ordering tests -> null (order was never the unknown).  ·  [merged: “The '7 intertwined passwords' = 7 soup tokens combine, and prime-position readings — null”] 168 tests → 1 chance valid-padding (garbage), 0 readable hits.",
  "outcome": "verified-insight",
  "insight": "SalPhaseIon is Phase 2's 'N parts -> concatenate in order -> sha256 -> decrypt' pattern repeated at the endgame, with N=7 ('seven intertwined passwords') but the pieces ENCODED and INTERTWINED (scrambled). The correct assembly order is the phase chronology (already given by the master hint), so the order is solved -- the wall is the piece VALUES (ybp, yinyang) plus the salph_inner intermediate, not their arrangement. The genuinely new structural fact is the two-shabef = two-stage sha256, with salph_inner as the crackable intermediate.",
  "provenance": "The Phase-3.2 material — the EBCDIC→Beaufort(THEMATRIXHASYOU) Architect speech, the VIC line, the chess clue, and the trailing p32_trailing blob (ciphertexts/p32_trailing.txt).",
  "links": [
   {
    "label": "Walkthrough — Phase 3.2 (Architect)",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "decentraland-audio-spectrogram-hashthetext",
  "phase": "salphaseion",
  "category": "SalPhaseIon entrance (Decentraland audio)",
  "title": "Decentraland audio → phase-invert → spectrogram → HASHTHETEXT (the SalPhaseIon entrance)",
  "who": "community",
  "source": "Telegram — GSMG Puzzle Solvers, msg #5335 (relaying a creator hint)",
  "input": "The audio clip played by the interactive box on the GSMG plot in Decentraland (saved as puzzlepiece.mp3): a stereo file whose two channels share the music but differ in a planted high-frequency signal.",
  "method": "Split the stereo into Left/Right, phase-invert (flip) one channel and mix to mono so the shared music cancels and only the planted difference survives, then view the result as a SPECTROGRAM (a Short-Time Fourier Transform picture of the sound). The hidden text sits in the high-frequency band.",
  "output": "The word HASHTHETEXT appears in the spectrogram's high frequencies. Hashing the opening image's full text (GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe -- 59 chars, no trailing newline) with sha256 gives 89727c59...152f6a32, which is the SalPhaseIon page URL.",
  "outcome": "verified-insight",
  "insight": "The entrance to SalPhaseIon is an AUDIO-steganography step: a phase-inverted stereo mix reveals HASHTHETEXT in the spectrogram, which instructs you to sha256 the genesis image's text to reach the next page. The interactive spectral lab reproduces this in-browser (a real FFT on the genuine audio).",
  "author": "id:1173894700",
  "date": "2021-01-06",
  "dateApprox": false,
  "time": "14:52 UTC",
  "sourceQuote": "here's a hint from the creator on Decentraland: find these coordinates → an audio file. Split the stereo track, invert one channel, mix back, mix down to mono, create a spectrogram. The answer is: HASHTHETEXT.",
  "provenance": "The Decentraland puzzlepiece.mp3 (assets/walkthrough/decentraland-assets/); the method is a creator hint relayed by id:1173894700.",
  "links": [
   {
    "label": "Walkthrough — Decentraland / spectrogram",
    "href": "#/walkthrough"
   }
  ],
  "image": "assets/walkthrough/community-images/decentraland-parcel-neg41-neg17.jpg",
  "imageAlt": "Decentraland — the GSMG.io 5 BTC Puzzle Challenge parcel at coordinates -41,-17, with a giant white \"?\" sculpture",
  "imageCaption": "The creator (@SoWut) posting the Decentraland puzzle-piece location on 2020-02-20 — parcel -41,-17 (see the location marker, top-left). Going there yields the audio file that decodes to HASHTHETEXT."
 },
 {
  "id": "cosmic-computed-genesis-values-full-recipe-sweep",
  "phase": "salphaseion",
  "category": "cosmic combine recipe",
  "title": "COMPUTED genesis-value yellowblueprimes/yinyang in the full 4-ingredient cosmic recipe (orders × separators × combine ops, ~2,700 tests) — 0 opens",
  "who": "this project",
  "source": "this session (2026-07-01) -- independent re-attack closing the 'the labels are COMPUTED values, not literal words' frontier that the literal-word sweep left open",
  "date": "2026-07-01",
  "input": "The 2023 master-hint recipe with its two OPEN ingredients supplied as COMPUTED values rather than literal label words. yellowblueprimes candidates built from the genesis coloured-cell index sets filtered by primes: blue-prime positions {2,3,7,11,13,17,23}, yellow-prime {5,19}, their concatenations both orders, the URL characters at those positions, and the primes {2,3,5,7} selecting the first four coloured cells. yinyang candidates from the blue<->yellow / black<->white duality: complement bitstrings, halfandbetterhalf, cosmicduality, bellaciao, theone. matrixsumlist in six numeric byte-forms (rows+cols concat, zero-padded two-digit, reversed, cols-first, comma-listed, and the literal word). lastwordsbeforearchichoice literal.",
  "method": "The LITERAL-word recipe (cosmic-4ingredient-literal-sha256-all-orders) and the dbbi/faed-as-value recipe (cosmic-per-ingredient-sha-then-concat-and-xor) were already exhausted; this closes the complementary hypothesis the creator's hints most support -- that yellowblueprimes/yinyang are LABELS whose VALUES are computed from the genesis ('go back to the first puzzle piece', 'Yellow has a number and so does Blue', 'the prime part'). Every (yellowblue x matrixsumlist-form x yinyang) tuple was assembled in all 24 ingredient orders x 5 separators {'', '+', '_', ' ', '.'} x 3 combine modes (sha256hex(joined) as EVP passphrase; joined literal as passphrase; per-ingredient sha256 concatenated, with and without a final sha), then AES-256-CBC decrypted against all three open blobs (cosmic 1328B, salph_inner 80B, p32_trailing 80B) with a WIF-shape + printable detector. ~358,000 candidate passphrases (~1.07M decrypts).",
  "output": "0 printable and 0 WIF-shaped hits on any of the three blobs; every PKCS7-valid decrypt was high-entropy noise. The computed-value recipe space -- the natural successor to the exhausted literal-word space -- is empty for every genesis-derived yellowblueprimes/yinyang candidate reachable from the coloured-cell + primes {2,3,5,7} rule.  ·  [merged: “The standard cosmic recipe with the best-held values (2347, 95101) is null across all 24 matrixsumlist forms”] 1152 tests → 3 chance valid-paddings (all ratio 0.39, garbage), 0 readable hits.  ·  [merged: “No principled combine of the held values fires cosmic — the block now points at the values, not the combine op”] 1,584 tests → 3 chance valid-paddings (all ratio ~0.39, garbage), 0 readable hits. Cumulatively the held-value recipe is null across 5 combine families × 24 matrixsumlist forms × 2 yinyang forms × {literal + 6 speech-span} lastwords.",
  "outcome": "verified-fail",
  "insight": "",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ],
  "author": "@DaneelOlivaw"
 },
 {
  "id": "reverse-binary-hint-involution-prime-length-structure",
  "phase": "salphaseion",
  "category": "the reverse-binary master hint",
  "title": "The 2023-02-23 master hint decoded byte-exact -- an INVOLUTION whose token-lengths encode 'the prime part'; the combine sweeps it implies are still null",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "source": "this session (2026-07-02) -- verbatim binary recovered from jrk's Telegram post, then a five-lens meaning analysis with every structural claim recomputed and every implied value swept",
  "date": "2026-07-02",
  "input": "jrk's verbatim 2023-02-23 'reverse binary' post (161 bytes, recovered byte-exact from the Telegram export; now in docs/WALKTHROUGH.md; re-verified 2026-07-14 that the transcription's first group 00100110 and last group 10011110 are byte-identical to the source image 2023-02-23.png, and the 161-group block re-decodes to the master hint at printable 1.000). Decoded via reverse-the-bits-in-each-byte THEN reverse-the-byte-order into the 8-token master hint: the 4 INGREDIENTS (yellowblueprimes . matrixsumlist . lastwordsbeforearchichoice . yinyang) and the 4 TAUNTS (wewontgiveawaythepassword . itsinfrontofyoureyesbutyourenotseeingit . verylaststepisatruegiveaway . promised).",
  "method": "Recomputed every structural claim, then swept the value/combine families the structure implies against the real blobs on a plant-validated harness. STRUCTURE verified: the decode is an INVOLUTION (op(op(x))=x, equal to reversing the whole bitstream once); the token lengths [16,13,26,7,25,39,27,8] sum to 161=7x23 and the 8 tokens concatenate with ZERO separators; the three x13 lengths {13,26,39} are exactly the KNOWN/pointer tokens while the other five {16,7,25,27,8} are prime-powers with bases {2,3,5,7}; 'promised' minus 'primes' = {d,o} (anagram of 'PRIMES'+'DO'); 'yellowblueprimes' minus 'primes' = anagram of 'yellowblue'; SalPhaseIon is an anagram of ALPHANOISES. SWEEP (~270k decrypts): concat / concat-then-reverse / XOR-of-4-hashes / Beaufort combines x forward+reversed order x char/byte/full-bit reversal of the assembled key x matrixsumlist mirror byte-forms x genesis-derived and complement yellowblueprimes/yinyang candidates, against cosmic + both 80-byte oracle blobs, ranked by printable score against an empirical noise floor.",
  "output": "STRUCTURE (all recomputed, verified): the master hint's METHOD is its message -- the operation that READS it (an end-to-end mirror) is self-inverse, so the combine belongs to the involution/symmetric family, not an exotic forward transform; the hint self-labels a zero-separator concatenation; and its token-length geometry literally sorts 'known/pointer' (x13) from 'the prime part' (prime-power lengths, bases {2,3,5,7}). VALUES (swept): 0 readable decrypts, 0 keys -- top printable 0.53 vs a random-key max of 0.60 (noise floor ~0.37). Every combine/reversal/genesis-value family lands at noise. The genesis derivation FRAMEWORK is confirmed exact (blue-prime index set {2,3,7,11,13,17,23}, yellow {5,19}) yet no value read from it opens anything.",
  "outcome": "verified-insight",
  "insight": "The reverse-binary hint is the puzzle's Rosetta Stone, and its METHOD is the message: the decode is an INVOLUTION (self-inverse, like Beaufort where encrypt=decrypt and the yin-yang's 180-degree symmetry), so the endgame's final combine is almost certainly self-inverse/symmetric -- and the hint quietly performs the very combine it 'withholds' (zero-separator concatenation, then a mirror). Newly verified structure: the token lengths encode 'the prime part' (prime-power lengths with bases {2,3,5,7}; x13 flags the KNOWN tokens), and 'promised' is an anagram of PRIMES+DO. But every VALUE these readings imply was swept to noise, which sharpens the diagnosis: the wall is the yinyang VALUE -- the short, dominant unknown ('once you hit a yinyang you solve it the same day') -- not the combine operation, which the evidence says is trivial. The interactive lab reproduces the decode, the prime-length anatomy, the wordplay identities, and the combine sweep in-browser. UNIQUENESS (attempt 0152): the canonical reverse-bits-per-byte + reverse-byte-order decode is the ONLY coherent reading of the raw 161-byte binary — of 7 tested bit/byte interpretations, only the canonical (and its trivial mirror/involution) yields readable English (printable 1.000); every genuinely-different grouping is <0.32 printable noise (the one 0.85 '7-bit regroup' is printable-by-construction garbage, not words). So the four ingredient IDENTITIES are UNIQUELY FORCED by the binary — there is no alternate decode giving different ingredients. This closes the 'maybe we have the wrong ingredients' branch and localizes the entire remaining wall to the ingredient VALUES (yellowblueprimes/yinyang) and the combine, not the ingredient set.",
  "provenance": "The four cosmic ingredients (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang), the genesis grid (content/matrix.js) they derive from, and the prize blob ciphertexts/cosmic.txt.",
  "links": [
   {
    "label": "Walkthrough",
    "href": "#/walkthrough"
   },
   {
    "label": "Reference — canonical values",
    "href": "#/reference"
   }
  ]
 },
 {
  "id": "creator-neo-passport-date-give-away",
  "phase": "salphaseion",
  "category": "creator-hint & narrative decode",
  "title": "Creator's explicit 'only date I give away' = Neo's Matrix passport expiry (09/11/2001) — keys no blob",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-11",
  "source": "Telegram — @SoWut (creator), msg #8048, reiterated #8516, framed 'scary specific' #8315",
  "sourceQuote": "The only date I give away is the expiry date of neo's passport.",
  "history": "Surfaced by an independent multi-agent lens sweep of the full @SoWut creator ledger (research/telegram/sowut.txt, 411 messages): the passport-expiry date is the single most explicitly-labelled 'give-away' value in the ledger, yet it had never been converted to a harness test. @DaneelOlivaw ran it in-harness on the self-verifying oracles.",
  "input": "Neo (Thomas Anderson)'s passport in The Matrix (1999) expires 09/11/2001. 26 candidate orderings disambiguating US / EU / ISO forms: 09112001, 11092001, 20010911, 9112001, 0911, 911, 090111, 110901, 010911, 09/11/2001, 11/09/2001, 2001-09-11, 09-11-2001, september112001, 11september2001, sept112001, neospassport, thomasanderson, … (+ the GSMG='Globally Supporting My Generation' expansion and corrected 'four first hint' bracket forms).",
  "method": "For each candidate, EVP passphrase (literal + sha256hex) via openssl enc -aes-256-cbc -md sha256 on the two SELF-VERIFYING 80-byte oracles (salph_inner, p32_trailing) and cosmic; flag any decrypt with valid PKCS7 padding AND printable ratio >= 0.85 (research/lib/gsmg.mjs).",
  "provenance": "The creator statement is @SoWut msg #8048/#8516 (verified sender_handle in research/telegram/corpus.json, flagged creator-not-community); the passport date is canonical Matrix trivia (the on-screen prop expires 09/11/2001); the blobs are ciphertexts/{salph_inner,p32_trailing,cosmic}.txt.",
  "output": "198 tests (26 date orderings + GSMG expansion + corrected bracket forms) x 3 blobs x 2 modes -> 0 valid padding, 0 readable.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 harness (selfcheck KATs passed this run).",
  "outcome": "verified-fail",
  "insight": "The creator's most explicit date give-away (Neo's passport expiry, 09/11/2001) is NOT a standalone passphrase for any open blob — it keys neither self-verifying oracle nor cosmic. So the give-away is either a combine INGREDIENT (used alongside the other cosmic ingredients, where there is no standalone oracle to confirm it) or a date-based transform anchor (e.g. a zero-out / offset value, fitting msg #8000's 'some characters need to be zeroed out') — not a direct key. A genuinely-novel creator datum, now decisively closed as a direct passphrase and added to the ledger.",
  "links": [
   {
    "label": "Reference — cosmic ingredients",
    "href": "#/reference"
   },
   {
    "label": "Walkthrough — SalPhaseIon & Cosmic Duality",
    "href": "#/walkthrough"
   }
  ]
 },
 {
  "id": "community-dbbi-faed-661-prime-11x11",
  "phase": "salphaseion",
  "category": "dbbi / faed — structure",
  "title": "dbbi + faed are ONE object: 91+570 = 661 (prime), π(661) = 121 = 11² — verified prime grid, decode open",
  "who": "community",
  "author": "@Mikejones90212",
  "date": "2026-07-13",
  "source": "Telegram — GSMG/SalPhaseIon group, @Mikejones90212, msg #66562 (2026-07-13 00:45 UTC); creator @SoWut replied noncommittally (#66564, 2026-07-13 00:45 UTC: 'I don't know right now')",
  "sourceQuote": "661 is the length of dbbib/faed combined. If you extract every prime positions in 661 characters your left with 121 characters. 121 is a perfect 11x11 square. Also there are 30 prime numbers up until 121. 121-30=91",
  "history": "First shared publicly by @Mikejones90212 on 2026-07-13 (00:45 UTC), prefaced 'been here since the beginning… I've never publicly shared this'; the creator @SoWut answered only 'I don't know right now' (#66564), neither confirming nor denying. Every prior attempt had treated dbbi and faed as INDEPENDENT ingredients (dbbi→yellowblueprimes, faed→yinyang), so a JOINT structural property of the two blocks together had never been checked. The observation is @Mikejones90212's; the research engine (@DaneelOlivaw) then independently VERIFIED the arithmetic byte-exact and ran the full decode battery on the resulting grid.",
  "input": "dbbi (91 a–i symbols) and faed (570 a–i symbols) from the SalPhaseIon soup; their concatenation dbbi+faed = 661 characters; the character positions 1..661.",
  "method": "Verify the arithmetic (is 661 prime? how many primes ≤ 661?); extract the characters of dbbi+faed at prime positions (2,3,5,7,…,659) → arrange as an 11×11 grid of a=1..i=9 values; then attempt to DECODE the grid — 48 linearizations (row/col-major, reverse, diagonals, boustrophedon, spiral, digit/sum strings) as AES passphrase on all three open blobs; 14 grid→256-bit-private-key derivations (base-9/base-10/sha256/parity, both orders) → P2PKH vs the prize address; 11×11 row/col sums as candidate ingredient values into the concat+sha256 cosmic combine. All gated with deepInspect + a KAT-gated secp256k1 address/self-auth detector (research/lib/gsmg.mjs + scratchpad r5/r6/r7).",
  "provenance": "dbbi and faed are the two undecoded a–i blocks of the SalPhaseIon soup (research/lib/data.mjs, matching docs/WALKTHROUGH.md); the arithmetic (661 prime; π(661)=121=11²; π(121)=30) is byte-verified; the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "output": "VERIFIED: 661 is prime; π(661) = 121 = 11²; the prime-position extraction lands on exactly 121 a–i symbols. DECODE: 288 passphrase decrypts (48 grid readings) + 14 grid→privkey derivations + 45 sums-combine decrypts + a full interpretation battery (parity/threshold/prime-bit → ASCII, VIC, base-9, pairs, selection-index) → 0 readable text, 0 WIF, 0 wallet match, 0 blob opened.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 harness with a secp256k1 KAT (privkey=1 → 1EHNa6Q…/1BgGZ9t…) passing; the prime sieve and π counts reproduced in-harness (selfcheck KATs passed this run).",
  "outcome": "verified-insight",
  "insight": "dbbi (91) and faed (570) are engineered to be ONE object, not two independent ingredients: their combined length 661 is prime and has exactly π(661)=121=11² prime positions — a double-coincidence too precise at exactly (91,570) to be accidental. This reframes the endgame around the confirmed VIC line 'the private keys belong to HALF and BETTER HALF' — dbbi = the small half, faed = the better half — and says to attack the dbbi/faed decode JOINTLY. The 11×11 grid is a real intermediate object (like the 14×14 genesis grid, which encoded a URL via LSB-parity rather than being a raw key); its interpretation rule is still open, but the obvious readings (passphrase, private-key, sums-combine, genesis-analog, VIC, base-9, selection-index) are now all closed.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)", "href": "#/walkthrough" },
   { "label": "Reference — cosmic ingredients", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-oracle-address-derivation-detector",
  "phase": "salphaseion",
  "category": "salphaseion :: detector & methodology",
  "title": "Every prior oracle sweep was blind to a two-private-key plaintext — a KAT-gated address + self-auth detector closes it",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Engine — mechanism-inference multi-agent workflow (adversarially-verified), reconciled against the full attempt ledger",
  "sourceQuote": "the private keys belong to HALF and BETTER HALF",
  "history": "Every historical decrypt sweep against the two self-verifying 80-byte oracles judged a candidate a 'hit' only if the plaintext was printable (ratio ≳0.85), later augmented by deepInspect (Salted__ prefix / base58 run / long printable run). None of those detectors fire on a plaintext that is two raw 32-byte private keys — which has printable ratio ~0.5, no Salted__ header and no base58 run. A correct key that decrypted an oracle to 'half ‖ better-half' (64 bytes = 2×32) would therefore have been produced and then DISCARDED as garbage by every prior sweep. This blind spot was identified by an independent multi-agent lens and then closed in-harness.",
  "input": "The two self-verifying 80-byte oracles salph_inner (salt 3ab585348552415d) and p32_trailing (salt b45a5e3d827593ca); a 2089-key set (puzzle vocabulary + derived values + GSMG/personal proper-nouns + the full bip39 English wordlist).",
  "method": "On EVERY valid-padding decrypt, derive P2PKH addresses (compressed + uncompressed) from all 32-byte windows and the documented half/better-half combinations {h1, h2, XOR, sha(h1‖h2), sha(h2‖h1), reverse(h1), reverse(h2)}, and match against the GSMG wallets (prize 1GSMG1JC9…, peeled 17ucy1K9…); plus a curve-free self-auth test sha256(h1)==h2. secp256k1 via node:crypto ECDH, KAT-gated (privkey=1 must derive 1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm before any result is trusted).",
  "provenance": "The oracles are ciphertexts/{salph_inner,p32_trailing}.txt; the VIC line 'the private keys belong to HALF and BETTER HALF' is the creator-confirmed Phase-3.2 output; the address derivation is proven by the privkey=1 known-answer test.",
  "output": "12,546 decrypts (2089 keys × 3 blobs × {literal, sha256}), 50 valid-padding → the new detector applied to all 50 → 0 wallet matches, 0 self-auth. Detector added as a permanent capability.",
  "evidence": "KAT-gated secp256k1 (privkey=1 → 1EHNa6Q…/1BgGZ9t… verified); byte-exact EVP-SHA256 AES harness (research/lib/gsmg.mjs + scratchpad r3).",
  "outcome": "verified-insight",
  "insight": "Printability-only success gates are UNSAFE for this target: the one hard, creator-confirmed fact about the endgame output is that it is TWO private keys ('half and better half'), and 64 bytes is the unique OpenSSL plaintext length that splits into two clean 32-byte halves from an 80-byte ciphertext — a plaintext that every prior sweep would have thrown away as high-entropy garbage. The correct key is not in the tested 2089-key set, but the detector class is now correct: every future oracle key candidate must be judged by KAT-gated address-derivation and self-auth, not by printability.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon & Cosmic Duality", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-oracles-are-pass-mode-only-unknown-is-passphrase",
  "phase": "salphaseion",
  "category": "salphaseion :: blob format & constraint",
  "title": "All open blobs are OpenSSL -pass (Salted__) mode — raw-key / custom-IV theories eliminated; the ONLY unknown is the passphrase",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Engine — structural verification of the ciphertext headers (reconciled against selfcheck's byte-exact KATs)",
  "sourceQuote": "the private keys belong to HALF and BETTER HALF",
  "history": "A recurring 'maybe it's encrypted differently' family of theories (an oracle encrypted with a raw key via `openssl enc -K <hex>`, or a non-standard IV, or an alternate KDF) had never been decisively ruled out — leaving open the worry that decryption was failing on the MODE rather than the passphrase. @DaneelOlivaw settled it from the ciphertext structure itself and, in the same pass, tested the literal two-oracle reading of 'half and better half'.",
  "input": "The raw bytes of the three open blobs cosmic (salt 2d3f6fe06dc950e6), salph_inner (3ab585348552415d), p32_trailing (b45a5e3d827593ca); and, for the companion test, a 2089-key set (vocabulary + proper-nouns + bip39).",
  "method": "Read the 8-byte magic header of each blob (Salted__ ⇒ openssl -pass / salted EVP_BytesToKey; raw-key -K mode writes NO header). Companion 'half & better half = two oracles, one passphrase' test: require valid PKCS7 padding on BOTH 80-byte oracles simultaneously (chance ~1/40 000 per key — a far stronger discriminator than either alone), then apply the full readable/WIF/address/salvation detector to any dual-valid key.",
  "provenance": "The blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt; the Salted__ semantics are OpenSSL's documented salted-passphrase format; selfcheck reproduces the solved blobs via standard EVP_BytesToKey(sha256).",
  "output": "All three blobs begin with the ASCII magic 'Salted__' ⇒ every one is -pass (salted EVP) mode; raw-key / custom-IV / alternate-KDF is impossible. Dual-oracle filter: 4,178 decrypt-pairs → exactly 1 chance dual-valid ('heart', high-entropy garbage on both), 0 signal.",
  "evidence": "Byte-exact header read + the byte-exact EVP-SHA256 harness (selfcheck KATs passed this run); scratchpad r12.",
  "outcome": "verified-insight",
  "insight": "The wall is provably a SINGLE MISSING STRING. Because the Salted__ header is written only by openssl's -pass mode, the KDF is fixed and known (EVP_BytesToKey(sha256) → key‖IV), the IV is not a free parameter, and there is no raw-key / non-standard-IV / non-AES escape hatch. Therefore every failed decrypt is a wrong PASSPHRASE, never a wrong mode — which also confirms that deepInspect + the address/self-auth detector are the correct and sufficient success gates. The literal 'two oracles share one passphrase' reading of 'half and better half' is unsupported over vocabulary+bip39 (though not eliminated, since a derived shared key could exist).",
  "links": [
   { "label": "Walkthrough — SalPhaseIon & Cosmic Duality", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-reframe-personal-knowable-token-null",
  "phase": "salphaseion",
  "category": "creator-hint & combine",
  "title": "The creator's 'personal / knowable' hint, cryptographically read 4 ways (combine-part, cipher-key, sha-chain, prime split) — all null",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Telegram — @SoWut (creator), msg #66573–#66574 (2026-07-13 00:51 UTC, the 2026-07-12 evening session; the one item he explicitly tagged 'a hint'); reframes generated by an adversarial multi-agent workflow and tested by @DaneelOlivaw",
  "sourceQuote": "My close friends have the best chance of solving it (a few tried). But they don't have the skills some of you do. NOTE: that is a hint.",
  "history": "The single 2026 statement the creator explicitly labelled 'a hint' says the key is personal/knowable — recoverable by friends & family, 'in front of your eyes' (reaffirming the earlier #9595 'friends/family together' line). Its natural cryptographic readings had never been tested: prior work only tried the GSMG brand as a STANDALONE passphrase (attempt 0002, which noted the ingredients 'must be COMBINED'), and jrk/sowut appear in the corpus only as provenance, never as key material. An out-of-the-box reframe workflow turned the hint into four falsifiable mechanisms; @DaneelOlivaw ran all four in-harness.",
  "input": "Personal/brand tokens {GSMGIO5BTCPUZZLECHALLENGE, prize address 1GSMG1JC9…, brand+address, the SalPhaseIon page-hash 89727c59…, jrk, sowut, jrkbgrt, gsmg, gsmgio, gsmg.io}; the H8 ingredients {2347, matrixsumlist byte-forms, lastwordsbeforearchichoice, 95101/10195, the 4 ingredient names, the canonical 4-part concat}; the H8 continuous string 'yellowblueprimes…yinyang'; A007522 primes split blue=[7,23,31,47,103,127] / yellow=[71,79,151,167,191].",
  "method": "Four mechanisms, all EVP passphrase (literal + sha256hex) on cosmic/salph_inner/p32_trailing: (1) personal token concatenated as a COMBINE-PART with each ingredient, token-first AND token-last; (2) personal proper-noun as a Vigenère/Beaufort key over the H8 string (the only construction yielding yinyang as a DECODE OUTPUT per C7); (3) forward sha-chain — decrypt salph_inner, sha256 its plaintext → cosmic key (soup order 'shabef [salph_inner] shabef anstoo'); (4) A007522 blue/yellow split as a per-oracle 'half + better half' key assignment. Gated with a KAT-gated secp256k1 address/self-auth detector + deepInspect + a salvation regex (C22, salph_inner) + a ying-yang regex (C7, cosmic).",
  "provenance": "The hint is @SoWut msg #66573–#66574 (verified creator, 2026-07-12 session, research/insights/0024); the ingredients/values are from docs/WALKTHROUGH.md and content/matrix.js; the A007522 set is creator-confirmed (primes ≡7 mod 8); the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt.",
  "output": "1,749 KAT-gated decrypts (R1 combine-part 1584 + R2 cipher-key 90 + R3 sha-chain, only 3 of ~558 candidates even padded salph_inner + R4 prime-split ~75) → 0 readable, 0 Salted__, 0 WIF, 0 wallet-controlling key, 0 self-auth, 0 salvation, 0 ying-yang.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 harness with a passing secp256k1 KAT (privkey=1 → 1EHNa6Q…); selfcheck KATs passed this run (scratchpad r13).",
  "outcome": "verified-fail",
  "insight": "The strongest untested cryptographic readings of the creator's only explicitly-tagged 2026 hint are closed: a personal/brand/handle token is NOT a passphrase combine-part, cipher-key, or per-oracle key, the forward sha-chain does not link salph_inner→cosmic, and the A007522 blue/yellow 'half & better half' split opens neither 64-byte oracle. Two possibilities survive: the personal element is a non-passphrase SELECTOR/index/zero-out parameter one step removed (C6/C15), or the datum is a genuinely private personal fact only friends hold ('friends have the best chance'). Either way, personal tokens should no longer be tried as direct passphrase material.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon & Cosmic Duality", "href": "#/walkthrough" },
   { "label": "Reference — cosmic ingredients", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-salphaseion-matrixsumlist-operator",
  "phase": "salphaseion",
  "category": "salphaseion :: structure & combine",
  "title": "The soup is a VALUE|OPERATOR|VALUE recipe: matrixsumlist as the operator that mints the missing zeros — structure verified, decode open",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): an 8-lens adversarial deep-analysis workflow + in-harness verification, reconciled against docs/WALKTHROUGH.md §9",
  "sourceQuote": "some characters need to be 'zeroed out'",
  "history": "A deep structural analysis of SalPhaseIon's parts and their order (every assumption/relation, with the whole puzzle and among themselves) run as a multi-agent workflow with adversarial verification, then every concrete falsifiable prediction tested in-harness. It set out to answer why dbbi/faed refuse to decode and how the soup's ordering encodes the combine.",
  "input": "The space-stripped SalPhaseIon soup (1075 chars): [dbbi 91 a–i] + [matrixsumlist binary 104 bits] + [faed 570 a–i] = Section 1 (765, zero filler), then z-sections for lastwordsbeforearchichoice, thispassword, and the salph_inner blob framed by two shabef (=sha256) + 'our first hint is your last command' + 'enter' + 'anstoo'. Confirmed field-decode a=1..i=9, o=0.",
  "method": "(1) Structural: split on z (3 genuine separators → 4 sections); measure section lengths; check the a–i-only alphabet; compare soup order vs the 2023 master-hint order. (2) Operator hypothesis: read 'matrixsumlist' as 'take the sum-list of a matrix' — lay dbbi/faed as digit matrices over every factorization (dbbi 7×13/13×7; faed 19×30…2×285), take row/col SUM-LISTS to mint ybp (dbbi) & yinyang (faed); encode raw / 2- and 3-digit-padded / base-9 / base-16; build flat (master & soup order) and NESTED sha256(ybp‖msl‖yin)‖lastwords keys, single + double sha; also 11×11 joint-grid sums, prime-selective sums, msl digit-stream mod-10 mask, and the salph_inner→sha256→cosmic chain. Decrypt salph_inner then cosmic; gate with deepInspect + KAT-gated address/self-auth + salvation (C22) + ying-yang (C7) detectors (research/lib/gsmg.mjs; scratchpad r14/r15/r16).",
  "provenance": "The soup structure and field-decode are from docs/WALKTHROUGH.md §9 (byte-verified); dbbi/faed are research/lib/data.mjs; the blobs are ciphertexts/{cosmic,salph_inner,p32_trailing}.txt; the 'zeroed out' hint is creator @SoWut (2021-12-25).",
  "output": "STRUCTURE VERIFIED: 3 z-separators → 4 sections; Section 1 = 91+104+570 = 765 exactly (a fused VALUE|OPERATOR|VALUE triad); dbbi/faed are strictly a–i (zero-free); soup order swaps yinyang/lastwords vs the master hint; Section 4 is a sha-chain. DECODE: ~20,000 KAT-gated decrypts across all factorizations/encodings/key-groupings → 0 readable, 0 Salted, 0 WIF, 0 wallet, 0 salvation, 0 ying-yang.",
  "evidence": "Byte-exact AES-256-CBC / EVP-SHA256 harness with a passing secp256k1 KAT; the sum-list zero-minting reproduced in-harness (dbbi 13×7 row-sums → 27303243304429…). selfcheck KATs passed this run.",
  "outcome": "verified-insight",
  "insight": "SalPhaseIon's ordering reads as a recipe: Section 1 fuses dbbi | matrixsumlist | faed (91+104+570, zero filler) into a VALUE|OPERATOR|VALUE sandwich, and matrixsumlist — a self-describing token like shabef=sha256 — names the operation 'take the sum-list of a matrix.' Because dbbi/faed contain only a–i (never the letter o=0), a direct field-decode is mathematically incapable of producing the zero digits yellowblueprimes/yinyang need, whereas SUMMING rows/columns crosses multiples of ten and MINTS exactly those missing zeros — matching the creator's 'insert the missing zeros' hint, the master-hint adjacency, and the half+better-half / Cosmic-Duality theme. This is the most fact-unifying model of the ordering to date. It is not yet the solve: ~20k decrypts of the minted values (all factorizations, encodings, and the nested/chain key groupings) opened no blob, so either the operator/encoding differs or the summing is a red herring. A distinct, untested reading remains open — visualizing the matrices graphically ('in front of your eyes').",
  "links": [
   { "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)", "href": "#/walkthrough" },
   { "label": "Reference — cosmic ingredients", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-length-analysis-actuable-blocks",
  "phase": "salphaseion",
  "category": "salphaseion :: structure & combine",
  "title": "Length analysis: the 80-byte oracles are the actuable key-targets (64B = two keys), dbbi is key-sized, faed is 7× too big",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): byte-exact length audit of every unsolved part + in-harness private-key test",
  "sourceQuote": "the private keys belong to HALF and BETTER HALF",
  "history": "A systematic audit of the byte-lengths of every unsolved part, to reason about which pieces are sized to be directly-usable crypto ('actuable data blocks') and which length relations hint at an intended combination — then the sharpest prediction (dbbi is sized for one 256-bit key) tested in-harness.",
  "input": "cosmic 1328B ct (83 blocks) → ~1312B plaintext; salph_inner & p32_trailing 80B ct (5 blocks) → 64B plaintext; dbbi 91 a–i (base-9 → 287 bits); faed 570 a–i (→ 1807 bits); matrixsumlist binary 104 bits = 13B; master hint 161 = 7×23 chars; genesis 14×14 = 196.",
  "method": "Compute exact byte-lengths and base-9 bit-capacities; map them onto crypto target sizes (32B key = 256 bits = 64 hex; WIF 51–52 base58; half+better-half = 64B = 2×32; AES block 16B). Test the sharpest prediction: dbbi/faed/661/121 as a direct 256-bit private key (base-9/base-10, reversed, sha256, hi/lo-32 bytes, and zero-out variants of the ~10 excess symbols) → P2PKH → match the prize address, KAT-gated (research/lib; scratchpad r20).",
  "provenance": "Blob lengths from ciphertexts/*.txt; dbbi/faed from research/lib/data.mjs; the VIC 'half and better half' line is creator-confirmed (Phase 3.2); the prize is the P2PKH vanity address 1GSMG1JC9….",
  "output": "cosmic plaintext (~1312B) = a MESSAGE, not a key; each 80-byte oracle → 64B = exactly two 32-byte keys (half+better-half). dbbi = 287 bits ≈ one 256-bit key + ~10 excess symbols; faed = 1807 bits ≈ 7 keys (oversized). dbbi/faed/661/121 as a DIRECT private key → 38 derivations, 0 wallet match (expected: the prize is a vanity address, so its key is random and lives encrypted in the blob).",
  "evidence": "Byte-exact length computation + KAT-gated secp256k1 derivation (privkey=1 → 1EHNa6Q…). selfcheck KATs passed this run.",
  "outcome": "verified-insight",
  "insight": "The actuable key-target is an 80-byte oracle: its 64-byte plaintext is exactly two 32-byte private keys — the literal shape of 'the private keys belong to HALF and BETTER HALF'. cosmic (~1312B) is the message, not the key. dbbi is length-sized for ONE 256-bit key (287 bits, ~10 excess symbols = candidates to 'zero out'), but because the prize is a vanity address its key is random and encrypted, so dbbi is key-derivation material or a taunt — not the key directly (verified null as a direct key). faed at 1807 bits is far too big for a value, matching the creator's 'faed is another puzzle'. Length relations that hint at untested combinations: dbbi(91=7×13) ‖ matrixsumlist-binary(104=8×13) both multiples of 13 → a 15×13 stack; the master hint (161 = 7×23, the two smallest A007522 primes) laid as a 7×23 grid; and dbbi+faed=661→11² (already known). The combine's OUTPUT must be a 32/64-byte block that opens an oracle.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon soup (dbbi/faed)", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-yellowblueprimes-grounded-grid-primes",
  "phase": "genesis",
  "category": "genesis :: genesis derivations",
  "title": "yellowblueprimes grounded: the prime spiral-positions of the blue & yellow cells (all A007522) — not 2347",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): byte-exact spiral-index derivation from content/matrix.js + in-harness combine test",
  "sourceQuote": "Yellow has a number and so does Blue",
  "history": "A reframe of the community guess that yellowblueprimes/yinyang derive from the SalPhaseIon dbbi/faed blocks. The 2020 Roses poem points instead at the genesis grid: each colored cell has a CCW-spiral reading position, and yellowblueprimes = the PRIME ones. Derived byte-exact from the grid and tested in the cosmic combine.",
  "input": "The 14×14 genesis grid: 15 blue + 9 yellow cells (content/matrix.js), their CCW-spiral reading indices, and the cosmic ingredients (matrixsumlist, lastwordsbeforearchichoice) + the open blobs.",
  "method": "Compute each colored cell's spiral index; filter primes; test the resulting prime set as the yellowblueprimes ingredient (concatenated / A007522-filtered / summed / color-split) in the flat/soup/nested cosmic combine and as direct oracle keys, with the address/self-auth + salvation detector, KAT-gated (scratchpad r23).",
  "provenance": "Grid + spiral from content/matrix.js (pixel-verified vs puzzle.png); A007522 (primes ≡7 mod 8) is creator-confirmed; blobs ciphertexts/*.txt.",
  "output": "VERIFIED: all 24 colored cells sit at spiral indices ≡7 mod 8 (byte boundaries); the PRIME ones are blue{7,23,31,47,103,127} + yellow{71,79,151,167,191} (all A007522). Combine of these grid-native values: 3870 KAT-gated decrypts → 0 blob opened.",
  "evidence": "Byte-exact spiral-index computation + KAT-gated AES/secp256k1 harness (selfcheck passed this run). INDEPENDENTLY VERIFIED (2026-07-14): the CCW spiral order was regenerated from scratch (standard boundary-shrinking traversal) and matches MATRIX.spiral byte-exact; the 24 colored cells (blue=1/yellow=0) in spiral order reproduce the LSBs of \"gsmg.io/theseedisplanted\" byte-exact; and the PRIME colored spiral-positions are exactly {7,23,31,47,103,127}∪{71,79,151,167,191} — so this derivation rests on a source-verified spiral, not an assumed one.",
  "outcome": "verified-insight",
  "insight": "yellowblueprimes has a clean grid-native meaning that replaces the 2347 guess: the set of PRIME spiral-positions of the blue and yellow cells — blue{7,23,31,47,103,127} and yellow{71,79,151,167,191}, all A007522 primes (≡7 mod 8). All 24 colored cells lie on byte boundaries (≡7 mod 8); keeping the 11 prime positions and dropping the 13 composite ones literally realizes the creator's 'reinsert the prime basics' and 'zero out'. The 6-blue/5-yellow split even offers a 'half and better half' reading (fefefe=103 is one of the blue-primes). The ingredient is now grounded; its exact byte-encoding and the final combine remain open — these primes as bytes/product/ordinals, or the two color-sets as the two 32-byte oracle halves, are the next tests.",
  "links": [
   { "label": "Walkthrough — Phase 0 Genesis", "href": "#/walkthrough" },
   { "label": "Reference — cosmic ingredients", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-salph-inner-ciphertext-byte-exact",
  "phase": "salphaseion",
  "category": "salphaseion :: blob format & constraint",
  "title": "Both 80-byte oracles are byte-exact: salph_inner = H1 + z + H2 (forced), p32_trailing = the phase-3.2 tail base64 — so the wall is the passphrase, not the artifact",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): byte-for-byte verification of the salph_inner reassembly from the soup halves",
  "sourceQuote": "the reconstructed salph_inner.txt is byte-identical — verified",
  "history": "After ~140 null decrypt attempts on salph_inner, a forced structural reframe asked the foundational question: is the ciphertext even byte-exact? salph_inner is reassembled from two base64 halves embedded in the soup (H1=63 chars, H2=64), with the 'enter' binary nested between — H1+H2 is 127 chars but the blob is 96 bytes (128 chars), so the reassembly adds one character. If it were wrong, EVERY key would fail silently.",
  "input": "The soup fragments H1='U2FsdGVkX186tYU0…efvdrd9' (63 chars) and H2='QvX0t8v3…GuN/jJ' (64 chars); the nested 'enter' binary (40 bits → 'enter'); the committed ciphertexts/salph_inner.txt (128 base64 chars).",
  "method": "Reassemble candidate ciphertexts {H1+H2, H1+'z'+H2, H1+enter-base64+H2, H1+H2+padding} and compare byte-for-byte to salph_inner.txt; check Salted__ prefix, salt, and AES block alignment (ct length % 16). Re-verify all three open blobs' byte integrity.",
  "provenance": "Soup fragments from docs/WALKTHROUGH.md §9; the blob is ciphertexts/salph_inner.txt (salt 3ab585348552415d, verified by selfcheck).",
  "output": "salph_inner.txt = H1 + 'z' + H2 exactly (128 chars = 96 bytes). FORCED by block alignment: H1+H2 → 95 bytes (79-byte ct, 79%16=15, invalid); H1+enter-base64+H2 → 100 bytes (invalid); only H1+'z'+H2 → 96 bytes → 80-byte ct → 5 AES blocks → valid. The OTHER 80-byte oracle was verified the same way (attempt 0144): p32_trailing.txt is byte-identical to the base64 blob at the very end of the phase-3.2 plaintext (2422 B, ending right after the chess-board clue '…as wide as the first one seen.'), wrapped across two 64-char lines by CRLF; the two lines concatenate to the committed 128-char blob exactly (salt b45a5e3d827593ca), and the plaintext terminates precisely at the blob (no truncation). All three open blobs re-confirmed Salted__ + block-aligned (cosmic 1328=83×16; salph_inner & p32_trailing 80=5×16).",
  "evidence": "Byte-for-byte comparison + block-alignment check in-harness for both 80-byte oracles (selfcheck KATs passed this run); scratchpad r33 (salph_inner) + r34 (p32_trailing).",
  "outcome": "verified-insight",
  "insight": "BOTH 80-byte oracles are byte-exact and correctly extracted. salph_inner's reassembly is unique/forced: the soup's separator 'z' is a genuine base64 character of the ciphertext here (removing it yields an invalid 95-byte, non-block-aligned blob), while the nested 'enter' binary (which decodes to the literal word 'enter') is correctly EXCLUDED metadata. p32_trailing is the CRLF-joined tail base64 of the phase-3.2 plaintext, matching the committed blob byte-for-byte. This closes the 'maybe the artifact is wrong / mis-reassembled' failure hypothesis for both oracles: the ~140 null attempts were all tested against the CORRECT ciphertext, so the persistent wall is genuinely the missing PASSPHRASE, not a corrupted blob. Future solvers can trust ciphertexts/salph_inner.txt = H1 'z' H2 and ciphertexts/p32_trailing.txt = the phase-3.2 tail base64 exactly.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon soup", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "oracle-salts-random-no-steganography",
  "phase": "salphaseion",
  "category": "endgame :: blob format & constraint",
  "title": "The 3 open-blob SALTS are random openssl salts — they encode no hidden clue (salt steganography ruled out)",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-13",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): structural analysis of the Salted__ salts",
  "sourceQuote": "checked whether a hand-picked salt encodes a value; it does not — the salts are random",
  "history": "A hand-built puzzle could hide a clue in a deliberately-chosen openssl salt (the 8 bytes are stored in the file and are otherwise assumed random). This had never been checked — so the three open-blob salts were examined for any encoded meaning.",
  "input": "The salts of the three open blobs: cosmic 2d3f6fe06dc950e6, salph_inner 3ab585348552415d, p32_trailing b45a5e3d827593ca (bytes 8–15 of each Salted__ file).",
  "method": "Tested each salt for (a) printable ASCII, (b) pairwise XOR / complement relationships, and (c) equality to the first 8 bytes of sha256(K), md5(K), or sha256(K)[8:16] for 34 known strings — every solved answer, the 4 ingredients, all soup tokens, the grounded 11 A007522 primes, the Architect speech-spans, the prize address, and theme words.",
  "provenance": "The salts are read from ciphertexts/{cosmic,salph_inner,p32_trailing}.txt (bytes 8–15); the byte-exact harness is research/lib/gsmg.mjs.",
  "output": "ASCII: 5/8, 5/8, 4/8 printable — gibberish, not text. Pairwise XORs (178aead4e89b11bb / 996531ddefbcc32c / 8eefdb090727d297) are random-looking with no complement/pattern. NO salt equals sha256/md5/sha256[8:16] of any of the 34 known strings. The salts encode no known value.",
  "evidence": "Byte-exact salt read + 34×3 hash-prefix comparison in-harness (scratchpad r42); selfcheck KATs passed this run.",
  "outcome": "verified-insight",
  "insight": "The three open-blob salts are standard random openssl salts — they carry NO hidden data or clue. This rules out salt-steganography (a natural 'is the salt a hint?' question) and hardens the conclusion that the sole remaining unknown is the PASSPHRASE, not any embedded parameter. Also: no grounded ingredient value opens cosmic's outer layer, so the 'nested 7-layer decrypt' reading cannot even start.",
  "links": [
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-ebcdic-beaufort-detector-cosmic",
  "phase": "salphaseion",
  "category": "salphaseion :: methodology & detector",
  "title": "The endgame readability check was EBCDIC-blind: a correct cosmic decrypt could hide as a phase-3.2-style CP1141→Beaufort layer — now scored (null for the grounded keyset)",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-14",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): a 6-lens adversarial assumption-audit workflow surfaced this as the sole survivor; verified in-harness. Extends the community EBCDIC false-negative warning (id:370469246, GSMG Puzzle Solvers msg #3856, 2020-05-11).",
  "sourceQuote": "in the standard config it's a false negative because of the ebcdic bytes",
  "history": "After the four cosmic ingredients were all grounded and every combine/value/index sweep returned null, an assumption-audit workflow attacked the load-bearing assumptions themselves rather than generating more keys. Five of six lenses found nothing, but the 'wrong-frame' lens noticed a real gap: the success detector scores printability on the RAW AES output, yet the puzzle's ONE confirmed multi-layer decode (phase-3.2) is only English AFTER a CP1141→Beaufort stack. So a correct cosmic decrypt that is likewise EBCDIC-layered would have been silently discarded.",
  "input": "The confirmed phase-3.2 decode stack (AES → iconv ISO-8859-1→IBM1141 → Beaufort key 'thematrixhasyou' over a–z, which turns phase-3.2's ~0.589-printable AES bytes into 'yourlifeisthesum…'); the grounded 4-ingredient cosmic keyset; the three open blobs.",
  "method": "Reproduced the phase-3.2 stack byte-exact and froze it as a KAT (phase32 AES output → the Architect speech), then embedded the 256-byte CP1141 table as a pure-node transform (research/lib/ebcdic.mjs). Re-ran the grounded cosmic keyset (1921 keys × {raw, sha256hex} × 3 blobs), and for EVERY valid-pad plaintext scored readability three ways — raw ASCII, CP1141-reinterpret, and the full CP1141→Beaufort stack — alongside the existing P2PKH-address / self-auth / WIF detectors, KAT-gated with the STOP-guard armed.",
  "provenance": "The stack is @CoruNethron's reproducible one-liner (…iconv -f ISO-8859-1 -t CP1141 | beaufort --decrypt --key=thematrixhasyou); the CP1141 table is iconv IBM1141 byte-for-byte; blobs are ciphertexts/*.txt; harness research/lib/gsmg.mjs + ebcdic.mjs.",
  "output": "KAT passes (phase32 → 'yourlifeisthesumofaremainderofan…'). Grounded sweep: 11,526 decrypts, 43 valid-pad (the ~1/256 chance floor), 0 readable-after-stack, 0 near-English. No false-negative hit was hiding among the grounded keys.",
  "evidence": "KAT-gated (phase32→speech + secp256k1 vector) in-harness; scratchpad r69 (iconv reproduction) + r70 (grounded sweep); the reusable detector is research/lib/ebcdic.mjs (in-node, no runtime iconv).",
  "outcome": "verified-insight",
  "insight": "The endgame detector had a real blind-spot: it scored readability on the RAW AES output, but cosmic's plaintext could be encoded like phase-3.2 (CP1141/EBCDIC bytes then a Beaufort keyed 'thematrixhasyou') — in which case the CORRECT decrypt reads ~0.59 printable and would be discarded as a chance valid-pad. This is the same false-negative that misled solvers on phase-3.2 (id:370469246, 2020), never previously applied to cosmic's ~1312-byte message path. The fix — score readability AFTER the confirmed CP1141→Beaufort stack — is now a standard, KAT-validated detector. Re-running the grounded 4-ingredient keyset through it found nothing: the grounded values still do not open cosmic even when the EBCDIC layer is accounted for. So the wall stands, but a genuine way the answer could have been hiding is now closed, and every future sweep can catch an EBCDIC-layered plaintext.",
  "links": [
   { "label": "Walkthrough — Phase 3.2 (EBCDIC → Architect)", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "community-4colour-prime-matrixsumlist-coordinate",
  "phase": "genesis",
  "category": "genesis :: genesis derivations",
  "title": "Alternate matrixsumlist: the 14×14 grid read as 4 colours (primes 2·3·5·7), FEFEFE row+column removed, 13×13 sums → ASCII → a GPS coordinate (Caresana, Italy) — verified deterministic, dead-end",
  "who": "community",
  "author": "The Community",
  "date": "2026-07-13",
  "source": "A community solver's message to the maintainer, 2026-07-13 (credited as community by request); reproduced + tested in-harness by the engine (@DaneelOlivaw)",
  "sourceQuote": "public 14×14 color matrix → read as four colors, not binary → Blue/White/Black/Yellow = first four primes → remove FEFEFE row and column → sum rows and columns → ASCII → 452349018944153,8/54295738",
  "history": "The canonical matrixsumlist is the row/col sums of the BINARY 14×14 genesis grid (counting 1s) → \"610876654997879\" / \"8108108736759668\" (verified byte-exact, attempt 0059). A community solver proposed a distinct reading: treat the grid as FOUR colours and weight them by the first four primes, remove the FEFEFE anchor's row and column, and read the resulting sums as ASCII text — which lands on a coordinate-shaped string.",
  "input": "The pixel-exact 14×14 grid (content/matrix.js): 15 blue + 9 yellow cells, the rest black/white by bit value; the off-white FEFEFE anchor cell at [7,4] (0-indexed) = row 8, column 5.",
  "method": "Reconstruct the 4-colour grid — Blue, White, Black, Yellow; delete the FEFEFE row and column → a 13×13 grid; weight cells B=2, W=3, K=5, Y=7; sum each remaining row and column; read the sums as ASCII. Then test the resulting string + all coordinate forms as passphrases on the three open blobs, as an alternative matrixsumlist inside the cosmic 4-ingredient combine, and as brainwallet keys (on-chain), KAT-gated with the EBCDIC-aware detector (scratchpad verification harness).",
  "provenance": "Grid/blue/yellow/fefefe from content/matrix.js (pixel-verified vs puzzle.png); the reconstruction reproduces the community solver's stated 13×13 grid EXACTLY; blobs ciphertexts/*.txt; on-chain via blockstream.",
  "output": "VERIFIED byte-exact: with black=1-bit / white=0-bit, the 13×13 grid matches the community solver's exactly. Row sums 52 53 50 51 52 57 48 49 56 57 52 52 49 → ASCII \"4523490189441\"; column sums 53 51 44 56 47 53 52 50 57 53 55 51 56 → ASCII \"53,8/54295738\"; joined \"452349018944153,8/54295738\" → read as 45.2349018944153, 8.54295738 = 45°14'05.7\"N 8°32'34.7\"E = Caresana, Italy (Sesia river, Lombardy/Piedmont border, between Milan and Turin). IN-HARNESS: 1548 KAT-gated decrypts (the string, coordinate/DMS/plus-code forms, and the value as an alt-matrixsumlist in the combine) → 0 blob opened; the 6 coordinate brainwallet addresses are all empty (0 txs) on-chain.",
  "evidence": "Byte-exact 13×13 reconstruction match + KAT-gated AES/secp256k1/EBCDIC harness + blockstream balance check (this run).",
  "outcome": "verified-insight",
  "insight": "This community derivation is arithmetically flawless and fully deterministic — the grid, read as 4 colours weighted by primes 2·3·5·7 with the FEFEFE row+column removed, provably yields \"452349018944153,8/54295738\", which reads cleanly as a Caresana, Italy coordinate. It is a genuine, reproducible construction and a nice piece of work. Two cautions keep it a documented ALTERNATE path rather than a solve: (1) it requires the prime set {2,3,5,7}, which the creator explicitly said is NOT the required set (the required primes are A007522: 7,23,31,47,…) — with A007522 the 13-cell sums are ~260, far outside the ASCII range, so no readable string emerges; (2) the coordinate shape is substantially forced by the arithmetic — small primes over 13 cells make every sum cluster in the ASCII 44–57 band (','–'9'), so a digit-and-punctuation string is nearly guaranteed and reading it as lat/lon is interpretive. And it leads nowhere testable: no blob opens, the value fails as an alternate matrixsumlist in the combine, and the coordinate brainwallets are unfunded — consistent with the solver's own note that these leads \"haven't yielded anything useful.\" Recorded so future solvers see the alternate path and its verified dead-end.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon matrixsumlist", "href": "#/walkthrough" },
   { "label": "Reference — cosmic ingredients", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-universal-decoder-inspector",
  "phase": "salphaseion",
  "category": "salphaseion :: methodology & detector",
  "title": "The \"we cannot miss\" universal inspector: every decrypt is checked under ALL codepages × ALL classical ciphers × ALL KDFs, so no hit hides behind an un-applied decoder",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-14",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): generalising the EBCDIC-detector blind-spot (insight 0034) into a complete post-decrypt inspector",
  "sourceQuote": "create a harness so that all tests take into account all versions of all decoders for each trial we make — we cannot miss",
  "history": "Phase-3.2 taught that a correct AES decrypt can be readable ONLY after a further decode (CP1141/EBCDIC → Beaufort), scoring just ~0.59 raw-printable — invisible to a raw-ASCII detector (insight 0034). If cosmic or an oracle is layered the same way, a raw detector would silently discard the winning key. So a trial must not rely on the plaintext being directly readable: it must be run through every decoder the creator could plausibly have used.",
  "input": "Any AES-CBC decrypt (padding OFF, so raw bytes are always inspected — nothing is gated away by a PKCS7 check); the three open blobs; the confirmed decode signature (CP1141 + Beaufort 'thematrixhasyou' + VIC).",
  "method": "research/lib/universal.mjs — for every trial: derive the AES key under ALL KDFs (EVP_BytesToKey md5/sha1/sha256/sha512 + PBKDF2×{1,1k,10k}); decrypt with padding disabled; then run the raw plaintext through (a) structural crypto detectors — P2PKH address from every 32-byte window vs the prize/peeled address, XOR/SHA combine of the two halves, sha256 self-auth, nested 'Salted__'; and (b) a text layer that reinterprets the bytes under 5 codepages (latin1 + EBCDIC CP1141/037/500/273) × ~30 classical ciphers (Beaufort/Vigenère±/Atbash/Caesar×25) and flags a valid base58check WIF, a thematic word, or ≥4 common-English words; plus nested base64/hex and a VIC digit-decode. KAT-gated (the phase-3.2 speech region flags English + 'privatekey' via CP1141→Beaufort) with a proven 0 false-positive rate on random data.",
  "provenance": "Codepage tables are `iconv -f ISO-8859-1 -t <cp>` byte-exact; secp256k1 via node crypto; WIF via full base58check validation. All blobs ciphertexts/*.txt.",
  "output": "KAT-validated: catches the confirmed CP1141→Beaufort stack (80 common words + 'privatekey'), validates real WIFs while rejecting random base58 strings, 0 false positives across random buffers. Re-certified the grounded 4-ingredient combine keyset AND the blind-spot reframe candidates (Dutch salvation words, on-chain hash160/sats, mp3-sha256, foreign-salt KDF, cross-blob ciphertext-as-key, PBKDF2 iter=1141) under the FULL decoder set → 0 hits. CAPSTONE (iter 370): the entire principled 4-ingredient COMBINE cross-product was run through it — 1250 passphrase candidates × 3 blobs × 7 KDFs = 26,250 decrypts, each inspected across 5 codepages × ~30 ciphers × the structural detectors → 0 findings, 0 valid-pad nears. No winning combine was hiding behind an un-applied decoder.",
  "evidence": "KAT-gated (phase32 speech + secp256k1 vector + base58check WIF) in-harness; scratchpad v_universal_kat + r83/r84; the combine capstone research/harnesses/r90_combine_crossproduct.mjs (3750 tests, sha256 KDF) + r91_combine_x_universal.mjs (26,250 decrypts, all 7 KDFs); module research/lib/universal.mjs.",
  "outcome": "verified-insight",
  "insight": "The endgame's persistent NULL is now certified NOT to be a detector artifact. Every trial is judged under all versions of all decoders — 5 codepages × ~30 classical ciphers × 7 KDFs × the address/WIF/self-auth/nested-Salted/theme/English detectors, on the raw (padding-off) plaintext — so a correct key whose plaintext reads only after some layering (EBCDIC, Beaufort, VIC, a WIF embedded in binary, an address in a 32-byte window) can no longer be missed. Applied to the principled combine space and to a fresh blind-spot reframe's candidates, it still finds nothing: the wall is genuinely the unknown passphrase/personal datum, not an un-applied decoder. This is now the standard success detector for every future trial.",
  "links": [
   { "label": "Walkthrough — Phase 3.2 (EBCDIC → Architect)", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-passphrase-side-byte-encoding-axis",
  "phase": "salphaseion",
  "category": "salphaseion :: methodology & detector",
  "title": "A structurally-overlooked axis: the passphrase's PRE-KDF byte encoding (EBCDIC / UTF-16) — every prior attempt fed openssl -pass as ASCII; the whole axis is now closed",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-15",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): an out-of-box reframe workflow (6 lenses generate + adversarial skeptics), whose sole survivor was the pre-KDF passphrase-encoding axis, then a 5-auditor verification workflow",
  "sourceQuote": "the visible passphrase characters are correct, but the BYTES fed to EVP_BytesToKey are not their ASCII encoding — they are the EBCDIC encoding of those same characters",
  "history": "The endgame's confirmed final layer is EBCDIC: the Phase-3.2 plaintext is byte-exact CP1141 + Beaufort (~0.59 raw-printable). The 'we cannot miss' inspector applies 5 codepages, but only DECODER-side — to the plaintext AFTER decryption. Nobody had ever applied a codepage to the PASSPHRASE before the key-derivation: every trial across ~370 iterations hardcoded UTF-8/ASCII -pass bytes (gsmg.mjs opensslDecrypt, universal.mjs deriveKeys). Since all ingredient forms are pure ASCII, the KDF had only ever seen ASCII passphrase bytes — a genuine blind spot.",
  "input": "The 1250 principled 4-ingredient combine passphrases (both literal and sha256hex forms from the combine cross-product); the three self-verifying open blobs (cosmic + two 80-byte-ciphertext oracles); the confirmed EBCDIC codepages CP1141/037/500/273 and UTF-16 LE/BE.",
  "method": "Encode each combine passphrase STRING to its pre-KDF bytes under a non-ASCII scheme, then run the standard pipeline: char→EBCDIC byte (KAT-checked: 'abc0'→81 82 83 f0; tables match Python's authoritative EBCDIC codecs) for CP1141/037/500/273, and UTF-16 LE/BE with and without a byte-order mark. Feed those bytes to EVP_BytesToKey(sha256) — and, for EBCDIC, all 7 KDFs (evp md5/sha1/sha256/sha512 + pbkdf2×{1,1k,10k}) — decrypt AES-256-CBC with padding OFF, check PKCS7 validity (self-verifying: a correct key MUST pad-validate), and run universalInspect (address/WIF/self-auth/nested-Salted/theme/English) on the result.",
  "provenance": "EBCDIC tables copied byte-exact from research/lib/universal.mjs (iconv -f ISO-8859-1 -t <cp>) and independently re-verified against Python's built-in EBCDIC codecs; evpBytesToKey byte-exact vs OpenSSL 3.5.7 across all digests; blob salts match ground truth (cosmic 2d3f6fe06dc950e6). Harnesses r92/r93/r95/r96 under research/harnesses/.",
  "output": "NULL across the entire axis: EBCDIC × 4 codepages × evp-sha256 = 15,000 decrypts (full inspection) → 0; EBCDIC × all 7 KDFs = 105,000 decrypts → 0; UTF-16 LE/BE = 52,500 → 0; BOM-prefixed UTF-16 = 52,500 → 0. Valid-pad counts track random chance throughout (e.g. 420 vs ~410). A 5-auditor verification workflow found 0 false-null bugs (encoder KAT correct, blob slices correct, valid-pad gate cannot hide a correct key, KDF byte-exact, 0 silent skips).",
  "evidence": "KAT-gated (EBCDIC self-check 'abc0'→81 82 83 f0; universal.mjs selfKAT; positive controls fire ENGLISH/THEME/WIF/NESTED) in-harness; research/harnesses/r92_passphrase_ebcdic_encoding.mjs, r93_passphrase_ebcdic_allkdf.mjs, r95_container_hash_and_utf16.mjs, r96_utf16_bom.mjs; verified by research/harnesses/wf_iter371_verify.mjs (5 auditors, 0 false-null bugs).",
  "outcome": "verified-insight",
  "insight": "The pre-KDF passphrase byte-encoding is a distinct attack axis from the combine, the decoder-side codepages, and the KDF/mode/salt sweeps — and it had never been tested: ~370 iterations all fed UTF-8/ASCII -pass bytes. Applying the puzzle's own native charset (EBCDIC CP1141/037/500/273) and UTF-16 (LE/BE ±BOM) to the passphrase before EVP_BytesToKey, across the full principled combine set and all 7 KDFs, still decrypts nothing on any of the three self-verifying blobs. Together with the combine × full-decoder-universe capstone, this narrows the wall further: it is neither an un-applied decoder nor an un-applied passphrase encoding on a correct in-hand combine — it is a genuinely missing external/personal input.",
  "links": [
   { "label": "Walkthrough — Phase 3.2 (EBCDIC → Architect)", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-lastwords-ordered-delta-null",
  "phase": "salphaseion",
  "category": "salphaseion :: endgame combine",
  "title": "The 'lastwords = the ordered DELTA of the modified Architect speech' reading (not the whole span) is closed — the creator's inserted/swapped tokens, in order, key nothing",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-15",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): a reframe workflow's highest-confidence lens (assumption-inversion), re-examined in-harness after its adversarial kill proved overbroad",
  "sourceQuote": "the ingredient is NOT the 1539-char modified Architect speech as a span, but the residue after the canonical Matrix monologue is subtracted — the creator's inserted/swapped tokens in order",
  "history": "The endgame ingredient 'lastwordsbeforearchichoice' has an UNRESOLVED byte-form: the whole 1539-char modified Architect speech, a single span, or the literal token. Prior work (attempt 0150) tested only six OBVIOUS individual insertions (ciaobellao / returntothesourcecodes / reinsertingtheprimebasics / ireallyhopeyouretheone / ...). The untested reading: the ingredient is the ORDERED DELTA — every token the creator inserted, swapped, or misspelled relative to the canonical Matrix Reloaded Architect monologue, concatenated in order — a reading grounded in the ingredient's own name and the master-hint taunt 'it's in front of your eyes but you're not seeing it'.",
  "input": "The creator-distinctive tokens (unambiguously not in any Matrix film speech) in the order they appear in the puzzle speech: thispuzzle, sedulously, worthhundredfourty, usguysatgsmg, helpusbuildit, returntothesourcecodes, reinsertingtheprimebasics, overtwentythreeciphers, sixteenencryptions, sevenintertwinedpasswords, findtheactualprivatekey, bruteforcingmightberequired, killingyourwillpower, extinctionoftheentirenessofyourselfself, ireallyhopeyouretheone, ciaobellao, and the misspellings (waisting/throphies/prices). Grounded ybp (11 A007522 primes), matrixsumlist (row/col sums), yinyang (95101/10195).",
  "method": "Build 11 delta-derived lastwords VALUES {full ordered concatenation, spaced, the 'worth 140' mission cluster, the endgame-instruction cluster, the swapped words, the misspellings, the number-words, the endings, a first-letter acrostic, ...}. Cross each with grounded ybp{asc-11-primes, blue-then-yellow} × matrixsumlist{rows, cols, rows+cols} × yinyang{95101, 10195, name} × separator{'', z} × order{3 arrangements} × {raw, sha256hex}, and test each on cosmic + both oracles under all 7 KDFs, judged by the universal inspector (address / WIF / self-auth / nested-Salted / theme / English, across 5 codepages × ~30 ciphers).",
  "provenance": "Distinctive tokens are the unambiguous creator additions (present in the confirmed phase-3.2 speech, absent from the Matrix film monologue), so the delta does not depend on an exact external transcript. Harness research/harnesses/r98_lastwords_ordered_delta.mjs; universal.mjs pipeline 5-auditor-certified (iter 371); positive control (phase2/causality) fires, negative control clean.",
  "output": "7,128 tryTrial batches (~50,000 decrypts) → 0 flags, 0 valid-pad readable. The ordered-delta reading of lastwords opens no blob in the grounded 4-ingredient combine. NULL.",
  "evidence": "KAT-gated in-harness (positive control tryTrial(phase2, sha256hex('causality')) fires ENGLISH; wrong-pass control = 0). research/harnesses/r98_lastwords_ordered_delta.mjs; reframe workflow research/harnesses/wf_iter372_reframe.mjs.",
  "outcome": "verified-fail",
  "insight": "The 'lastwords is the DELTA, not the span' hypothesis — a genuinely distinct and previously-untested reading of the most ambiguous ingredient byte-form — is closed. Even the full ordered concatenation of every creator-inserted/swapped/misspelled token (including the ones attempt 0150 missed: hundredfourty, gsmg, privatekey, bruteforcing, the number-swaps, the misspellings) keys nothing in the grounded combine. This removes another 'wrong ingredient form' explanation for the combine nulls and, with the public-artifact exhaustion (Decentraland scene bundle + deployer wallet, also null), reinforces that the missing piece is a non-public personal datum rather than an alternate reading of in-hand material.",
  "links": [
   { "label": "Walkthrough — Phase 3.2 (Architect speech)", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-genesis-grid-verified-vs-source-image",
  "phase": "genesis",
  "category": "genesis :: matrix structure",
  "title": "The genesis grid is independently verified against the puzzle.png pixels — all 196 cells match (rabbit-obscured cells resolved); the 3 grid ingredients rest on a source-verified foundation",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-14",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): first non-circular pixel re-derivation of the grid from the source image (prior 'pixel-exact' checks recomputed FROM matrix.js itself)",
  "sourceQuote": "re-verified pixel-exact against puzzle.png",
  "history": "The 14×14 grid (content/matrix.js) is the source of 3 of the 4 cosmic ingredients (matrixsumlist, yellowblueprimes, yinyang). Its 'pixel-exact' provenance was circular — earlier integrity checks recomputed sums FROM MATRIX.grid, never reading the actual image back. If even one cell were wrong, all three ingredients would be subtly off — a clean explanation for the endgame's persistent NULL. So the grid was read directly from puzzle.png for the first time.",
  "input": "puzzle.png (1048×1556, the Phase-0 genesis image); content/matrix.js (grid/blue/yellow/fefefe/spiral).",
  "method": "PIL pixel-read: locate the 14×14 grid (red separator at y≈1061, cells ≈75px); classify each cell by the majority of its interior samples against {black,white,blue,yellow,fefefe}; reconstruct the 0/1 grid + colored-cell sets; diff cell-by-cell vs matrix.js (parsed as JSON). Drill the 'mixed' cells (obscured by the overlaid white-rabbit drawing) with corner samples. Then flip the obscured cells and test the corrected matrixsumlist/yinyang in the 4-ingredient combine under the universal inspector (all codepages × ciphers × KDFs), KAT-gated.",
  "provenance": "puzzle.png in assets/walkthrough/; matrix.js parsed as JSON; the combine harness is KAT-gated (research/lib/universal.mjs).",
  "output": "blue (15), yellow (9), and fefefe [7,4] MATCH exactly; all 196 cells' majority classification matches matrix.js (ones=101, zeros=95). The only 'mixed' cells are the two obscured by the white-rabbit drawing — (6,7) and (7,8) — both reading WHITE (0) by pixel-majority (only 36–39% black = the rabbit's outline), matching matrix.js. Flip test: flipping (6,7) and/or (7,8) and recomputing matrixsumlist/yinyang → 576 combine trials under the full decoder set → 0 hits.",
  "evidence": "PIL pixel audit (v_grid_from_image / v_grid_rabbit_audit) + KAT-gated universal combine harness (r89), all reproducible in research/harnesses/.",
  "outcome": "verified-insight",
  "insight": "The genesis grid is now INDEPENDENTLY verified against the source image — the first non-circular check (the earlier 'pixel-exact' claim recomputed from matrix.js itself). Every uncolored cell, all 15 blue, all 9 yellow, and the fefefe anchor at [7,4] match puzzle.png exactly; the only cells the 'follow the white rabbit' drawing obscures — (6,7) and (7,8) — read white by pixel-majority and, even if flipped to black, produce a matrixsumlist/yinyang that still opens nothing. So the three grid-derived ingredients (matrixsumlist = 610876654997879/8108108736759668, yellowblueprimes, yinyang = 95101/10195) rest on a source-verified foundation with exactly 101 ones (prime). This definitively closes the 'a wrong grid cell is why the combine never works' hypothesis: the input data is correct; the endgame wall is genuinely the unknown combine/passphrase, not a transcription error.",
  "links": [
   { "label": "Walkthrough — Phase 0 Genesis", "href": "#/walkthrough" },
   { "label": "Reference — cosmic ingredients", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-dbbi-faed-source-verified-foundation-audit-complete",
  "phase": "salphaseion",
  "category": "salphaseion :: source verification",
  "title": "dbbi and faed are verified byte-exact against the archived SalPhaseIon page — the foundation audit is now complete across every endgame source",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-15",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): a gap-audit workflow flagged the SalPhaseIon soup as the one load-bearing source the foundation audit had never checked non-circularly",
  "sourceQuote": "dbbi and faed are the only soup blocks that do not self-decode, so a transcription typo would be invisible to every self-check — yet they seed the entire dbbi→yellowblueprimes / faed→yinyang frontier",
  "history": "The foundation audit re-derived every load-bearing endgame fact from its actual source to break circularity: the genesis grid from puzzle.png pixels, the spiral / colored-URL / yellowblueprimes derivation, the master-hint identities from the 2023-02-23 image, and the blob bytes from the page. But it explicitly scoped OUT the SalPhaseIon soup. Every 'transcription integrity confirmed' note compared only repo-internal copies (data.mjs / ENDGAME-ANALYSIS / WALKTHROUGH — the same transcription lineage). Because dbbi (91 symbols) and faed (570 symbols) are the only soup blocks whose field-decode is garbage (they do not self-decode to a label like the other tokens), a single wrong a–i symbol would be undetectable by any in-harness check while silently mis-seeding every dbbi/faed factorization and grid attack.",
  "input": "The independent 2023-06-01 Internet Archive capture of the SalPhaseIon page (web.archive.org/web/20230601222752 of gsmg.io/89727c59…), where the soup is rendered as space-separated a–i letters; and research/lib/data.mjs (DBBI, FAED).",
  "method": "Fetch the archived page, extract the visible soup text between the 'SalPhaseIon' and 'Cosmic Duality' labels, strip everything except a–z, and char-diff the result against the repository strings: assert the full soup matches character-for-character, and specifically that soup[0:91] equals DBBI, soup[195:765] equals FAED, and the matrixsumlist region soup[91:195] is identical.",
  "provenance": "The Internet Archive capture is an independent third-party mirror (not derived from this repo), so the diff breaks circularity. The same page's Cosmic Duality blob (U2FsdGVkX18tP2/g…) matches the cosmic ciphertext already verified in prior work.",
  "output": "The external soup is byte-identical to the repository soup across all 998 space-stripped characters. dbbi (soup[0:91]) === DBBI, faed (soup[195:765]) === FAED, and the matrixsumlist region match exactly. There is no transcription error in dbbi or faed.",
  "evidence": "Reproducible: curl the Wayback capture, extract + strip the soup, diff against data.mjs DBBI/FAED. In-harness char-diff run this iteration; harnesses research/harnesses/r99 and r100 (the same iteration's cipher-choice and matrixsumlist-form gaps, both null).",
  "outcome": "verified-insight",
  "insight": "With dbbi/faed confirmed against an independent external source, the foundation audit is COMPLETE across every load-bearing endgame source — genesis grid, spiral / colored-URL / yellowblueprimes, master-hint identities, the four AES blob byte-streams, and now the SalPhaseIon soup including dbbi and faed. There is no transcription, derivation, or decode error anywhere in the endgame data. Together with the exhausted combine, passphrase-encoding, cipher-choice, and public-artifact spaces, this maximally constrains the remaining problem: the wall is neither corrupted data nor an un-applied transform — it is a genuinely missing non-public datum, exactly as the creator has said.",
  "links": [
   { "label": "Walkthrough — SalPhaseIon soup", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-creator-statement-history-no-unlogged-hint",
  "phase": "salphaseion",
  "category": "salphaseion :: endgame strategy",
  "title": "The creator's seven-year public statement history holds no un-logged operational hint — and he has said the answer lives on an offline laptop, so the wall is a non-public personal datum",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-16",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): a systematic chronological mining of the creator's entire public message history, prompted by his own statement that close friends have the best chance because they know something",
  "sourceQuote": "My close friends have the best chance of solving it (a few tried). But they don't have the skills some of you do. — followed by: NOTE: that is a hint.",
  "history": "Years of in-harness cryptanalysis are exhausted and every endgame data source is now verified. The creator has repeatedly framed the missing piece as personal and knowable. If a decisive clue existed in his own words, it would be the highest-value untapped source — but only a handful of his statements had ever been distilled into intel. This work mined the whole history chronologically to either surface an overlooked operational hint or establish, rigorously, that none exists in public.",
  "input": "The complete set of the creator's public messages spanning 2019 through 2026 (several hundred), read chronologically by year-window; the existing creator-intel notes and the exhaustion ledger for de-duplication.",
  "method": "Fan out readers across year-windows, each extracting every message that could be an operational instruction, a concrete value, a self-referential pointer, or a personal datum a close friend would know — excluding banter. Adversarially verify each candidate against its own in-thread context and the ledger: is it genuinely new, genuinely operational (versus flavour the creator himself waves off), and can it be turned into a concrete decryption test? Then run every concrete token the mining surfaced through the universal decryptor (all key-derivations, code pages, and ciphers) against the three open blobs, both standalone and appended to the four-ingredient combine.",
  "provenance": "Every quote verified verbatim against the message archive; candidate tokens tested in-harness with the KAT-gated universal inspector. No biographical specifics are reproduced here by design — only the puzzle-relevant conclusion.",
  "output": "Of dozens of flagged candidates, none survived adversarial verification: each resolved to an unrelated April-Fools prank, the single already-known typo fix, a quote the creator explicitly tagged 'not a hint', a self-referential backronym, or biographical colour with no extractable key. The token sweep of every concrete name/place/idiom he mentioned was null across all three blobs. Two of his own statements, however, sharpen the picture: the definitive answer resides on an offline laptop he 'hasn't touched in years', and his close friends 'have the best chance … because they know something' — a line he explicitly labelled a hint.",
  "evidence": "In-harness token sweep (25 creator-mentioned tokens × 5 forms × 3 blobs × all key-derivations) → 0 valid decrypts; research/harnesses/r102_creator_corpus_personal_tokens.mjs; the mining workflow research/harnesses/wf_iter375_creator_mining.mjs.",
  "outcome": "verified-insight",
  "insight": "The creator's entire public statement history contains no un-logged operational hint, and no public token he has ever mentioned is the passphrase. Combined with his own words — that the answer sits on an offline laptop and that close friends who 'know something' have the best chance — this establishes that the remaining barrier is a genuinely non-public personal datum, not a derivation or a hint hidden in public material. It reframes the realistic path to a solution: not more cryptanalysis of the in-hand data (which is exhausted and verified) but a specific piece of knowledge held by the creator or someone close to him.",
  "links": [
   { "label": "Walkthrough — the endgame", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 },
 {
  "id": "engine-merkle-taproot-combine-null",
  "phase": "salphaseion",
  "category": "salphaseion :: endgame combine",
  "title": "Hash-tree combines of the four ingredients — a plain Merkle root and a BIP341 taproot tagged-hash root — are tested and open nothing",
  "who": "this project",
  "author": "@DaneelOlivaw",
  "date": "2026-07-17",
  "source": "Independent research — Hosterjack (@DaneelOlivaw): prompted by a live creator/community session (2026-07-16) whose most-quoted lines were 'merkle root is the balancing function' (@piandonehalf) and 'there is no key path' (a BIP341 taproot term)",
  "sourceQuote": "merkle root is the balancing function, same way the block header contains the merkle root of the transaction list",
  "history": "The cosmic passphrase is a combine of the four verified ingredients, but every string/arithmetic/cipher combine is exhausted. A live discussion about quantum-resistant Bitcoin (BIP360), Pay-to-Merkle-Root, and taproot raised a construction the combine sweeps had never covered: a hash-TREE over the four ingredients (rather than a flat concatenation-then-hash). The Bitcoin genesis-block merkle root had been tested as a value, but a merkle tree built FROM the four ingredients had not.",
  "input": "The four grounded ingredients {yellowblueprimes (11 A007522 primes), matrixsumlist (grid row/col sums), lastwordsbeforearchichoice, yinyang (95101/10195)}, in principled byte-forms; the three open blobs.",
  "method": "Build a two-level binary hash tree over the four ingredients under all three ways of pairing them into two halves (naturally matching the puzzle's 'half and better half' motif). (1) Plain Merkle: leaf = H(ingredient); internal = H(leaf_left ‖ leaf_right); root = H(internal_left ‖ internal_right); with H in {single SHA-256, Bitcoin double-SHA-256} and both raw-byte and hex concatenation. (2) BIP341 taproot: the tagged hash SHA256(SHA256(tag)‖SHA256(tag)‖data) with TapLeaf-tagged leaves and TapBranch nodes that lexicographically sort their two children (as the standard requires), plus a TapTweak-of-root variant. Each 32-byte root is tested as the openssl passphrase (hex, through every key-derivation) and as a raw AES key with a derived IV (padding off), on cosmic and both oracles, judged by the universal inspector.",
  "provenance": "Tagged-hash and TapBranch-sorting implemented to the BIP341 spec; self-verifying via PKCS7 on the blobs; STOP-guard armed. Harnesses r106 (merkle) and r107 (taproot) under research/harnesses/.",
  "output": "NULL. Plain Merkle: 288 roots → 864 passphrase-batches + 864 raw-key decrypts → 0. Taproot tagged-hash: 144 roots → 864 + 432 → 0. No hash-tree combine of the four ingredients — Merkle or taproot — produces a valid decrypt on any open blob.",
  "evidence": "Self-verifying in-harness; research/harnesses/r106_merkle_tree_combine.mjs and r107_taproot_tagged_hash_combine.mjs; the prompting session logged as insight 0041.",
  "outcome": "verified-fail",
  "insight": "The combine space now also excludes hash-tree constructions: neither a plain Merkle root nor a BIP341 taproot tagged-hash root over the four ingredients keys any blob. This closes the most concrete idea to come out of the community's BIP360/merkle/taproot discussion, so future solvers arriving from that same conversation can skip it. It is one more confirmation that the barrier is not an untried combine shape over the public ingredients — it is a non-public personal datum, exactly as the creator has repeatedly said.",
  "links": [
   { "label": "Walkthrough — the endgame combine", "href": "#/walkthrough" },
   { "label": "Reference — the open blobs", "href": "#/reference" }
  ]
 }
];

// Obvious facts / identities / settled conclusions render as COMPACT cards (terse, one line,
// with a collapsible "details" for the full input/method/output) so they don't crowd the catalog.
const COMPACT_IDS = new Set([
  'genesis-qr-decoded-blockchain-link', 'genesis-qr-standard-reproduced-from-url',
  'genesis-fefefe-cell-located-7-4', 'genesis-colors-equal-url-bit-parity',
  'genesis-grid-byte-boundary-pointer', 'chain-reproduce-phase2-3-32-byteexact',
  'verify-embedded-salphaseion-equals-repo', 'cosmic-txt-authenticity-archived-2023',
  'blob-independence-conclusion', 'cosmic-no-partial-progress-oracle',
  'vanity-address-kills-brainwallet', 'faed-ic-near-random-118',
  'dbbi-symbol-frequency-analysis', 'keysweep-pkcs7-chance-calibration',
  'onchain-ecdsa-nonce-reuse-ruled-out', 'architect-ebcdic-cp1141-codepage-debate',
  'wayback-cdx-gsmg-urls-spa-shell', 'onchain-ecdsa-nonce-reuse-ruled-out',
  'oracle-salts-random-no-steganography',
]);
for (const a of ATTEMPTS) if (COMPACT_IDS.has(a.id)) a.compact = true;

// Family cards: big clusters of near-duplicate trials collapse into ONE dense summary (+ the
// cluster's interactive lab), with every individual trial nested compactly beneath — nothing
// deleted, but the shared conclusion is stated once. Keyed by "<phase> :: <category>".
export const FAMILIES = {
  'genesis :: matrix structure': {
    blurb: `<b>What the grid's structure encodes.</b> The coloured cells sit <i>exactly</i> on the URL's byte-boundaries — a deliberate <b>pointer</b> mechanism, not decoration — and the colours equal the URL characters' bit-parity (so they carry no separate message). Game-of-Life / cellular-automata rules and prime-position re-reads yield nothing beyond the URL.` },
  'genesis :: genesis derivations': {
    blurb: `<b>Computing <code>yellowblueprimes</code> / <code>yinyang</code> from the genesis.</b> The 4156-lens sweep, the 89-candidate sweep, the matrixsumlist row/col sums, first-piece text keys, yinyang from the blue↔yellow duality, and mixed 0-vs-1-origin ("zero out") indexing. The values ARE genesis-derived numbers — but none can be confirmed without the cosmic combine, which also needs the unknown <code>yinyang</code> (no standalone oracle).` },
  'salphaseion :: dbbi / faed — field & number decode': {
    blurb: `<b>Reading the a–i blocks as NUMBERS.</b> Field-decode (a=1…i=9) → big integer → hex → ASCII; <b>all 362,880 (9!)</b> symbol→digit permutations; base-81 pairs; the block as a decimal passphrase; primality/factoring; repeating-key and one-time-pad subtraction against the 91-char "INCASE…" line; and a direct search for the literal word "yellowblueprimes" in every base. All → high-entropy garbage, no blob key. dbbi is only 91 bits (≤13 chars) so it <i>cannot</i> hold a 16-char word — it must encode a computed number, not text.`,
    lab: 'dbbi-all-9factorial-substitutions' },
  'salphaseion :: dbbi / faed — binary & bitmap': {
    blurb: `<b>Reading the blocks as BITS.</b> The verified "fefefe = 101010" prime-value map (2,3,5,7 → 0, else → 1) packed into 8-bit ASCII; grid re-indexing (rows/cols/diagonal/boustrophedon); the matrixsumlist-104 mask; and rendering dbbi as a 7×13 bitmap looking for a glyph. All noise — and 91 bits is simply too little information to carry the target string.`,
    lab: 'dbbi-all-9factorial-substitutions' },
  'salphaseion :: dbbi / faed — zero-out schemes': {
    blurb: `<b>The creator's "some characters need to be zeroed out" — read literally.</b> Zero the prime-valued symbols; or insert a single 0 at every indexed / prime position before field-decoding; exploiting that dbbi/faed uniquely <i>lack</i> the "o"(=0) symbol. Every insertion rule → garbage.`,
    lab: 'dbbi-all-9factorial-substitutions' },
  'salphaseion :: polyalphabetic & fractionation': {
    blurb: `<b>Classical hand-ciphers on the a–i blocks.</b> Vigenère / Beaufort (periods 1–6, and keyed by matrixsumlist / the colour-prime bits / the "INCASE…" alphabet); bifid over every 3×3 square and period; columnar transposition across all grid factorisations; balanced-ternary trit-pairs; the "seven intertwined passwords" reading. All → garbage — and faed's Index of Coincidence (≈ 0.118) statistically rules out any monoalphabetic or short-period cipher.`,
    lab: 'dbbi-all-9factorial-substitutions' },
  'salphaseion :: dbbi / faed — statistical': {
    blurb: `<b>Information-theoretic characterisation.</b> Symbol frequency, Index of Coincidence, autocorrelation / lag-253, column-IC period detection, and compression / file-format probes. Verdict: <b>dbbi is STRUCTURED</b> (IC 0.151, "b"-skewed) — a real numeric encoding whose scheme matches nothing in the toolkit; <b>faed is RANDOM</b> (IC 0.118) — encrypted or filler, matching the creator's "faed may be for another puzzle."`,
    lab: 'dbbi-all-9factorial-substitutions' },
  'salphaseion :: dbbi / faed — exotic transforms': {
    blurb: `<b>Long-shot symbol systems.</b> EBCDIC / VIC transforms, I-Ching / Lo-Shu / flying-star, nonary digital-root (mod 9), turtle / numpad path-drawing, and the prime-index "rabbit cells" reading. None produces text or a key.`,
    lab: 'dbbi-all-9factorial-substitutions' },
  'salphaseion :: cosmic combine recipe': {
    blurb: `<b>Every way to build the final cosmic key.</b> The four literal words in all orders / separators; matrixsumlist literal vs numeric; 3-ingredient (omit yinyang); include enter / thispassword; the full master-hint string; per-ingredient-sha-then-concat and XOR; double-sha (the two "shabef"); dbbi/faed bytes as raw ingredients; KDF variants (md5 / sha1 / sha512 / pbkdf2); and the fabricated issue-#56 XOR-of-7 and issue-#69 master-key. None opens the blob — because two ingredients (ybp, yinyang) are unknown and there is <b>no partial-progress oracle</b>.`,
    lab: ['cosmic-4ingredient-literal-sha256-all-orders', 'cosmic-kdf-variants-md5-sha1-sha512-pbkdf2'] },
  'salphaseion :: blob combination & format': {
    blurb: `<b>Treating the four AES blobs as linked.</b> XOR of pairs, ciphertext concatenation, cross-keying (one blob's ciphertext as another's key), shared / repeated-block scans, the four salts as an AES key in all orderings, salt-math (xor / sum / sha), AES-key-wrap and BIP38 hypotheses, and the orphaned 4th blob (salt 74c974e3). Conclusion: the blobs are <b>independent</b> containers (own salts, no shared block, XOR to noise) — the linkage is in key-derivation, not in combining ciphertexts.` },
  'salphaseion :: key sweep (passphrase battery)': {
    blurb: `<b>Spraying passphrase batteries at the blobs.</b> The full 370k-word English dictionary (× literal / sha256hex, ~1.5M decrypts), harvested plaintext phrases, Matrix-Reloaded quotes, the named-token battery, reused chain keys, and the SalPhaseIon page-hash — PKCS7-chance-calibrated, every result at the noise floor. Blind spraying is hopeless without a value that first opens a small blob.` },
  'salphaseion :: on-chain forensics': {
    blurb: `<b>The Bitcoin side.</b> 50 OP_RETURN messages mined from the prize address; the vanity-prefix finding (the key is <b>random</b> → no brainwallet / split-key shortcut, 86k + 1.2k derivations, zero address matches); an ECDSA nonce-reuse check; the Wayback CDX of all gsmg.io URLs (no hidden post-cosmic stage); and cosmic.txt authenticity (verbatim on the 2023 archive). Establishes: the key exists only <i>inside</i> the cosmic blob — there is no external shortcut.` },
};

// Point each family at the interactive lab that actually matches its methods.
FAMILIES['salphaseion :: dbbi / faed — binary & bitmap'].lab = 'dbbi-faed-exhaustive-decode-ic-characterization';   // analysis workbench (bitmap render)
FAMILIES['salphaseion :: polyalphabetic & fractionation'].lab = 'dbbi-faed-exhaustive-decode-ic-characterization';  // analysis workbench (Vigenère/Beaufort)
FAMILIES['salphaseion :: dbbi / faed — statistical'].lab = 'dbbi-faed-exhaustive-decode-ic-characterization';       // analysis workbench (freq/IC/autocorr)
FAMILIES['salphaseion :: blob combination & format'].lab = 'cosmic-kdf-variants-md5-sha1-sha512-pbkdf2';            // AES oracle
FAMILIES['salphaseion :: key sweep (passphrase battery)'].lab = 'cosmic-kdf-variants-md5-sha1-sha512-pbkdf2';       // AES oracle
FAMILIES['genesis :: matrix structure'].lab = 'ledger-exhaustive-reread-14x14-matrix';                             // interactive genesis grid
FAMILIES['genesis :: genesis derivations'].lab = 'ledger-exhaustive-reread-14x14-matrix';                          // interactive genesis grid
