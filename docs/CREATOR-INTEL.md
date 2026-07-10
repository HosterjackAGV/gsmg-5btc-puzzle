# The Three Books — Creator Intel

Everything the puzzle's creator (**@SoWut / "Jrk Bgrt"**) has *directly* handed solvers, sieved from all **445** of his Telegram messages (2019–2026) and cross-checked against the confirmed walkthrough. It is split into three books:

- **📕 The Rulebook** — his *direct, logical* statements about the puzzle and how to solve it (the hard constraints), with the **irony/banter quarantined** so you don't chase jokes.
- **📗 The Hintbook** — every hint he delivered in *code* (binary, cipher, audio, image, a released hash) and its **verified decode**.
- **📘 The Openbook** — every piece of the whole walkthrough that is **decoded but still unused** — the inventory of unspent ammunition for the open endgame.

> **Why this matters.** The endgame (Cosmic Duality) is genuinely unsolved. The creator has repeatedly said the answer is *"in front of your eyes"* and that *no internet is needed to solve* — i.e. everything required is already in these pages. These books collect exactly that: the constraints your solution **must** satisfy, the hints already given, and the pieces not yet spent. Provenance is the creator unless noted; confidence is tagged. Nothing here claims a private key — the prize is unclaimed.

---

<details open><summary><b>📕 BOOK I — THE RULEBOOK</b> · the creator's direct logical constraints (click any group)</summary>

The creator rarely gives away values, but he *has* stated many hard rules about the puzzle's **shape, mechanics, and output**. Any correct solution must be consistent with every rule below. Each cites the source; jokes are separated into the **Banter graveyard** at the end so nobody wastes time on them.

<details><summary><b>§A · Hard constraints</b> — a solution MUST satisfy these</summary>

