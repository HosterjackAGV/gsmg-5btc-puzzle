# GSMG Puzzle — Unused & Under-Exploited Pieces (Loose-Ends Inventory)

> Scope: every artifact that is UNUSED, UNDERUSED, BRUTEFORCED (value known, WHY not), UNDECODED, DUAL-USE, or OPEN. Organized by puzzle phase. De-duplicated across area-auditors. The goal is to surface the missed step toward **yellowblueprimes**, **yinyang**, and the final **cosmic** AES key.

---

## Phase 0 — Genesis Image (gsmg.io/puzzle, content/matrix.js)

**14×14 binary grid (196 cells)** — `[UNDERUSED / DUAL-USE]`
- What: 14×14 0/1 matrix (15 blue, 9 yellow, 0 red cells); 1-bits = 101; rows & cols each sum to 101.
- Used: CCW spiral → 8-bit ASCII → `gsmg.io/theseedisplanted` (single confirmed reading).
- → potential: 2020 hint says "the rabbit's nest may contain a whole lot MORE." Per-cell color (LSB parity) was never turned into the yellowblueprimes/yinyang VALUES; main/anti diagonals (7, 8) never folded into any value.

**CCW spiral reading order (196-cell path)** — `[DUAL-USE]`
- What: explicit 196-entry inward spiral in matrix.js (down left col first).
- Used: defines bit order yielding the URL (once).
- → potential: never tried as the **array-indexing function** the creator keeps citing ("if you know how the ARRAY IS INDEXED"). Apply this exact spiral as the indexer over dbbi/faed. Note 196 = 24·8 + 4: trailing 4 spiral cells (192–195) are not part of any URL byte and were never examined as a separate payload.

**15 blue + 9 yellow colored cells** — `[UNDERUSED]`
- What: every colored cell sits at spiral position ≡ 7 mod 8 (the LSB of one URL byte). Blue tags 1-indexed positions {1,2,3,4,6,7,8,11,12,13,14,16,17,20,23}; yellow {5,9,10,15,18,19,21,22,24}; together they partition all 24.
- Used: dismissed as "just LSB parity = zero extra info"; a few index/count/sum candidates hashed → 0 hits.
- → potential: the most direct match to **yellowblueprimes** + the 2020 hint "Yellow has a NUMBER and so does Blue." Two index sets over positions 1–24; "primes" maps onto prime positions {2,3,5,7,11,13,17,19,23} (blue holds {2,3,7,11,13,17,23}, yellow {5,19}). The exact derivation is unsettled ("too many combinations"). The deliberate mod-8 byte-boundary placement = a designed POINTER mechanism, not parity.

**colors = LSB-parity of URL bytes** — `[DUAL-USE]`
- What: blue↔1/LSB=1, yellow↔0/LSB=0.
- Used: recorded as a NEGATIVE result ("no payload beyond the URL").
- → potential: byte-boundary placement is a byte-SELECT scheme — blue-selected chars `gsmgio/eseeisae` vs yellow-selected `.thdplntd` were only lightly hashed, never crossed with prime positions.

**matrixsumlist row-sums + col-sums** — `[BRUTEFORCED]`
- What: rows [6,10,8,7,6,6,5,4,9,9,7,8,7,9], cols [8,10,8,10,8,7,3,6,7,5,9,6,6,8]. Naive concat rows=`610876654997879`, cols=`8108108736759668`.
- Used: cosmic ingredient #2; concatenation hashed thousands of times → 0 hits.
- → potential: **format is ambiguous/lossy** — the value 10 makes `6108...` parse two ways. Zero-padded two-digit? base-14/15? rows-then-cols vs interleaved vs cols-first vs 28-value list? The exact byte-form feeding sha256 is unknown and could alone break an otherwise-correct recipe. Diagonal sums (7,8) and total (101) are unfolded extensions.

**URL `gsmg.io/theseedisplanted` as data** — `[DUAL-USE]`
- What: 24-char spiral output.
- Used: navigation to Phase 1; lightly tried as AES/Vigenère key (noise).
- → potential: it is the substrate the colors index → raw material for yellowblueprimes. 24 chars = 24 LSBs = a 3-byte number never read as a standalone value tied to yinyang's duality.

**Prime-spiral-position bits** — `[BRUTEFORCED]`
- What: grid bits at the 44 prime spiral positions ≤196.
- Used: computed, shallow Vigenère test (noise).
- → potential: reading the GRID at prime positions is a plausible alternate "prime basics" source vs dbbi/faed. The small set {2,3,5,7} selecting only the first 4 prime-position cells was never isolated as a value.

**The QR code (bottom-left)** — `[UNDECODED]`
- What: standard QR in img_puzzle.png.
- Used: one note says "blockchain.com link, no payload"; another says it could NOT be decoded from the recompressed copy.
- → potential: status genuinely ambiguous. A pristine/original-resolution decode was never confirmed; any payload beyond the standard address link is unread.

**Rabbit drawing inside the grid** — `[UNDERUSED]`
- What: pixel-art rabbit across the matrix center; "rabbit's nest," "follow the white rabbit."
- Used: treated as flavor.
- → potential: hint directly claims the rabbit region holds MORE. The cells the rabbit covers were never extracted as a sub-message/mask, nor checked against the colored-cell set.

**Red border line + red address text ("Roses are White but often Red")** — `[UNDERUSED]`
- What: thin red line separates grid from footer; address `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` is red; no red cells inside grid.
- Used: read as the literal "Red" referent.
- → potential: 4-color schema (white, red, yellow, blue) where only yellow/blue are explained. Red may mark the payout/answer layer vs the puzzle layer, or hint a "should-be-red" missing cell. Unexhausted.

**The #FEFEFE cell (image forensics) — NOW LOCATED** — `[UNDECODED]`
- What: a planted off-white cell (FEFEFE not FFFFFF); creator: "104 is the fefefe square. fefefe is 101010."
- LOCATED (this session, pixel scan of img_puzzle.png): exactly ONE cell at grid **(row 7, col 4)** — counting
  rows/cols from **0**; = **row 8, col 5** counting from 1 — is rendered 254,254,254 vs 255,255,255 everywhere
  else. grid value there = 0 (white). Its **spiral index = 163 (PRIME)** counting from 0 / 164 counting from 1;
  **row-major index = 102 (0-based) / 103 (1-based)**. It is NOT a byte boundary (spiral 164 ∤ 8) so it tags a
  single BIT (the 4th bit of URL char 21='n', counting chars from 1), unlike blue/yellow which tag whole chars.
- → potential: MAJOR & now concrete. "104 is the fefefe square" — note row-major **104 (1-based) = cell (row 7, col 5)**
  (0-based; = row 8, col 6 from 1), one column right of the located (row 7, col 4); the marker may intend index 104
  exactly (verify on a pristine PNG). The cell sits at a DUAL-PRIME index, though the two primes use **different
  origins** — spiral 163 (counted from 0) and row-major 103 (counted from 1) — strongly on-theme with "the prime part." Test
  whether index 103/104 selects a char in dbbi/faed/matrixsumlist or marks the "zero-out" point.

