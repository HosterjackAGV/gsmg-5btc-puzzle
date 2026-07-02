# GSMG.io 5 BTC Puzzle — The Definitive Verified Reference

> A beginner-friendly, rigorously fact-checked compendium of the GSMG.io 5 BTC Bitcoin puzzle. Every value below is tagged with a verification status. Nothing past Phase 3.2 is solved — and this document never pretends otherwise.
>
> **Last verified:** 2026-06-26. **Confidence legend:** ✅ CONFIRMED (independently reproduced or multi-source) · ⚠️ UNVERIFIED / DISPUTED · ❌ REFUTED (the literal claim is false as stated).

---

## 1. Overview & Provenance

The GSMG.io 5 BTC puzzle is a multi-stage cryptographic treasure hunt published by the team behind the (now wound-down) site **gsmg.io**. Whoever reconstructs the final Bitcoin **private key** can sweep the prize wallet. The puzzle is **genuinely unsolved past Phase 3.2** — the on-chain prize coins have never been moved by any solver, which is the only real proof of a solve.

### The prize money (all on-chain, ✅ cross-confirmed on mempool.space + blockstream + blockchain.info)

| Item | Value | Status |
|---|---|---|
| Prize address | `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` | ✅ CONFIRMED |
| Current prize balance | **1.25634510 BTC** (125,634,510 satoshis) | ✅ CONFIRMED |
| Total ever received | 8.75988008 BTC (875,988,008 sat) | ✅ CONFIRMED |
| Total ever sent out | 7.50353498 BTC (750,353,498 sat), across **6 spent outputs**, 125 txs | ✅ CONFIRMED |
| Split-off address | `17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa` — **3.75054755 BTC**, total sent **0** (fully unspent) | ✅ CONFIRMED |
| Donation address (older README) | `1JK27jtvE1wS4VG9k7Zpo8wBufMbYwy3r8` — ~0.0023 BTC, never spent, OP_RETURN "for ying yang thank you!" | ✅ CONFIRMED |
| Donation address (current Naddiseo README) | `bc1qla7lmz3guzz3cezhfl72r0w546a4gyacpu530r` | ✅ CONFIRMED |

**The "halving" schedule (✅ CONFIRMED):** The prize was set at **5 BTC (2019)** and the creators deliberately mirror Bitcoin's own halving by cutting the prize in half on each halving date: **5 → 2.5 BTC (after 11 May 2020) → 1.25 BTC (after ~19 Apr 2024)**. The 2.5 + 1.25 = 3.75 BTC that was peeled off sits in the split-off address `17ucy...`, which matches exactly. The remaining ~1.256 BTC in the prize address = 1.25 BTC plus a little dust sent in by onlookers.

