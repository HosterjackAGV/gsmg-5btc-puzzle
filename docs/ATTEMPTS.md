# GSMG.io 5 BTC Puzzle — What Was Tried

> A complete, human-readable catalog of **every documented attempt** to advance the open endgame — both the community’s and this project’s — with the exact input, method, and output of each, badged by outcome. 137 attempts total. This mirrors the in-site **What was tried** section; the walkthrough’s per-phase “What was tried to move forward” panels deep-link to each entry.

**98** verified fail · **39** verified with new insight · **0** unverified

---

## Phase 0 — Genesis image (matrix · yellowblueprimes · QR) (16)

### cellular automaton

<a id="t-ledger-game-of-life-1357-matrix"></a>
#### Game of Life B1357/S1357 parity bitmap + matrix evolution
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** The genesis matrix parity bitmap. Cellular-automaton rule B1357/S1357 ('1357'). Every generation rendered.
- **Method:** Built the parity bitmap from the matrix and evolved it under the symmetric '1357' Game-of-Life rule, rendering each generation, on the speculation that the grid is a seed that animates into a readable state.
- **Output:** Chaotic noise -- no readable state at any generation.

### image forensics

<a id="t-ledger-image-forensics-genesis-png"></a>
#### Image forensics on the genesis PNG
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** The genesis img_puzzle.png. Operations: palette histogram, per-channel LSB extraction, trailing-data scan past the IEND marker, location of the #FEFEFE cell.
- **Method:** Ran standard steganography forensics on the genesis image: palette analysis, per-channel least-significant-bit extraction, scanning for data appended after the PNG's IEND end marker, and locating the off-white #FEFEFE planted cell.
- **Output:** Fully accounted for; no recoverable stego. (Caveat: the copy in hand is recompressed -- a pristine original PNG remains the only open possibility.)
- **Insight:** Standard stego forensics finds no hidden payload in the (recompressed) genesis PNG -- every element is accounted for, leaving only a pristine original PNG as an untested edge case.

<a id="t-genesis-fefefe-cell-located-7-4"></a>
#### The #FEFEFE marked cell LOCATED at (row 7, col 4) [0-based; = row 8, col 5 from 1], a dual-prime index
💡 **Verified — new insight** · this project · *this session (image forensics on img_puzzle.png)*

- **Input:** Original genesis image img_puzzle.png (1048x1556). Creator hint: '104 is the fefefe square. fefefe is 101010.' Palette scan for an off-white cell rendered 254,254,254 instead of 255,255,255.
- **Method:** Ran a pixel-by-pixel palette histogram and per-cell color scan over the 14x14 grid to find the single planted off-white cell. Computed its spiral index and row-major index to test the creator's '104' / 'array indexing' claim. The cell's grid value and indices were then checked against dbbi/faed/matrixsumlist as a possible 'zero-out' pointer.
- **Output:** Exactly ONE cell is 254,254,254 (vs 255,255,255 everywhere else): grid (row 7, col 4) — counting rows/cols from 0; that is row 8, col 5 counting from 1 — grid value 0 (white). Its spiral index = 163 (PRIME) counting from 0 / 164 counting from 1; row-major index = 102 (0-based) / 103 (1-based). It sits at a DUAL-PRIME index, though the two primes come from DIFFERENT origins: spiral 163 (counted from 0) and row-major 103 (counted from 1) are both prime. Spiral 164 is not divisible by 8, so it tags a single BIT (the 4th bit of URL char 21 = 'n', counting chars from 1), unlike blue/yellow which tag whole chars. Note: row-major 104 (1-based) is the adjacent cell (row 7, col 5) [0-based; = row 8, col 6 from 1] — the creator's '104' may intend that neighbor (verify on a pristine PNG).
- **Insight:** The planted #FEFEFE cell is exactly at grid (row 7, col 4) counting from 0 (= row 8, col 5 counting from 1), a dual-prime index — spiral 163 (0-based) and row-major 103 (1-based) are both prime — tagging a single bit rather than a whole character; concretely on-theme with 'the prime part' though no decode follows from it yet.

<a id="t-genesis-qr-decoded-blockchain-link"></a>
#### The QR code DECODED to a blockchain.com address link
💡 **Verified — new insight** · this project · *this session (image forensics on img_puzzle.png)*

- **Input:** The square QR code in the bottom-left of img_puzzle.png, flush to the left edge (which had defeated earlier crops/recompressed copies).
- **Method:** Decoded the QR from the full-edge image (earlier attempts failed because the code is flush to the left margin and got cropped). Pixel analysis also re-checked the palette for any hidden third color.
- **Output:** The QR decodes to https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe — a public blockchain-explorer link to the prize address, with no extra payload. Palette shows only white/black/blue/yellow plus the red border (no hidden third color). The genesis image is fully accounted for.
- **Insight:** The genesis QR code resolves to a plain blockchain.com link to the prize address (no hidden door), closing the long-open question of whether the QR carried a secret payload.

<a id="t-genesis-qr-standard-reproduced-from-url"></a>
#### QR reproduced byte-exact from the prize-address URL (Byte/UTF-8/Auto mask/7% EC) — no hidden bits
💡 **Verified — new insight** · community · *community cross-check (a solver re-encoded the URL and compared the QR module-for-module)*

- **Input:** The QR code in puzzle.png and the string https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe. Standard encoder config: Byte mode, UTF-8, mask = Auto, error-correction level L (7%).
- **Method:** Re-encoded the URL with a standard QR encoder using Byte/UTF-8/Auto-mask/level-L and compared the resulting modules against the QR in the image — the data bits, the Reed-Solomon error-correction (redundancy) bits, the format/version 'service' bits, and the chosen mask — module for module. (Independently re-derived here: that URL at level-L produces a version-4, 33x33 QR.)
- **Output:** The puzzle's QR is a standard version-4 (33x33) Byte-mode, level-L code that reproduces from the URL with NOT A SINGLE BIT swapped — every data, error-correction and format bit matches the textbook encoding. Nothing is smuggled into the redundancy, the mask, or the format bits.
- **Insight:** The genesis QR is a perfectly standard QR of the blockchain.com prize-address URL (Byte/UTF-8/Auto-mask/EC-level-L, version 4) — byte-exactly reproducible, so its error-correction and format/service bits carry zero hidden data. This definitively closes the 'is there steganography in the QR' question, hardening the plain-decode result: the QR is just a convenience link to the prize address, not a puzzle input.

### matrix re-read

<a id="t-ledger-colored-cells-24bit-message"></a>
#### Colored cells as an independent 24-bit message
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** The 15 blue + 9 yellow colored cells read in spiral order as a standalone 3-byte (24-bit) payload.
- **Method:** Read the blue/yellow cells in spiral order as their own independent 24-bit message, to test whether the colors carry information separate from the URL.
- **Output:** They are exactly the LSB parities of the URL characters -- zero extra information.
- **Insight:** The colored cells are precisely the least-significant-bit parities of the URL characters, carrying zero information beyond the URL -- definitively closing the 'colors hide a separate payload' hypothesis.

<a id="t-ledger-exhaustive-reread-14x14-matrix"></a>
#### Exhaustive re-read of the 14x14 genesis matrix
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** The 14x14 matrix (196 cells). All 8 spiral orientations x both bit polarities, plus row-major, column-major, and diagonal scans.
- **Method:** Re-read the grid in every plausible orientation, polarity, and scan order to check whether a second hidden message exists beyond the single known URL reading.
- **Output:** Only one reading is text -- the URL gsmg.io/theseedisplanted. The grid is information-full; there is no hidden second message in it.
- **Insight:** Across all 8 spiral orientations, both polarities, and row/column/diagonal scans, the 14x14 grid yields exactly ONE text reading (the URL) -- there is provably no second hidden message in the matrix itself.

### matrix structure

<a id="t-genesis-matrix-cellular-rules-paths"></a>
#### Game-of-Life / numerology / turtle-path renderings of the matrix
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** The 14x14 binary parity bitmap; the matrix evolved under Game-of-Life rule B1357/S1357; a/b-to-direction turtle paths drawn over the grid.
- **Method:** Built the parity bitmap and evolved the matrix generation-by-generation under the '1357' cellular-automaton rule, rendering every state to an image to look for a glyph/message; separately mapped symbols to numpad directions and drew paths. Reasoning: maybe a hidden image or yin-yang glyph emerges from the grid under a rule or path.
- **Output:** Chaotic noise in every generation — no readable state; the turtle path is a connected but meaningless blob explained by direction bias alone. No glyph, no message.

<a id="t-genesis-grid-byte-boundary-pointer"></a>
#### Blue/yellow cells sit on byte boundaries — each tags one URL character
💡 **Verified — new insight** · this project · *this session*