**Alternate spiral orientations / bit polarities** — `[BRUTEFORCED]`
- What: 8 start/direction combos × 2 polarities.
- Used: swept for readable TEXT only.
- → potential: never scored as alternate INDEX functions or as NUMERIC outputs (yellowblueprimes is a number, not text).

**24-bit color-parity stream as a standalone 3-byte payload** — `[BRUTEFORCED]`
- What: blue/yellow in spiral order as 1/0 = same 24 LSBs as the URL.
- Used: "redundant, zero extra info."
- → potential: as a 3-byte NUMBER never used as an index/offset into dbbi/faed, a prime selector, or part of yinyang.

**yellowblueprimes (cosmic ingredient)** — `[OPEN]`
- What: ingredient #1; a LABEL whose VALUE must be computed from genesis yellow cells, blue cells, primes.
- Used: many char-index/count/sum candidates hashed → 0 hits.
- → potential: the single biggest Phase-0 open end. Promising: yellow-number & blue-number via byte-INDEX positions, then keep prime positions / insert {2,3,5,7}, combined with "zero out" + spiral indexing. No verified value; the WHY is open.

**yinyang (cosmic ingredient)** — `[OPEN]`
- What: ingredient #4; candidate source = the blue↔yellow / 0↔1 / black↔white duality.
- Used: complement/literal tests → 0 hits.
- → potential: genesis duality is the most on-theme yinyang source and is under-derived as a concrete number/string.

**2020-01-14 poem as an operational instruction set** — `[UNDECODED]`
- What: "Roses are White but often Red. Yellow has a number and so does Blue. Go back to the first puzzle piece… the rabbit's nest may contain a whole lot more." Soup labels it "your last command."
- Used: parsed into literal referents; phrases hashed → 0 hits.
- → potential: never decoded as a RECIPE. Each line is plausibly an instruction ("Yellow has a number and Blue" = compute two numbers). This is the unsolved heart of the endgame, sourced entirely in Phase 0. (See also "our first hint is your last command" in the soup.)

---

## Phase 1 — "The Warning" / theseedisplanted

**Image-tile FILENAMES** — `[DUAL-USE]`
- What: 8 `<img>` srcs: black_banking_-_war, blue_ca, blue_dig_i, blue_lock_lo, red_crypto_gic, red_n_you, red_open_lock_n_ing, red_t — each a word-fragment + color + sometimes an icon.
- Used: only war+ning→WARNING and lo+gic→LOGIC → song "The Warning" by Logic.
- → potential: unused tokens banking, ca, dig i, crypto, you, and the `+`/`-` glyphs. "crypto banking … you …" may be a sentence; `+`/`-` may mark ADD vs SUBTRACT fragments (a selection/ordering key) — never tried.

**Color-coding of tiles (1 black, 3 blue, 4 red)** — `[UNUSED]`
- What: black {banking/war}, blue {ca, dig i, lo}, red {crypto gic, n you, n ing, t}.
- Used: never; song-ID ignored color.
- → potential: BLUE vs RED is exactly the endgame duality. Reading blue-only then red-only fragments may give a second string; blue=0/red=1 binary over fragments untested. A candidate "door."

**Lock icons: closed (blue_lock_lo) vs open (red_open_lock_n_ing)** — `[UNUSED]`
- What: one locked, one unlocked padlock.
- Used: ignored beyond LO+GIC.
- → potential: may flag which fragment is "encrypted" (key) vs "revealed" (plaintext). Pairs with blue/red split.

**House-with-"S" icon + "banking" (black tile)** — `[UNUSED]`
- What: bank/house icon containing letter S, fragment "banking," word "war."
- Used: only "war" consumed.
- → potential: "banking" is the one word that doesn't reduce to the song; + "crypto" = "crypto banking" (finance theme: Fed/EO-11110). The embedded "S" and black color may be standalone markers.

**`+` and `-` operator glyphs** — `[UNUSED]`
- What: blue dig_i renders "dig i +"; red t renders "t -."
- Used: ignored as decoration.
- → potential: foreshadow the endgame COMBINE operation (concat vs XOR/subtract); or begin/end delimiters; never tested.

**WAR+NING / LO+GIC scramble — leftover fragments** — `[BRUTEFORCED]`
- What: rearrangement spelling the song; leaves banking, ca, dig i, crypto, you, +, - unconsumed.
- Used: solved → song → password.
- → potential: strongest concrete loose end on the page. A clean scramble should consume ALL eight fragments — leftovers imply a SECOND hidden word/phrase. Find the arrangement using all fragments.

**Song "The Warning" — unused lyric lines** — `[UNDERUSED]`
- What: only the line after "Phase two" was used as the password.
- Used: one line → password.
- → potential: the song has "Phase two/three" markers; other phase-labeled lines may be later passwords/confirmations. A reusable key source (themes echo "theseedisplanted"/"rabbit's nest").

**Redirect tail `…averyspecialdessertiwroteitmyself`** — `[UNDERUSED]`
- What: Merovingian "choice" quote + an ADDED second Merovingian "dessert, I wrote it myself" line.
- Used: whole URL = address of Phase 2 page.
- → potential: "I wrote it myself" = first-person authorship flag (look here). Two spliced quotes never decoded for acrostic/hidden token; "dessert"/causality ties to Phase 2's "causality" password.