| # | The rule | Source | What it means for the search |
|---|---|---|---|
| **C1** | The final output is a **regular Bitcoin private key**. | 2024-01-26 | Produce a **WIF** (`5…` / `K` / `L…`) controlling `1GSMG1JC9…`. A "solve" is ONLY a key that moves the coins on-chain. |
| **C2** | The final step is a **decrypt**; the key is **stored online, encrypted**. | 2021-08 (#7830/32/34) | The cosmic blob is the hosted encrypted key; solving = deriving its passphrase (same AES chain as every phase). |
| **C3** | It **is solvable** — "might appear unsolvable, but it's not." | msg 8360 | Never conclude unsolvable. |
| **C4** | **No internet is needed to solve** — everything is already in hand (internet only to *claim*). | 2023-11-24; #9607/#9639 | The answer is **derivable from material already decoded** — don't look for external data. Strongest evidence it's a *lens/operation* on what we hold. |
| **C5** | **Primes are required** to proceed — but the *set* is not creator-given (`{2,3,5,7}` is a community guess). | 2021-12, 2023-01 (#8000/#8330) | A prime operation is part of the endgame; define the prime set from the puzzle's own structure, not assumptions. |
| **C6** | **Some characters must be "zeroed out."** | 2021-12-25 (#8000) | A delete/nullify step on a string, tied to C5. The Architect's *"reinserting the prime basics"* is the flip side — test insert *and* remove. |
| **C7** | **`yinyang` is a DECODE OUTPUT, not a guess-word — and it is THE gate.** | msg 39237/39224 | Don't test `yinyang` as a key. Find the (ciphertext, key) whose **plaintext contains "ying yang."** Reaching it = same-day solve. As of 2025, **nobody has**. |
| **C8** | The endgame is **select-from-many, not one hash** — "over 23 ciphers, 16 encryptions and/or 7 intertwined passwords; brute forcing might be required." | Architect speech (confirmed) | A select/pipeline/7-part process; a *bounded, logic-pinned* brute-force is sanctioned. |
| **C20** | The private key **is stored online, encrypted**; the solver "will find a way to decrypt it." | #7830/32/34 | Reinforces C2 — the hosted cosmic blob is the target. |
| **C21** | **On-chain / OP_RETURN messages are NOT his** and NOT part of the puzzle. | #12653 | **Discard** the `FromN0E…BellaCiao…1_1…Pi…` OP_RETURN and any blockchain text as a hint — it's dust, already tested null. |
| **C22** | Breaking SalPhaseIon should give **"the feeling of the phase's name"** (SalPhaseIon ≈ **salvation**). | #6497 | A correct `salph_inner` decrypt should read **salvation-themed** — a discriminator beyond mere valid padding. |
| **C23** | The key is retrievable **without** the 2020 hint. | #881 | The 2020 "Roses" poem is convenience, not a dependency. |
| **C24** | **All hints must be interpreted together.** | #8491 | A single hint underdetermines the solve; combine them. |
| **C25** | **Typos are mostly NOT clues** (except the one confirmed `giveit` fix). | #1806/#3345 | Don't over-read spelling artifacts. |
| **C26** | Shape: **~7 parts**; Part III has sub-stages; 3.2 is "the last part." | #1465/#887/#2026 | Consistent with the "7 intertwined passwords." |
| **C27** | The key is recoverable by his **friends/family working together**. | #9595 | It derives from knowable/shareable information — not solver-guessed entropy. Reinforces C4 (derivable). |

</details>

<details><summary><b>§B · Structural leads</b> — real, creator-stated, but partly explored</summary>

| # | The lead | Source | Status |
|---|---|---|---|
| **C9** | There is **"another door"** (a 3rd door / extra piece), still unfound at last check. | 2021-12-02 (#7914); #4590/#1487 | An un-found entry may exist. |
| **C10** | The "another door" index triple = **`{1},{4},{21}`** → a1z26 `A,D,U` (`R=18 A=1 B=2`). | #6884/#6913 | Standalone readings refuted; the letters may only matter *inside* the combine. |
| **C11** | **`#fefefe` = 104 = `101 010`**, the zero-out anchor. | 2021-03-01 | The genesis `#fefefe` cell is the zero-out/select anchor. |
| **C12** | **"Theory of everything" is a valid path** to the key. | 2023-01-12 (#8354) | A grand-unified/physics angle is legitimate, not flavour. |
| **C13** | An **imaginary-number** nudge: "higher than sqrt(-1)"; "an imaginary puzzle would." | 2023-01-12 (#8353/#8356) | `i` / complex numbers may be involved (Phase 2 already used `sqrt(-1)`). |
| **C14** | **Duality / colour thread**: yellow/blue → infrared → "the purple pill" → purple/orange. | 2023-12-26; #6250 | Paired-opposite colour dualities recur; a *second* duality beside yellow/blue. |
| **C15** | Late nudge — **ASCII 127 / DEL**: "I think I'll be going for ASCII 127 myself." | 2024-11-29 (#32613) | DEL (127) as the delete/"zero-out" character (ties C6). |

</details>

<details><summary><b>§C · Status &amp; calibration</b> — where we are (not operations)</summary>

- **C16 · "The hardest part is done."** (2023-08-03) — the remaining step is comparatively small.
- **C17 · "One microstep further → solved the same day."** (2024-11-29) — solvers are very close to the gate.
- **C18 · Still UNSOLVED and VALID** — "Did anyone find yingyang? I don't think so" (2025-04-28); "The puzzle is still valid!" (2026-05-28).
- **C19 · Value framing** — the Architect: "worth **hundred fourty (140)** of the investment." Possibly the number **140** matters; possibly motivation.

</details>

<details><summary>🗑️ <b>§D · The Banter graveyard</b> — creator jokes &amp; teases; DO NOT treat as rules or chase as values</summary>

Some of the most-quoted "hints" are jokes. Each of these was tried anyway and produced **nothing** — they are listed so nobody re-walks them.

- **B1 · "The only date I give away is the expiry date of neo's passport"** (2021-12-31) — a New-Year Matrix joke. (Tested: 09/11/2001 and every ordering → null.)
- **B2 · "You only need the last number of pi"** (2024-11-29) — pi has no last digit → banter. (Tested: pi-digit forms → null.)
- **B3 · `{30},{2},{77}`** — a **Cyberpunk-2077** joke, not an index triple.
- **B4 · "Only -41,-17 matters"** — a **Decentraland parcel coordinate**, not a cosmic hint.
- **B5 · "42"** — Hitchhiker's banter (theory-of-everything-adjacent at most; the literal key is null).
- **B6 · The 2026-01-01 "tiny hint"** — the binary decodes to *"Happy new year … here's a 'tiny hint' <3"* — the "tiny hint" is itself the tease. No payload.
- **B7 · Purple carrots / Dutch orange** — a colour-theme aside, not an operation.
- **B8 · Emotional / logistics chatter** — "it was nice knowing you all," "16$ fee," "see you in 4 years," the killswitch musing.

> ⚠️ "Banter" ≠ "meaningless": some jokes are *thematic* (passport→Matrix, 42→ToE, purple→duality) and so reinforce §B themes — but **none is a literal value to test.**

</details>

</details>

---

<details open><summary><b>📗 BOOK II — THE HINTBOOK</b> · the creator's coded hints &amp; their verified decodes</summary>

The creator likes to deliver a hint *in code* and let solvers crack it. Here is every coded hint, how it decodes, and the verified plaintext. Notice the recurring encoding families — **spiral-binary→ASCII, stereo phase-invert spectrogram, reversed-binary→ASCII, a1z26, EBCDIC/Beaufort/VIC** — all classical + encoding, never modern crypto. Expect them again in the endgame.

<details><summary><b>The nine coded hints</b> (click to expand each decode)</summary>

| # | When | The code (as posted) | Decode method | ✅ Verified plaintext / meaning |
|---|---|---|---|---|
| **H1** | 2019 | the 14×14 colour genesis grid | black/blue=1, white/yellow=0; **CCW inward spiral**; 8 bits/byte → ASCII | `gsmg.io/theseedisplanted` + the row/col 1-counts → `matrixsumlist`. |
| **H2** | 2019-04-22 | `5ac40783…0b746f75` | it's `sha256(the Phase-1 answer)` | A **checkpoint** — `sha256("theflowerblossoms…concretesurface")` reproduces it. He hands you a hash to test answers **offline** (the origin of "no internet to solve"). |
| **H3** | 2019-05-17 | `giveit = givetit` | a typo-fix instruction | Fixes a Phase-3 mistake. The hash-confirmed answer is `giveitjustonesecond`; `givetit` was later called "the biggest blunder." Use `giveit`. |
| **H4** | 2020-01-14 | *"Roses are White but often Red. **Yellow has a number and so does Blue.** Go back to the first puzzle piece…"* | read as instruction | Points to the genesis **blue/yellow numeric payload** (`matrixsumlist`) and that the first image hides **more than one door**. |
| **H5** | 2020-02-20 | a Decentraland screenshot | read the location | LAND parcel **-41,-17** — where the audio clue lives. |
| **H6** | (asset) | `puzzlepiece.mp3` — stereo audio | **split stereo, phase-invert one channel, mix to mono, spectrogram** | The word **`HASHTHETEXT`** → instruction: SHA-256 the opening-image text. |
| **H7** | 2021-12-02 | `There is Another D O O R` | letters, one per line | **"Another DOOR"** — a further, still-unfound path exists. |
| **H8** | 2023-02-23 | a 161-byte binary string | **reverse the bits within each byte, then reverse the whole byte sequence**, read ASCII | **`yellowblueprimes matrixsumlist lastwordsbeforearchichoice yinyang wewontgiveawaythepassword itsinfrontofyoureyesbutyourenotseeingit verylaststepisatruegiveaway promised`** — THE master hint: the four Cosmic ingredients, then the taunt. |
| **H9** | 2026-01-01 | a 152-byte binary (standard ASCII this time) | 8-bit groups → ASCII | *"Happy new year! Make the best of everything. Oh, and here's a 'tiny hint' <3."* — the "tiny hint" is a tease (see B6). |

</details>

<details><summary>Why <b>H8</b> is the load-bearing hint</summary>

**H8** (2023-02-23) is the *only* source that names the four Cosmic-Duality ingredients — `yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang` — and it deliberately **withholds how to combine them**: *"we won't give away the password; it's in front of your eyes but you're not seeing it; the very last step is a true give-away; promised."*

Its own encoding is telling: **reverse the bits in each byte, then reverse the order of the bytes** — a self-inverse ("involution") transform. That the creator chose a bit/byte-reversal to *deliver* the ingredient list is a strong hint that the **endgame combine may itself use reversal** at the bit or byte level. And "it's in front of your eyes" (with "no internet needed to solve," C4) says the missing combine is a **lens/operation on material already in hand** — not a new decrypt.

</details>

</details>

---

<details open><summary><b>📘 BOOK III — THE OPENBOOK</b> · every decoded-but-unused piece (unspent ammunition)</summary>

The walkthrough is fully solved through Phase 3.2, and along the way it produced many **confirmed** values, tokens, and blobs that have **never been spent** toward the endgame. This is the inventory — each with its value, why it's still unused, and whether it's been tried. When picking a next move, prefer an item marked **UNTOUCHED**.

<details><summary><b>A · Decoded tokens &amp; values not yet spent</b></summary>

| # | Piece | Confirmed value | Why still unused |
|---|---|---|---|
| **O1** | `matrixsumlist` byte-form | rows `610876654997879`, cols `8108108736759668` (both total 101) | The exact byte-form the combine wants is **ambiguous** (the `10`s parse ≥4 ways). Ingredient #2. |
| **O2** | `enter` | the word (spliced *into* salph_inner's base64) | Decoded but **unused**; its splice POSITION may be a byte-offset / delimiter marker; may pair with `thispassword`. |
| **O3** | `thispassword` | the word | Decoded but **unused**; self-referential — may be the `salph_inner` key ("enter this password"). |
| **O4** | `lastwordsbeforearchichoice` (#3) | the literal token | The *name* implies a **value never substituted** — the actual last speech lines before the Architect's choice. Literal-vs-span **unresolved**. |
| **O5** | `shabef` / `anstoo` | `shabef`=sha256; `anstoo` (="ans too"?) | `anstoo`'s exact role is unresolved (a second answer? a suffix?). |
| **O6** | `#fefefe` cell | genesis cell at spiral index ~103/104 | The zero-out **anchor** — the specific zero-out use is unexploited. |
| **O7** | Phase-2 coordinates | 51°52'28"N 4°24'23"E | A consistency check (SafeNet HQ) — never reused as endgame material. **UNTOUCHED** (low odds). |

</details>

<details><summary><b>B · Undecoded ciphertexts</b> — the self-verifying oracles (any right key is instantly obvious)</summary>

| # | Blob | salt · size | Note |
|---|---|---|---|
| **O8** | `salph_inner` | `3ab585348552415d` · 80 B | Its plaintext should read **salvation-themed** (C22) — a discriminator for a hit. |
| **O9** | `p32_trailing` | `b45a5e3d827593ca` · 80 B | An oracle at the end of Phase 3.2, largely un-noticed. |
| **O10** | 4th orphaned blob | `74c974e3f92e64b5` · 96 B | A fourth oracle, barely explored — the **least-explored** of the four. |
| **O11** | `dbbi` (91) / `faed` (570) | a–i base-9 blocks | The hoped sources of `yellowblueprimes` / `yinyang`. `faed` looks near-random (index of coincidence ≈ 0.118). |
| **O12** | `cosmic` | `2d3f6fe06dc950e6` · 1344 B | The prize blob (no partial-progress oracle). |

</details>

<details><summary><b>C · Decoded instructions not yet operationalised</b></summary>

- **O13 · The Architect's endgame phrases** — *"return to the source codes · reinserting the prime basics · select from 23 ciphers, 16 encryptions and/or 7 intertwined passwords · worth 140."* Decoded, but the operational meaning is unused (the pipeline is blind without the `yinyang` value; the number **140** is never placed).
- **O14 · The chess board-construction** — *"a fubcd-king &amp; oracle-queen, thingky mvps, on a sad board but as wide as the first one seen."* Only the VIC **alphabet** is confirmed used; the "board → a key for `p32_trailing`" reading is unexploited.

</details>

<details><summary><b>D · Creator leads still un-cashed</b> — flag for a test</summary>

| # | Lead | Note | Status |
|---|---|---|---|
| **O15** | **"Infrared"** (2021-03-05) | a one-word method/lead in the colour thread. | **UNTOUCHED** — never tested as a key/lens. The single cheapest un-run creator lead. |
| **O16** | `{1},{4},{21}` → `A,D,U` | the "another door" a1z26. | Standalone refuted; open only as a combine element. |
| **O17** | theory of everything / imaginary numbers | ToE is "a valid path"; "higher than sqrt(-1)." | The literal keys are null; the **concept** is un-cashed. |
| **O18** | *"Are you really looking for JUST the btc…?"* | implies MORE than the BTC (obscure intel / a second layer). | **UNTOUCHED** (soft). |
| **O19** | Jacque Fresco / Venus Project (2026) | a Phase-3 "Free Will" thematic re-nod. | **UNTOUCHED** (soft). |

</details>

<details><summary>How to use the Openbook</summary>

Shop the **UNTOUCHED** rows first (**O15 "Infrared"** is the cheapest un-run creator lead; **O10** the 4th blob is the least-explored oracle). But note: everything in §B/§C ultimately needs the **`yinyang`** value (a decode output) or the **combine** pinned — so the single highest-leverage act remains **making a self-verifying oracle's plaintext readable** (salvation-themed for `salph_inner`, per C22). The prize address is a *vanity* address, which proves its key is **random and only lives inside the cosmic blob** — so no shortcut from `dbbi`/`faed` can produce the key directly; the combine is unavoidable.

</details>

</details>

---

> These books are living documents, maintained as the creator posts new hints and as more of the walkthrough is decoded. They are analysis of **public** creator statements — no private key, no partial solution, nothing that isn't already on the puzzle's own pages. The 5 BTC bounty (now ~1.25 BTC after two halvings) remains **unclaimed**.