- **Input:** content/matrix.js: 14x14 grid (196 cells), 15 blue cells, 9 yellow cells, 0 red, plus the explicit 196-entry CCW spiral reading path. URL produced by the spiral = 'gsmg.io/theseedisplanted' (24 chars = 192 bits + 4 trailing spiral cells).
- **Method:** Computed the spiral index of every colored cell and divided by 8. Every single blue and yellow cell lands at spiral position congruent to 7 mod 8 — i.e. exactly on the least-significant bit of one of the 24 URL bytes. This means the coloring is not random decoration but a deliberate pointer: each colored cell tags exactly one whole URL character (charindex = (spiral1)//8). Blue tags 1-indexed char positions {1,2,3,4,6,7,8,11,12,13,14,16,17,20,23}; yellow tags {5,9,10,15,18,19,21,22,24}; together they partition all 24 positions.
- **Output:** Confirmed: 100% of colored cells sit on mod-8 byte boundaries; blue+yellow partition all 24 URL character positions with no overlap and no gap. The placement is a designed char-SELECT mechanism, not noise.
- **Insight:** The 15 blue + 9 yellow cells are deliberately placed exactly on URL byte boundaries so each tags one whole URL character, partitioning all 24 positions — a built-in pointer/selection mechanism rather than incidental coloring.

<a id="t-genesis-colors-equal-url-bit-parity"></a>
#### Colors == URL character bit-parity (no hidden color message)
❌ **Verified fail** · this project · *this session*

- **Input:** Blue cells (15) and yellow cells (9) read in spiral order as a 24-bit stream (blue=1/yellow=0 and the inverse), versus the per-character LSB parity of the 24 URL bytes of 'gsmg.io/theseedisplanted'.
- **Method:** Read the colored cells in spiral order as a standalone 24-bit payload under both polarities (B=1/Y=0 and B=0/Y=1), packed into 3 bytes, and compared bit-for-bit against the LSB parity of each URL character. Re-derived independently 3 times. The goal was to see whether the colors carry an extra hidden message beyond the URL.
- **Output:** The 24-bit color stream is EXACTLY the LSB parities of the URL characters: blue cells sit on 1-bits, yellow on 0-bits. Zero extra information — the colors are fully explained by (and redundant with) the URL.

<a id="t-genesis-matrix-prime-position-reads"></a>
#### Grid read at prime spiral positions + all spiral orientations/polarities
❌ **Verified fail** · this project · *this session / dead-end ledger*

- **Input:** 14x14 grid as a bit stream in spiral order (196 bits). Primes <=196 (44 prime positions). Also all 8 spiral start/direction orientations x 2 bit polarities, plus row-major, column-major and diagonal scans.
- **Method:** Extracted the grid bits at the 44 prime spiral positions as a candidate 'prime basics' source, and separately re-read the whole grid in every spiral orientation/polarity and in row/column/diagonal order, scoring each output for readable text. Reasoning: the creator repeatedly cites 'the prime part' and 'if you know how the array is indexed', so prime-indexed cells or an alternate index order might surface a second message.
- **Output:** Only one reading of the grid is text — the URL. Prime-position bit extraction and every alternate orientation/polarity produced noise. The grid is information-full but holds no hidden second message.

### first-piece key sweep

<a id="t-genesis-firstpiece-text-keys"></a>
#### Genesis 'first piece' strings (URL, grid rows, prime literals) as blob keys
❌ **Verified fail** · this project · *this session (firstpiece.py)*

- **Input:** Candidate strings derived from the first puzzle piece: 'gsmg.io/theseedisplanted', 'theseedisplanted', the 14x14 grid rows joined (with/without spaces), the SalPhaseIon page hash 89727c59..., the GSMGIO5BTC...challenge string, 'yellowblueprimes', 'yellow', 'blue', and prime literals '235711131719' / '2357111317192329' / '23571113171923'. Each tested in 6 hashing forms (literal, sha256hex, raw-sha, double-sha, hex-of-hex, raw-of-hex) against salph_inner and p32_trailing.
- **Method:** The 2020 hint says to 'go back to the first puzzle piece', so every concrete string the genesis piece yields was tested as a passphrase on the two instantly-verifiable 80-byte oracle blobs, in all standard key-derivation forms. Success = printable ratio >0.90.
- **Output:** 0 hits across all candidates and all 6 hashing forms. No genesis-derived first-piece string is a blob passphrase.

### matrixsumlist derivation

<a id="t-genesis-matrixsumlist-row-col-sums"></a>
#### matrixsumlist = genesis row-sums + column-sums (ingredient #2, format ambiguous)
❌ **Verified fail** · this project · *this session (matrix.py)*

- **Input:** 14x14 grid row-sums [6,10,8,7,6,6,5,4,9,9,7,8,7,9] and column-sums [8,10,8,10,8,7,3,6,7,5,9,6,6,8]. Naive concatenations: rows='610876654997879', cols='8108108736759668'.
- **Method:** Computed the genesis row and column sums and concatenated them to produce the literal value of the cosmic ingredient 'matrixsumlist'. Tested this concatenation (and variants) thousands of times as part of the cosmic recipe. Flagged the format as lossy: the value 10 makes '6108...' parse two ways (single-digit vs zero-padded two-digit), so the exact byte-form feeding sha256 is uncertain.
- **Output:** Row/col sums confirmed; the concatenation was hashed thousands of times within the cosmic recipe with 0 hits. The exact byte-format (one-digit vs two-digit, rows-first vs cols-first vs interleaved vs 28-value list) is ambiguous and could alone break an otherwise-correct recipe.

### yellowblueprimes derivation

<a id="t-genesis-yellowblueprimes-lens-4156-sweep"></a>
#### Expanded yellowblueprimes 'lens' sweep (4,156 candidates / 16,620 key-attempts)
❌ **Verified fail** · this project · *this session (lens_ybp.py, lens_attack.py)*

- **Input:** A much larger derived-value set built from the genesis matrix: blue/yellow counts (15/9), index-sums, index-concatenations, grid row/col-coordinate sums, spiral-position sums, prime-filtered index subsets and their sums, colored-cell grid-bit reads, URL chars at prime / small-prime positions, URL with non-prime (or prime) positions zeroed out, and paired blue-number+yellow-number combinations (e.g. '159','915'). Combined with matrixsumlist variants ('matrixsumlist', '610876654997879'+'8108108736759668', concatenated form), lastwordsbeforearchichoice, yinyang∈{yinyang,'yin yang'}, seps {'' . space}, and double-sha (shabef) hashing.
- **Method:** Each derived value was tested alone (literal/sha/raw/double/raw-double) on the two 80-byte oracle blobs and cosmic, then folded into the canonical 4-ingredient cosmic key across orders, separators and single vs double sha. Success criterion: printable ratio >0.92 or >=2 dictionary words in the decrypt. This operationalized the 2020 'Yellow has a number and so does Blue' + 'zero out characters' + primes hints into thousands of concrete recipes.
- **Output:** ~4,156 distinct candidate strings / ~16,620 key-attempts: every multi-blob 'hit' was chance PKCS7 noise (printable ~0.30-0.49). No clean result; >>> NO CLEAN RESULT <<<. The exact derivation of yellowblueprimes is unsettled ('too many combinations').

<a id="t-genesis-yellowblueprimes-89-candidate-sweep"></a>
#### yellowblueprimes candidate sweep (~89 derived values) vs the blobs
❌ **Verified fail** · this project · *this session (attack_ybp.py, ybp.py, ybp2.py)*

- **Input:** Derived yellowblueprimes candidates from the genesis colored cells: blue char-index set {1,2,3,4,6,7,8,11,12,13,14,16,17,20,23}, yellow {5,9,10,15,18,19,21,22,24}; primes 1..24 = {2,3,5,7,11,13,17,19,23}; blue∩primes {2,3,7,11,13,17,23}, yellow∩primes {5,19}; counts 15/9; index-sums; URL chars at those positions; literal '2357' and 'yellowblueprimes'. Tested directly as keys and inside the 4-ingredient cosmic recipe (matrixsumlist, lastwordsbeforearchichoice, yinyang∈{yinyang,yin,yang}, seps {'' . - _ space}, several orders).
- **Method:** Built every plausible 'yellow has a number and so does Blue' + primes 2,3,5,7 reading as a concrete value (concatenation, index-sum, count, prime-filtered subset, URL chars at prime positions). Each was hashed (literal, sha256hex, raw-sha, double-sha) and tested against cosmic, salph_inner and p32_trailing, both alone and assembled into the cosmic 4-ingredient key.
- **Output:** Zero valid hits. No candidate opened any blob to readable text or produced a valid PKCS7 plaintext above chance. yellowblueprimes value remains unknown.

### yinyang derivation

<a id="t-genesis-yinyang-from-duality"></a>
#### yinyang derived from genesis duality / Cosmic Duality book / faed complement
❌ **Verified fail** · this project · *this session (yinyang_cands.py)*

- **Input:** yinyang candidates: literal forms (yinyang, 'yin yang', YinYang, tao, taiji, taijitu); the faed yin-yang complement map (a<->i, b<->h, c<->g, d<->f, e fixed) applied to the 570-symbol faed block and its digit form; faed binary maps under thresholds 4/5/6 and parity; faed split into two 285-symbol halves; and the genesis blue<->yellow / 0<->1 / black<->white duality, plus the real 'Cosmic Duality' book (Mysteries of the Unknown, yin-yang of two galaxies) as a thematic source.
- **Method:** The creator's '...you'll solve it the same day once you hit a ying yang' makes yinyang the sole bottleneck, with the most on-theme source being the genesis blue/yellow duality and the faed complement. Generated complement/threshold/parity/half candidates and literal/book forms, hashed each (literal/sha/double-sha) and tested against cosmic and the two oracle blobs.
- **Output:** Complement and literal yinyang tests all failed (0 hits). The genesis duality and the book yield no verified yinyang value. yinyang remains the central unknown of the endgame.

## Phase 3.2 — The Architect & the trailing blob (5)

### artifact discovery

<a id="t-discover-p32-trailing-blob-end-of-phase32"></a>
#### DISCOVERED the undocumented 80-byte p32_trailing AES blob embedded at the END of the phase-3.2 plaintext
💡 **Verified — new insight** · this project · *this session*

- **Input:** The decrypted phase-3.2 plaintext (saved to phase32_plain.bin). Searched it for the OpenSSL base64 magic prefix 'U2FsdGVkX1'. Recovered blob (b64): U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46zgKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4 -> salt b45a5e3d827593ca, 80 ciphertext bytes (5 AES blocks).
- **Method:** After reproducing phase3.2, scanned the full plaintext for any embedded 'Salted__' base64 (extract.py: find('U2FsdGVkX1'), then collect the contiguous base64 run). Found a base64 blob sitting AFTER the Architect speech/VIC text at the very tail of the plaintext, distinct from the on-page salphaseion blob. Decoded it, confirmed the Salted__ header and an 80-byte ciphertext, and cross-checked that it is NOT equal to ciphertexts/salphaseion.txt.
- **Output:** A genuine fourth/extra OpenSSL aes-256-cbc blob (salt b45a5e3d827593ca, 80 bytes) that the community walkthroughs never noted or decoded. Being 80 bytes (<=79 readable plaintext bytes), a correct key would be instantly self-verifying -> a built-in oracle. It resisted all keys tried so far (chess/VIC/speech-derived, dictionary).
- **Insight:** There is a previously-unnoticed 80-byte AES blob (salt b45a5e3d827593ca) appended to the phase-3.2 plaintext itself, giving a fresh, self-verifying decryption oracle with no community attack history.

### key sweep (p32_trailing oracle)

<a id="t-keysweep-p32-288-phase32-answers"></a>
#### 288 phase-3.2-derived answer strings against the p32_trailing blob
❌ **Verified fail** · this project · *this session*

- **Input:** The 80-byte p32_trailing blob (salt b45a5e3d827593ca, b64 U2FsdGVkX1+0Wl49...mdC0NAv4) found at the very end of the phase-3.2 plaintext. Keyed with 288 strings derived locally from phase 3.2: the THEMATRIXHASYOU Beaufort key, the custom VIC alphabet FUBCDORA.LETHINGKYMVPS.JQZXW (and the ambiguous ...ZJQWX. rebuild), the chess clue 'A fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen' (and fubcdking/oraclequeen/sadboard fragments), the raw VIC 144-digit string (fwd/rev), CIAO BELLA O, HALF AND BETTER HALF, the phase-2 chess FEN B5KR/1r5B/2R5/..., REINSERTING THE PRIME BASICS / RETURN TO THE SOURCE CODES, 140/hundredfourty, privatekeynote, etc. Each as literal, sha256hex, raw-sha, double-sha, hex-of-hex (attack_p32.py, chessclue.py).
- **Method:** p32_trailing is a self-verifying oracle (a correct key yields <=79 readable bytes instantly) and the chess sentence immediately preceding it suggested its key is a phase-3.2 construction. Every plausible phase-3.2 answer/alphabet/board phrase was normalized and hashed in the puzzle's conventions and used to decrypt the blob.
- **Output:** 0 readable decrypts. No phase-3.2-derived string -- including the literal pre-Beaufort EBCDIC letter string and the VIC digit string forward and reversed -- opens p32_trailing. The chess lead is closed: no specific board position is given to construct a non-phrase key.

### p32_trailing decode

<a id="t-p32-trailing-chess-vic-constructive-attack"></a>
#### p32_trailing chess-clue CONSTRUCTIVE attack — build the VIC straddling-checkerboard and run the chess clue through it
❌ **Verified fail** · this project · *this session (p32_chess.py, p32chess.py, chess_p32.py, p32_clue.py, vic.py)*

- **Input:** The 80-byte OpenSSL blob at the END of the phase-3.2 plaintext: p32_trailing (salt b45a5e3d827593ca, base64 U2FsdGVkX1+0Wl49…mdC0NAv4). Its immediately-preceding clue: 'Raising the stakes without extra chances of winning. A fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen.' Construction material: the VIC straddling-checkerboard alphabet FUBCDORA.LETHINGKYMVPS.JQZXW with markers 1&4, and the 144-digit VIC code string 15165943121972409169171213758951813141543131412428154191312181219433121171617137149110916631213131281491109166131412199114371612126021664313711154112.
- **Method:** Rather than just hashing the chess sentence as a phrase, this attack treated the clue as a CONSTRUCTION: built the VIC straddling checkerboard from the clue's letter-groups (top row FUBCDORA into the 8 non-marker columns, marker-1 row and marker-4 row), verified it round-trips the known phase-3.2 VIC plaintext, then generated every plausible key from that construction — the clue text and all normalizations, every sub-fragment (fubcdking, oraclequeen, thingkymvps, sadboard, aswideasthefirstoneseen, gsmg.io/theseedisplanted as 'the first one seen'), the column-read of the checkerboard, the re-decoded VIC string, and the VIC plaintext fragment 'HALF AND BETTER HALF' — each hashed as {literal, sha256hex, raw-sha256, double-sha, hexofhex} and AES-decrypted against p32_trailing (and salph_inner/cosmic), with success defined as a PKCS7-valid plaintext scoring >0.85 printable.
- **Output:** Across all consolidated chess/VIC scripts (hundreds of candidate keys × 4-5 hash forms × the 80-byte blobs) ZERO produced a PKCS7-valid readable plaintext. The VIC checkerboard build verified correct (it round-trips the known Architect VIC plaintext), proving the clue's only real function is to define the VIC alphabet that was already consumed in phase 3.2 — there is no specific board POSITION/coordinate set encoded to build a key from. The chess/p32_trailing lead is closed.

<a id="t-vic-straddling-checkerboard-reverse-engineering"></a>
#### VIC straddling-checkerboard reverse-engineering — the chess clue is just the VIC-alphabet mnemonic
💡 **Verified — new insight** · this project · *this session (vic.py round-trip verification)*

- **Input:** VIC alphabet FUBCDORA.LETHINGKYMVPS.JQZXW with markers (1,4); the 144-digit phase-3.2 VIC code string (151659431219…154112); target known plaintext beginning 'INCASEYOUMANAGE…' → full decode 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE'.
- **Method:** Reverse-engineered the straddling checkerboard from the chess clue's letter-groups and decoded the 144-digit VIC string under both marker orientations (1,4) and (4,1) to find which construction reproduces the known Architect plaintext. Reasoning: confirming the board round-trips the existing plaintext proves whether the chess clue carries any NEW data (a board position) or whether its entire purpose was already spent in establishing the VIC alphabet.
- **Output:** The reconstructed checkerboard correctly round-trips the 144-digit string to the known VIC plaintext, confirming the chess clue's sole cryptographic role is the VIC-alphabet mnemonic (markers 1&4, top row FUBCDORA, etc.) — it encodes no separate board state or coordinate key. Note: the alphabet's tail is reconstruction-ambiguous (…JQZXW vs …ZJQWX.), a documented minor uncertainty, but neither variant yields a p32_trailing key.
- **Insight:** The phase-3.2 chess clue ('fubcd-king & oracle-queen…') is purely the VIC straddling-checkerboard mnemonic — the reconstructed board round-trips the known 144-digit VIC string to the Architect plaintext, so it carries no separate board-position key for p32_trailing.

### solved-chain verification

<a id="t-chain-reproduce-phase2-3-32-byteexact"></a>
#### Reproduced the full phase2 -> phase3 -> phase3.2 AES chain byte-exact with own OpenSSL/EVP harness
💡 **Verified — new insight** · this project · *this session*

- **Input:** Three repo ciphertext blobs (ciphertexts/phase2.txt, phase3.txt, phase32.txt). Keys: phase2 = sha256hex('causality'); phase3 = the audit key 1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5 (= sha256 of the 7-part Mr-Robot password); phase3.2 = sha256hex('jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple') = 250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c.
- **Method:** Built a standalone Python harness (gsmg.py) that re-implements OpenSSL's `enc -aes-256-cbc -md sha256`: it strips/base64-decodes each blob, reads the 8-byte Salted__ salt, derives key+IV via EVP_BytesToKey with SHA-256 (D1=sha256(pw+salt); Di=sha256(Di-1+pw+salt)), then AES-256-CBC decrypts and validates PKCS7. Ran the known answer-strings (chain.py) for all three stages to confirm each decrypts cleanly and the chain is reproducible outside the original repo tooling.
- **Output:** All three stages decrypt with valid PKCS7 and produce the expected plaintext (phase2 -> Mr-Robot riddle; phase3 -> 7-part-password stage; phase3.2 -> the EBCDIC/Beaufort Architect speech + VIC digit block). Confirms the published solved chain is byte-exact and independently reproducible.
- **Insight:** An independent from-scratch EVP_BytesToKey(SHA-256)+AES-256-CBC harness reproduces phase2/3/3.2 exactly, fixing the precise crypto format (salt-prefixed OpenSSL, pass = sha256hex(answer)) used by every blob in the puzzle.

## SalPhaseIon & Cosmic Duality — the open endgame (116)

### assembly recipe

<a id="t-ledger-blocks-as-base9-numbers-into-hash"></a>
#### Blocks read straight as base-9 numbers fed into the cosmic hash
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** Raw base-9 integers of dbbi and faed used directly as the yellowblueprimes / yinyang values. 50 distinct numeric assemblies built and hashed.
- **Method:** Skipped decoding entirely and treated each block's raw base-9 integer value AS the ingredient value, assembling them into ~50 candidate cosmic passphrases and testing each against the real SalPhaseIon blob via AES + PKCS7.
- **Output:** Zero valid PKCS7 against the real SalPhaseIon blob.

### cosmic combine recipe

<a id="t-cosmic-xor-7-token-issue56"></a>
#### Issue #56 XOR-of-7-tokens recipe reproduced and refuted
❌ **Verified fail** · community · *puzzlehunt issue #56*

- **Input:** The exact 7-token XOR recipe from issue #56: XOR of sha256 of each of [matrixsumlist, enter, lastwordsbeforearchichoice, thispassword, matrixsumlist, yourlastcommand, secondanswer] → 32-byte key. The claimed 'next-page' plaintext SHA target was 4f7a1e4efe4bf6c5581e32505c019657cb7b030e90232d33f011aca6a5e9c081. Reproduced in xor7.py and tested as EVP passphrase (raw + hex), and as a direct AES key with IV∈{0, salt}.
- **Method:** Issue #56 claimed the cosmic key is the XOR of seven token hashes. The recipe was reproduced exactly, the resulting 32-byte XOR computed, and used both as an EVP passphrase and as a direct AES-256 key (IVs zero and salt) against cosmic, salph_inner and p32_trailing. Also swept variations: token pools sized 4–8, all permutations of the 4 core tokens plus extras, as EVP-raw and direct key.
- **Output:** Does not reproduce its own claimed plaintext SHA (4f7a1e…). Decrypts nothing readable on any blob — every result is PKCS7-fail or random bytes. The recipe is FALSE. (Separately, the '4f7a1e…' Wayback 'next page' is itself a 530 server error, never real content; and the tokens yourlastcommand/secondanswer originated as on-chain solver dust, not creator hints.)

<a id="t-cosmic-master-key-818af53d-issue69"></a>
#### Issue #69 'master key' 818af53d… tested under every interpretation and refuted
❌ **Verified fail** · community · *puzzlehunt issue #69*

- **Input:** The claimed 64-hex master key 818af53daa3028449f125a2e4f47259ddf9b9d86e59ce6c4993a67ffd76bb402, tested against cosmic, salph_inner, p32_trailing as: (A) EVP passphrase in 4 forms {literal 64-ascii, sha256(hex64), raw-sha256-of-32-bytes, double-sha} under md5 & sha256 KDFs; (B) the raw 32 bytes as a DIRECT AES-256 key with 6 IVs {0, salt+0pad, salt*2, sha(key)[:16], key[:16], key[16:32]}; (C) ascii[:32] as a direct key with IV∈{0,salt}. (adv_verify_69.py)
- **Method:** Issue #69 posted a single 'master key' allegedly decrypting cosmic. Because the issue's quoted 'decrypted payload' was just a copy-paste of the already-known phase-3.2 VIC text, it was independently re-derived (de-obfuscating tel:-markdown links) and adversarially tested under every plausible cryptographic interpretation — EVP passphrase, direct key, multiple IVs and KDFs — counting a WIN only as meaningful printable plaintext, not mere PKCS7-validity.
- **Output:** ZERO meaningful/printable hits across all interpretations and all 3 blobs (cosmic padding-fails under EVP-hex, raw-key/IV=0, raw-key/IV=salt and ECB). The quoted 'payload' is fabricated (it is the phase-3.2 VIC sentence). The key fails the small 80-byte oracle blobs too, where a correct key would be instantly obvious. FABRICATED.

<a id="t-ledger-literal-word-assemblies-vs-blob"></a>
#### ~750 + 96 literal-word ingredient assemblies vs the real blob
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** The four named ingredients (yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang). ~750 plus 96 assemblies: every order/format (literal words, numeric sums, label strings) -> sha256 -> AES -> PKCS7 test.
- **Method:** Concatenated the four cosmic ingredients in every order and format, hashed each candidate to an AES passphrase, and tested PKCS7 validity against the real cosmic blob, to check whether the password is simply the literal ingredient words.
- **Output:** Only chance-level PKCS7 passes, all decrypting to garbage. The password is not the literal words.

<a id="t-cosmic-3ingredient-omit-yinyang"></a>
#### 3-ingredient recipe omitting yinyang (faed may be 'another puzzle')
❌ **Verified fail** · this project · *this session*

- **Input:** Recipes built from only THREE ingredients {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice} (yinyang/faed dropped), in candidate value-forms and orders, hashed and tested vs all 3 blobs (recipe.py / combine families; ybp value-candidates from genesis prime/blue/yellow char readings).
- **Method:** The creator stated 'the second half [faed] will probably be used for ANOTHER PUZZLE, or not at all,' so the cosmic recipe was tried WITHOUT the yinyang slot — combining only the three remaining ingredients (with yellowblueprimes drawn from genesis prime/colored-cell char readings) to test the hypothesis that yinyang is not actually a cosmic ingredient.
- **Output:** 0 hits. Dropping yinyang does not yield a working recipe; the 3-ingredient assemblies decrypt to garbage on all blobs.

<a id="t-cosmic-kdf-variants-md5-sha1-sha512-pbkdf2"></a>
#### Alternate KDFs (MD5/SHA-1/SHA-512 EVP, PBKDF2) on top candidate keys
❌ **Verified fail** · this project · *this session*

- **Input:** Top candidate passphrases (soup tokens, ingredients, 'our first hint is your last command', causality, hashthetext, theseedisplanted, the entry string, etc.) run through non-standard KDFs: MD5-EVP, SHA-1/SHA-512-EVP, and PBKDF2-HMAC-{sha256,sha1} with {1, 1k, 10k} iterations; also trailing-newline passphrase variants. Tested vs salph_inner & p32_trailing (and cosmic in the berserk KDF pass) (kdf_variants.py, lens4_salph.py, ENDGAME §8c).
- **Method:** All confirmed blobs use OpenSSL EVP_BytesToKey with SHA-256, but to rule out a different key-derivation the strongest candidate passphrases were re-run through MD5/SHA-1/SHA-512 EVP and PBKDF2 (varied iteration counts), plus trailing-newline forms (a common OpenSSL pitfall).
- **Output:** 0 hits under any alternate KDF. Cosmic and the small blobs use standard SHA-256 EVP (matching the rest of the chain); no MD5/SHA1/SHA512/PBKDF2 derivation of any candidate opens them.

<a id="t-cosmic-double-sha-shabef"></a>
#### Double-SHA ('shabef' = sha256 applied twice / N times)
❌ **Verified fail** · this project · *this session*

- **Input:** The recipe assembly hashed with sha256 nested N times, N∈{2,5,6} (the soup token 'shabef' = a1z26 sha + b,e,f = 2,5,6 → sha256, appearing TWICE in the soup). Applied to the 4-ingredient concat (and per-ingredient forms) as the EVP passphrase, vs cosmic/salph_inner/p32_trailing (n5_recipe.py, combine_unknowns.py, literal_recipe.py double-sha form).
- **Method:** 'shabef' brackets the inner-blob region twice and decodes to 'sha256' with the digits {2,5,6}; this was read as a possible instruction to apply sha256 two (or 2/5/6) times. The assembled recipe string was therefore iterated through sha256 multiple times and the resulting hex/raw digest used as the passphrase.
- **Output:** 0 hits for any N on any blob. Double/multi-sha of the recipe does not open the blobs.

<a id="t-faed-as-cosmic-passphrase-direct"></a>
#### faed (and its base-9 integer forms) used directly as the cosmic passphrase/ingredient
❌ **Verified fail** · this project · *this session*

- **Input:** faed literal, faed a1z26-digit string, faed true-base-9 integer, and decimal integers of the digit strings, used directly as the yellowblueprimes / yinyang ingredient value in the cosmic combine (sha256 -> AES). Included in the ~50 numeric assemblies feeding raw base-9 integers of dbbi & faed as ingredient values.
- **Method:** If faed IS the home of the 'yinyang' cosmic ingredient, its raw value (number or string) should slot directly into the combine recipe and produce a valid decrypt against the real SalPhaseIon / cosmic blob. This skips decoding faed to a word and just uses it as the ingredient.
- **Output:** Zero valid PKCS7 against the real SalPhaseIon blob across the numeric assemblies; all garbage. faed-as-ingredient does not fire the combine.

<a id="t-cosmic-4ingredient-literal-sha256-all-orders"></a>
#### Literal 4-ingredient SHA-256 assembly (every order and separator)
❌ **Verified fail** · this project · *this session*

- **Input:** The four named cosmic ingredients as their LITERAL label words: yellowblueprimes . matrixsumlist . lastwordsbeforearchichoice . yinyang. All 24 permutations (4!) of the four words, joined with each of 8 separators {'', '.', ' ', '-', '_', '+', ',', '\n'}. Tested against all 3 open blobs (cosmic 1328B, salph_inner 80B, p32_trailing 80B). ~6,900 assemblies (literal_recipe.py).
- **Method:** The 2023 reverse-binary master hint names four ingredients to combine. The simplest reading is that the puzzle wants sha256 of the four literal label words concatenated. Each assembled string was run through 5 key-forms (sha256hex, raw-sha256-hex, double-sha hex, sha-of-hex, and the literal string itself) as the OpenSSL EVP passphrase, then AES-256-CBC decrypted and the plaintext scored for printable/PKCS7-valid text.
- **Output:** 0 hits on any of the 3 blobs. Best printable score remained at chance level (~0.59). No assembly produced valid readable plaintext.

<a id="t-cosmic-matrixsumlist-literal-vs-numeric"></a>
#### matrixsumlist as literal word vs. as the numeric row/col sums
💡 **Verified — new insight** · this project · *this session*

- **Input:** The ingredient matrixsumlist in two byte-forms: (a) the literal word 'matrixsumlist'; (b) the numeric value = genesis row-sums '610876654997879' concatenated with col-sums '8108108736759668' = '6108766549978798108108736759668' (rows[6,10,8,7,6,6,5,4,9,9,7,8,7,9], cols[8,10,8,10,8,7,3,6,7,5,9,6,6,8]). Each substituted into the 4-ingredient recipe across 7 separators and 4 orders, single and double sha (final_recipes.py, recipe.py, megacombine.py).
- **Method:** It was verified byte-exact that the soup's 104-bit 'binary1' chunk literally spells the WORD 'matrixsumlist' (a=0,b=1, 8-bit ASCII), proving the soup tokens are self-labeling — the token names itself, and its VALUE is the genesis row/col sums. Both interpretations (literal word and true numeric value) were therefore tested as the matrixsumlist slot of the recipe so an otherwise-correct recipe could not fail merely on this slot's encoding.
- **Output:** 0 hits under either the literal-word or the numeric-sums form, across all orders/separators and all 3 blobs.
- **Insight:** The soup's 104-bit 'binary1' chunk decodes byte-exactly to the literal word 'matrixsumlist' (and 'enter' likewise spells 'enter'), proving the cosmic ingredients are self-LABELING tokens whose VALUES (e.g. the genesis sums) must be computed rather than used as the literal label words.

<a id="t-cosmic-per-ingredient-sha-then-concat-and-xor"></a>
#### Per-ingredient SHA then concat, and XOR-of-N-ingredient-hashes
❌ **Verified fail** · this project · *this session*

- **Input:** Two structural combine variants: (a) sha256hex each of the 4 ingredients then concatenate the four 64-hex digests (then optionally re-sha); (b) XOR of the 4 per-ingredient sha256 digests → 32-byte key, used as EVP-raw passphrase and as direct AES key. Also generalized to XOR-of-N token hashes, N=4..8. Ingredient values included dbbi/faed raw-byte and field-decoded forms (combine_unknowns.py, final_recipes.py, combine_values.py).
- **Method:** Beyond plain concatenation, the recipe might combine ingredients by hashing each separately. Two natural schemes were tested: concatenating the per-ingredient hashes (then sha), and XOR-ing the per-ingredient hashes into one 32-byte key. dbbi was treated as the yellowblueprimes raw/field-decoded ingredient and faed as yinyang, in addition to the literal words.
- **Output:** 0 hits. Neither per-ingredient-sha-then-concat nor XOR-of-N-hashes (as EVP passphrase or direct key) opens any blob.

<a id="t-cosmic-include-enter-thispassword-tokens"></a>
#### Recipe including the unused soup tokens 'enter' and 'thispassword'
❌ **Verified fail** · this project · *this session*

- **Input:** The 4 master ingredients plus the two 'unused' soup tokens, in combinations: all 24 permutations of {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang} × extra ∈ {∅, ['enter'], ['thispassword'], ['enter','thispassword']}; also the on-chain soup-4 string 'matrixsumlistenterlastwordsbeforearchichoicethispassword'. Forms {sha256hex, literal, raw-sha, double-sha} vs all 3 blobs (combine_values.py §C, literal_recipe.py).
- **Method:** The soup contains two decoded tokens — 'enter' and 'thispassword' — that are NOT among the 4 master ingredients, suggesting they might be additional recipe components (e.g. 'enter this password'). They were appended/interleaved into the 4-ingredient assembly in every order and hashed, plus the exact soup-order concatenation that solvers posted on-chain.
- **Output:** 0 hits on any blob. Adding enter/thispassword to the recipe produces no readable decrypt.

<a id="t-cosmic-phase-chain-key-reuse"></a>
#### Reusing the phase-2/3/3.2/entry chain keys as cosmic ingredients/keys
❌ **Verified fail** · this project · *this session*

- **Input:** The verified phase chain keys used as passphrase material on the blobs: phase2 sha256('causality')=eb3efb…e5bf; phase3 1a57c572…30d5; phase3.2 sha256('jacquefresco…principle')=250f3772…ce4c; SalPhaseIon entry sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe')=89727c59…6a32. Tested literal, as sha256-of-key, and (for 64-hex) as direct 32-byte AES keys with IV∈{0, salt*2} (combine_values.py, final_recipes.py, attack_double.py).
- **Method:** The Architect speaks of 'seven intertwined passwords' and reusing earlier material, so each already-solved phase key was tried directly as the cosmic/small-blob passphrase, as a hashed passphrase, and (being 64-hex) as a raw AES key. attack_double.py additionally checked whether any chain key produces a nested 'Salted__' header (double encryption).
- **Output:** 0 hits on any blob; no chain key yields readable plaintext, and no first-layer decrypt produces a 'Salted__' inner header. Chain-key reuse does not open the endgame blobs.

<a id="t-cosmic-no-partial-progress-oracle"></a>
#### Structural 'no partial-progress oracle' on the cosmic recipe
💡 **Verified — new insight** · this project · *this session*

- **Input:** Cross-cutting structural observation over the entire cosmic-recipe search (~20,000 targeted attempts + full 370k-word dictionary × {literal, sha256hex} ≈ 1.5M decrypts). The cosmic key requires THREE unknowns simultaneously: the value of yellowblueprimes, the value of yinyang, AND the exact combine operation/separator.
- **Method:** Across every recipe family above, results were analyzed for any signal short of a full solve. Because each test reduces to AES-256-CBC decryption, and AES only yields valid PKCS7 + readable text when the ENTIRE passphrase is exactly right, two-of-three components perfect still produces pure random bytes. This was confirmed empirically: no recipe ever scored above chance printability, with no gradient toward a solution.
- **Output:** Confirmed: the cosmic recipe has NO partial-progress oracle — the search is multiplicative and feedback-free. Two-of-three ingredients/combine correct yields zero distinguishable signal, which is precisely why ~1.5M decrypts produced no gradient and why cleverness alone cannot close it (matching the Architect's 'brute forcing might be required').
- **Insight:** The cosmic blob provides no partial-progress feedback: the key needs yellowblueprimes, yinyang, AND the combine operation all simultaneously correct, so any two-of-three-perfect attempt is indistinguishable from random — a multiplicative, feedback-free search with no oracle to guide it.

<a id="t-cosmic-full-master-hint-string-as-key"></a>
#### The full master-hint string (ingredients + taunt block) as the key
❌ **Verified fail** · this project · *this session*

- **Input:** The complete 161-byte (=7·23) master-hint string: the 4 ingredients followed by the trailing taunt block wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit · verylaststepisatruegiveaway · promised (taunt lengths [25,39,27,8]). Tested as a single passphrase in forms {literal, sha256hex, raw-sha, double-sha}, with separators, vs all 3 blobs (literal_recipe.py 'taunt', combine_values.py PHR pool).
- **Method:** Rather than treating the taunts as flavor, the entire reverse-binary master-hint payload (ingredients + four taunt phrases) was concatenated and hashed as one passphrase, on the theory that the whole 161-byte string is the key material. Each taunt phrase was also tried individually as literal/sha passphrase.
- **Output:** 0 hits. Neither the full master-hint string nor any individual taunt phrase opens any blob.

<a id="t-cosmic-ybp-yinyang-as-rawbytes-from-dbbi-faed"></a>
#### yellowblueprimes/yinyang as RAW decoded bytes of dbbi/faed in the recipe
❌ **Verified fail** · this project · *this session*

- **Input:** yellowblueprimes := dbbi in forms {literal, a-i→1-9 digits, field-decoded bytes hex, sha256(dbbi)}; yinyang := faed in forms {literal, digits, field-decoded hex, complement, sha256(faed), 'yinyang'}; slotted with matrixsumlist-numeric and lastwordsbeforearchichoice in both ingredient orders; combined via sha256(concat), XOR-of-sha, and shabef-nesting (combine_unknowns.py, n5_recipe.py).
- **Method:** Since dbbi/faed are believed to ENCODE yellowblueprimes/yinyang, the creator might concatenate their decoded bytes (not words). Each dbbi/faed byte-interpretation was substituted into the recipe and combined three ways (sha256-concat, XOR-of-per-ingredient-sha, multi-sha) against all 3 blobs, gating on printable+English plaintext.
- **Output:** 0 hits across all dbbi/faed byte-forms, orders and combine operations. Best printable ratios stayed at chance for every blob.

### dbbi/faed decode

<a id="t-ledger-reinsert-prime-basics"></a>
#### 'Reinsert the prime basics' (Architect's literal instruction)
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** A reconstructed longer string; 0s inserted at the prime indices of the FINAL string; then field-decoded.
- **Method:** Took the Architect's own phrase 'reinserting the prime basics' literally: rebuilt a longer string and inserted zeros at the prime-numbered positions of the final string before running the field decode, to supply the missing zeros the field method needs.
- **Output:** Printability <=0.46 -- the author's literal instruction, cleanly tested, fails.

<a id="t-ledger-all-9factorial-substitutions-dbbi"></a>
#### ALL 9! monoalphabetic substitutions x 2 digit ranges on dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. Every one of the 362,880 permutations of a-i, run twice (digits 0-8 and digits 1-9) = 725,760 total field-decodes.
- **Method:** Brute-forced the entire monoalphabetic key space: every possible assignment of the nine symbols to nine digits, in both digit ranges, each followed by the int->hex->ASCII field decode, to definitively rule out any single-symbol substitution.
- **Output:** Zero produced English (out of 725,760 decodes).

<a id="t-ledger-all-grid-reads-dbbi"></a>
#### All grid reads of dbbi (7x13 and 13x7)
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi laid out 7x13 and 13x7. Read orders: rows, columns, diagonals, spiral, boustrophedon.
- **Method:** Exhaustively re-read dbbi as a rectangle in every standard scan order, since the creator emphasized 'how the array is indexed', to find a reading order that exposes text.
- **Output:** Garbage.

<a id="t-ledger-all-transposition-x-substitution-dbbi"></a>
#### ALL transposition x substitution on dbbi (3.27M decodes)
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. 9 transposition layouts x every 9! substitution = 3,265,920 decodes.
- **Method:** Crossed the full monoalphabetic key space with 9 grid/transposition layouts, so any combination of 'rearrange then substitute' was covered, then field-decoded all 3.27M results.
- **Output:** Zero produced English.

<a id="t-ledger-be-binary-channel-dbbi"></a>
#### b/e binary channel and presence channel in dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. Channel 1: b vs e as a bit. Channel 2: colored-vs-not as a bit.
- **Method:** Treated the two dominant symbols as a binary channel (b=0/e=1) and separately the colored-vs-uncolored status as another bit channel, reading each as a hidden bitstream.
- **Output:** Garbage.

<a id="t-ledger-base81-digit-pairs-dbbi"></a>
#### Base-81 digit-pair reading of dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. Adjacent symbol pairs read as single base-81 digits (9x9 = 81).
- **Method:** Combined adjacent base-9 symbols into base-81 digits, on the idea that the real alphabet is two-symbol units, then decoded the resulting base-81 stream.
- **Output:** Garbage.

<a id="t-ledger-cosmic-duality-vic-on-blocks"></a>
#### Cosmic Duality book / VIC cipher applied to the blocks
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Applied the Phase-3.2 VIC straddling-checkerboard (alphabet FUBCDORA.LETHINGKYMVPS.JQZXW) and book-cipher readings.
- **Method:** Reused the Phase-3.2 VIC checkerboard cipher and Cosmic Duality book-cipher readings on dbbi and faed, on the theory that the same cipher machinery from the architect phase continues into the soup blocks.
- **Output:** Garbage -- both the VIC and book-cipher readings eliminated.

<a id="t-ledger-direct-base-field-decode-dbbi-faed"></a>
#### Direct base-9 / base-16 / octal field-decode of dbbi and faed
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi (91 base-9 symbols, alphabet a-i: dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe) and faed (570 base-9 symbols). Symbol->digit maps a-i -> 1-9 and a-i -> 0-8.
- **Method:** Applied the exact 'house method' that successfully solved the earlier z-fields of the soup: map each letter a..i to a digit, read the whole block as one big integer, convert that integer to hexadecimal, then to ASCII text. They reasoned that if the same decoder solved the agda/cfob word-chunks it should solve dbbi/faed too.
- **Output:** Garbage. The method fundamentally cannot fire here because dbbi/faed contain no 'o' symbol (the symbol that maps to 0), and the verified field method needs an 'o'=0 to produce the zeros present in the target words.

<a id="t-ledger-dbbi-primality-factoring"></a>
#### Primality and factoring of dbbi as a number
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi interpreted as a number in base-9 and in base-10.
- **Method:** Tested whether dbbi-as-a-number is prime or has meaningful factors, on the 'prime is very important' theme, hoping a factorization would yield a key, period, or offset.
- **Output:** Not prime; only small factors (base-9: 5*11*53; base-10: divisible by 5). Carries no obvious key.

<a id="t-ledger-prime-position-select-zero-both-indexbases"></a>
#### Prime-position select & zero, both 0-index and 1-index
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed symbol strings. Operations: keep / remove / zero the symbols sitting at prime positions. Index conventions swept: 0-based and 1-based ('First or zero'). All four field decoders applied afterward.
- **Method:** The creator repeatedly stressed primes and 'zeroing out characters', so they treated the prime-numbered positions as special: at each prime index they either kept the symbol, deleted it, or forced it to zero, then field-decoded the result. They tried both index origins because the off-by-one is ambiguous.
- **Output:** 0.000 English under every single combination of operation x index-base x decoder.

<a id="t-ledger-remove-zero-dominant-be-dbbi"></a>
#### Remove / zero the dominant symbols b and e in dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. Symbols b and e together make up ~47% of dbbi. They were deleted, then separately zeroed, and dbbi re-decoded.
- **Method:** Noticed b and e dominate the histogram (~47%) and treated them as filler/noise: removed them, and separately forced them to zero, then re-decoded, on the theory the real message hides among the rarer symbols.
- **Output:** Garbage.

<a id="t-ledger-search-literal-yellowblueprimes-dbbi"></a>
#### Search dbbi for the literal string 'yellowblueprimes'
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. Target: the literal string 'yellowblueprimes' encoded in any base.
- **Method:** Checked directly whether dbbi contains the word 'yellowblueprimes' (the hypothesized payload) encoded in any base representation, to confirm or kill the 'dbbi spells the word' assumption.
- **Output:** Absent in every base.

<a id="t-ledger-single-zero-insertion-sweep-dbbi"></a>
#### Single zero-insertion sweep across dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. One '0' inserted at every position in turn (and specifically at prime positions); each result field-decoded.
- **Method:** Since dbbi lacks the 'o'=0 symbol, they inserted a single zero at every candidate position (and at prime positions) and field-decoded, testing whether one missing zero in the right slot unlocks readable text.
- **Output:** Garbage at every insertion point.

### faed decode

<a id="t-faed-dbbi-repeating-key"></a>
#### dbbi used as a repeating key over faed (community 'dbbi keys faed')
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** faed (570 symbols) with dbbi (91 symbols) as a repeating Vigenere-style key: add / subtract / Beaufort, dbbi forward and reversed, with and without its 4-symbol header, plus pairwise operation on the shared 91-symbol prefix.
- **Method:** Because dbbi physically precedes faed in the soup and is shorter, the community theory was that dbbi is the key that deciphers faed. Every additive/subtractive/Beaufort combination and orientation was applied and the result's Index of Coincidence measured.
- **Output:** IoC collapses to 0.108-0.114 (uniform) under every variant -> the 'dbbi keys faed' idea is dead in its additive form.

<a id="t-faed-9factorial-permutation-sweep"></a>
#### 9! monoalphabetic permutation sweep of the faed field-decode
❌ **Verified fail** · this project · *this session*

- **Input:** The 570-symbol faed string; all 9! = 362,880 permutations of the symbol->digit mapping (a..i to the digits), in two digit ranges (0-8 and 1-9), each fed through the field-decode (int -> hex -> ASCII) and scored for printable ratio.
- **Method:** Since the 'correct' digit assignment for the alphabet is unknown, every possible bijection of the nine symbols to nine digits was tried exhaustively, then each decode scored for printable English. This brute-forces away any ambiguity in which symbol maps to which value.
- **Output:** All 362,880 decodes scored as garbage (max printable ~0.52 for faed); no permutation yields English. (Companion dbbi sweep maxed ~0.74, also garbage.)

<a id="t-faed-deinterleave-factors-and-lag253"></a>
#### De-interleave faed at its factors and at autocorrelation lag-253
❌ **Verified fail** · this project · *this session*

- **Input:** faed (570 = 2*3*5*19) de-interleaved into 2,3,5,6,10,15,19,30 strands; each strand field-decoded plus concatenations plus reversed strands. Separately, autocorrelation found a z~3.8 peak at lag 253 (weak echo near 505), so faed was split/aligned on a 253 period to expose a repeated substring.
- **Method:** If faed is an interleaving (fractionation) of multiple shorter messages, splitting on a true factor period should re-assemble readable strands. The lag-253 autocorrelation spike was investigated as a possible repeated key/plaintext period that would betray structure.
- **Output:** All factor de-interleavings are garbage (printability ~0.2-0.42). The lag-253 peak has no literal repeated substring behind it and sits at the Bonferroni significance floor -> parked as noise, not a real period.

<a id="t-faed-binary-bit-sweep"></a>
#### Exhaustive faed binary bit-map sweep (2^9 assignments x grids x 7/8-bit)
❌ **Verified fail** · this project · *this session*

- **Input:** faed (570 symbols). For each of the 510 non-trivial subsets of {a..i} mapped to bit '1' (rest '0'), the 570-bit string was read in grid shapes 570x1, 19x30, 30x19, 10x57, 57x10, 6x95, 95x6 under rows/cols/cols-reversed/boustrophedon orders, then chunked at 7 and 8 bits per character and scored against a 4-10 letter English dictionary.
- **Method:** Mirrors the verified dbbi 'fefefe is 101010' binary rule (per-symbol bit map). Since the correct symbol->bit assignment is unknown, every subset was tried, across multiple grid reindexings and both ASCII byte widths, and outputs were scored strictly by counting real dictionary words found as substrings.
- **Output:** No candidate reached even 3 dictionary-word hits with meaning; all readings are noise. faed-as-binary yields no text.

<a id="t-faed-field-decode-237-bytes"></a>
#### faed a1z26 field-decode to one big integer -> 237 random bytes
❌ **Verified fail** · this project · *this session*

- **Input:** The 570-symbol faed string (alphabet a..i only, no 'o'): 'faedggeedfcbdab...ahaidhfahiihic' (570 = 2*3*5*19). Map a..i -> 1..9 (and the alternate a..i -> 0..8), concatenate into one decimal/base-9 integer, convert to hex, then hex pairs to ASCII.
- **Method:** This is the verified 'house method' that successfully decoded the soup's z-fields (agda, cfob, shabef) into literal words. The reasoning: faed sits in the same family as those word-chunks, so the same a1z26 -> big-int -> hex -> ASCII pipeline should reveal a literal word (the candidate home of 'yinyang'). The single integer was reduced to bytes.
- **Output:** ~237 bytes of statistically random output; no printable English. Field-decode cannot fire correctly because faed (like dbbi) conspicuously contains no 'o' (=0 in the alphabet), so the integer never lands on text containing zeros.

<a id="t-faed-as-blob-key-material"></a>
#### faed literal/digits/bits/sha forms as AES passphrases for the blobs
❌ **Verified fail** · this project · *this session*

- **Input:** Derived candidate passphrases from faed: the literal string; the a1z26 digit string; prime->0 bit string and its inverse; zero-out digit string; field-decoded int-as-hex; the yin-yang complement string; plus base-9 integer forms (true base-9 int, decimal of digit strings, int-as-bytes). Each tested as literal, sha256hex, raw-sha256 digest, and double-sha against the salph_inner (salt 3ab585...) and p32_trailing (salt b45a5e3d...) 80-byte AES-CBC blobs via the OpenSSL EVP/SHA-256 KDF.
- **Method:** A correct key on either 80-byte blob is instantly obvious (valid PKCS7 padding plus <=79 readable bytes). Rather than decode faed to plaintext, this treats every plausible faed-derived string/byte sequence directly as the AES passphrase, since the creator hinted faed could be key/value material rather than text.
- **Output:** Zero readable hits across all faed-derived forms x {literal, sha, raw-sha, double-sha} x both blobs; at most chance-level PKCS7 passes decrypting to garbage. faed-derived bytes are NOT the blob keys.

<a id="t-faed-yinyang-self-complement-halves"></a>
#### Yin-yang self-complement test of the two 285-symbol halves
❌ **Verified fail** · this project · *this session*

- **Input:** faed split into two halves of 285 symbols each (570/2 = 285). Yin-yang complement map a<->i, b<->h, c<->g, d<->f, e fixed. Compared half-A against complement(half-B) and measured matching IC/correlation; also applied the complement standalone and chained with prime-zeroing.
- **Method:** The 'yinyang' ingredient suggests a duality/complement structure, so the hypothesis was that faed encodes its two conjugate halves such that one half is the yin-yang complement of the other (a self-complementary payload). If true, complementing one half would align it with the other.
- **Output:** The two halves match only at ~0.10 (chance level) -> faed is NOT a yin/yang self-complement. The standalone complement substitution and the complement-then-zero chained variants also produced garbage.

### fractionation

<a id="t-ledger-seven-intertwined-passwords-dbbi"></a>
#### 'Seven intertwined passwords' de-interleave of dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi (91 = 7x13). De-interleaved into 7 strands of 13 symbols each; each strand field-decoded plus the concatenation.
- **Method:** Mapped the Architect's 'seven intertwined passwords' onto dbbi's 7x13 factorization: pulled out 7 interleaved strands of 13 symbols and field-decoded each strand individually and concatenated, treating each strand as one of the seven passwords.
- **Output:** Garbage.

<a id="t-ledger-bifid-multiple-squares-periods"></a>
#### Bifid cipher with multiple 9-squares and periods
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Squares: identity 9-square, Lo Shu 9-square, reversed 9-square. Lengths: full-length and period 7 and period 13.
- **Method:** Ran the Bifid fractionating cipher (which pairs row/column coordinates of a square) using three candidate 9-squares and three period settings, since Bifid is the natural fractionation cipher for a base-9 alphabet.
- **Output:** Garbage.

<a id="t-ledger-deinterleave-by-factors"></a>
#### De-interleave dbbi and faed into strands by their factors
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi de-interleaved into 7 strands and 13 strands; faed into 2, 3, 5, 6, 10, 15, 19, and 30 strands. Each strand field-decoded, plus concatenations and reversed strands.
- **Method:** Treated the blocks as multiple intertwined sub-messages (the creator's 'intertwined' language) and pulled out every-Nth symbol for each factor N, then field-decoded each strand and combinations of strands.
- **Output:** Garbage (printability ~0.2-0.42).

<a id="t-ledger-trit-pair-balanced-ternary"></a>
#### Trit-pair / balanced-ternary split (9 = 3^2)
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Each base-9 symbol split into two base-3 digits; read as a 3x3 Polybius square and as a balanced-ternary stream.
- **Method:** Because 9 = 3^2, each base-9 symbol decomposes into a pair of base-3 trits. They split every symbol into two trits and read the trit stream as a 3x3 Polybius fractionation and as balanced ternary, hunting for hidden structure at the trit level.
- **Output:** Printability ~0.38-0.46 -- garbage.

### geometric/path

<a id="t-ledger-turtle-numpad-path-drawing"></a>
#### Turtle / numpad path-drawing of the symbol streams
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi (91 moves) and faed (570 moves). Symbols a-i mapped to numpad directions; paths drawn on a grid and rendered to an image.
- **Method:** Mapped each a-i symbol to a numeric-keypad direction and walked a turtle across a grid, drawing the 91-move and 570-move paths, hoping the trace would form a glyph, a yin-yang symbol, or a readable shape.
- **Output:** A connected but meaningless blob (explained entirely by direction bias) -- no glyph, no yin-yang.

### numerology

<a id="t-ledger-iching-loshu-flying-star"></a>
#### I Ching / Lo Shu nine-palace flying-star transform
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Operations: complement substitution, flying-star transposition, 180-degree spatial map, trigram/hexagram parity; then assembly + direct hash.
- **Method:** Treated the base-9 structure as the Lo Shu 3x3 nine-palace magic square and applied I Ching flying-star transpositions, 180-degree rotation, and trigram/hexagram parity readings, which the analysts flagged as the strongest remaining untested numerology lead.
- **Output:** Noise -- the strongest 'untested' lead, now closed.

<a id="t-ledger-nonary-digital-root-999"></a>
#### Nonary / digital-root '999' (Zero Escape) scheme
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed partitioned into door-groups; 9s zeroed; running digital-root computed; 'first-or-zero' rule; then assembly + direct hash.
- **Method:** Inspired by the '999'/Zero Escape and nine-theme hints, they grouped symbols into 'doors', zeroed out the 9s, ran a running digital-root reduction, applied a first-or-zero rule, then both assembled a key and hashed directly.
- **Output:** Noise.

### polyalphabetic cipher

<a id="t-ledger-dbbi-as-key-over-faed"></a>
#### dbbi used as a repeating polyalphabetic key over faed
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** faed = ciphertext (570 symbols); dbbi = repeating key (91 symbols). Variants: add / subtract / Beaufort; dbbi forward and reversed; with and without the 4-symbol header; plus a pairwise run over the shared 91-symbol prefix.
- **Method:** Tested the popular community idea that 'dbbi keys faed' (the first block decrypts the second). They cycled dbbi as a Vigenere-style key over faed using modular add, subtract, and Beaufort, in both orientations and header variants, to see if any alignment produced English.
- **Output:** The Index of Coincidence collapses to 0.108-0.114 (uniform/random), so the additive 'dbbi keys faed' idea is dead in its additive form.

<a id="t-ledger-matrixsumlist-vigenere-mask"></a>
#### matrixsumlist as a Vigenere key / mask over the blocks
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Key/mask = the matrixsumlist row/col sum digits (rows 610876654997879, cols 8108108736759668).
- **Method:** Used the matrixsumlist sum digits to key (Vigenere) or mask the blocks before decoding, since matrixsumlist physically sits between dbbi and faed and could be the indexing mask.
- **Output:** Score 0.43 versus a 0.95 control -- noise.

<a id="t-ledger-vigenere-beaufort-incase-alphabet"></a>
#### Vigenere / Beaufort against the INCASE checkerboard alphabet
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed as ciphertext; key = the INCASE checkerboard ordering. Both cipher directions (encrypt/decrypt sense).
- **Method:** Treated the INCASE straddling-checkerboard letter ordering as a polyalphabetic key and ran Vigenere and Beaufort over each block in both directions, on the theory the checkerboard ordering from an earlier phase was the keystream.
- **Output:** Garbage.

<a id="t-ledger-vigenere-beaufort-brute-periods-1to6-dbbi"></a>
#### Vigenere / Beaufort brute force, periods 1-6, on dbbi
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. 597,870 keys x both directions (Vigenere and Beaufort) -> field-decode -> English score.
- **Method:** Exhaustively brute-forced every short polyalphabetic key up to period 6 in both cipher directions, field-decoded each output, and scored for English, to rule out short-key polyalphabetic encipherment of dbbi.
- **Output:** Zero English.

<a id="t-ledger-vigenere-colored-prime-bits-duality-bits"></a>
#### Vigenere against colored-prime bits and full 24-bit duality stream
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed as ciphertext. Keys: the blue/yellow LSB sequence (colored-prime bits) and the whole 24-bit colored stream from the genesis grid.
- **Method:** Built keystreams from the genesis colored-cell bits (the blue=1/yellow=0 parities and the full 24-bit stream) and used them as Vigenere keys, on the theory that the colors encode yellowblueprimes/yinyang key material.
- **Output:** Noise.

<a id="t-ledger-vigenere-matrixsumlist-url-cellstream"></a>
#### Vigenere against matrixsumlist / genesis URL / spiral cell-stream
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed as ciphertext. Keys: the matrixsumlist row+col sum digits, the decoded genesis URL bytes (gsmg.io/theseedisplanted), and the 196-cell spiral cell stream.
- **Method:** Used three genesis-derived byte sources as Vigenere keys over the blocks, reasoning the key should come from Phase 0 material the creator keeps pointing back to. Scored against a known-good control to calibrate.
- **Output:** Noise (score <=0.43 versus a 0.95 known-good control).

### statistical analysis

<a id="t-ledger-autocorrelation-lag253-faed"></a>
#### Autocorrelation lag-253 peak in faed
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** faed. Autocorrelation found a z~3.8 peak at lag 253 (and a weak echo near lag 505).
- **Method:** Scanned faed's autocorrelation for repeats and found a notable z~3.8 spike at lag 253, then investigated whether a literal repeated substring sits behind it.
- **Output:** No literal repeated substring behind the lag-253 peak; it sits at the Bonferroni multiple-testing floor -- parked as noise, not a lead.
- **Insight:** faed's striking lag-253 autocorrelation peak (z~3.8) has no literal repeated substring behind it and sits at the Bonferroni significance floor -- it is a multiple-testing artefact, not a real period.

<a id="t-ledger-autocorrelation-freqnull-dbbi"></a>
#### Autocorrelation of dbbi with a frequency-preserving null
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** dbbi. Tested lag-7 and its harmonics (14/21/28) against a shuffled null model that preserves the letter histogram.
- **Method:** Searched for a repeating structure by measuring autocorrelation at lag 7 and harmonics, comparing against a histogram-preserving shuffle so that the b/e skew could not fake a signal.
- **Output:** lag-7 only z~1.95 with no harmonics at 14/21/28 -- weak, and mostly explained by the b/e skew.
- **Insight:** The apparent lag-7 periodicity in dbbi is statistically weak (z~1.95) with no supporting harmonics, and is attributable to the b/e frequency skew rather than a real 7-period structure.

<a id="t-ledger-column-ic-period-detection-dbbi"></a>
#### Column-IC period detection on dbbi, periods 1-30
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** dbbi. Per-column Index of Coincidence measured for periods 1-30, compared against the whole-string IC of 0.151.
- **Method:** Looked for a polyalphabetic period by checking whether splitting dbbi into N columns raises the per-column IC above the flat 0.151, which would betray a Vigenere period.
- **Output:** No reliable period -- the apparent spikes at period 13/26/29 are small-sample artefacts (only 3-7 symbols per column).
- **Insight:** The period-13/26/29 IC 'spikes' are statistical artefacts of tiny per-column samples, not a real cipher period -- a false lead that future solvers can safely ignore.

<a id="t-ledger-compression-fileformat-probe-dbbi"></a>
#### Compression / file-format magic probe on dbbi-as-bytes
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** dbbi mapped to bytes under 4 byte-mappings. Checked for gzip/zlib/bzip2/xz/zip/OpenSSL magic headers; every decompressor tried.
- **Method:** Tested whether dbbi is actually a packaged/compressed file by scanning four byte-interpretations for known file-format magic bytes and attempting every standard decompressor.
- **Output:** No magic header, nothing decompresses. Byte-entropy 5.0-5.25 out of 8 -- structured, but not a packaged file.
- **Insight:** dbbi's byte entropy of 5.0-5.25/8 shows it is structured (non-random) yet is provably not any standard compressed/packaged file format.

<a id="t-ledger-couplet-bigram-tokenisation-dbbi"></a>
#### Couplet / bigram tokenisation of dbbi (split on 'be')
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi. The bigram 'be' is over-represented (~2.3 sigma). Split dbbi on every 'be' into fields and decoded the fields as the primes.
- **Method:** Because 'be' appears far more often than chance (~2.3 sigma), they hypothesized it is a delimiter, split dbbi on it, and decoded the resulting fields, hoping they would read as a list of primes.
- **Output:** Irregular fields whose values look nothing like primes -- tokenisation negative.

<a id="t-ledger-format-alignment-check-faed"></a>
#### Format & alignment check on faed
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** faed. Tested for a Salted__ OpenSSL header, 16-byte block alignment, and compressed-format magic.
- **Method:** Checked whether faed is itself a packaged ciphertext or file: looked for the OpenSSL 'Salted__' prefix, AES 16-byte block alignment, and known compression magic bytes.
- **Output:** Not OpenSSL-AES, not block-aligned, not a known compressed format -- statistically a high-entropy value/key.
- **Insight:** faed is not an OpenSSL/AES blob, not 16-byte block-aligned, and not a known compressed format -- statistically it behaves as a high-entropy value or key, not a container.

<a id="t-ledger-ic-invariance-battery-faed"></a>
#### IC-invariance battery on faed
💡 **Verified — new insight** · community · *dead-end ledger*

- **Input:** faed (570 symbols). IC measured under candidate substitutions, transpositions, and polyalphabetic periods 1-30.
- **Method:** Measured the Index of Coincidence of faed across many candidate transforms to decide whether it could be enciphered natural-language English, which would show an elevated IC.
- **Output:** IC stays ~0.118 (random) under all transforms -- decisively rules out faed being enciphered English.
- **Insight:** faed's IC pins at ~0.118 (random) under all substitutions/transpositions/periods 1-30, decisively proving faed is NOT enciphered English text -- it is high-entropy value/key data.

### substitution

<a id="t-ledger-yinyang-complement-chained-zeroing"></a>
#### Yin-yang complement chained with prime zeroing
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Yin-yang complement applied first, then zero/insert operations at prime positions, in orders not previously tried.
- **Method:** Combined the duality complement with the prime 'zero out' instruction, sequencing them (complement -> then zero/insert at primes) in fresh permutations to cover orderings the earlier standalone tests missed.
- **Output:** Fail.

<a id="t-ledger-yinyang-complement-standalone"></a>
#### Yin-yang complement substitution (a<->i, b<->h, c<->g, d<->f, e fixed)
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi and faed. Mapping: a<->i, b<->h, c<->g, d<->f, e fixed (the duality/complement map).
- **Method:** Applied the yin-yang duality complement (each symbol swapped with its mirror around the center 'e') standalone, on the theory that 'yinyang' literally means apply the complement to the blocks.
- **Output:** Fail.

### transposition

<a id="t-ledger-columnar-transposition-grid-factorisations"></a>
#### Columnar transposition over grid factorisations of dbbi and faed
❌ **Verified fail** · community · *dead-end ledger*

- **Input:** dbbi as 7x13 and 13x7; faed as 19x30, 30x19, 10x57, 6x95 and other factor pairs. Read orders: row, column, diagonal, spiral, boustrophedon.
- **Method:** Since 91=7x13 and 570=2x3x5x19 factor cleanly, they laid each block out as a rectangle and re-read it in every standard transposition order, looking for a reading that produces text.
- **Output:** Garbage in every reading.

### blob combination

<a id="t-blob-3salt-2salt-subset-keys"></a>
#### 3-salt and 2-salt subset concatenations as key material
❌ **Verified fail** · this project · *this session*

- **Input:** All ordered 3-permutations (24-byte) and 2-permutations (16-byte) of the same four salts, used as EVP passphrase (raw and hex) on each of the 4 blobs.
- **Method:** Same scattered-key hypothesis but allowing that only some salts form the key. Subset concatenations were fed as EVP_BytesToKey passphrases (raw bytes and hex string) and, where length permitted, as direct key material against every blob.
- **Output:** No readable plaintext on any blob. Subset salt concatenations are also random and carry no usable key structure.

<a id="t-blob-ciphertext-concatenation-decrypt"></a>
#### Concatenate all four ciphertexts and decrypt as one blob
❌ **Verified fail** · this project · *this session*

- **Input:** All 24 orderings of the 4 ciphertexts joined into one byte stream, decrypted using each blob's own salt plus chain keys (eb3efb51..., 250f3772..., 89727c59...) and token keys (thispassword, yinyang).
- **Method:** Tests the literal reading that the blobs are fragments of one larger ciphertext that was split and scattered. Every permutation of the four ciphertexts was concatenated and run through EVP decryption under each candidate salt and key.
- **Output:** No ordering decrypted to printable text. Concatenated ciphertexts do not form one coherent cipher under any salt/key tried.

<a id="t-blob-cross-keying-ct-as-key"></a>
#### Cross-blob keying — one blob's ciphertext used as the key for another
❌ **Verified fail** · this project · *this session*

- **Input:** For every ordered pair (src, dst) of the 4 blobs: src's ciphertext in forms ct-sha=sha256(ct), ct-shahex, ct-first32=ct[:32], ct-b64=base64(ct), used as the passphrase/key for dst.
- **Method:** Hypothesis that the blobs chain — decrypting one yields the key to the next. Each source blob's raw ciphertext (and several derived forms) was used as the EVP passphrase, and the 32-byte forms also as a direct AES key with zero IV, against every other blob.
- **Output:** No cross-pair decryption produced readable text. There is no observable chaining: no blob's ciphertext keys any other blob.

<a id="t-blob-value-combos-cross-type"></a>
#### Cross-type value pairs (every token x every sum/salt/number/phrase)
❌ **Verified fail** · this project · *this session*

- **Input:** Every token x every {sum, salt, number, phrase}, both orders, separators in {'', '+', '_'}, hashed in four conventions, tested vs all 4 blobs. Total across the value sweep ~35,000 combinations.
- **Method:** Broadens the combination hypothesis across categories — e.g. a token joined to a number or a salt. Each cross-type pair in both orders and three separators was hashed four ways and used as an EVP passphrase against every blob, with explicit logging of any key opening >=2 blobs.
- **Output:** No cross-type pair produced readable plaintext on any blob. Every apparent PKCS7-valid result was chance noise.

<a id="t-blob-independence-conclusion"></a>
#### Decisive conclusion: the four blobs are cryptographically independent containers
💡 **Verified — new insight** · this project · *this session*

- **Input:** Synthesis of all blob-combination negatives: no shared 16-byte blocks, random 80B-XOR (printable 0.48), random salt-concat, no multi-blob key (4 chance events), no cross-keying, no ciphertext-concat decrypt.
- **Method:** The combined structural evidence was evaluated against the 'one scattered AES' hypothesis. Each blob is standard OpenSSL aes-256-cbc -md sha256 with its OWN random 8-byte salt, so each requires its OWN passphrase; the connection between blobs is at the key-derivation/narrative layer (shared ingredients feeding different blobs), not at the ciphertext/salt layer.
- **Output:** The four blobs are provably independent — NOT fragments of one cipher. Mixing the blobs or their salts unlocks nothing; the path forward is each blob's individual passphrase (cosmic via yellowblueprimes/yinyang, salph_inner via enter/thispassword/first-hint, p32_trailing via the chess construction, urlblob via its provenance).
- **Insight:** The four AES blobs are cryptographically independent containers (own random salts, no shared structure), so the puzzle's linkage lives in key-derivation/narrative, not in combining the blobs.

<a id="t-blob-4salts-as-aes256-key-all-orderings"></a>
#### Four 8-byte salts concatenated into a 32-byte AES-256 key, all orderings, direct + EVP
❌ **Verified fail** · this project · *this session*

- **Input:** The 4 OpenSSL salts: cosmic=2d3f6fe06dc950e6, salph_inner=3ab585348552415d, p32_trailing=b45a5e3d827593ca, urlblob=74c974e3f92e64b5. Concatenated 8+8+8+8 = 32 bytes, tried in all 24 permutations against all 4 blobs.
- **Method:** Hypothesis: the four blobs are one 'scattered' AES message and the four salts are really the 256-bit key split four ways. Each 32-byte ordering was used (a) as a DIRECT AES-256-CBC key with IV in {all-zero, salt||salt, key[:16]}, (b) as an EVP_BytesToKey raw passphrase, (c) as a hex-string passphrase, and (d) as sha256(key) — on every blob. About 1008 tests.
- **Output:** No decrypt produced printable text (printable ratio gate >0.85 never met). The 4 concatenated salts are random bytes with no ASCII/base58/word structure and are not a usable key on any blob.

<a id="t-blob-multi-blob-detection-scattered-signature"></a>
#### Multi-blob detection — explicit search for any key opening >=2 blobs
💡 **Verified — new insight** · this project · *this session*

- **Input:** Across the full ~35,000-combination value sweep, each candidate hashed {sha256hex, literal, raw-sha256, double-sha256} and tested against all 4 blobs, flagging any key that yields PKCS7-valid output on 2 or more blobs.
- **Method:** A key that opens two-plus blobs would be the unmistakable signature of one scattered AES message. The harness logged every multi-blob event and scored its plaintext for readability rather than relying on PKCS7 alone.
- **Output:** Exactly 4 multi-blob PKCS7 events occurred — ALL chance noise (printable 0.30-0.49, i.e. random bytes), and ~3 such events are statistically expected at this test volume. No candidate opened any blob to readable text.
- **Insight:** The ~4 keys that PKCS7-validated on >=2 blobs were all random-byte noise (printable 0.30-0.49) at the chance-expected rate, so no single key unlocks multiple blobs.

<a id="t-blob-repeated-block-shared-block-scan"></a>
#### Repeated-block / shared 16-byte ciphertext block scan across all blobs
💡 **Verified — new insight** · this project · *this session*

- **Input:** All 16-byte ciphertext blocks of cosmic (83), salph_inner (5), p32_trailing (5), urlblob (6), compared within and across blobs.
- **Method:** In CBC, identical plaintext blocks under the same key/IV produce identical ciphertext blocks; a shared message scattered across blobs would likely leave repeated blocks. Every 16-byte block was hashed and compared within each blob and across all pairs.
- **Output:** No 16-byte ciphertext block is shared across any pair of blobs (and no telling internal repeats). The blobs do not encrypt the same plaintext under the same key/IV.
- **Insight:** No 16-byte ciphertext block is shared across any blob pair, decisively ruling out a single scattered plaintext encrypted under a common key/IV.

<a id="t-blob-salt-math-xor-sum-sha"></a>
#### Salt arithmetic (XOR / byte-sum / sha256-of-concat) as a derived key
❌ **Verified fail** · this project · *this session*

- **Input:** xor4 = byte-wise XOR of all 4 salts (8 bytes); sum4 = byte-sum mod 256 of the 4 salts (8 bytes); sha-concat4 = sha256(salt_cosmic||salt_salph||salt_p32||salt_url) (32 bytes). Tested on all 4 blobs.
- **Method:** If a single key were hidden across the salts via a simple combiner, recovering it might need XOR, modular sum, or hashing the concatenation. Each derived value was used as an EVP passphrase (raw and hex), and the 32-byte sha form additionally as a direct AES key with zero IV, on every blob.
- **Output:** No blob decrypted to printable text under any of the three salt-math derivations. Salt math yields random keys.

<a id="t-blob-four-ingredients-plus-enter-thispassword"></a>
#### The 4 narrative ingredients combined with enter/thispassword, all orders
❌ **Verified fail** · this project · *this session*

- **Input:** The 4 ingredients {yellowblueprimes, matrixsumlist (concat 610876654997879+8108108736759668 and arithmetic sum 8718985391757547), lastwordsbeforearchichoice, yinyang} in all 24 orders, each crossed with {none, enter, thispassword, both}, separators {'', '.', ' ', '+'}.
- **Method:** Directly encodes the SalPhaseIon master-hint recipe (the four named ingredients plus the 'enter/thispassword' framing) as a passphrase. Each ordering+suffix+separator was hashed (sha256, double-sha) and tested as the EVP passphrase against cosmic, salph_inner, and p32_trailing.
- **Output:** No ordering or suffix combination decrypted any blob to readable text. The plain recipe-concatenation does not derive any blob's passphrase.

<a id="t-urlblob-4th-orphaned-blob-salt-74c974e3"></a>
#### The urlblob — 4th orphaned OpenSSL blob (salt 74c974e3) located in a gsmg.io URL path
💡 **Verified — new insight** · this project · *this session (Wayback CDX hex URL + urlblob.bin)*

- **Input:** A hex-encoded Salted__ blob found as a literal gsmg.io URL path in the CDX: gsmg.io/53616c7465645f5f74c974e3f92e64b5…0607 (captured 2026-02-07, returns the SPA shell). Decoded to urlblob.bin (112 bytes total) = magic 'Salted__' + salt 74c974e3f92e64b5 + 96-byte ciphertext (6 AES blocks). This is the FOURTH distinct OpenSSL blob, alongside cosmic (2d3f6fe0…), salph_inner (3ab58534…) and p32_trailing (b45a5e3d…).
- **Method:** Spotted a long hex string used as a URL path in the Wayback CDX, recognized its prefix 53616c7465645f5f as ASCII 'Salted__' (the OpenSSL enc magic), and hex-decoded it to recover a complete fourth AES-256-CBC blob with its own random salt. Reasoning: a self-contained 96-byte blob would be an instantly-verifiable oracle (a correct key yields ≤95 readable bytes), so it was worth cataloguing and adding to the candidate-key sweeps.
- **Output:** Recovered urlblob.bin: salt 74c974e3f92e64b5, 96-byte ciphertext. It is a genuine standalone OpenSSL blob but is orphaned — provenance is only a community-posted URL path (the page itself returns the empty SPA shell), and no tested key decrypts it. Structural analysis (BLOB-COMBINATION) confirms it shares no ciphertext blocks with the other three blobs, so it is an independent container, not a fragment of cosmic.
- **Insight:** A fourth, previously-uncatalogued OpenSSL blob exists (salt 74c974e3f92e64b5, 96-byte ct) recovered by hex-decoding a 'Salted__' gsmg.io URL path; it is a real but orphaned, independent container that no tested key opens.

<a id="t-blob-value-combos-within-type"></a>
#### Within-type value combinations (tokens, sums+salts, numbers) as passphrases
❌ **Verified fail** · this project · *this session*

- **Input:** 2- and 3-permutations within each type: TOKENS {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang, enter, thispassword}; SUMS+SALTS; NUMBERS {11110,140,104,91,570,23,16,7,1141,2357,42}; SALTS.
- **Method:** Tests that the answer is two or three same-category loose ends combined. Each within-type permutation was joined (separators '', '+', '_'), hashed in four conventions {sha256hex, literal, raw-sha256, double-sha256}, and tested as a passphrase against all 4 blobs.
- **Output:** No within-type combination opened any blob to readable text. Part of the ~35,000-combination sweep that produced zero real hits.

<a id="t-blob-xor-of-n-sha256-hashes"></a>
#### XOR of N sha256 token-hashes as a 32-byte key (issue #56 style)
❌ **Verified fail** · this project · *this session*

- **Input:** XOR of sha256 of N tokens for N=4..8 drawn from {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang, thispassword, enter, sha256, itsinfront..., 8718985391757547, shabef}; the 32-byte XOR used as EVP raw/hex passphrase and as a direct key (IV=zero and IV=salt||0).
- **Method:** Implements the community 'XOR the hashes together' idea: hash each chosen token, XOR the digests into one 256-bit value, and use it as the key. Every N-combination's XOR was tested in four key roles against the three open blobs.
- **Output:** No XOR-of-hashes key produced readable plaintext on any blob. The XOR-combiner hypothesis yields random keys.

<a id="t-blob-xor-two-80byte-blobs"></a>
#### XOR of the two equal-size 80-byte blobs (salph_inner xor p32_trailing)
💡 **Verified — new insight** · this project · *this session*

- **Input:** salph_inner ciphertext (80 bytes, salt 3ab585348552415d) XOR p32_trailing ciphertext (80 bytes, salt b45a5e3d827593ca).
- **Method:** If two blobs encrypted the same plaintext under the same keystream (e.g. key/IV reuse), their XOR would cancel the keystream and expose plaintext-XOR-plaintext structure. The two only equal-length blobs were XORed byte-for-byte and the result scored for printability.
- **Output:** Result is high-entropy garbage (printable ratio 0.48). No shared keystream or plaintext — confirms the two blobs are independently keyed.
- **Insight:** The two 80-byte blobs share no keystream/plaintext (XOR printable 0.48), proving they were not encrypted with a reused key/IV.

### creator-hint decoding

<a id="t-hint-image-decoding-primes-fefefe-doors-toe"></a>
#### Hint-image / creator-hint decoding — primes 2,3,5,7, 'zero out', fefefe=101010, 'another door', 'theory of everything'
💡 **Verified — new insight** · this project · *this session (hints/ images + creator Telegram timeline)*

- **Input:** The creator's hint images and Telegram timeline (saved as hints/ + the mh_top/mh_bot/mh_last PNGs). Key extracted statements: 2021-03-01 'which primes 2,3,5,7 we need use' / 'You are at THE PRIME PART already???' / 'too many combinations'; 2021-03-01b 'fefefe is 101010 … if you know how the array is indexed'; 2021-12-25 'prime numbers required to proceed … some characters need to be zeroed out'; 2020-08-02 / 2021-12-02 / 2021-12-25 'there is ANOTHER DOOR' (nobody found) and 'the second half [faed] will probably be used for ANOTHER PUZZLE, or not at all'; 2020-01-14 'Yellow has a number and so does Blue'; 2023 'the theory of everything is also still a valid path' / 'a prime number is very important'.
- **Method:** Transcribed and cross-referenced the full creator hint timeline (images + Telegram) to extract the precise operational instructions for the endgame rather than treating them as flavor. Reasoning: these hints name the exact mechanism — primes {2,3,5,7}, 'zero out characters', the binary rule fefefe=101010 (so the per-symbol bit map f=1/e=0), an unfound 'another door', and an alternate 'theory of everything' path — so pinning the verbatim wording is what makes the dbbi/faed and yinyang attacks targetable.
- **Output:** Compiled the verbatim instruction set: primes 2,3,5,7 are 'the prime part'; certain characters must be 'zeroed out'; fefefe=101010 establishes the binary digit map and ties to 'how the array is indexed'; an unfound 'another door' exists; faed may be a separate puzzle entirely; 'theory of everything' is a named alternate path; 'a prime number is very important'. These guided (but did not solve) every dbbi/faed prime/zero-out attack; no decode tested against them produced text.
- **Insight:** The creator's own hints precisely specify the endgame mechanism — primes {2,3,5,7} ('the prime part'), 'zero out' certain characters, fefefe=101010 as the per-symbol binary/array-index rule, an unfound 'another door', faed possibly being a separate puzzle, and 'theory of everything' as a named alternate path.

### dbbi as key

<a id="t-dbbi-as-number-passphrase"></a>
#### dbbi numeric / binary derived values as AES passphrases against all blobs
❌ **Verified fail** · this project · *this session*

- **Input:** Values derived from dbbi: the big decimal (a-i->1-9 concatenation), the prime->0 bitstream as bytes/hex/decimal/inverted, hex(int(bits)), field-decode int->hex string; each tested as literal, sha256hex, raw-sha256 and double-sha passphrase plus raw-byte passphrases, vs cosmic/salph_inner/p32_trailing.
- **Method:** Test the hypothesis that dbbi's decoded value IS the yellowblueprimes/yinyang key - feed its numeric and binary forms directly as the AES passphrase (in every standard KDF form) to the three open blobs, watching for a valid PKCS7 + readable plaintext.
- **Output:** Zero valid PKCS7-with-text hits on any blob; the dbbi-derived bytes are NOT a blob key (also confirmed not the private key against the prize address across ~17 scalar forms).

### dbbi as number

<a id="t-dbbi-base81-pairs"></a>
#### dbbi adjacent symbol pairs as base-81 digits
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi; adjacent symbol pairs (9x9=81 combinations) read as base-81 digits.
- **Method:** Since each symbol is base-9, a pair is a base-81 digit; read consecutive pairs as a base-81 number / byte stream to see if a coarser radix reveals structure.
- **Output:** Garbage.

<a id="t-dbbi-primality-factoring"></a>
#### Primality and factoring of dbbi as a number
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi read as a single number in base-9 and base-10.
- **Method:** If the 'prime number is very important' hint points at dbbi itself, the number might be prime or factor into meaningful primes. Tested primality and factored it in both bases.
- **Output:** Not prime. base-9 factors = 5*11*53; base-10 factors with only small factor 5. Carries no obvious key.

### dbbi binary decode

<a id="t-dbbi-binary-prime-value-map"></a>
#### fefefe=101010 prime-value binary map (prime->0 else->1), flat 7/8-bit + all subsets/polarities
💡 **Verified — new insight** · this project · *this session*

- **Input:** dbbi (91 symbols); creator rule 'fefefe is 101010' verified: f(6)->1, e(5)->0, i.e. symbol whose a1z26 value is prime {2,3,5,7}->0 else ->1, giving a 91-bit string. Swept all subsets of {2,3,5,7} as the zero-set, both polarities, widths 7 and 8, plus rules even/odd/>=5/f-only.
- **Method:** Map each symbol to one bit per the creator's confirmed fefefe rule, producing a 91-bit stream, then chop into 7- or 8-bit chars to read ASCII. Try every variant of which prime values become 0 and both inversions, since the creator said 'if you know how the array is indexed'.
- **Output:** All readings noise; the fefefe sanity check confirmed 'fefefe'->'101010' correctly, but no width/subset/polarity produced readable text. Note: 91 bits holds at most 13 chars (8-bit) - mathematically too little to encode the 16-char 'yellowblueprimes'.
- **Insight:** The fefefe binary rule is byte-exactly correct (fefefe->101010) but 91 bits caps the payload at ~13 chars, so dbbi cannot itself contain the literal 16-char word - it must yield a computed number.

<a id="t-dbbi-grid-reindex-binary"></a>
#### Grid reindex (7x13 / 13x7 rows/cols/diag/spiral/boustrophedon) then prime-value binary
❌ **Verified fail** · this project · *this session*

- **Input:** dbbi as 7x13 and 13x7 grids; reading orders rows, cols, rows_rev, cols_rev, transpose, boustrophedon, diagonal, spiral_cw, spiral_ccw; each then mapped via 5 bit-rules (prime0, prime1, even1, odd1, ge5) x reverse x widths 7/8 x lsb/msb.
- **Method:** Honor the creator's 'if you know how the array is indexed' hint by re-ordering the 91 symbols along every plausible 2D path before applying the binary rule and reading ASCII. Each resulting candidate string also tested as a passphrase against the cosmic, salph_inner and p32_trailing blobs.
- **Output:** Every reading was noise (no printable-text candidate scored above chance); zero of the candidate strings opened any blob to readable plaintext (BLOB HITS: 0).

<a id="t-dbbi-matrixsumlist-104-mask"></a>
#### matrixsumlist 104-bit string as a select/XOR mask over dbbi binary
❌ **Verified fail** · this project · *this session*

- **Input:** dbbi prime-value bitstream (91 bits, both polarities); MSL = ASCII bits of the literal word 'matrixsumlist' (104 bits). Operations: XOR MSL (repeated) onto the dbbi bits; select dbbi symbols where the 104-bit 'a/b' mask is 1 vs 0 (using first 91 of 104); widths 7/8.
- **Method:** matrixsumlist physically SITS BETWEEN dbbi and faed in the soup and is 104 bits, matching the '104 is the fefefe square' hint - so test it as the 'array index'/mask that selects or XORs exactly the dbbi characters to keep or zero. Re-decode the masked/XORed bits and also test outputs as blob keys.
- **Output:** All noise; no readable text and zero blob hits. The mask-over-dbbi interpretation does not fire.

### dbbi bitmap

<a id="t-dbbi-bitmap-render"></a>
#### Bitmap rendering of dbbi (prime-value bits on 7x13/13x7 grids)
❌ **Verified fail** · this project · *this session*

- **Input:** dbbi prime-value bitstream laid out on 7x13 and 13x7 grids, both polarities; rendered to PNG (dbbimap_prime0_7x13.png, dbbimap_prime0_13x7.png, dbbimap_prime1_*.png).
- **Method:** If dbbi encodes a glyph (a yin-yang symbol, a QR-like mark, letters), the prime-value bits drawn as black/white pixels on the correct grid should show it. Rendered all four grid/polarity combinations as images for visual inspection.
- **Output:** No glyph, no yin-yang, no letterforms - the bitmaps are visually meaningless noise (consistent with the turtle/path-draw render in the ledger that also produced only a direction-biased blob).

### dbbi decode

<a id="t-dbbi-transposition-times-substitution"></a>
#### All transposition layouts x all 9! substitutions of dbbi (3.27M decodes)
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi (91 symbols); 9 transposition layouts (7x13 / 13x7 grids read as rows/cols/diagonals/spiral/boustrophedon) x every 9! substitution = 3,265,920 decodes.
- **Method:** Combine the two classical attacks: first re-order the symbols by a transposition path, then try every monoalphabetic substitution on the re-ordered string, then field-decode and score. Covers the case where dbbi is a transposed AND substituted cipher.
- **Output:** Zero produced English across all 3,265,920 decodes - garbage everywhere.

<a id="t-dbbi-field-decode-int-hex-ascii"></a>
#### Direct field-decode of dbbi (a-i -> 1-9 -> big integer -> hex -> ASCII)
❌ **Verified fail** · this project · *this session*

- **Input:** The 91-symbol dbbi string 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe' (alphabet a-i, no 'o'); mapping a=1..i=9.
- **Method:** Applied the verified 'house' field-decode that solved the soup's z-fields (agda, cfob, shabef): substitute each letter for its 1-9 digit, read the whole string as one decimal integer, convert to hexadecimal, then to ASCII bytes. The reasoning: if dbbi were a word like the other chunks, this exact method would reveal it.
- **Output:** Garbage. dbbi contains NO 'o' (=0), so unlike the word-chunks it cannot field-decode to any text containing a zero digit; the resulting bytes were non-printable. Baseline 'plain' decode scored far below readable.

<a id="t-dbbi-all-9factorial-substitutions"></a>
#### Exhaustive sweep of all 362,880 (9!) symbol->digit permutations of dbbi field-decode
💡 **Verified — new insight** · this project · *this session*

- **Input:** dbbi (91 symbols); every one of the 9! = 362,880 bijections from {a..i} to a 9-digit alphabet, run for BOTH digit ranges 0-8 and 1-9 (725,760 total decodes), each field-decoded to bytes and scored for printability/English.
- **Method:** Rather than guess the symbol->digit mapping, brute-force ALL of them. For each of the 362,880 permutations, build the integer, convert to hex/ASCII, and score the result for printable ratio and dictionary words. If dbbi were monoalphabetically enciphered text, exactly one permutation would surface readable English.
- **Output:** ALL 362,880 (and the full 725,760 with both digit ranges) scored as garbage; max printable ~0.74, max meaningful-English 0.52 - i.e. pure chance, no permutation yields text. This is the decisive proof that dbbi is NOT monoalphabetic text under field-decode.
- **Insight:** The full 9! brute force proves dbbi is not a substitution-enciphered word: no symbol->digit mapping makes it readable, so its payload must be numeric/binary, not text.

<a id="t-kdf-variations-on-cosmic"></a>
#### Non-standard KDFs (MD5/SHA-1/SHA-512 EVP, PBKDF2) on cosmic + small blobs with top keys
❌ **Verified fail** · this project · *this session*

- **Input:** Top candidate keys (the 4-ingredient master string, the soup-4 concat matrixsumlistenterlastwordsbeforearchichoicethispassword, thispassword, yinyang, yellowblueprimes, causality, thematrixhasyou) x {literal, sha256hex} x blobs {cosmic, salph_inner, p32_trailing}. KDFs: EVP-MD5, EVP-SHA1, EVP-SHA512, and PBKDF2-SHA256 with {1, 1000, 10000} iterations.
- **Method:** The whole verified chain uses OpenSSL EVP_BytesToKey with SHA-256, but a wrong KDF assumption would make even a correct passphrase fail. berserk1.py re-derived key+IV under alternative message-digests and PBKDF2 to rule out a KDF mismatch, scoring any plaintext for >0.85 printability.
- **Output:** 0 readable decrypts. Cosmic and the small blobs use standard SHA-256 EVP, matching the rest of the chain; no KDF variant unlocks anything.

<a id="t-dbbi-search-literal-yellowblueprimes"></a>
#### Search dbbi for the literal string 'yellowblueprimes' in any base
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi; target substring 'yellowblueprimes' encoded in any base representation.
- **Method:** Directly test whether dbbi simply contains the word it is hypothesized to hold, by encoding 'yellowblueprimes' in each base and searching dbbi's representations.
- **Output:** Absent in every base - dbbi does not literally contain the word.

### dbbi exotic transforms

<a id="t-dbbi-ebcdic-vic-transforms"></a>
#### EBCDIC (cp1141 family), VIC checkerboard, genesis-spiral transforms on dbbi
❌ **Verified fail** · this project · *this session*

- **Input:** dbbi field-decoded bytes (digit maps 0-8 and 1-9) decoded through EBCDIC codecs cp500/cp037/cp1140/cp1026/cp273/cp424/cp875 (cp1141 unavailable in Python, nearest German/Intl pages used); the Phase-3.2 VIC alphabet FUBCDORA.LETHINGKYMVPS.JQZXW as a monoalphabetic key; the genesis matrix.js CCW spiral path as the reindexer.
- **Method:** Re-apply the exact transforms that worked elsewhere in the chain: EBCDIC cp1141 + Beaufort cracked Phase-3.2, and the VIC alphabet decoded its digit block - so run dbbi's bytes through EBCDIC code pages and its symbols through the VIC permutation and the genesis spiral, on the theory the same machinery is reused.
- **Output:** Garbage under every code page, the VIC alphabet, and the spiral reindex; outputs fed to the blob oracle produced zero hits. Both EBCDIC and VIC/book-cipher readings of dbbi eliminated.

### dbbi polyalphabetic

<a id="t-dbbi-vigenere-beaufort-brute"></a>
#### Vigenere / Beaufort brute force on dbbi, periods 1-6
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi; 597,870 keys x both directions (Vigenere add and Beaufort), periods 1 through 6, each followed by field-decode and English scoring.
- **Method:** Treat dbbi as polyalphabetically enciphered and brute every short key, including using the INCASE/VIC checkerboard ordering and matrixsumlist/genesis-URL/cell-stream as keys, to recover plaintext.
- **Output:** Zero English across ~600k keys; control with a known-good text scored 0.95 while dbbi readings stayed <=0.43.

### dbbi statistical

<a id="t-dbbi-compression-fileformat-probe"></a>
#### Compression / file-format magic-header probe on dbbi-as-bytes
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi mapped to bytes under 4 byte-mappings; checked for gzip/zlib/bzip2/xz/zip/OpenSSL 'Salted__' magic and run through every decompressor.
- **Method:** Test whether dbbi is a packaged/compressed file rather than text or cipher, by scanning for known magic headers in several byte interpretations and attempting decompression.
- **Output:** No magic header found and nothing decompresses; byte-entropy 5.0-5.25/8 indicates structured-but-not-packaged data.

<a id="t-dbbi-symbol-frequency-analysis"></a>
#### Symbol-frequency / bigram analysis of dbbi (b,e dominant; 'be' couplet)
💡 **Verified — new insight** · this project · *dead-end ledger*

- **Input:** dbbi 91-symbol frequency table (b and e together ~47%); bigram 'be' over-represented (~2.3 sigma); whole-string IC = 0.151; per-column IC for periods 1-30; autocorrelation lags 7/14/21/28 and lag-7 vs a frequency-preserving null.
- **Method:** Statistically characterize dbbi: measure letter and bigram frequencies, index of coincidence, look for a Vigenere period via column-IC spikes, tokenize on the over-represented 'be' couplet, and test autocorrelation against a histogram-preserving shuffle to distinguish real periodicity from frequency skew.
- **Output:** b/e dominate and 'be' is a genuine ~2.3-sigma couplet, but split-on-'be' fields look nothing like primes; no reliable Vigenere period (period-13/26/29 'spikes' are 3-7-symbol small-sample artefacts); lag-7 autocorr only z~1.95 with no harmonics - mostly the b/e skew. dbbi is structured but not enciphered English.
- **Insight:** dbbi has real internal structure (b/e dominance, a ~2.3-sigma 'be' bigram, byte-entropy ~5.0-5.25/8) yet no cipher period or readable tokenization - it behaves like a structured numeric/key value, not enciphered text.

### dbbi zero-out

<a id="t-dbbi-zero-dominant-be"></a>
#### Remove / zero the dominant symbols b and e
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi; symbols b and e together make up ~47% of the 91 characters. Variants: delete b+e, or set them to 0, then re-decode.
- **Method:** Since b and e dominate the frequency table, test whether they are filler/spacer symbols to be stripped or zeroed, leaving a sparser payload that field-decodes to text.
- **Output:** Garbage.

<a id="t-dbbi-single-zero-insertion-sweep"></a>
#### Single zero-insertion at every position (and prime positions) then field-decode
❌ **Verified fail** · this project · *dead-end ledger*

- **Input:** dbbi (91 symbols); insert exactly one '0' at each of the 92 possible positions, and separately at each prime position, then field-decode.
- **Method:** Test the minimal version of the 'missing zero' hypothesis: maybe just one zero digit was removed. Insert a single 0 at every candidate slot and re-run the int->hex->ASCII decode, scoring each for readable text.
- **Output:** Garbage at every insertion point.

<a id="t-dbbi-zero-out-prime-schemes"></a>
#### Zero-out schemes (by prime value, by prime position, insert/replace) before field-decode
❌ **Verified fail** · this project · *this session*

- **Input:** dbbi (91 symbols). (A) zero symbols whose value is prime - all subsets of {b,c,e,g}=values{2,3,5,7}, plus each single symbol a-i; (B) zero at prime POSITIONS, 0-indexed and 1-indexed, replace vs insert a '0'; (C) zero only at positions {2,3,5,7} and combos; then field-decode each.
- **Method:** Act on the creator hints 'some characters need to be zeroed out' and 'reinsert the prime basics'. Force selected symbols to the digit 0 (the digit dbbi conspicuously lacks) - either by symbol value, by position, replacing or inserting - so the field-decode can land on text containing zeros, then convert int->hex->ASCII and score.
- **Output:** All garbage; top printable ~0.46. The creator's literal 'zero out'/'reinsert primes' instruction, cleanly tested across value/position/insert/replace variants, fails.

### faed forensics

<a id="t-faed-format-alignment-compression"></a>
#### faed format/alignment/compression probe (Salted__, block alignment, magic headers)
💡 **Verified — new insight** · this project · *this session*

- **Input:** faed-as-bytes in candidate byte-mappings. Checked for an OpenSSL 'Salted__' header, 16-byte AES block alignment, and gzip/zlib/bzip2/xz/zip compressed-file magic; attempted decompressors.
- **Method:** If faed were an encrypted file or a compressed container rather than a cipher of text, it would carry a recognizable header or align to a block boundary. This screens whether faed is a packaged binary artifact before spending effort on linguistic cipher attacks.
- **Output:** Not an OpenSSL-AES 'Salted__' blob, not 16-byte block-aligned, not any known compressed format; nothing decompresses. Statistically faed reads as a high-entropy value/key, consistent with the creator's 'may be for another puzzle, or not at all' remark.
- **Insight:** faed is not a Salted__ AES blob, not block-aligned, and not a compressed container -- combined with its random IC, it behaves like a standalone high-entropy value/key (matching the creator's note that the 'second half will probably be used for ANOTHER PUZZLE, or not at all').

### faed statistical analysis

<a id="t-faed-ic-near-random-118"></a>
#### faed Index of Coincidence ~0.118 (near-random) battery
💡 **Verified — new insight** · this project · *this session*

- **Input:** The 570-symbol faed string. Measured Index of Coincidence (IC) on the raw string and under candidate monoalphabetic substitutions, transpositions, and polyalphabetic periods 1-30.
- **Method:** If faed were enciphered natural-language English, its IC would be elevated (English ~0.066 on 26 letters; for a 9-symbol alphabet a substituted/transposed English text holds an IC well above uniform ~0.111). An IC pinned at the uniform-random floor across all periods proves no monoalphabetic/polyalphabetic English is hiding inside. This was run as the decisive screening test before deeper cipher work.
- **Output:** IC stays ~0.118 (uniform-random floor for 9 symbols) across all tested periods 1-30 -> decisively rules out faed being enciphered English.
- **Insight:** faed is statistically NOT enciphered English (IC ~0.118 = random for a 9-symbol alphabet across all periods 1-30); it behaves like a high-entropy value/key, not a substitution/transposition ciphertext.

### key sweep (calibration)

<a id="t-keysweep-pkcs7-chance-calibration"></a>
#### Calibration: PKCS7-valid-but-garbage at ~1/256 is chance, not a hit
💡 **Verified — new insight** · this project · *this session*

- **Input:** Across all of the above sweeps (token battery, harvested phrases, ~1.5M-word dictionary, 288 phase-3.2 answers, Matrix quotes, chain keys, page-hash) the detection threshold was: PKCS7 padding valid AND printable ratio > ~0.90 (English-word scoring for the strict harnesses). The combine/blob-combination work separately logged 4 multi-blob PKCS7 events out of ~35,000 combinations.
- **Method:** AES-CBC with a random key produces a structurally-valid PKCS7 pad by pure chance roughly 1 time in 256 (the last byte landing on 0x01 etc.), and those decrypts are still random bytes. Every sweep therefore treats 'PKCS7-valid' as NECESSARY but NOT sufficient, and only flags decrypts whose CONTENT is readable English/printable. This calibration is what distinguishes a real key-hit from background noise in a feedback-free search.
- **Output:** Every PKCS7-valid survivor in every sweep decrypted to garbage (printable ~0.30-0.59), exactly the ~1/256 chance rate expected. The 4 multi-blob PKCS7 coincidences in the combination work scored 0.30-0.49 (random) versus ~3 expected by chance -- confirming no key ever produced readable content. The bound holds: no open blob has been opened.
- **Insight:** PKCS7-valid-but-garbage decrypts occur at the chance rate (~1/256 per try, ~3 multi-blob coincidences expected over ~35k combinations), so padding-validity alone is meaningless and only readable-content scoring constitutes a hit -- which never occurred.

### key sweep (chain keys)

<a id="t-keysweep-chain-keys-reused"></a>
#### Reusing the verified phase chain keys as blob passphrases
❌ **Verified fail** · this project · *this session*

- **Input:** The already-verified per-phase AES keys reused as passphrases on the open blobs (sweep.py, chains.py, attack_double.py): phase3 key 1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5, phase3.2 key 250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c, sha256('causality') (phase2), plus chained/nested-hash combinations of the soup tokens (sha256(sha256hex(a)+b), progressive ingredient chains, double/triple-sha to depth 7). Each tested as literal, hex, raw, double, against cosmic / salph_inner / p32_trailing.
- **Method:** Some puzzle chains reuse the previous stage's key/answer as the next key, so each verified chain key (and hashes thereof) was used to derive AES keys for the open blobs. attack_double.py additionally checked whether any first-layer decrypt yields a fresh 'Salted__' header (double-encryption), which would chain into a second decrypt.
- **Output:** 0 readable decrypts and 0 nested 'Salted__' headers. No reused chain key opens any open blob; the blobs are not encrypted under a previous phase's key, and no layer-1 decrypt produced a second valid OpenSSL blob.

### key sweep (passphrase battery)

<a id="t-keysweep-full-english-dictionary-1p5m"></a>
#### Full ~370k-word English dictionary sweep (~1.5M decrypts)
❌ **Verified fail** · this project · *this session*

- **Input:** The entire ~370,000-entry English word list (words.txt). Each word tested in up to four forms (literal, sha256hex, raw-sha32, double-sha) against the open blobs, predominantly the two 80-byte oracle blobs salph_inner and p32_trailing (dictattack.py). Total on the order of ~1.5 million AES decrypt attempts.
- **Method:** A brute-force last resort taking the Architect's 'BRUTE FORCING MIGHT BE REQUIRED' literally: if the key is any ordinary English word, the 80-byte blobs (only 5 AES blocks) are cheap to test exhaustively. Each derived key decrypts the ciphertext; results are kept only if printable ratio exceeds 0.90 (a real English plaintext would score ~0.99).
- **Output:** 0 strong hits. The single best printable score across the whole dictionary was ~0.59 -- exactly what random bytes produce, i.e. pure chance, not a near-miss. No dictionary word is the passphrase for any open blob.

<a id="t-keysweep-harvested-plaintext-phrases"></a>
#### Harvested phrases from every decrypted plaintext + Architect speech + VIC sentence
❌ **Verified fail** · this project · *this session*

- **Input:** Every word (>=3 chars) and every normalized whole-line phrase harvested from the project's two write-ups (puzzlehunt.md, naddiseo.md) and from the recovered plaintexts: the full ~300-word Architect speech ('YOUR LIFE IS THE SUM OF A REMAINDER...CIAO BELLA O', including the misspellings WAISTING/THROPHIES/PRICES), the VIC sentence 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF...NEED FUNDS TO LIVE', plus memorable assembled phrases (reinsertingtheprimebasics, returntothesourcecodes, privatekeynote, hopeyouretheone, ciaobellao, hundredfourty, beautifulstrategicposition, etc.). Hundreds of candidates, each in many normalizations (upper/lower/alpha-only/alnum-only/no-space) and each tested as literal, sha256hex, raw-sha32, double-sha32, and sha-of-hex (attack_harvest.py, fullspeech.py, lens_attack.py).
- **Method:** The hypothesis is that the blob key is a phrase that already appears in plaintext the solver has decrypted (the puzzle is self-referential: earlier answers feed later keys). Every line/word was collapsed to a canonical form, hashed in the puzzle's standard ways, and used to derive the AES key for each blob; outputs were scored against an English-word list (not just printable) so a real plaintext would surface.
- **Output:** 0 readable decrypts across all three blobs. No phrase from the speech, the VIC sentence, or the write-ups produced English or a WIF; all PKCS7 survivors were garbage.

<a id="t-keysweep-matrix-reloaded-quotes"></a>
#### Matrix Reloaded Architect quotes as passphrases
❌ **Verified fail** · this project · *this session*

- **Input:** Canonical Matrix Reloaded Architect quotes (lens_attack.py): 'The problem is choice' / theproblemischoice, 'Choice. The problem is choice.', 'Ergo, vis-a-vis, concordantly', 'There are only two possible explanations', 'You are here because Zion is about to be destroyed', 'Your life is the sum of a remainder of an unbalanced equation', 'Denial is the most predictable of all human responses', 'Hope. It is the quintessential human delusion', 'The matrix is older than you know'. Each in multiple normalizations and as literal/sha256hex/raw-sha/double-sha against salph_inner and p32_trailing.
- **Method:** The phase-3.2 speech is a paraphrase of the Matrix Reloaded Architect monologue, so the canonical movie quotes (which the puzzle author clearly drew on) were tested as candidate blob keys, hashed in the puzzle's standard ways and scored for real dictionary words.
- **Output:** 0 readable decrypts. No Matrix Reloaded quote, in any normalization or hash form, opens either 80-byte blob.

<a id="t-keysweep-token-battery-named-tokens"></a>
#### Named-token passphrase battery against cosmic / salph_inner / p32_trailing
❌ **Verified fail** · this project · *this session*

- **Input:** A hand-curated battery of ~40 puzzle-vocabulary tokens (battery.py / finalbattery.py): the four soup tokens (thispassword, lastwordsbeforearchichoice, enter, matrixsumlist), the two unknown ingredient labels (yellowblueprimes, yinyang), causality, THEMATRIXHASYOU and case/whitespace variants, the SalPhaseIon entry string GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe, its hash 89727c59..., halfandbetterhalf/half/betterhalf, salphaseion/cosmicduality, freewill, thechoiceisanillusion, the four master-hint taunts, oneforonefourforone, fubcdking/oracle/queen, anstoo/shabef/fanstoo. Each tested in two forms (literal string AND its 64-char sha256-hex), plus raw-sha32, against all three blobs.
- **Method:** Each token is run through OpenSSL-equivalent EVP_BytesToKey(SHA-256) to derive the AES-256-CBC key+IV from the blob's own salt, the ciphertext is decrypted, PKCS7 padding checked, and the result scored for printable bytes. The reasoning: these are the only strings the puzzle ever names as 'passwords' or ingredients, so if a small blob's key is one of them a correct decrypt would be instantly readable (<=79 bytes).
- **Output:** 0 readable decrypts. The few PKCS7-valid results decrypted to high-entropy garbage (printable ratio ~0.30-0.49, i.e. random bytes). No token opened cosmic, salph_inner, or p32_trailing.

<a id="t-keysweep-page-hash-89727c59"></a>
#### SalPhaseIon page-hash 89727c59 as a blob passphrase
❌ **Verified fail** · this project · *this session*

- **Input:** The SalPhaseIon entry hash 89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32 = sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe') -- the URL path of the page that hosts cosmic. Tested as literal passphrase, as the pre-image string, and as sha256-of-the-hash, against cosmic / salph_inner / p32_trailing (battery.py, firsthint.py, lens2_salph.py, final_recipes.py).
- **Method:** The narrative 'our first hint is your last command' suggested the last OpenSSL pass used (the page hash that opened SalPhaseIon) might be the key to the next blob. The hash and its pre-image were hashed in the puzzle's conventions and used to derive the AES keys for the open blobs.
- **Output:** 0 readable decrypts. The page hash 89727c59... does not open cosmic or either 80-byte blob; it is purely the page URL, carrying no further key.

### on-chain forensics

<a id="t-brainwallet-sweep-sha256-phrase-to-privkey"></a>
#### Brainwallet sweep: sha256(puzzle phrase) used directly as a Bitcoin private key vs the three known GSMG addresses
❌ **Verified fail** · this project · *this session*

- **Input:** A pool of puzzle-vocabulary phrases: the 4 cosmic ingredients (yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice, yinyang) in all 24 orders x 3 separators (literal + numeric matrixsumlist '6108766549978798108108736759668'), the 6 soup tokens, the taunt phrases (wewontgiveawaythepassword, itsinfrontofyoureyesbutyourenotseeingit, verylaststepisatruegiveaway, promised), halfandbetterhalf / theprivatekeysbelongtohalfandbetterhalf, causality, thematrixhasyou, ciaobellao, the full 7-part phase-3.2 password, and the full master-hint string. Each phrase x {sha256, double-sha256, sha256(sha256hex), raw-bytes-if-64-hex}. Targets: prize 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe, split-off 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa, donation 1JK27jtvE1wS4VG9k7Zpo8wBufMbYwy3r8. Total 86,310 derivations.
- **Method:** A 'brainwallet' turns a memorable phrase into a Bitcoin key by hashing it; if the puzzle's answer were such a phrase, hashing it would reproduce one of the known GSMG addresses and instantly confirm the answer with no AES needed. Each candidate phrase was hashed (and double/nested-hashed) to a 32-byte scalar, used as a secp256k1 private key, and turned into both compressed and uncompressed P2PKH addresses (brain.py via coincurve), then compared against all three target addresses. This is the rare self-verifying oracle that needs no blob decrypt.
- **Output:** ZERO matches across all 86,310 derivations. No puzzle-vocabulary phrase hashes to any of the three GSMG addresses.

<a id="t-cosmic-txt-authenticity-archived-2023"></a>
#### cosmic.txt authenticity confirmed against the archived 2023 SalPhaseIon page
💡 **Verified — new insight** · this project · *this session (Wayback capture of gsmg.io/89727c59…, 2023-06-01)*

- **Input:** The local prize blob ciphertexts/cosmic.txt (OpenSSL Salted__ blob, salt 2d3f6fe06dc950e6, 1328-byte ciphertext, base64 begins U2FsdGVkX18tP2/g…) versus the archived SalPhaseIon page at gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32, captured 2023-06-01 at exactly 4592 bytes (the SalPhaseIon entry-hash = sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe') = 89727c59…).
- **Method:** Located the only REAL archived SalPhaseIon page (small 4592-byte capture, dated 2023, not the later SPA shell) and compared its embedded content to the working files used in this project. Reasoning: if the local cosmic blob and the soup match the page the creator actually published, then the dataset every attack runs against is authentic and complete — ruling out the possibility that we are attacking corrupted or fabricated ciphertext.
- **Output:** The 2023 archived page contains exactly this project's SalPhaseIon soup AND the cosmic AES blob beginning U2FsdGVkX18tP2/g… — byte-for-byte matching cosmic.txt. This confirms cosmic.txt is authentic creator-published data and the soup/blob inputs are complete and uncorrupted.
- **Insight:** The cosmic prize blob (salt 2d3f6fe06dc950e6, 1328B, U2FsdGVkX18tP2/g…) is provably authentic: it appears verbatim on the real 2023-archived SalPhaseIon page, so all cryptanalysis is running against genuine, complete data.

<a id="t-dbbi-faed-bytes-as-private-key"></a>
#### dbbi / faed decoded bytes tried directly as the secp256k1 private key
❌ **Verified fail** · this project · *this session*

- **Input:** The dbbi (91 base-9 symbols) and faed (570 base-9 symbols) blocks reduced to scalars via roughly 17 different forms (raw field-decode int, sha256 of the string, the binary-rule bitstream packed to bytes, base-9 integer, etc.).
- **Method:** Since dbbi/faed are the hypothesized homes of yellowblueprimes/yinyang, their decoded byte values were tested as a private key in ~17 scalar interpretations, each producing compressed and uncompressed P2PKH addresses compared against the three GSMG targets. Another would-be self-verifying oracle path.
- **Output:** No match for any of the ~17 scalar forms. dbbi/faed bytes are NOT the private key (and separately NOT a valid key for any of the AES blobs).

<a id="t-opreturn-50-messages-discovered"></a>
#### On-chain OP_RETURN layer: 50 distinct messages mined from the prize and split-off addresses
💡 **Verified — new insight** · this project · *on-chain*

- **Input:** All OP_RETURN outputs on prize 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe and split-off 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa (blockstream.info), 50 distinct payloads, mostly 546-sat solver dust.
- **Method:** Bitcoin transactions can carry short text in OP_RETURN outputs. Every OP_RETURN on the two funded GSMG addresses was harvested and catalogued, because this layer (never catalogued in any walkthrough) records years of community guesses and possibly creator hints. The messages were classified into thematic pointers, encoded payloads, solver addresses, and bravado.
- **Output:** A 50-message catalogue (opreturns.md) covering Matrix-theme tokens (redpill, iamtheone, leavethematrix, THEMATRIXHASYOU, ALPHANOISES=anagram of SALPHASEION), soup tokens, two encoded payloads, and several suggestive pointers. A genuinely un-mined record of community attempts and a few possible pointers.
- **Insight:** A previously-uncatalogued on-chain OP_RETURN layer of 50 messages exists on the GSMG addresses, recording years of solver dust plus a handful of suggestive pointer phrases.

<a id="t-opreturn-fromn0e-half-betterhalf-pi"></a>
#### OP_RETURN 'FromN0EHalfABetterHalfBuiltItBellaCiao1_1Pi...' as a combine hint / key
❌ **Verified fail** · this project · *on-chain*

- **Input:** OP_RETURN payload 'FromN0EHalfABetterHalfBuiltItBellaCiao1_1Pi36y7LJugXwFNDVjR1p8p5JoB7eN5zSZ' = 'From Neo, Half A Better Half Built It, Bella Ciao, 1_1, Pi, [30-char base58 tail]'.
- **Method:** This message ties the Architect's HALF/BETTER HALF + CIAO BELLA themes to two concrete numbers '1_1' and 'Pi' plus a base58 tail, making it the strongest candidate combine-operator hint. Its components (1_1 as ratio/underscore-concat, Pi as 3.14159/'theory of everything', the base58 tail) were tested as keys/combine operators against the blobs.
- **Output:** 0 hits vs cosmic / salph_inner / p32_trailing. The 1_1 / Pi combine idea and base58 tail did not open any blob.

<a id="t-opreturn-little-prince-quote"></a>
#### OP_RETURN 'itisonlywiththeheart...invisibletotheeye' (Little Prince) tested as a key
❌ **Verified fail** · this project · *on-chain*

- **Input:** OP_RETURN payload 'itisonlywiththeheartthatoneseesrightlywhatisessentialisinvisibletotheeye' and its short form 'whatisessentialisinvisibletotheeye'.
- **Method:** This Little Prince quote on-chain directly echoes the master-hint taunt 'its in front of your eyes but youre not seeing it', suggesting the answer is 'invisible/seen with the heart'. The full quote and short form were tested as passphrases (literal / sha forms) against the cosmic and small blobs.
- **Output:** 0 hits vs cosmic / salph_inner / p32_trailing. Suggestive as a thematic pointer but not a working key.

<a id="t-opreturn-soup-token-concat"></a>
#### OP_RETURN 'matrixsumlistenterlastwordsbeforearchichoicethispassword' (soup-4 concat) as a key
💡 **Verified — new insight** · this project · *on-chain*

- **Input:** OP_RETURN payload 'matrixsumlistenterlastwordsbeforearchichoicethispassword' — the four SOUP tokens concatenated in soup order (posted on BOTH addresses by multiple solvers). Also the related solver tokens yourlastcommand / secondanswer / yourlastcommandsecondanswer and 'fourfirsthintisyourlastcommand' / 'fanstoo'.
- **Method:** This is a community recipe attempt that uses the soup-order four tokens (including the 'unused' enter + thispassword), distinct from the master-hint four ingredients. It was tested as a passphrase in literal and sha forms against the AES blobs; the related solver tokens were also recorded as the origin of issue #56's (refuted) recipe.
- **Output:** 0 hits as a blob key in literal/sha forms. Confirmed these tokens (yourlastcommand, secondanswer) originated as solver dust on-chain, not creator hints — clarifying that issue #56's recipe was built from community-posted strings.
- **Insight:** Issue #56's recipe tokens (yourlastcommand, secondanswer) are provably solver dust posted on-chain, not creator hints, and the soup-4 concat is not a blob key.

<a id="t-split-key-half-and-better-half-combinations"></a>
#### Split-key 'HALF and BETTER HALF' combinations as a private key vs the GSMG addresses
❌ **Verified fail** · this project · *this session*

- **Input:** The phase-3.2 VIC clue 'THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF' interpreted as a two-piece (split) secret. 1,204 derivations combining candidate 'half' and 'better half' material (the dbbi/faed-derived bytes, the HALF/BETTERHALF phrases, ingredient pairs) by concat / XOR / add, then hashing to a 32-byte scalar and deriving P2PKH addresses, vs prize / split-off / donation addresses.
- **Method:** The 'HALF and BETTER HALF' line plausibly says the secret is split into two pieces that must be combined. Each of 1,204 candidate (half, better-half) combinations was joined and reduced to a private key, then turned into compressed and uncompressed addresses and checked against the three known GSMG addresses. Like the brainwallet sweep, a hit would be self-verifying without any AES.
- **Output:** ZERO matches across all 1,204 split-key derivations. The 'half + better half' combination does not reconstruct any GSMG address key.

<a id="t-vanity-address-kills-brainwallet"></a>
#### The 1GSMG1 prefix proves the prize address is a VANITY address, so its private key is random
💡 **Verified — new insight** · this project · *this session*

- **Input:** The prize address 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe, whose leading characters spell '1GSMG1' (the project's own brand).
- **Method:** A human-readable prefix like '1GSMG1' cannot occur by chance in a normally-derived key; it can only be produced by brute-forcing random keys until one yields the desired address prefix (a 'vanity' generation). That means the private key behind the prize address is RANDOM, not derived from any phrase or puzzle answer. This structurally explains why the brainwallet and split-key sweeps must fail, and confirms the only path to the key is decrypting the cosmic blob that contains it.
- **Output:** Definitive structural conclusion: brainwallet / address-derivation approaches are impossible by construction. The key exists only inside the cosmic AES blob.
- **Insight:** The 1GSMG1 prefix is a brute-forced vanity prefix, so the prize private key is random and cannot be derived from any phrase, ruling out every brainwallet/split-key/address-derivation path.

<a id="t-wayback-cdx-gsmg-urls-spa-shell"></a>
#### Wayback Machine CDX of all gsmg.io URLs — no hidden stage; the 64-hex 'stage' pages are just the SPA shell
💡 **Verified — new insight** · this project · *this session (cdx_full.txt, 397 captured URLs)*

- **Input:** The complete Internet Archive CDX index for the domain gsmg.io (397 distinct captured URL/timestamp rows, saved as cdx_full.txt). Of interest: the genuinely-small real puzzle pages — gsmg.io/theseedisplanted (1245 bytes, captured 2020-11-12), gsmg.io/choiceisanillusion...iwroteitmyself (7253 bytes, 2020), and the SalPhaseIon page gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32 (4592 bytes, captured 2023-06-01) — versus the dozens of 64-hex 'stage' URLs, /final_stage, /followthewhiterabbit, /TheArchitectChoice, /banking-war, /cryptogic etc., all captured 2024-2026 at ~11,800-12,900 bytes each.
- **Method:** Pulled the full CDX (capture index) for gsmg.io from the Wayback Machine and sorted every archived URL by capture date and stored byte-size, looking for any genuine post-cosmic puzzle stage hidden in the archive. Reasoning: a real puzzle page has small, specific content (like theseedisplanted's 1245 bytes); a single-page-app (SPA) shell that just renders 'page not found / app boot' is large and identical regardless of path. Compared sizes and dates to separate authored pages from community URL-guesses that the server simply answered with the generic app.
- **Output:** Only THREE small, dated (2020-2023) pages are real authored stages (1245B / 7253B / 4592B). Every 2024+ URL — the ~10 64-hex 'stage' pages, /final_stage, /followthewhiterabbit, /TheArchitectChoice, the hex-Salted__ blob paths — returns the identical ~12KB SPA shell, i.e. they are community URL-guesses the server answered generically, NOT real stages. gsmg.io/door.png (11,735B) and /static/images/door.png are unrelated binaries; the Phase-1 tile-fragment guess URLs (/banking-war, /cryptogic, /dig-i) all return the same empty shell. No hidden door or post-cosmic stage exists in the archive.
- **Insight:** There is no hidden post-cosmic stage on gsmg.io: only theseedisplanted (1245B), the Phase-2 page (7253B) and the SalPhaseIon page (4592B) are real authored content; every 64-hex 'stage' URL is just the generic ~12KB SPA shell returned for any path.

### solved-chain verification

<a id="t-verify-embedded-salphaseion-equals-repo"></a>
#### Confirmed the on-page SalPhaseIon blob embedded in phase-3.2 plaintext matches the repo salphaseion.txt
💡 **Verified — new insight** · this project · *this session*

- **Input:** The first 'U2FsdGVkX1' base64 run found in the phase-3.2 plaintext vs ciphertexts/salphaseion.txt (whitespace-stripped).
- **Method:** While scanning the phase-3.2 plaintext for embedded blobs (extract.py), compared the first reconstructed base64 run against the repo's salphaseion.txt by common-prefix length and equality (ignoring '=' padding). This separates the genuine on-page salphaseion blob from the distinct trailing p32_trailing blob.
- **Output:** The first embedded blob equals the repo salphaseion ciphertext, confirming the salphaseion blob is authentic and correctly carried through the chain; the p32_trailing blob at the tail is a genuinely separate artifact.
- **Insight:** The phase-3.2 plaintext contains TWO distinct Salted__ blobs — the known salphaseion blob (matches repo) and a separate trailing p32_trailing blob — verifying the chain data and isolating the new artifact.

### soup reconstruction

<a id="t-reconstruct-salph-inner-blob-stray-z-enter-binary"></a>
#### Reconstructed the salph_inner 80-byte blob from soup fragments (stray-'z' + embedded 'enter' binary removed)
💡 **Verified — new insight** · this project · *this session*

- **Input:** post-z soup chunks 3 and 4. Chunk 3 = 'shabe' + 'fourfirsthintisyourlastcommand' + blobpart1. Chunk 4 = enter-binary (40 a/b chars = 8-bit ASCII of 'enter') + blobpart2 + suffix 'shabefanstoo'. Concatenated b64 -> Salted__ blob, salt 3ab585348552415d, 80 ciphertext bytes.
- **Method:** The inner blob's base64 is broken across the 'z' token separators and has the word 'enter' (as a 40-char a/b binary string) spliced INTO the middle of the base64. Reconstructed it (inner.py/inner2.py): stripped the leading plaintext 'shabefourfirsthintisyourlastcommand' from chunk 3 to get blobpart1, stripped the leading 40-char 'enter' binary and the trailing 'shabefanstoo' from chunk 4 to get blobpart2, and joined blobpart1+blobpart2. Verified the result base64-decodes to a valid 'Salted__' header with an 80-byte ciphertext.
- **Output:** A clean, valid OpenSSL aes-256-cbc blob: salt 3ab585348552415d, 80 bytes (5 blocks) — the salph_inner oracle. With its sibling p32_trailing it is one of the two small self-verifying blobs. It resisted ~thousands of candidate keys (soup tokens, first-hint phrases, ybp/yinyang candidates) -> 0 PKCS7-valid readable hits.
- **Insight:** The salph_inner base64 is deliberately fragmented across 'z' separators with the 'enter' binary inserted mid-blob; removing the stray 'z' and the embedded 'enter' binary is required to assemble the real 80-byte blob (salt 3ab585348552415d).

<a id="t-recover-dbbi-faed-salphaseion-soup-exact"></a>
#### Recovered the EXACT dbbi (91) & faed (570) strings and the full SalPhaseIon soup structure
💡 **Verified — new insight** · this project · *this session*

- **Input:** The SalPhaseIon notebook soup (salphaseion.ipynb, fenced block, spaces/newlines stripped). dbbi (91 = 7x13 symbols, alphabet a-i, no 'o'): dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe. faed (570 = 2x3x5x19 symbols): faedggeedfcbdabhh...ahaidhfahiihic (full string saved to faed.txt).
- **Method:** Parsed the soup (parse_soup.py): located the first 'z' to split off the leading pre-z chunk, computed the a/b bit-pattern of the word 'matrixsumlist' (8-bit ASCII, a=0/b=1, 104 bits), found that pattern inside pre-z, and split pre-z into [dbbi][matrixsumlist-binary][faed]. Then split post-z on 'z' to recover the agda (->lastwordsbeforearchichoice), cfob (->thispassword), shabef, and the inner-blob region. Saved dbbi.txt and faed.txt verbatim and confirmed both alphabets contain a-i with no 'o'.
- **Output:** Exact verbatim dbbi (91 syms) and faed (570 syms) strings plus the full soup order: [dbbi][binary1=matrixsumlist][faed] z [agda->lastwordsbeforearchichoice] z [cfob->thispassword] z 'shabef' 'four first hint is your last command' [salph_inner blob, split by z + binary2=enter] 'shabef' 'anstoo'. The 104-bit binary1 literally spells the WORD 'matrixsumlist'.
- **Insight:** The soup tokens are SELF-LABELING: the 104-bit binary between dbbi and faed decodes (a=0/b=1, 8-bit ASCII) to the literal word 'matrixsumlist', proving yellowblueprimes/yinyang are likewise LABELS whose VALUES must be computed, not the literal words themselves.

<a id="t-stray-z-enter-marker-finding"></a>
#### The stray-'z' / embedded-'enter' finding as a possible delimiter/offset signal
💡 **Verified — new insight** · this project · *this session*

- **Input:** The two soup constructs flanking salph_inner: the 'z' separators that fragment the inner-blob base64, and the 'enter' word encoded as a 40-bit a/b binary spliced inside the base64 (between blobpart1 and blobpart2). 'enter' is NOT one of the four cosmic ingredients.
- **Method:** Noted during reconstruction that 'enter' is encoded the same self-labeling way as 'matrixsumlist' (a/b 8-bit ASCII) but sits INSIDE the inner-blob base64 rather than standing alone, and that 'z' marks the split points. Considered whether the split position / 'enter' marker is a deliberate pointer (a UI 'enter the password' command, or a byte-offset delimiter) versus mere noise, and tested 'enter'/'thispassword'/'enterthispassword' as inner-blob keys.
- **Output:** 'enter' decodes cleanly to its literal word (self-labeling, like matrixsumlist) and its splice position is reproducible, but using 'enter', 'thispassword', 'enterthispassword' (literal / sha256hex / raw-sha) as the salph_inner passphrase produced 0 PKCS7-valid readable decrypts. The marker's purpose (delimiter vs pointer) remains undetermined.
- **Insight:** The word 'enter' is encoded (a/b binary) and embedded INSIDE the salph_inner base64 at the 'z' split point — a structural feature distinct from the standalone soup tokens, suggesting a deliberate delimiter/'enter the password' marker rather than a cosmic ingredient.