> ❌ **CRITICAL CORRECTION:** Calling the prize address **"unspent"** (as the project's own `README.md` line 73 and `CLAUDE.md` do) is **literally false**. The address has 6 spent outputs and has sent 7.5 BTC over its life. The correct wording is: **"the prize tranche is unclaimed by any solver — no one has ever swept it."** The spends are the creators' scheduled halving moves, not a solve.

### Team & farewell (⚠️ mostly UNVERIFIED)

- Only the handle **"Jrk / jrk"** (cited as Discord #4105) is independently attested in community walkthroughs as the creator who posted official hints. ✅ for Jrk.
- The other names — **d0d, Darky, Bloctite** — appear **only** in this repo's own `README.md`/`index.html` and an alleged private GSMG Discord. **No public, indexed source corroborates them.** ⚠️ UNVERIFIED.
- The **2026 farewell** ("All Good Things Come To An End — The End of GSMG" / "Our 9-Year Chaos Tour Is Officially Over", signed "JRK, d0d, Darky, Bloctite, and the remaining GSMG crew") and the **wind-down / community-maintenance request** are sourced only to the private Discord. Discord is not search-indexed or archivable, so these can be **neither confirmed nor refuted**. ⚠️ UNVERIFIED. A Wayback snapshot of gsmg.io exists dated **10 Jan 2026** (site was still live then) and the domain is registered until **~3 Jul 2026** (a plausible basis for "the URL might vanish"), but no public statement of a wind-down exists.

### Solve status

✅ **Solved and reproducible through Phase 3.2** (plus four decoded SalPhaseIon tokens). The endgame — **dbbi → yellowblueprimes**, **faed → yinyang**, feeding the **Cosmic Duality** decryption — is **OPEN**. Numerous confident "SOLVED" posts exist (e.g. GitHub issues #56, #69) but **none has produced a private key that moves the coins**; several are AI-generated and self-admit they recovered no spendable key.

**From-zero concepts:** *Bitcoin address* (a transparent glass piggy-bank — everyone sees the balance, only the private-key holder can spend) · *private key* (the secret that controls an address; finding it is the only true "solve") · *satoshi* (1 BTC = 100,000,000 sat) · *spent vs. unspent output (UTXO)* · *block explorer* (free public ledger viewer) · *Bitcoin halving* · *Wayback Machine* · *why Discord can't be fact-checked* · *OP_RETURN* (a tiny permanent note attached to a transaction).

---

## 2. The Phases

### Phase 0 — Genesis image (the 14×14 matrix → `theseedisplanted`)

**Plain English:** The puzzle starts with one picture: a **14×14 grid of coloured squares** (196 tiles). It is **not** a scannable QR code — it's a hand-decoded grid. Read the colours as binary, in a counter-clockwise spiral, and they spell a URL that opens the puzzle.

**Step-by-step (a beginner can follow):**
1. Treat each tile as a **bit**: black/blue = `1`, yellow/white = `0`. ✅ CONFIRMED.
2. Write out the 14×14 grid of 0s and 1s.
3. Read the tiles in a **counter-clockwise spiral starting at the upper-left** square: go DOWN the left column, RIGHT along the bottom, UP the right column, LEFT along the top, then spiral inward ring by ring (like peeling an onion anti-clockwise). ✅ CONFIRMED — independently re-implemented; reproduces the URL.
4. Chop the resulting 196-bit string into **8-bit bytes** and convert each to its **ASCII** character.
5. Result: **`gsmg.io/theseedisplanted`** (24 chars + a 4-bit zero pad). ✅ CONFIRMED.
6. Visit that URL → begins Phase 1.

**Canonical values:**
| Value | Status |
|---|---|
| Decoded URL `gsmg.io/theseedisplanted` | ✅ CONFIRMED (reproduced) |
| Row-sums concatenated: **`610876654997879`** (per-row 1-counts 6,10,8,7,6,6,5,4,9,9,7,8,7,9) | ✅ CONFIRMED (reproduced) |
| Column-sums concatenated: **`8108108736759668`** (8,10,8,10,8,7,3,6,7,5,9,6,6,8) | ✅ CONFIRMED (reproduced) |
| Total `1` cells = 101 (both sums total 101 — consistency check) | ✅ CONFIRMED |
| These sums feed the later token **`matrixsumlist`** | ✅ CONFIRMED |

> ⚠️ **Important caveat:** The row/column sums are **real and reproduce exactly, but they are NOT part of getting the URL.** They are a *separate, later-use* artifact ("matrixsumlist"). Presenting them as a Phase 0 decoding step is misleading. The official 2020-01-14 "Roses are White but often Red / Yellow has a number and so does Blue" hint points to this numeric reading — the hint **text** is corroborated, but the exact **date** is ⚠️ not independently verified.

**From-zero concepts:** bit · binary · byte · ASCII · spiral reading order · row/column sums.

---

### Phase 1 — "The Warning"

**Plain English:** The `theseedisplanted` page hides a password form (visible in browser dev tools) plus scrambled images that spell out the song **"The Warning" by Logic**. The password is a lyric from that song.

**Step-by-step:**
1. Open `gsmg.io/theseedisplanted`. Press **F12** (dev tools) to find the hidden HTML **POST** form (it posts to `gsmg.io/phase1verification`).
2. The scrambled on-page images spell **war + ning = WARNING** and **LO + gic = LOGIC** → the song "The Warning" by Logic.
3. In the song, the line **right after the words "Phase two"** is: *"The flower blossoms through what seems to be a concrete surface…"*
4. Lowercase it and remove spaces/punctuation → the password.
5. Submit it → redirected to the long Matrix-quote URL (below), which begins Phase 2.

**Canonical values:**
| Value | Status |
|---|---|
| Passphrase: **`theflowerblossomsthroughwhatseemstobeaconcretesurface`** | ✅ CONFIRMED (both walkthroughs, verbatim) |
| Redirect URL: `gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself` | ✅ CONFIRMED |
| Source of the URL: two **Merovingian** quotes from *The Matrix Reloaded* ("Choice is an illusion, created between those with power, and those without" + "a very special dessert. I wrote it myself") | ✅ CONFIRMED (Wikiquote) |

> Note: this stage reveals **no private key** — it is a pure navigation/lookup gate. ✅ CONFIRMED.

**From-zero concepts:** HTML & a hidden form · HTTP POST · the lowercase-no-spaces convention (servers check answers by exact character match).

---

### Phase 2 — "Mr. Robot" (the 7-part password)

**Plain English:** Phase 2 is an encrypted text file. You unlock it with the single word **`causality`** (you actually type its SHA-256 hash). Inside is a Mr. Robot–themed riddle whose answers build a **seven-part password**; the SHA-256 of that whole string is the key to Phase 3.

**Step-by-step:**
1. Decrypt `phase2.txt` (OpenSSL AES-256-CBC) with the key **`sha256("causality")`**.
2. Read the riddle: it tags itself with the Mr. Robot episode `eps3.4_[in one of the valleys of Phillip]runtime-error.r00`, gives the line `# X 2 S H 4 Y 0 Q B 15 #`, and four sub-clues (Q/B/H/S).
3. The "keymakers / hide in plain sight" theme points to a **Hardware Security Module** — specifically the real product **Thales/Gemalto SafeNet Luna HSM** — supplying three parts: `Safenet`, `Luna`, `HSM`.
4. Assemble the **seven parts** (no separators between them).
5. SHA-256 the whole concatenation → the Phase 3 key.

**Canonical values:**
| Value | Status |
|---|---|
| Phase-2 page key `sha256("causality")` = **`eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf`** | ✅ CONFIRMED (I recomputed it) |
| Phase-2 AES salt: `06286612d43ed7ed` (read from the file header) | ✅ CONFIRMED (extracted) |
| The 7 parts: `causality` · `Safenet` · `Luna` · `HSM` · `11110` · the 0x-hex genesis string · the full chess FEN | ✅ CONFIRMED (order verified by the hash) |
| Part 6 = Bitcoin **genesis-block coinbase message reversed**, stored as `0x736B6E61…656854` → decodes to "*…sknab rof tuoliab dnoces… ehT*" = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks" backwards | ✅ CONFIRMED (decoded + reversed) |
| Part 7 = chess FEN `B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1` ("Buddhist forced to move" = the non-mating move; now Black to move) | ✅ CONFIRMED |
| Part 5 = `11110` (value required for the hash to come out right) | ✅ CONFIRMED *(value)* |
| Part 5 *meaning* = JFK **Executive Order 11110** | ⚠️ UNVERIFIED — both walkthroughs admit the on-page logic for reaching `11110` was partly brute-forced; the value is confirmed, the *why* is not |
| Phase-3 key = SHA-256 of the full concatenation = **`1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5`** | ✅ CONFIRMED (recomputed + chain-decrypts Phase 3) |

> ⚠️ **Two subtle "gotchas":** (a) the literal **`0x`** prefix on the genesis hex **must** be kept, and (b) the **full FEN** (not just `B5KR`) must be included — only `0x-prefix + full FEN` reproduces the published hash. Naddiseo's README renders the password truncated at `…B5KR`; that truncated form does **not** hash correctly. Use the puzzlehunt README's full string.

**From-zero concepts:** hash (SHA-256) · AES-256-CBC · base64 (the `U2FsdGVkX18…` envelope) · the `Salted__` header + salt · hex & `0x` · genesis-block coinbase message · chess FEN · HSM / SafeNet Luna.

---

### Phase 3 — "Free Will"

**Plain English:** Decrypting Phase 3 reveals **three short riddles**. Solve them, glue the lowercase answers together with no spaces, hash the result — that's the key to Phase 3.2.

**Step-by-step:**
1. Decrypt `phase3.txt` (with the Phase-2 key `1a57c572…`). Out come three riddles, each tagged `/(aa,connected enf)` = "all lowercase, words connected, no spaces."
2. **Riddle 1** — "The thinker behind free will" → **Jacque Fresco** (The Venus Project) → `jacquefresco`.
3. **Riddle 2** — Cheshire Cat / "How long is forever? … just one second" and the text says prepend `giveit` → `giveitjustonesecond`.
4. **Riddle 3** — "the fundamental limit to the precision with which certain pairs of physical properties are known" = **Heisenberg's uncertainty principle** → `heisenbergsuncertaintyprinciple`.
5. Concatenate → SHA-256 → Phase 3.2 key.

**Canonical values:**
| Value | Status |
|---|---|
| Answer 1: `jacquefresco` | ✅ CONFIRMED |
| Answer 2: `giveitjustonesecond` | ✅ CONFIRMED |
| Answer 3: `heisenbergsuncertaintyprinciple` (**note the internal "s"** after *heisenberg*) | ✅ CONFIRMED |
| Concatenation `jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple` → SHA-256 = **`250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c`** | ✅ CONFIRMED (I recomputed it) |
| Phase-3 (`phase3.txt`) salt: `9fbc451d13d071f4` | ✅ CONFIRMED (extracted) |
| Phase 3.2 plaintext = the **"Architect" speech** from *The Matrix Reloaded* | ✅ CONFIRMED (decrypts cleanly) |

> ⚠️ **Spelling trap:** The puzzlehunt README *prose* writes `heisenberguncertaintyprinciple` (no internal "s"). That spelling hashes to the **wrong** value. The correct, hash-matching, decryption-proven form is `heisenbergsuncertaintyprinciple` **with the "s"**.
> ⚠️ **Salt labeling:** `9fbc451d13d071f4` is the salt of `phase3.txt` (the riddle blob). The next blob `phase32.txt` has a **different** salt, `eefc4c5befc1656a`. Don't conflate them.

**From-zero concepts:** salt (non-secret seasoning) · concatenation · Heisenberg's uncertainty principle (the *answer*, not something to calculate).

---

### Phase 3.2 — "The Architect" (Beaufort + VIC cipher)

**Plain English:** This blob holds **two** hand-puzzles: a block of **letters** (decode with a Beaufort cipher) and a block of **digits** (decode with a VIC / straddling-checkerboard cipher). The digits reveal the big plot twist: the prize key is **split** between "HALF and BETTER HALF."

**Step-by-step:**
1. Decrypt `phase32.txt` with the Phase-3 key `250f37…`.
2. A first sub-step decodes raw bytes via **IBM EBCDIC code page 1141** (hint "one for one, four for one"). ✅ CONFIRMED.
3. **Letters block** → **Beaufort cipher**, key **`THEMATRIXHASYOU`** ("the matrix has you"). Beaufort encryption and decryption are the same operation.
4. Output = the **Architect monologue**, beginning *"YOUR LIFE IS THE SUM OF A REMAINDER OF AN UNBALANCED EQUATION…"* ending *"…I REALLY HOPE YOURE THE ONE CIAO BELLA O"*.
5. **Digits block** → **VIC cipher** with straddling-checkerboard alphabet **`FUBCDORA.LETHINGKYMVPS.JQZXW`**, straddling/marker digits **1 and 4**.
6. Output = *"IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE."*

**Canonical values:**
| Value | Status |
|---|---|
| Beaufort key `THEMATRIXHASYOU` | ✅ CONFIRMED (3 sources) |
| Architect speech (opening line + theme) | ✅ CONFIRMED — exact *ending* only single-sourced (⚠️ second-source-uncertain) |
| VIC alphabet `FUBCDORA.LETHINGKYMVPS.JQZXW`, digits 1 & 4 | ✅ CONFIRMED (dominant form) |
| VIC numeric string `1516594312197240916917121375895181314154313141242815419131218121943312117161713714911091663121313128149110916613141219911437161212602166431371115411​2` | ✅ CONFIRMED (verbatim, 2 sources) |
| VIC decode: "…PRIVATE KEYS BELONG TO HALF AND BETTER HALF…" | ✅ CONFIRMED |
| Phase 3.2 salt `eefc4c5befc1656a` | ✅ CONFIRMED (extracted) |

> ⚠️ **Source disagreement on the VIC board:** puzzlehunt/local use `FUBCDORA.LETHINGKYMVPS.JQZXW`; Naddiseo writes `fubcdora/lethingkymvpszjqwx.` (same letters/derivation, different trailing order and `/` vs `.`). A beginner reproducing the board may get different results depending on which they follow.

**From-zero concepts:** cipher · Beaufort cipher (encrypt = decrypt) · straddling checkerboard · VIC cipher · EBCDIC / code page 1141.

---

### Decentraland → entry into SalPhaseIon

**Plain English:** A side clue lived in the virtual world **Decentraland**. A clickable box plays a sound; the sound hides a word via **audio steganography**. That word tells you to **hash the text on the very first puzzle image** — and the resulting hash is the **secret URL** of the next stage.

**Step-by-step:**
1. Visit the GSMG plot in Decentraland at **LAND coordinates -41,-17**; click the box → it plays `audio_source.wav`. ✅ CONFIRMED (Decentraland "GSMG.io Puzzle piece" parcel exists).
2. In an audio editor (e.g. Audacity): split the **stereo** into Left/Right, **invert (phase-flip)** one channel, and **mix to mono**. Everything identical cancels; only the hidden difference survives.
3. View the result as a **spectrogram** (a picture of sound). In the high frequencies you'll see the word **`HASHTHETEXT`**. ✅ CONFIRMED.
4. Take **all the text on the opening image including the prize address**, no spaces: `GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` (59 chars, **no trailing newline**).
5. SHA-256 it → the secret page name.

**Canonical values:**
| Value | Status |
|---|---|
| Spectrogram word `HASHTHETEXT` | ✅ CONFIRMED |
| Decentraland coords `-41,-17`, file `audio_source.wav` | ✅ CONFIRMED |
| Entry string `GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` (59 chars) | ✅ CONFIRMED |
| `sha256(entry string)` = **`89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32`** | ✅ CONFIRMED (I recomputed it) |
| SalPhaseIon URL `gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32` | ✅ CONFIRMED |

> ⚠️ The **no-trailing-newline** detail is load-bearing: adding a newline yields a different hash (`8784851d…`). The live gsmg.io page is wound down, so the final URL→page step rests on two independent walkthroughs, not a fresh fetch.

**From-zero concepts:** Decentraland · stereo channels & phase inversion · spectrogram · "which text" = the opening image text incl. the address.

---

### SalPhaseIon — tokens, and the two unsolved blocks

**Plain English:** The SalPhaseIon page is a long "soup" of letters from a tiny alphabet, split into chunks by the letter **`z`**. **Four** chunks are cracked; **two** remain unsolved. The two unsolved ones are the doorway to the endgame.

**Step-by-step:**
1. Split the soup wherever a `z` appears.
2. **a/b chunks** → set a=0, b=1, read as **8-bit binary ASCII**: → `matrixsumlist` (104 bits) and `enter` (40 bits). ✅ CONFIRMED.
3. **a–i/o chunks** → map a=1…i=9, **o=0**, read as a big number → convert to **hex** → hex pairs as ASCII: → `lastwordsbeforearchichoice` and `thispassword`. ✅ CONFIRMED.
4. **Two chunks won't decode** — nicknamed by their first four letters: **`dbbi`** (91 symbols, 91 = 7×13) and **`faed`** (570 symbols, 570 = 2·3·5·19). These are the open problem.

**Canonical values:**
| Value | Status |
|---|---|
| `matrixsumlist`, `enter`, `lastwordsbeforearchichoice`, `thispassword` | ✅ CONFIRMED |
| SalPhaseIon inner blob salt `3ab585348552415d` | ✅ CONFIRMED (extracted) |
| Cosmic Duality blob salt `2d3f6fe06dc950e6` | ✅ CONFIRMED (extracted) |
| `dbbi` (91 base-9 *symbols*) → hoped to yield `yellowblueprimes` | ⚠️ UNVERIFIED hypothesis |
| `faed` (570 base-9 *symbols*) → hoped to yield `yinyang` | ⚠️ UNVERIFIED hypothesis |

> ⚠️ **Wording trap:** "91 in base-9" / "570 in base-9" means these chunks are **91 and 570 symbols long**, NOT that they decode to the number 91 or 570.
> ⚠️ The mapping `dbbi → yellowblueprimes` and `faed → yinyang` is a **community guess, not a result**. The repo's own dead-end ledger records that the literal string `yellowblueprimes` is **absent from dbbi in every base**, and that exhaustive sweeps of `faed` produce only garbage (its statistics look near-random). The citation of GitHub issue #56 for these nicknames is **mismatched** — issue #56 does not contain the terms `dbbi/faed/yellowblueprimes/yinyang/91/570`; these are sourced **only** to this repo's `index.html`.

**From-zero concepts:** base / base-9 · a1z26 · binary↔ASCII · hexadecimal · the `z` separator.

---

### Cosmic Duality — the endgame (OPEN)

**Plain English:** This is the final, locked box. A 2023-02-23 official "reverse-binary" hint **names** the four password ingredients — but deliberately **withholds how to combine them**. Nobody has decrypted it.

**The 2023-02-23 "reverse-binary" master hint (✅ CONFIRMED decode, single-source Naddiseo):**
> `yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang · wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit · verylaststepisatruegiveaway · promised`

The first four tokens are the believed ingredients. The rest is a taunt: *"we won't give away the password, it's in front of your eyes but you're not seeing it."*

**The candidate endgame recipe (⚠️ UNVERIFIED HYPOTHESIS — do not present as solved):**
```
privkey = AES-256-CBC-decrypt(
            cosmic blob,
            key = sha256("yellowblueprimes" + "matrixsumlist"
                       + "lastwordsbeforearchichoice" + "yinyang")
          )
```
This is **structurally consistent** with the puzzle's answer→sha256→AES pattern, but **it has never been shown to work** — every tested guess fails with an AES "invalid padding / bad decrypt" error. The recipe *shape* is itself disputed: GitHub issue #56 instead proposes an **XOR of SHA-256 hashes of seven tokens** (which don't even include `yellowblueprimes`/`yinyang`). Neither recipe has ever decrypted the blob.

A correct solve would produce a Bitcoin **WIF private key** — a ~51–52 char string starting with **5** (uncompressed) or **K/L** (compressed), since the prize address `1GSMG…` is a legacy P2PKH ("1…") address (✅ general Bitcoin fact). As of 2026-06-26 this has not happened; the funds are unmoved.

**From-zero concepts:** WIF (Wallet Import Format) · invalid padding / bad decrypt (the tell of a wrong AES password) · why "naming the parts" ≠ "knowing the combine operation."

---

## 3. The Crypto Method (explained simply)

Every encrypted blob in this puzzle uses **OpenSSL's classic `Salted__` container: AES-256-CBC, with the key/IV derived from the passphrase by `EVP_BytesToKey` using SHA-256 as the digest.**

**How it works, in plain English:**
- The encrypted text is **base64** (printable-letter "envelope"). Decode it and the raw bytes start with the literal word **`Salted__`** + 8 random **salt** bytes + the ciphertext. You can spot one instantly: base64 of `Salted__` is **`U2FsdGVkX18=`**, so every blob starts `U2FsdGVkX1…`. ✅ I verified `base64("Salted__") = U2FsdGVkX18=`.
- **AES** needs a 32-byte key + 16-byte IV, but you typed a passphrase. OpenSSL's old converter **`EVP_BytesToKey`** stretches passphrase + salt by repeated hashing:
  `D1 = SHA256(pass‖salt)`, `D2 = SHA256(D1‖pass‖salt)`, `D3 = SHA256(D2‖pass‖salt)`; then **key = (D1‖D2)[:32]**, **IV = D3[:16]**.
- This is **not PBKDF2** — so any "solution" claiming to "bypass PBKDF2" misunderstands the format. ⚠️
- **The `-md sha256` gotcha:** Old OpenSSL (≤1.0.2) defaulted to **MD5**; modern OpenSSL (≥1.1.0 / 3.x) defaults to **SHA-256**. So `-md sha256` is **strictly required on old OpenSSL** and merely redundant on new. Always include it for portability. (Modern OpenSSL also prints a harmless `WARNING: deprecated key derivation used` — expected, not a failure.) ⚠️ The blanket claim that it is *always* "required" is slightly overstated, but it is correct best practice.

**The canonical verification command:**
```bash
openssl enc -aes-256-cbc -d -a -md sha256 -in <blobfile> -pass pass:<64-char-sha256-key>
```
`-d` decrypt · `-a` input is base64 · `-md sha256` digest for the KDF · OpenSSL reads the salt out of the header automatically. Wrong key → "bad decrypt"; right key → readable text.

**Worked, reproducible examples (✅ all recomputed during this verification):**
- `sha256("causality")` = `eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf` → opens `phase2.txt`.
- `sha256("…freescogiveit…principle")` = `250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c` → opens `phase32.txt`.
- Salts read straight from the files: phase2 `06286612d43ed7ed` · phase3 `9fbc451d13d071f4` · phase32 `eefc4c5befc1656a` · salphaseion `3ab585348552415d` · cosmic `2d3f6fe06dc950e6`. ✅ All extracted.

**From-zero concepts:** hash · AES-256-CBC · IV · salt · base64 · `EVP_BytesToKey` (vs. PBKDF2) · the `-md` MD5/SHA-256 default trap.

---

## 4. The OPEN Frontier (stated honestly)

These are **genuinely unsolved**. Confidence: HIGH that they are open (the coins prove it); the hypotheses below are LOW-confidence guesses.

1. **`dbbi` → `yellowblueprimes`.** A 91-symbol base-9 SalPhaseIon block. The target word is only *named* by a hint; the literal string is **absent from dbbi in every tested base**, and all decode attempts produce garbage. **UNSOLVED.**
2. **`faed` → `yinyang`.** A 570-symbol base-9 block. Its statistics (index of coincidence ~0.118, near-random) suggest it may not even be enciphered English. **UNSOLVED.**
3. **Cosmic Duality.** Even *if* you had `yellowblueprimes` and `yinyang`, the **combine-operation** (concatenate-then-sha256? XOR of seven hashes? something else?) is **disputed and unproven** — no recipe has ever decrypted the cosmic blob. **UNSOLVED.**

**The only valid proof of a solve:** a private key that controls `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` and drops its balance to zero on-chain. Nothing else counts. Do not trust any "I solved it" post that does not show the prize moving.

---

## 5. Corrections & Unverified Claims (fix or soften these on the site)

> This is the punch-list for the site owner.

**❌ REFUTED — fix the wording:**
1. **"The prize address `1GSMG…` is unspent."** (`README.md` line 73, `CLAUDE.md` line 48.) **FALSE.** The address has **6 spent outputs** and has sent **7.50353498 BTC**. Replace with: *"the prize tranche (~1.256 BTC) is unclaimed — never swept by any solver. Earlier outflows are the creators' scheduled halving moves."*
2. **GitHub issue #69 "SOLVED" / XOR master key `818af53d…`** and **issue #56 "final resolution."** Both are **false/AI-generated** — each self-admits it produced **no spendable key** (#56: "both balances = 0"; #69 invents a fictional "Half and Better Half / split-key / dusting-trigger" mechanism that does not exist in real Bitcoin reward puzzles). Do not cite as solutions.
3. **"The puzzle has been solved."** (Some web-search snippets.) FALSE — coins unmoved.
4. **The news.bitcoin.com "World's Toughest Bitcoin Puzzle solved" article** is about a **different** puzzle (1FLAMEN6 / "Legend of Satoshi Nakamoto" by coin_artist, solved by "Isaac"). It is **not** GSMG — never use it to claim the GSMG prize was claimed.

**⚠️ UNVERIFIED — soften / attribute clearly:**
5. **Team handles `d0d`, `Darky`, `Bloctite`** — only `Jrk` is attested publicly. Present the others as *"per the GSMG Discord (not publicly verifiable)."*
6. **The 2026 farewell text and the wind-down / community-maintenance request** — sourced only to a private Discord; not confirmable or refutable. Label *"reported, unverified."*
7. **`dbbi → yellowblueprimes` and `faed → yinyang`** — community **guesses**, not decodes. The repo's own dead-end ledger contradicts them. The citation of **issue #56** for these nicknames is **wrong** (issue #56 contains none of those terms); they trace only to `index.html`.
8. **The Cosmic Duality recipe `sha256(four tokens)`** — present explicitly as a **candidate hypothesis**, not "THE operation." The site's own workbench text already admits it fails until "the real recipe is found"; reconcile the two so the hint-card doesn't read as confirmed.
9. **Phase 2 Part 5 = "Executive Order 11110"** — the *value* `11110` is confirmed, but the *EO 11110 meaning* is unverified (the on-page logic was partly brute-forced). Soften the "why."
10. **Phase 3 spelling `heisenberguncertaintyprinciple` (no internal "s")** in the puzzlehunt README prose — **wrong**; the correct hash-matching form is **`heisenbergsuncertaintyprinciple`**. Make sure the site uses the "s" form.
11. **Naddiseo's truncated Phase-2 password ending at `…B5KR`** — does not hash correctly; the site must use the **full FEN + `0x` prefix**.
12. **"2.5 BTC" prize figure** (older write-ups / puzzlehunt README) — **stale**. Current is ~1.25 BTC (two halvings). Use the 2024-halving figures (1.25 in prize + 3.75 split-off).
13. **VIC checkerboard notation** differs between sources (`FUBCDORA.LETHINGKYMVPS.JQZXW` vs Naddiseo's `fubcdora/lethingkymvpszjqwx.`). Note the discrepancy so beginners don't get stuck.
14. **"Roses are Red" hint date (2020-01-14)** — the hint *text* is corroborated; the exact *date* is not independently verified. Don't make the date load-bearing.
15. **Calling the genesis grid a "QR code"** — it's a bespoke 14×14 spiral-decoded grid, not a scannable QR. Soften.
16. **Internal repo inconsistency** in `index.html`'s salt table (it mislabels which salt belongs to which phase). Ground truth (from the binaries, ✅ verified): phase2 `06286612d43ed7ed`, phase3 `9fbc451d13d071f4`, phase32 `eefc4c5befc1656a`, salphaseion `3ab585348552415d`, cosmic `2d3f6fe06dc950e6`. Fix the table labels.

---

## 6. Sources

**Community walkthroughs & discussion**
- https://github.com/puzzlehunt/gsmgio-5btc-puzzle (and `/blob/master/README.md`)
- https://github.com/Naddiseo/gsmgio-5btc-puzzle (README + `phase0.ipynb`)
- https://github.com/dinhoka/gsmgio-5btc-puzzle
- https://deepwiki.com/puzzlehunt/gsmgio-5btc-puzzle/2-getting-started
- GitHub issues #51 (PGP/PKESK theory), #56, #69 ("SOLVED" — refuted), #84 ("unsolvable")
- https://privatekeys.pw/puzzles/gsmg-puzzle
- https://bitcointalk.org/index.php?topic=5532424.0

**On-chain (block explorers)**
- https://mempool.space/api/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe (+ `/utxo`)
- https://blockstream.info/api/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe
- https://blockchain.info/rawaddr/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe
- https://mempool.space/api/address/17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa
- https://blockchain.info/rawaddr/17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa
- https://blockchain.info/rawaddr/1JK27jtvE1wS4VG9k7Zpo8wBufMbYwy3r8

**Reference / context**
- https://en.wikiquote.org/wiki/The_Matrix_Reloaded ; https://scottmanning.com/content/merovingian-matrix-reloaded-transcript/
- https://lyrhub.com/en/track/Logic/The-Warning
- https://en.wikipedia.org/wiki/Jacque_Fresco ; https://en.wikipedia.org/wiki/Uncertainty_principle
- https://www.openssl.org/docs/man1.1.1/man3/EVP_BytesToKey.html
- https://learnmeabitcoin.com/technical/keys/private-key/wif/ ; https://bitcoinmagazine.com/technical/bitcoin-address-types-compared-p2pkh-p2sh-p2wpkh-and-more
- https://decentraland.org/places/place/?position=-41.-17 (GSMG.io Puzzle piece parcel)
- http://web.archive.org/web/20260110051955/https://gsmg.io/ ; https://archive.org/wayback/available?url=gsmg.io&timestamp=20260110

**Local artifacts (this repo, ✅ salts & decrypts verified directly)**
- `ciphertexts/phase2.txt`, `phase3.txt`, `phase32.txt`, `salphaseion.txt`, `cosmic.txt`
- `index.html`, `README.md`, `CLAUDE.md`

---

*Bottom line: the cryptographic chain is solid and fully reproducible through Phase 3.2 (every hash, salt, and decrypt above was re-verified). The endgame — `dbbi`, `faed`, and Cosmic Duality — is genuinely OPEN. The unspent prize is the proof.*