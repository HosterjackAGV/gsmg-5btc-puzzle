# GSMG.io 5 BTC Puzzle — Endgame Cryptanalysis: Complete Merged Findings

**Status: UNSOLVED (genuinely).** This document merges everything established across a deep
multi-session investigation: verified facts, the exact raw data, the full creator-hint timeline,
proof that the public "solutions" are fake, the complete exhaustion map, the original-image
analysis, and the structural reason the endgame resists everyone. Goal of any solve = a WIF private
key controlling `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` (coins on-chain, unmoved → proof it's open).

---

## 0. The single most important structural insight
The endgame has **NO partial-progress oracle.** Every test reduces to decrypting one of three
AES-256-CBC blobs, and AES only "fires" (valid PKCS7 + readable text) when the *entire* passphrase
is correct. The final key needs THREE unknowns simultaneously right: the value of `yellowblueprimes`,
the value of `yinyang`, AND the combine operation. Two-of-three perfect still yields pure random
bytes — zero feedback. This is a multiplicative, feedback-free search. It matches the Architect's
own warning: *"twenty-three ciphers, sixteen encryptions… seven intertwined passwords… brute forcing
might be required."* This is why 7 years of skilled attempts (and this investigation) cannot close it
by cleverness alone.

---

## 1. Verified crypto chain (reproduced byte-exact)
All blobs = OpenSSL `enc -aes-256-cbc -md sha256` (EVP_BytesToKey/SHA-256). Passphrase convention:
`pass = sha256hex(answer-string)`.
- phase2  key = sha256("causality") = eb3efb…e5bf → Mr-Robot riddle ✓
- phase3  key = sha256(7-part pw)   = 1a57c572…30d5 ✓
- phase3.2 key= sha256("jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple") = 250f3772…ce4c ✓
- phase3.2 plaintext: EBCDIC cp1141 → Beaufort(THEMATRIXHASYOU) → Architect speech; VIC
  (alphabet FUBCDORA.LETHINGKYMVPS.JQZXW, markers 1&4) → "…PRIVATE KEYS BELONG TO HALF AND BETTER HALF…"
- Entry to SalPhaseIon: sha256("GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe") =
  89727c59… (Decentraland audio → "HASHTHETEXT").

## 2. THREE open AES blobs (salt / ct-len)
1. **cosmic**       2d3f6fe06dc950e6 / 1328B  — the final prize blob (ciphertexts/cosmic.txt)
2. **salph_inner**  3ab585348552415d / 80B   — blob embedded in the SalPhaseIon soup
3. **p32_trailing** b45a5e3d827593ca / 80B   — blob at the END of phase-3.2 plaintext; the community
   never noted/decoded this one. (b64: U2FsdGVkX1+0Wl49…mdC0NAv4)
A correct key on either 80-byte blob would be instantly obvious (≤79 readable bytes).

## 3. The SalPhaseIon soup (exact)
Structure: `[dbbi][binary1=matrixsumlist][faed] z [agda→lastwordsbeforearchichoice] z
[cfob→thispassword] z "shabef" "our first hint is your last command" [salph_inner blob, split by z +
binary2=enter] "shabef" "anstoo"`.
- shabef = sha256 (sha + b,e,f=2,5,6 via a1z26). The combine uses sha256.
- dbbi (91=7×13): `dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe`
- faed (570=2·3·5·19): `faedggeedfcbdabhhggcadcf…ahaidhfahiihic` (full string in faed.txt)
- 4 known soup tokens (each decodes to its LITERAL word): matrixsumlist, enter,
  lastwordsbeforearchichoice, thispassword.

## 4. The 4 cosmic ingredients (2023-02-23 reverse-binary master hint)
`yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang` (+ taunt:
`wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit · verylaststepisatruegiveaway · promised`)
- KNOWN: matrixsumlist (= row-sums "610876654997879" + col-sums "8108108736759668"),
  lastwordsbeforearchichoice (literal).
- **UNKNOWN: yellowblueprimes, yinyang.** These are the wall.

## 5. Hint intelligence (creator + community Telegram, assembled here) — with provenance flagged
> ⚠️ Provenance matters: several lines long treated as "creator hints" were actually written by
> *community* solvers. Jrk (the creator) confirmed only a few of them. Attribution is marked below.
- 2020-01-14 (creator): "Roses are White but often Red. **Yellow has a number and so does Blue**. Go back to the
  first puzzle piece… the rabbit's nest may contain a whole lot more." (NOBODY publicly decoded this.)
- 2021-03-01 (**community, not creator**): a solver (Telegram id394589394) asks "which primes **2,3,5,7** we need
  use" and separately posts "**104 is the fefefe square**… **fefefe is 101010**… if you know how the **array is
  indexed**". Jrk's ONLY replies that day were "You are at THE PRIME PART already???" (confirming a prime part
  EXISTS — not the set {2,3,5,7}) and, to the fefefe line, "Ancient spelling 😅. One of the many many typos."
  → **{2,3,5,7} and fefefe=101010/104 are community inferences / working assumptions, NOT confirmed creator hints.**