**Hidden POST form + `gsmg.io/phase1verification`; CSRF token; `robots=noindex`** — `[DUAL-USE / noise]`
- What: server-side redirect; 40-char Laravel CSRF token → 30 random bytes; minimal page.
- Used: navigation only.
- → potential: redirect came FROM the server (not client-derivable) — only record of phase transitions. CSRF token = almost certainly noise (catalogued so it isn't mistaken for payload). noindex confirms no other hidden DOM. Low residual value.

---

## Phase 2 — Mr Robot (causality·Safenet·Luna·HSM·11110·GenesisHex·FEN)

**The 7-part password as a whole** — `[DUAL-USE]`
- What: 7 concatenated answers; sha256 → AES key for Phase 3.
- Used: concat → sha256 (verified).
- → potential: the ONLY explicit set of 7 passwords; Architect later needs "SEVEN INTERTWINED PASSWORDS" + "REINSERT THE PRIME BASICS." Reuse of these exact 7 (XOR/interleave/per-part-sha) never exhausted. Ambiguity: part-7 = "B5KR" vs full FEN; case/space normalization are live variants.

**11110 (part 5, EO 11110)** — `[BRUTEFORCED]`
- What: community admits brute-forced; real reasoning undisclosed.
- Used: literal "11110" into the password.
- → potential: WHY unknown. (a) JFK EO 11110 (silver certs / Fed — on-theme); (b) binary 11110 = decimal 30 → an index/offset; (c) sibling of EO 11111. Literal-vs-decimal ambiguity unexhausted — the only password part the community openly never understood.

**Chess FEN board (`B5KR/1r5B/2R5/...`, part 7)** — `[DUAL-USE]`
- What: "buddhist move" puzzle; 20 occupied squares.
- Used: only the FEN STRING text is hashed.
- → potential: the BOARD POSITION (coordinates / which square the move targets / moved piece) never used as DATA — could be a 64-bit bitmask, coordinate list, or permutation. 3.2's "a sad board but as wide as the FIRST ONE SEEN" back-references this board → geometry likely reused for the p32_trailing blob. The given→solution FEN delta (rook to c6) is an unmined datum.

**Genesis coinbase hex, reversed-byte (part 6)** — `[DUAL-USE]`
- What: main.cpp line 1616 hex; reversed = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks."
- Used: raw hex string hashed.
- → potential: the DECODED plaintext was never used as a key. "RETURN TO THE SOURCE CODES / PRIME BASICS" may literally mean this bitcoin source line. The reversal motif foreshadows the 2023 REVERSE-BINARY master hint. Date numbers (03/Jan/2009), line 1616, nBits 486604799, the literal "4" — all unused adjacent data.

**Cipher line `# X 2 S H 4 Y 0 Q B 15 #`** — `[UNDECODED]`
- What: bracketed token line; community: "unclear how to use."
- Used: B,H,S values computed (S=32,B=−16,H=−1) but never placed into a working string; password parts come from elsewhere.
- → potential: dangling/undecoded. Read as coordinate pairs (X,2)(Y,0)…, a substitution table, or an ordering/index for the Q/B/H/S values. Numbers 2,4,0,15 (esp. 15) and the `#…#` delimiters never assigned meaning; may index into the FEN/matrix.

**Q sub-clue ("swordless fish… I and W below")** — `[UNDECODED]`
- What: defines token Q.
- Used: effectively never; no value placed.
- → potential: swordfish-minus-sword / "phish" → a hacker alias; "I and W below" = add letters. Solving Q may gate full parsing of the `# X…15 #` line.

**B sub-clue (Intel i5 → (5i−i)²=−16)** — `[BRUTEFORCED]`
- What: BV80605001911AP = i5; B=−16.
- Used: value computed, never inserted.
- → potential: back-rationalized. The full SKU carries more than "5." B=±16 ties to "SIXTEEN ENCRYPTIONS." Unexhausted as index/operand.

**H sub-clue ("answer to only this puzzle" × −1)** — `[UNDECODED]`
- What: self-referential negation.
- Used: never; guessed −42 vs −1.
- → potential: deliberate non-42 contrast; could be prize amount/phase number/meta value. Gates the `# X…15 #` line.

**S sub-clue (Klingon cha+vagh·jav = 2+5·6 = 32)** — `[BRUTEFORCED → DUAL-USE]`
- What: Klingon numerals; S=32.
- Used: value computed, never placed.
- → potential: the {2,5,6} triple is IDENTICAL to the LATER "shabef → b,e,f = 2,5,6 → sha256" soup hint. Same triple seeded in Phase 2 and reused as the sha-combine key — a deliberate cross-phase bridge, never connected. 32 = sha256 output length / 0x20.

**"2name / 3Moon / 4How so mate" numbered markers** — `[DUAL-USE]`
- What: digit-glued words → Safenet/Luna/HSM (parts 2,3,4).
- Used: association → password parts.
- → potential: the digits literally INDEX password parts — same mechanism as "1name" (Phase 3) and the soup labels. "How so mate" = chess "mate" foreshadows the FEN part. The numbers as an ORDERING key are unexhausted.

**`eps3.4_…runtime-error.r00` / "daughters hit magic keypads"** — `[UNDERUSED]`
- What: real Mr Robot S3E5 title + embedded references.
- Used: theme confirmation only.
- → potential: "eps3.4" = a coordinate/version index; ".r00" = a split-RAR extension ("rabbit's nest may contain more" / multi-part data) — never followed. "valleys of Phillip," "magic keypads/daughters" = candidate pointers (HSM PIN/keypad?).

**"Ok kid, on the highway, let put it in the worst gear."** — `[UNDECODED]`
- What: trailing instruction.
- Used: never.
- → potential: "worst gear on the highway" = REVERSE. Likely an explicit instruction to reverse something (foreshadows reversed genesis hex AND the 2023 reverse-binary hint). Un-actioned.

**Undefined tokens X and Y in `# X…15 #`** — `[UNDECODED]`
- What: X,Y have NO sub-clue.
- Used: never.
- → potential: most under-specified Phase-2 artifact. X,Y = variables/axes/coordinates; pattern may be coordinate pairs or a 2-column table; `#…#` = a fixed field or comment. May be the actual "cipher."

**"security by hiding… in plain sight"** — `[DUAL-USE]`
- What: thematic line.
- Used: flavor.
- → potential: rhymes with 2023 "ITS IN FRONT OF YOUR EYES BUT YOURE NOT SEEING IT" — confirms the final answer is hidden in something already visible.

---

## Phase 3 — Free-Will Riddles + Architect Speech (phase3.2)

**Riddle 1 — Jacque Fresco / The Venus Project** — `[DUAL-USE]`
- What: answer "jacquefresco" (password part 1); quote "the future is ours to direct."
- Used: name only.
- → potential: riddle says "look into his works." Resource-based-economy ideology echoes Architect "help us BUILD it." The quote text / "ours" never tried as key; Fresco theme = candidate semantic source for yinyang/duality.

**Riddle 2 — Cheshire "just one second" → giveitjustonesecond** — `[DUAL-USE]`
- What: password part 2; names a "keyhole," "fall in."
- Used: literal part.
- → potential: keyhole/rabbit-hole/door imagery ties to the unfound "another door"; Cheshire "now you see me" rhymes with "in front of your eyes." Door/keyhole thread unfollowed.

**Riddle 3 — Heisenberg Uncertainty Principle** — `[DUAL-USE]`
- What: password part 3; conjugate PAIRS.
- Used: literal part.
- → potential: prefigures HALF/BETTER HALF, yin/yang, the conjugate-pair structure (yellowblueprimes ↔ yinyang). Pairing dbbi↔faed / blue↔yellow / half↔better-half never operationalized.

**"REINSERTING THE PRIME BASICS"** — `[UNDERUSED]`
- What: explicit endgame instruction.
- Used: read as primes {2,3,5,7} + "zero out" on dbbi/faed; creator confirmed "THE PRIME PART." All tries garbage.
- → potential: "REINSERTING" (not removing) implies INSERTING primes/zeros back at indexed positions ("if you know how the array is indexed"). Could mean prime-indexed genesis-URL chars reinserted into matrixsumlist/dbbi. The most under-determined instruction.

**"SELECT FROM OVER TWENTY-THREE CIPHERS" (23)** — `[UNUSED]`
- What: number 23.
- Used: never as index/count/selector.
- → potential: 23 = largest prime ≤24 (URL length); blue holds prime-position 23; master hint = 161 = 7·23. Could select a cipher / offset / char index, or be the singular "prime number very important."

**"SIXTEEN ENCRYPTIONS" (16)** — `[UNUSED]`
- What: number 16.
- Used: never as a parameter.
- → potential: 16 = AES block / IV length / hex-nibble count. Cosmic = 1328 = 83·16; small blobs = 5·16. May mean 16 sequential operations / layering depth / iteration count.

**"SEVEN INTERTWINED PASSWORDS" (7)** — `[UNDERUSED]`
- What: number 7.
- Used: loosely mapped to Phase-3's 7 parts / 7 soup tokens; flat XOR-of-7 tried → FALSE.
- → potential: "INTERTWINED" = interleave/braid, not concat/XOR-flat. The exact 7 aren't pinned; a 7-way braided/columnar transposition was never built. Structural rhyme with Phase-3's 7-part→sha256 mechanic.

**"THE ACTUAL PRIVATE KEYNOTE"** — `[UNDERUSED]`
- What: pun key + note.
- Used: read as "private key."
- → potential: "keynote" = a key's tonic note → possible musical/audio thread (audio already used for HASHTHETEXT); "note" = a textual message. Pun never decomposed.

**"BRUTE FORCING MIGHT BE REQUIRED"** — `[DUAL-USE]`
- What: explicit brute-force statement.
- Used: ~20k+ random-passphrase attempts → 0 hits.
- → potential: search is finite/intended — but the community brute-forced the WRONG layer (random passphrases). Re-scope to the small structured dbbi/faed prime-insertion/indexing space.

**"WORTH HUNDRED FOURTY OF THE INVESTMENT" (140) + "wiseman ABOVE"** — `[BRUTEFORCED / UNDECODED]`
- What: 140; creator gloss splits FOUR→104 ("fefefe square") and FORTY.
- Used: noted; literal keys → 0 hits.
- → potential: creator explicitly links 140↔104↔matrixsumlist bit-length↔fefefe↔array-indexing. 140 may decompose as 104+offset or 1-4-0 markers. "WISEMAN ABOVE" = a specific earlier speech line never identified. A deliberate, undecoded key-length pointer. (See cross-cut 140/104.)

**"RETURN TO THE SOURCE CODES / the code you carry"** — `[UNDERUSED]`
- What: instruction to return carrying "the code."
- Used: read as "go back to genesis."
- → potential: "SOURCE CODES" (plural) may point to the bitcoin source line (part 6) OR the gsmg.io page HTML/JS (matrix.js). "The code you carry" = the Phase-3 7-part password / its sha256 to be RE-INSERTED (a loop). Cross-phase reinjection never tried.

**EBCDIC cp1141 ("one for one, four for one" → 1141)** — `[DUAL-USE]`
- What: code-page decode before Beaufort.
- Used: once.
- → potential: same phrase ALSO gives VIC markers 1,4 — two consumed meanings, a probable third ("1→1, 4→1" mapping / 1:4 split / every 1st & 4th element). German cp1141 choice (vs 037/500) never questioned. Code-page decode never re-applied to dbbi/faed/cosmic/the 80-byte blobs.

**Beaufort key THEMATRIXHASYOU (Neo→you)** — `[DUAL-USE]`
- What: Beaufort decrypt of the EBCDIC bytes.
- Used: once → Architect speech.
- → potential: Neo↔you↔"The One" is a reversible substitution rule. Applying the inverse (you→one) across the speech may expose an embedded acrostic/number. THEMATRIXHASYOU never tried as a Beaufort/Vigenère key on the open blobs (beyond literal).

**VIC alphabet `FUBCDORA.LETHINGKYMVPS.JQZXW` (markers 1&4)** — `[DUAL-USE]`
- What: straddling checkerboard from the chess sentence.
- Used: decoded the VIC digit string.
- → potential: reconstruction is AMBIGUOUS (`…JQZXW` vs `…ZJQWX.`) → a second valid build could decode the SAME digits differently. The custom A–Z permutation never tested as a monoalphabetic key over dbbi/faed or for the p32_trailing blob.

**VIC plaintext "PRIVATE KEYS BELONG TO HALF AND BETTER HALF … FUNDS TO LIVE"** — `[UNDERUSED]`
- What: introduces "HALF/BETTER HALF," plural "keyS."
- Used: lore; half/betterhalf/funds as keys → 0 hits.
- → potential: MAJOR — "HALF/BETTER HALF" = yin/yang + Cosmic Duality + the SECOND funded address (17ucy1K…, 3.75 BTC). Output may be a PAIR or a split secret (yellowblueprimes = one half, yinyang = the other). "Split/concat two derived halves" never structurally exhausted.

**VIC digit string itself (151659431219…154112)** — `[DUAL-USE]`
- What: raw 144-digit block.
- Used: fully consumed by the VIC decode.
- → potential: second use plausible — numeric seed / base-N data / re-decode under the ambiguous alphabet; or read only marker-prefixed pairs vs singles for a hidden second message. Never hashed as a numeric key beyond cursory tries.

**Chess clue "fubcd-king & oracle-queen… SAD board as wide as the FIRST ONE SEEN"** — `[UNDERUSED]`
- What: yields the VIC alphabet AND literally describes a board.
- Used: only the alphabet reading; literal board only hashed as a phrase (0 hits).
- → potential: "as wide as the FIRST ONE SEEN" = 14 (the 14×14 genesis grid). "SAD board" may be an anagram / a specific board STATE never decoded like the Phase-2 FEN. A literal chess board precedes the UNDECODED p32_trailing blob → its key is likely a board CONSTRUCTION (coordinates/FEN), not a hashed phrase. Most concrete unexhausted 3.2 lead.

**"CIAO BELLA O" — orphan trailing "O"** — `[UNDECODED]`
- What: speech sign-off with a dangling "O."
- Used: read as goodbye; "ciaobellao" → 0 hits.
- → potential: "O"=0 (consistent with soup) → a terminator/marker; "BELLA O" may be scrambled "bella ciao"; or "O" begins the next instruction. Deliberate anomaly, never analyzed as a token/index.

**"One for one, four for one" — the dual-trigger phrase** — `[DUAL-USE]`
- What: triggers BOTH EBCDIC-1141 AND VIC markers 1,4.
- Used: twice.
- → potential: two confirmed uses → likely a third (1→1, 4→1 collapse; 1:4 split; every 1st/4th element). "Beautiful strategic position" = Beaufort AND a board, reinforcing the trailing-blob board reading.

**"THE FUNCTION OF THE YOU" (Neo='you'='The One')** — `[UNDERUSED]`
- What: garbled "function of THE ONE."
- Used: narrative.
- → potential: confirms the you↔one transform leaks into the speech; inverse-substituting the whole speech may surface a cleaner ingredient phrase / acrostic. Never fully re-derived.

**Acrostic / hidden structure of the Architect speech** — `[UNUSED]`
- What: 18-line Beaufort speech as a carrier (line-initials, word counts, capitalized words, deliberate misspellings WAISTING/THROPHIES/PRICES/SEDULOUSLY, "wiseman ABOVE").
- Used: only plaintext meaning + collapsed-line key candidates.
- → potential: classic second-layer carrier. The misspellings (creator: "typos don't matter") may conversely MARK carrier positions; capitalized numbers (23,16,7,140) read positionally; every-Nth-word acrostic. Untested extraction surface.

**p32_trailing 80-byte AES blob (salt b45a5e3d827593ca)** — `[UNDECODED]`
- What: 80-byte OpenSSL aes-256-cbc blob at the END of phase-3.2 plaintext; community never even noted it.
- Used: not at all (this session: chess/VIC/soup keys → 0 hits).
- → potential: HIGH-VALUE built-in ORACLE (correct key → ≤79 readable bytes = instant verification). Key almost certainly from the immediately-preceding chess clue (board construction) and/or speech numbers. No public attempt history — genuinely fresh. Likely reveals the next instruction / "another door." Top priority.

---

## Decentraland → SalPhaseIon Soup

**Decentraland audio (−41,−17) / "HASHTHETEXT"** — `[DUAL-USE]`
- What: stereo box; L/R split + invert + spectrogram → "HASHTHETEXT."
- Used: sha256 of the genesis text → SalPhaseIon URL.
- → potential: audio carrier never re-examined for a SECOND payload (non-inverted channel, other frequency bands, metadata, sample-rate/length as a number). "HASH THE TEXT" is generic — may apply to OTHER text blocks (speech, VIC sentence, soup) and may be the "first hint = last command" referent. Community noted "blobs in mp3 not recovered." Audio not in scratchpad — needs re-fetching.

**Coordinates −41, −17** — `[UNDERUSED]`
- What: Decentraland location of the box.
- Used: navigation only.
- → potential: 41 and 17 are both PRIME; never fed into anything. Candidate indices/offsets/keys into the genesis grid; 17 also recurs in the second-address context.

**dbbi chunk (91 base-9 symbols, alphabet a–i, no 'o')** — `[UNDECODED]`
- What: hypothesized home of yellowblueprimes; 91 = 7·13.
- Used: never cleanly decoded — 9! perms, transposition×sub (3.27M), Vigenère/Beaufort 1–6, grids, bifid, base-81, prime-zeroing, fefefe-binary → all garbage.
- → potential: THE primary wall. Verified f=1/e=0 prime-value rule + "zero out characters" + "array indexing" + primes {2,3,5,7} combine in an un-found way ("too many combinations"). 91 bits is too small for the literal 16-char word → dbbi yields a COMPUTED number. Frontier = array-indexing + zeroing + prime-mask, untried in the right combination.

**faed chunk (570 base-9 symbols, no 'o')** — `[UNDECODED]`
- What: hypothesized home of yinyang; 570 = 2·3·5·19; IC≈0.118 (random).
- Used: never decoded (de-interleaves, field-decode, yin-yang self-complement all chance).
- → potential: creator (2020-08-02): "the second half will probably be used for ANOTHER PUZZLE, or not at all" — faed may NOT feed cosmic (it could BE the extra-door payload). High randomness suggests it is itself keyed/encrypted data. Untried: faed keyed by dbbi-derived material; complement map combined with the array-index/zeroing recipe.

**matrixsumlist (104-bit a/b chunk, between dbbi and faed)** — `[DUAL-USE]`
- What: 104-bit string → literal "matrixsumlist"; physically SITS BETWEEN dbbi and faed.
- Used: label → genesis row/col sums (ingredient #2).
- → potential: its POSITION suggests it is a KEY/MASK over dbbi and/or faed — 104 bits could index/zero exactly the chars the hints say to "zero out." Never exhausted as the array-indexing mechanism. "104 = the fefefe square" explicitly cross-links its bit-length to the dbbi binary rule — never operationalized.

**"enter" (binary chunk splitting the salph_inner blob)** — `[UNUSED]`
- What: a/b binary → "enter"; embedded WITHIN the inner blob's base64.
- Used: decoded then discarded; not a cosmic ingredient.
- → potential: (1) a UI command ("enter the password") tying to "thispassword" + "first hint = last command"; (2) its split POSITION inside the blob base64 may be a delimiter/byte-offset marker. "enter"+"thispassword" as a concatenated key for salph_inner is an obvious untried test.

**"thispassword" (cfob chunk)** — `[UNUSED]`
- What: agda-method decode → literal "thispassword"; not a cosmic ingredient.
- Used: decoded; never used as a password.
- → potential: self-referential — "this password" = the key to the adjacent salph_inner blob (or cosmic). Untested in combination with "enter" / "our first hint is your last command" as literal, sha256hex, or double-sha.

**lastwordsbeforearchichoice (agda chunk)** — `[DUAL-USE]`
- What: → literal label (cosmic ingredient #3).
- Used: literal word in the recipe.
- → potential: the NAME points to a VALUE never substituted — the actual final SPEECH LINES before the Architect's choice ("…CIAO BELLA O" / "RETURN TO THE SOURCE CODES… PRIME BASICS"). Parallel to matrixsumlist (label→value). Correct span of speech words never resolved.

**salph_inner 80-byte AES blob (salt 3ab585348552415d)** — `[UNDECODED]`
- What: OpenSSL blob embedded in the soup, base64 split by 'z' + "enter," wrapped by "shabef" (sha256) and "our first hint is your last command."
- Used: never decrypted (~thousands of keys → 0 PKCS7-valid hits).
- → potential: one of two built-in ORACLES. The wrapping text literally states the recipe: sha256(value derived from the 2020 "Roses" poem) — which nobody publicly decoded. Pairs with p32_trailing. enter/thispassword/first-hint not provably exhausted as its passphrase.

**"our first hint is your last command"** — `[UNDERUSED]`
- What: plain-English instruction before salph_inner.
- Used: noted; the recipe it implies never decoded.
- → potential: (a) "first hint" = the 2020 poem (the FINAL recipe, never solved into a value); (b) "first hint" = the Decentraland "HASHTHETEXT" command → the LAST command is also to hash some text. Governs salph_inner + cosmic; operationalization unfinished.

**"shabef" (appears twice)** — `[DUAL-USE]`
- What: a1z26 sha + b,e,f = 2,5,6 → "sha256"; brackets the inner-blob region.
- Used: read as the sha256 combine hint.
- → potential: DOUBLE occurrence may signal sha256(sha256(...)) or TWO separate sha steps (one per blob). Second "shabef" pairs with "anstoo" — never analyzed. Only single-sha was used. (Echoes the Phase-2 Klingon {2,5,6}.)

**"anstoo" (final soup token)** — `[UNDECODED]`
- What: the LAST token of the soup, right after the 2nd "shabef"; unexplained everywhere.
- Used: never.
- → potential: a1z26 a,n,s,t,o,o = 1,14,19,20,15,15 (unexplored as a number/key); phonetic "ans too"/"and so too"; anagram. Sitting after sha256 it may name the SECOND operand of the final hash, or complete "first hint = last command." Structural climax, ~zero analysis.

**cosmic AES blob (salt 2d3f6fe06dc950e6, 1328 bytes)** — `[UNDECODED]`
- What: final blob → the WIF private key; 1328 = 83·16.
- Used: ~20k+ key attempts → 0 real hits (feedback-free).
- → potential: key = sha256(assembly of the 4 ingredients) with 2 values unknown + unknown combine/separator. Under-explored: multi-layer encryption ("23/16/7"), label→value for ALL four ingredients, "reinsert the prime basics" as literal key pre-processing.

**hex Salted__ URL blob (urlblob.bin, salt 74c974e3f92e64b5, 96-byte ct)** — `[UNDECODED]`
- What: a FOURTH valid OpenSSL blob, distinct salt.
- Used: not decrypted. ⚠️ **CORRECTION** — the earlier "zero key attempts / referenced by no attack script" wording is STALE: `BLOB-COMBINATION-ANALYSIS.md` tested it in the ~35,000-combination battery against all four blobs, and `ENDGAME-ANALYSIS.md` §8c records it as **undecryptable by any tested key**. ⚠️ Also: there is **no `ciphertexts/urlblob.txt` committed** — its salt (`74c974e3f92e64b5`) and 96-byte size are cited in three docs, but the artifact itself is not in the repo, so it cannot be reproduced against locally.
- → potential: 96-byte ct → instantly-obvious oracle if real. Pin down provenance (likely pulled from a gsmg.io page hex) and commit the artifact so it is reproducible.

**Soup 'z' separators + base64 split points** — `[UNDERUSED]`
- What: 'z' tokenizes the soup; inner blob base64 split by 'z' + "enter."
- Used: tokenization only.
- → potential: split POSITIONS may encode an index/offset (where to cut, which half to use). 'z' = 26th letter / a value. "enter" splitting (vs standing alone) may be a deliberate pointer, not noise.

---

## Cross-Phase Hints & Numbers (2020–2023 Telegram/master hint)

**2020-01-14 "Roses are White but often Red" poem** — `[UNDECODED]`
- What: the "first hint" that "is your last command."
- Used: loosely mapped (Yellow/Blue→yellowblueprimes; first piece→genesis; one door→more).
- → potential: most explicitly-flagged-yet-unsolved hint; likely encodes the exact yellowblueprimes computation (two concrete numbers from yellow/blue cells ∩ primes). "White but often Red" and "rabbit's nest more" unparsed.

**Primes 2,3,5,7 ("the PRIME PART")** — `[UNDECODED]`
- What: creator-confirmed combinatorial core; "too many combinations."
- Used: f∈{2,3,5,7}→0 bit-rule + zeroing (all garbage).
- → potential: primes as INDICES (positions 2,3,5,7 / every Nth char), as a multi-radix/CRT system (2·3·5·7=210; note dbbi=7·13, faed=2·3·5·19), or selecting WHICH cipher/encryption/password. Exact combination un-brute-forced.

**"Some characters need to be ZEROED OUT"** — `[BRUTEFORCED]`
- What: dbbi/faed decode requires forcing certain symbols to 0; both conspicuously LACK 'o'(=0).
- Used: many zero-out/insert schemes → garbage.
- → potential: WHY never understood. Pairs with "array indexing" + primes → zeroing is INDEX-driven in a 2D ARRAY (zero prime positions / prime-valued cells). The missing 'o' is a designed signal to RECONSTRUCT zeros (so field-decode lands on printable text). Re-run field-decode AFTER zero-insertion at prime-indexed positions in the correct grid shape.

**"104 is the fefefe square; fefefe is 101010; if you know how the ARRAY IS INDEXED"** — `[UNDERUSED]`
- What: per-symbol binary map (f→1,e→0) verified via fefefe=101010; 104 = matrixsumlist bit-length.
- Used: rule applied to flat/grid/spiral dbbi reads → garbage.
- → potential: "SQUARE" undecoded (104 isn't a perfect square → a 104-CELL region / the matrixsumlist mask between dbbi & faed). STRONG lead: apply the SAME spiral indexing that decodes the genesis grid to dbbi/faed.

**"There is ANOTHER DOOR" / "3rd door" (2020–2023, repeatedly)** — `[OPEN]`
- What: an extra hidden entry/branch, never located in 3 years; 2021-12-02 rendered as a VERTICAL acrostic "Another D-O-O-R."
- Used: never found.
- → potential: biggest acknowledged loose end. The vertical rendering hints the door is found via an acrostic/vertical read. Candidates: a second hash of the genesis text (different normalization), the rabbit region, the `#..#` markers, or faed ("second half for another puzzle").

**"The second half will probably be used for ANOTHER PUZZLE, or not at all"** — `[OPEN]`
- What: ambiguity about faed (the 570-block).
- Used: faed analyzed extensively (random).
- → potential: if faed ≠ cosmic, then yinyang comes from elsewhere (genesis/Cosmic-Duality duality), and faed may BE the second-door payload. Never resolved; never tested cosmic-recipe assuming faed is irrelevant.

**"Focussing on the THEORY OF EVERYTHING is also still a valid path"** — `[UNUSED]`
- What: a named, creator-confirmed ALTERNATE path to the key.
- Used: never acted on — no script/decode at all.
- → potential: top untouched route. (a) a physics term ("M-theory"/"unified field") as passphrase; (b) "theory of everything" ≡ the DUALITY/yin-yang unification → an independent way to derive yinyang; (c) the 2014 Hawking film title/quote. Should be started.

**"At least a PRIME NUMBER is very important" (singular, 2023)** — `[DUAL-USE]`
- What: late re-emphasis on ONE specific prime.
- Used: folded into the {2,3,5,7} theme.
- → potential: singular phrasing may point to ONE prime never identified: 91=7·13, 570 factors, 104, 140, 23/16/7, or a cipher key/period/modulus. Escalated to a standalone hint → people were missing a specific prime.

**The FOUR INGREDIENTS recipe (yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang)** — `[OPEN]`
- What: 2023 reverse-binary master hint; 161 bytes = 7·23.
- Used: all 24 orders × separators × {literal/sha/raw/double} → 0 hits.
- → potential: tokens are SELF-LABELING (matrixsumlist's bits spell the WORD, not its value) → yellowblueprimes/yinyang are LABELS whose VALUES must be COMPUTED — yet only the literal-word recipe was exhausted. Separators/order may be primes; 161=7·23 may be meaningful.

**Master-hint taunt block — `wewontgiveawaythepassword` / `itsinfrontofyoureyesbutyourenotseeingit` / `verylaststepisatruegiveaway` / `promised`** — `[UNDERUSED / UNDECODED]`
- What: four trailing taunts, lengths [25,39,27,8]; occupy bytes 100–161; bit-reversed like the ingredients.
- Used: each tried as literal/sha passphrase → 0 hits.
- → potential: NOT proven to be only-taunt. (a) "itsinfrontofyoureyes…" (len 39 = 3·13) literally says the answer is VISIBLE/overlooked — pairs with "wiseman 140" and "in plain sight"; (b) "verylaststep…giveaway" (corroborated by "solve it the SAME DAY") means the difficulty is ENTIRELY yinyang and the final combine is trivial — re-focus all effort on yinyang; (c) lengths [25,39,27,8] / [16,13,26,7,25,39,27,8] as offsets into faed(570)/dbbi(91)/cosmic; token-initials "w,i,v,p" / "y,m,l,y,w,i,v,p" as a seed; reading only prime-indexed chars. "promised" (len 8) may be a sentinel/delimiter.

**140 / "hundred fourty" ↔ 104 ("fefefe square")** — `[UNDECODED]`
- What: two digit-permutation numbers the creator links in one hint.
- Used: literal only ("140× the investment").
- → potential: 140↔104 is likely intentional. Uses: key length, char index, cipher selector, or "wiseman ABOVE" = a specific earlier line whose value=140. 104 = matrixsumlist mask length (sandwiched between dbbi/faed) — strengthens the MASK interpretation.

**"Breaking salphation should give the FEELING OF THE PHASE'S NAME" (SalPhaseIon ≈ salvation)** — `[UNUSED]`
- What: thematic plaintext-recognition hint.
- Used: never as a check/keyword.
- → potential: the decoded inner blob should read "salvation"-themed → prioritize candidate decrypts containing salvation/redemption language. "salvation"/"salphaseion" as literal passphrases not specifically exhausted; the sal+phase+ion pun may decompose into a key.

**`#..#` markers ("wasn't used")** — `[UNUSED]`
- What: delimiter markers the community itself flagged as never used.
- Used: never.
- → potential: may delimit a hidden segment, mark insertion points (where to "zero out" / "reinsert primes"), or be a page anchor. Ties to the recurring "…" = "key" theory. Never located precisely.

**"Cosmic Duality" book (Mysteries of the Unknown) + "Once you hit a ying yang, you'll solve it the SAME DAY" (2023-08-06)** — `[UNDERUSED]`
- What: real book photo (yin-yang of two galaxies); makes yinyang the SOLE bottleneck.
- Used: thematic recognition only.
- → potential: a real, identifiable object — title/subtitle/ISBN/a specific page/its thesis could be the literal yinyang VALUE or a passphrase. Two stars (bright/dark) ↔ genesis blue/yellow ↔ VIC "half/better half." The book as a yinyang source was never pursued.

**Architect cipher inventory ("23 ciphers, 16 encryptions, 7 passwords, RETURN TO THE SOURCE CODES, REINSERT THE PRIME BASICS, brute forcing")** — `[UNDERUSED]`
- What: literal endgame spec.
- Used: read as flavor; "7 passwords" loosely mapped.
- → potential: 23/16/7 likely operative parameters (161=7·23; 23 = the singular "prime number"?). "SOURCE CODES" may mean gsmg.io page HTML/JS (matrix.js) as a key source — never mined. Combine space of the correct 7 untried because 2 values are unknown.

**Reverse-binary OBFUSCATION of the master hint** — `[UNDERUSED]`
- What: each byte bit-reversed (LSB-first) + whole string reversed.
- Used: treated as transport only.
- → potential: the METHOD may be a meta-instruction — apply (bit-reverse each unit + reverse order) to dbbi/faed binary, the genesis spiral, or the recipe assembly. Never tried.

**Final 2023 sign-offs ("the puzzle talks for me," "the last scene of Mr Robot becomes a reality," "connects the last pieces for the main price")** — `[UNUSED]`
- What: closing farewell messages.
- Used: flavor.
- → potential: "the last scene of Mr Robot" is a specific checkable reference → possible passphrase/thematic key (Phase 2 already uses Mr Robot). "connects the last pieces" reaffirms a final ASSEMBLY step; "main price" (sic) recurs as a possible keyword. None tested.

**a1z26 + base-9/10/16 field-decode (agda/cfob/dbbi/faed)** — `[DUAL-USE]`
- What: a..i,o→1..9,0 → big int → hex → ASCII. Decoded agda/cfob/shabef; dbbi/faed → random.
- Used: decoded the word-chunks.
- → potential: dbbi/faed lack 'o'=0, so they can't field-decode to words containing 0 (yellowblueprimes/yinyang decimals contain 0s) — PROVING the solver must INSERT the missing zeros at indexed positions before field-decoding. Zero-insertion was tried but NOT combined with the array-indexing + primes-{2,3,5,7} rule. The intended-but-unexecuted combination.

**"FUNDS TO LIVE" / second address 17ucy1K… (3.75 BTC)** — `[UNDERUSED]`
- What: VIC text says holders "need funds to live"; a second funded address exists on-chain.
- Used: lore.
- → potential: endgame may yield TWO keys (half + better half), one per address. Treat the target as a PAIR, not a singleton WIF.

---

## On-Chain OP_RETURN Layer (50 messages — NEVER catalogued in any walkthrough)

Source: all txs on the prize `1GSMG1…` and split-off `17ucy1K…` addresses. Mostly **solver dust** (546-sat
outputs carrying guesses/messages), a few possibly creator. A genuinely un-mined crevice. (Tested as blob keys → 0 hits.)

**`itisonlywiththeheartthatoneseesrightlywhatisessentialisinvisibletotheeye`** — `[UNDERUSED]`
- The Little Prince. DIRECTLY echoes the master-hint taunt "its in front of your eyes but youre not seeing it."
- → potential: a literal pointer that the answer is "invisible/seen with the heart"; the quote (or `whatisessentialisinvisibletotheeye`) as a passphrase/normalization was only lightly tried.

**`FromN0EHalfABetterHalfBuiltItBellaCiao1_1Pi36y7LJugXwFNDVjR1p8p5JoB7eN5zSZ`** — `[UNDECODED]`
- "From Neo, Half A Better Half Built It, Bella Ciao, **1_1**, **Pi**, [base58 tail]". Combines the Architect's
  HALF/BETTER HALF + CIAO BELLA with the numbers **1_1** and **Pi** and a 30-char base58 tail.
- → potential: the strongest candidate creator-or-advanced-solver COMBINE hint. "1_1" (ratio? concat with underscore?)
  and "Pi" (3.14159… / "theory of everything"?) as the combine operator were never tested; the base58 tail as a key/address fragment unread.

**`matrixsumlistenterlastwordsbeforearchichoicethispassword`** — `[UNDERUSED]`
- The FOUR SOUP tokens concatenated in soup order (posted on BOTH addresses by multiple solvers).
- → potential: a recipe attempt using the soup-4 (NOT the master-hint-4); includes the "unused" enter+thispassword. Tested literal/sha → 0, but combined with yellowblueprimes/yinyang untested.

**`fourfirsthintisyourlastcommand`** — `[DUAL-USE]`
- Confirms the soup reads "**four** first hint is your last command" (resolves the our/four ambiguity → it's FOUR).
- → potential: "FOUR first hint" may mean the 4th hint, or the number 4, or the 4 ingredients — never parsed as a number.

**`yourlastcommand` / `secondanswer` / `yourlastcommandsecondanswer`** — `[DUAL-USE]`
- The exact tokens issue #56's (refuted) recipe used — they ORIGINATED here as solver dust, not creator hints.

**`fanstoo`** — `[UNDECODED]` confirms the soup's trailing "anstoo/fanstoo" is a real token (a solver posted it verbatim).

**Two ENCODED OP_RETURNs (only non-plaintext payloads)** — `[UNDECODED]`
- `673b7b4b67571b1b4b-3.o` (hi-nibbles 6,3,7,4,6,5,1,1,4 ≈ a–i symbols 'fcgdfeaad'; lo-nibbles 7,b,b,b,7,7,b,b,b)
  and `844e86a69a04eea672049e0e0e8612` (15 high-entropy bytes). No clean decode found; likely solver noise but unconfirmed.

**Matrix/theme tokens** — `entertherabbithole`, `redpill`, `iamtheone`, `leavethematrix`, `There is no spoon`,
`THEMATRIXHASYOU`, `SalPhaseIon`, `ALPHANOISES` (=anagram of SalPhaseIon), `The answer is women`. Solver/creator flavor.

**Recurring solver payout addr** `bc1qks8zrshwmu3m8vgqdzwl2u8jjfgnvgjlezwqcd` (with leavethematrix/secondanswer/yourlastcommand) — a solver's address, not a clue.

---

## Cross-reference: Phase-1 tile filenames ↔ archived gsmg.io door-URLs
The Phase-1 image-fragment filenames (`banking`, `dig_i`, `crypto_gic`, `lo`/`lock`, `ca`) match **real gsmg.io
URLs people tried** (found in Wayback CDX): `gsmg.io/banking-war`, `/cryptogic`, `/crypto_gic`, `/dig-i`,
`/digitallogiccryptography`, `/cryptogic`. All return the SPA shell (empty), so those exact door-guesses are dead —
but it confirms the tile fragments WERE read as door pointers ("DIGITAL LOGIC CRYPTOGRAPHY"?). The correct door
arrangement of all 8 fragments remains unfound. (The Wayback hex-`Salted__` URL = the urlblob.bin 4th blob above.)

---

## TOP 10 MOST PROMISING LOOSE ENDS

> Ranked by likelihood of hiding the missed step toward yellowblueprimes / yinyang / the cosmic key. Each with a concrete next experiment.

1. **p32_trailing 80-byte blob (salt b45a5e3d827593ca) — fresh, self-verifying oracle.**
   Experiment: build the chess clue as an actual board/coordinate set ("fubcd-king & oracle-queen, mvps, as wide as the FIRST ONE SEEN" = a 14-wide board). Generate FEN/coordinate-list/bitmask candidates, sha256 each, and AES-decrypt the blob. A correct key yields ≤79 readable bytes — instant confirmation, no community history to repeat.

2. **The genesis spiral as the dbbi/faed array-indexer ("if you know how the ARRAY IS INDEXED").**
   Experiment: re-index dbbi (91=7·13) and faed (570) using the EXACT matrix.js CCW spiral path (and its reverse), then apply the verified f→1/e→0 prime-value binary rule, then field-decode. Score outputs for printable text / the words yellowblueprimes/yinyang.

3. **yinyang from the Cosmic Duality book / genesis blue↔yellow duality (the creator's named GATE — "solve it the same day").**
   Experiment: derive yinyang candidates from (a) the book's title/subtitle/ISBN/known page text, and (b) the genesis blue↔yellow complement read in spiral order; hash each (literal/sha/double-sha) against cosmic AND the two 80-byte oracle blobs.

4. **yellowblueprimes from the colored-cell index sets ∩ primes (the 2020 poem "Yellow has a number and so does Blue").**
   Experiment: enumerate yellow-set {5,9,10,15,18,19,21,22,24} and blue-set {1,2,3,4,6,7,8,11,12,13,14,16,17,20,23} as numbers (concatenation, spiral-order read, prime-positions-only {blue∩primes, yellow∩primes}, the URL chars at those positions); sha256 each and test against the oracle blobs first.

5. **salph_inner blob keyed by enter / thispassword / "first hint is your last command".**
   Experiment: build keys from "enter"+"thispassword", "thispassword" alone, "enterthispassword", and the 2020 poem (raw / normalized / hashed), each as literal/sha256hex/raw-sha/double-sha; AES-decrypt salph_inner — recognize success via "salvation"-themed plaintext.

6. **The #FEFEFE genesis cell → its grid index ("104 is the fefefe square").**
   Experiment: locate the exact FEFEFE pixel/cell in a pristine img_puzzle.png, compute its spiral and row-major indices, and test whether index 104 (or that position) selects a character/cell in dbbi/faed/matrixsumlist or marks the "zero-out" point.

7. **Zero-INSERTION at prime-indexed positions before field-decoding dbbi/faed.**
   Experiment: in the correct grid shape (7×13 / 13×7 for dbbi; 19×30 / 30×19 for faed), insert '0' at prime positions (or prime-valued cells) per "some characters need to be zeroed out," then run the a1z26→int→hex→ASCII field-decode and score for printable words.

8. **urlblob.bin (4th blob, salt 74c974e3f92e64b5) — already tested (NOT "zero attempts"; see §8c / BLOB-COMBINATION-ANALYSIS), and not committed as an artifact.**
   Experiment: commit the actual ciphertext (there is currently no `ciphertexts/urlblob.txt`), pin its provenance, then re-run the candidate-key sweep against its 96-byte ciphertext. The prior battery already found nothing.

9. **matrixsumlist (104 bits) as a MASK/index over dbbi & faed, not just a label.**
   Experiment: align the 104-bit a/b string against dbbi/faed and use it to select/zero characters (the "array indexing" the creator cites), then re-field-decode the masked symbols; also fix the lossy concatenation format (two-digit / base-14 / interleaved) before any cosmic hash.

10. **Re-focus brute force per "verylaststepisatruegiveaway" + the WAR/NING leftover fragments + faed = "another door".**
   Experiment: (a) accept that the combine is trivial once yinyang is right → spend cycles ONLY on yinyang candidates; (b) anagram all 8 Phase-1 tile fragments (consuming banking/ca/dig i/crypto/you/+/-) to find the hidden second word/door; (c) test the hypothesis "faed is NOT a cosmic ingredient" by solving the recipe with yinyang sourced from genesis duality instead of faed.