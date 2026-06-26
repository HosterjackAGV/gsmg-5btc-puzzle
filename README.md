# The Seed Is Planted — GSMG.io 5 BTC Puzzle · interactive solver's guide

An **interactive, beginner-friendly, fully self-contained** field guide and toolkit for the unsolved
[GSMG.io](https://gsmg.io) **5 BTC cryptographic puzzle**.

Open it here → **https://hosterjackagv.github.io/gsmg-5btc-puzzle/** *(live once GitHub Pages is enabled — see below)*

> The official `gsmg.io` site has been wound down by its creators, who asked the puzzle to be
> **community-maintained** because "the URL might vanish." This repo is built to keep the puzzle
> alive and openable by anyone, forever, with no external dependencies.

---

## What this is

A single self-contained `index.html` (no build step, no server, no tracking) that:

- **Opens every locked door live in your browser.** Type a riddle's answer into an "unlock" console and watch the real OpenSSL-encrypted page decrypt in front of you — using a built-in, byte-for-byte OpenSSL-compatible engine (SHA-256 + `EVP_BytesToKey` + AES-256-CBC). No OpenSSL, no CyberChef required.
- **Explains every step from absolute zero.** Plain-English panels assume no knowledge of the puzzle, computers, cryptography, or bitcoin. A six-card crash course covers hashes, encryption, ciphers, addresses, and private keys with everyday analogies.
- **Reproduces everything verbatim.** Every decrypted page, the full Architect speech, every quote, poem, hint message, address, key, and salt — no ellipses, nothing you have to go elsewhere to find.
- **Gives you a solver's workbench** for the open endgame: hash any text, or try to decrypt any of the real blobs (including the unsolved **Cosmic Duality** box) with a candidate passphrase.
- **Documents what's already been ruled out** — a 42-entry "dead-end ledger" so you don't re-walk thousands of dead ideas.
- **Tracks your progress** (saved in your browser) with a "doors cracked" meter and a per-door "I cracked this" toggle.
- Includes the creators' full **2026 farewell message**.

The puzzle is **solved through Phase 3.2**; the open frontier is two encoded blocks nicknamed **dbbi** (→ `yellowblueprimes`) and **faed** (→ `yinyang`), which gate the final **Cosmic Duality** decryption.

## How to use it

1. Visit the live site (link above) **or** download `index.html` and open it.
2. Read the **crash course** (section 00) if you're new.
3. Walk **the doors** (section 04). For each, read the plain-English panel, then type the answer into the **unlock console** and hit *Decrypt* — or *Reveal answer* if you just want to watch it work.
4. To work the open puzzle, use the **workbench** (section 08): the unsolved blocks are `dbbi` and `faed`; the goal is the recipe `sha256(yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang)` that opens Cosmic Duality.

> **Note on in-browser crypto:** the live decryption uses the Web Crypto API, which requires a *secure context*. On GitHub Pages (HTTPS) it works out of the box. If you open the file locally and the consoles don't run, serve it over `http://localhost` (e.g. `python3 -m http.server`) or just use the published site.

## Repo contents

```
index.html                      the whole guide + toolkit (self-contained; images embedded)
ciphertexts/                    the raw OpenSSL-encrypted blobs, for independent verification
  phase2.txt … cosmic.txt
data/                           leaderboard data (machine-written by CI — do not hand-edit)
  leaderboard.json              the rendered ranking the page reads
  attempts.jsonl                append-only, deduplicated global attempt log
.github/
  workflows/leaderboard.yml     re-verifies submissions & rebuilds the board
  scripts/verify.mjs            re-runs the real AES on every attempt (trust nothing)
  ISSUE_TEMPLATE/attempt-batch.yml
README.md  ·  LICENSE
```

## The collaborative leaderboard

Section 09 ("The Hive") turns the open endgame into a **shared, self-verifying search**:

- Every decrypt attempt you make in the workbench is **logged locally and verified by the real crypto** (unlocked vs. fail).
- Attempts are **deduplicated by an exact fingerprint** of `blob + recipe + prehash`, so only genuinely new ground counts — the board is a live map of what's been covered.
- One click **submits your new attempts** as a pre-filled GitHub issue. The Action re-runs the decryption on each one **in CI** and updates `data/leaderboard.json` — so a claimed result that isn't reproducible is silently corrected. Nothing is taken on trust.
- **Win condition:** the first verified *valid decryption of the Cosmic Duality blob* is auto-detected and pinned. Ranking is by **frontier tries** (unique verified attempts against the open blobs) and **novel** (first to test a recipe).

It works locally with zero setup; the global board activates once the `.github/` and `data/` files are committed (they're included here). To rebuild the board manually: **Actions → GSMG leaderboard → Run workflow**.

Verify any blob yourself with OpenSSL (note the `-md sha256`):

```bash
openssl enc -aes-256-cbc -d -a -md sha256 -in ciphertexts/phase2.txt \
  -pass pass:eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf
```

## Status & provenance

- The prize address `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` is **unspent** — the puzzle is genuinely unsolved (2026).
- Every solved-path hash in the guide was **recomputed against the real artifacts**; the in-browser engine is confirmed by known-answer test (it reproduces the exact Phase-2 plaintext).
- Cross-checked against the community walkthroughs at
  [puzzlehunt/gsmgio-5btc-puzzle](https://github.com/puzzlehunt/gsmgio-5btc-puzzle) and
  [Naddiseo/gsmgio-5btc-puzzle](https://github.com/Naddiseo/gsmgio-5btc-puzzle).
- **Beware "solutions":** many confidently-worded "I solved it" posts exist; none has produced a spendable key. You can disprove most in seconds with the workbench.

## Credits

Puzzle by the GSMG team (JRK, d0d, Darky, Bloctite, and crew). This is an independent, not-for-profit
community archive — not affiliated with GSMG. Made in the spirit of the puzzle: **no guessing, verified
findings only, all negatives documented.**

## License

Released into the public domain (CC0) so it can be freely forked, mirrored, and maintained by the community.
Puzzle text, images, and the creators' message remain the property of their authors and are reproduced here
for preservation and study.