- 2021-12-25 (**creator**): "prime numbers… required to proceed. … **some characters need to be 'zeroed out'**."
- 2021-12-02 / 2021-12-25 / 2020-08-02: "There is **another DOOR**" nobody found; "the second half
  [faed?] will probably be used for ANOTHER PUZZLE, or not at all."
- 2021-03-14: "Breaking salphation should give the FEELING OF THE PHASE'S NAME" (SalPhaseIon≈salvation).
- 2023: "prime number is very important"; "the theory of everything is a valid path"; 2023-08-03:
  "Are you really looking for just the btc…?" / "the hardest part is done."
- Architect: "RETURN TO THE SOURCE CODES… REINSERTING THE PRIME BASICS… 23 ciphers, 16 encryptions,
  7 intertwined passwords… BRUTE FORCING MIGHT BE REQUIRED… worth HUNDRED FOURTY (140)."

## 6. Original genesis image — analyzed pixel-by-pixel (img_puzzle.png, 1048×1556)
- 14×14 grid EXACTLY matches content/matrix.js (15 blue, 9 yellow, 0 red cells, 0 anomalies).
- Colors present: white, black, blue (40,40,200), yellow (240,240,0); RED only = the bottom border
  line + the address text (the literal "…but often Red"). A **rabbit** is drawn in the grid (the
  literal "rabbit's nest"). A **QR code** sits bottom-left (could not be decoded from the recompressed
  copy; standard Qs on these images encode the URL/address — likely not the hidden "door").
- Genesis colors carry NO hidden payload beyond the URL: blue cells sit on 1-bits, yellow on 0-bits,
  i.e. they equal the URL characters' ASCII LSB parity (re-derived 3× independently).

## 7. PUBLIC "SOLUTIONS" ARE FAKE (verified by direct computation)
- Issue #69 master key `818af53daa3028449f125a2e4f47259ddf9b9d86e59ce6c4993a67ffd76bb402`:
  fails on cosmic under EVP(hex), raw-key/IV=0, raw-key/IV=salt, ECB — all padding-fail. Its quoted
  "decrypted payload" is just the phase-3.2 VIC text copy-pasted. FABRICATED.
- Issue #56 XOR-of-7-tokens recipe: does not reproduce its own claimed plaintext SHA, decrypts nothing. FALSE.

## 8. EXHAUSTION MAP — what is decisively ruled out
**dbbi/faed as decoded text:** ALL 362,880 symbol→digit permutations of the field-decode (int→hex→
ascii) = garbage (max printable 0.74/0.52). ALL 9! monoalphabetic subs, all transposition×sub (3.27M),
Vigenère/Beaufort periods 1–6, grids, bifid, base-81, base reads — all garbage (ledger + this work).
**dbbi as binary** (fefefe rule prime-value→0, verified): flat 7/8-bit, all subset bit-maps, both
polarities, grid reindex (rows/cols/diag/boustro/transpose/reverse), bitmap render — all noise; AND
mathematically too low-information (91 bits → max 13 chars, cannot hold 16-char "yellowblueprimes").
**dbbi/faed "zero-out" schemes** (by prime value {2,3,5,7}, by prime position, insert vs replace,
remove): all garbage. **Prime-symbol extraction:** garbage.
**faed:** IC≈0.118 (random) → not enciphered English (periods 1–30); not Salted__/block-aligned/
compressed; not a yin/yang self-complement (halves ~0.10 = chance); lag-253 autocorr has no literal
repeat. dbbi/faed decoded bytes are NOT the private key (≈17 scalar forms vs address) and NOT blob keys.
**Cosmic/small-blob keys:** ~20,000 targeted attempts + full 370k-word dictionary × {literal,sha256hex}
(~1.5M decrypts) → top printable 0.59 = chance. Tested: all soup tokens, the 4 master words (every
order/sep), matrixsumlist numeric, the full Architect speech + VIC sentence (many normalizations),
Matrix-Reloaded quotes ("theproblemischoice" etc.), chain keys reused, page-hash 89727c59,
"thispassword"/"enter"/"shabef"/the taunt phrases/the FULL master-hint string, XOR-of-N-token-hashes
(N=4..8) as EVP-passphrase and direct key, double-sha (shabef), per-ingredient-sha-then-concat.
**Matrix yellowblueprimes candidates** (prime-index chars, per-color counts, position sums 157/143,
prime-position readings) as keys/ingredients: nothing.

## 8d. Genesis image — 100% accounted for (QR finally decoded)
The first puzzle piece holds NO further hidden data. Every element resolved: 14×14 grid = the URL
(matches matrix.js exactly); blue cells sit on 1-bits / yellow on 0-bits = URL bit-parity → matrixsumlist
(no separate color message); the rabbit drawing = the literal "rabbit's nest" motif; the red line = the
literal "often Red"; the address text = the prize address. The QR code (square, flush to the left edge —
which defeated earlier crops) decodes to **`https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe`**
— a public blockchain-explorer link, no payload. Pixel analysis shows only white/black/blue/yellow +
the red border (no third hidden colour). The genesis is fully mined.

## 8c. "Berserk" round — Wayback archaeology + KDF/split-key + the vanity-address insight
- **The prize address is a VANITY address** (`1GSMG1`… is a brute-forced prefix). Therefore the private
  key is **random**, NOT derived from any phrase. This DEFINITIVELY kills brainwallet / split-key /
  any address-derivation approach (86,310 brainwallet + 1,204 split-key derivations confirmed: 0
  matches). The key only exists *inside* the cosmic blob; the sole path is decrypting cosmic.
- **KDF variations on cosmic** (MD5, SHA-1, SHA-512 EVP; PBKDF2 ×{1,1k,10k iters}) with top keys → 0.
  Cosmic uses standard SHA-256 EVP (matches the rest of the chain).
- **Wayback Machine fully mined** (CDX of all gsmg.io URLs): the only REAL puzzle pages (specific,
  small content) are from 2020-2023 — `theseedisplanted` (1245B), `choiceisanillusion…` (=Phase 2,
  9232B), and **SalPhaseIon `89727c59…` (4592B) = exactly my soup + the cosmic blob `U2FsdGVkX18tP2/g…`**.
  This CONFIRMS cosmic.txt is authentic and the data is complete. Everything from 2024+ (the ~10 64-hex
  "stage" pages, `final_stage`, `followthewhiterabbit`, `TheArchitectChoice`, `puzzle/stage5`, the
  hex-`Salted__`-blob URLs) returns the **identical ~36KB SPA shell** — i.e. community URL-guesses, NOT
  real stages. `gsmg.io/door.png` = unrelated binary; `follow_the_white_rabbit.png` = the genesis grid.
- **Issue #56's `4f7a1e…` "next page" is fabricated**: its only Wayback capture is a 530 server error
  (never real content), and no cosmic key yields a plaintext hashing to it. There is NO discoverable
  "other door" / post-cosmic stage in the archive. (A new 96-byte `Salted__` blob at salt `74c974e3`
  appears as a posted URL path but is a community artifact, undecryptable by any tested key.)

## 8b. Final closures (deep-dive results)
- **Chess/`p32_trailing` lead CLOSED.** The "fubcd-king & oracle-queen… sad board as wide as the first
  one seen" clue's only real purpose is the VIC alphabet (already used). `p32_trailing` resists 288
  phase-3.2-derived answer strings, the raw pre-Beaufort EBCDIC letters string, the VIC digit string
  (fwd/rev), the phase-2 FEN, chain keys, and the full 370k-word dictionary. No specific board
  position is given to construct a key from. Dead end.
- **Brainwallet hypothesis CLOSED.** sha256(phrase) used DIRECTLY as a secp256k1 private key →
  P2PKH (compressed+uncompressed) vs the prize/split-off/donation addresses: 86,310 derivations over
  all puzzle-vocabulary permutations (×{sha256, double-sha256, sha256∘sha256hex}) → ZERO matches. The
  prize key is the AES-protected endpoint, not a brainwallet. (This was the one self-verifying oracle
  available without the cosmic key; now exhausted for puzzle vocabulary.)

## 9. Honest assessment + remaining threads (ranked)
This is not close to solved. Best-effort probability of a clean local-cryptanalysis crack: very low.
The wall is structural (§0) + likely informational: the creator says "nobody found the extra door"
and the live gsmg.io pages are down. Genuinely untried/under-determined threads, in priority:
1. **p32_trailing** (80B, never decoded) via the chess clue immediately preceding it —
   "fubcd-king & oracle-queen, thingky mvps, on a SAD BOARD but as wide as the FIRST ONE SEEN" +
   alphabet FUBCDORA.LETHINGKYMVPS.JQZXW — decoded as an actual board/coordinate construction (not
   merely hashed as a phrase). The one self-contained, instantly-verifiable concrete lead left.
2. **yellowblueprimes / yinyang as COMPUTED values from the genesis** (yellow/blue + primes 2,3,5,7;
   yinyang = the blue/yellow duality/complement) — but unverifiable except through the blobs.
3. The **QR code** decoded from a pristine image (low odds; likely standard).
4. Accept the creator's framing ("you'll never finish the last task", "are you really looking for just
   the btc", "worth 140× the investment") — the endgame may be intentionally near-unsolvable / gated
   on lost resources.

## 10. Reusable artifacts (this investigation, scratchpad/)
gsmg.py (byte-exact AES/KDF harness), dbbi.txt, faed.txt, DATA_BRIEF.md, the sweep/decode scripts
(sweep.py, author.py, xor7.py, zeroout.py, binmap.py, gridbits.py), the hint images (hints/), and the
two multi-agent workflow scripts (wf.js, wf2.js).
