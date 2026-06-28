# GSMG.io 5 BTC Puzzle — The Complete Walkthrough

**The authoritative, source-merged walkthrough of the unsolved [GSMG.io](https://gsmg-archive.org/) 5 BTC
cryptographic puzzle.** Every phase, every exact value, every original image, and the open endgame —
assembled from *all* public sources into one place, de-duplicated and cross-checked against the real
artifacts, so the community can read the whole puzzle here without hunting across scattered repos.

Open it here → **https://hosterjackagv.github.io/gsmg-5btc-puzzle/** *(GitHub Pages)*

> Built so the puzzle stays openable by anyone, forever. No guessing — verified findings only, all
> negatives documented.

---

## What this is

A **modular static site** (native ES modules — no build step, no framework, no tracking) whose
centerpiece is **[`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md)**: the complete, merged walkthrough of
every phase, rendered in the browser with all images inline and the real encrypted blobs verbatim.

It merges, de-duplicates, and reconciles:

- the **[puzzlehunt](https://github.com/puzzlehunt/gsmgio-5btc-puzzle)** walkthrough,
- the **[Naddiseo](https://github.com/Naddiseo/gsmgio-5btc-puzzle)** notebooks + every asset image,
- the creator's full **hint timeline (2020–2026)** with every hint image transcribed,
- on-chain data (prize/split-off/donation addresses, OP_RETURN messages), and
- an independent re-verification of every solved-path value against the OpenSSL artifacts.

Where two sources disagree, the discrepancy is called out. Nothing is truncated.

## Solve status

✅ **Solved and fully reproducible through Phase 3.2** (plus four decoded SalPhaseIon tokens). The
endgame — the `dbbi` & `faed` blocks and the final **Cosmic Duality** AES decryption — is **genuinely
OPEN**. The prize wallet `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` has never been swept by any solver; no
"solution" posted anywhere has moved the coins.

A few corrections this walkthrough makes that most write-ups get wrong:

- **The prize wallet is *unclaimed*, not "unspent."** Its earlier outflows are the creators' scheduled
  halving moves, not a solve.
- **The bounty is ~1.25 BTC today** (5 → 2.5 → 1.25 across two halvings); the peeled-off 3.75 BTC sits
  unspent in `17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa`.
- **`dbbi → yellowblueprimes`** and **`faed → yinyang`** are community *guesses*, not decodes — the
  endgame is genuinely unsolved.

## Run it

It's a static site, but the in-browser crypto and ES imports need a **secure context**, so serve it over
http rather than opening `index.html` as a `file://`:

```bash
python3 -m http.server      # then open http://localhost:8000
```

On GitHub Pages (HTTPS) it works out of the box. No install, no build, no dependencies.

## Repo structure

```
index.html               app shell (Home · Walkthrough · Reference)
docs/
  WALKTHROUGH.md          ← THE complete merged walkthrough (the centerpiece)
  VERIFIED-SOLUTIONS.md   the value-by-value verification audit (✅/⚠️/❌)
  ENDGAME-ANALYSIS.md     deep cryptanalysis of the open Cosmic Duality endgame
  LOOSE-ENDS.md           inventory of every unused / under-exploited piece
  BLOB-COMBINATION-ANALYSIS.md   "are the 4 blobs one scattered AES?" analysis
assets/
  walkthrough/            EVERY original asset image, by phase (puzzle.png, phaseN-assets/,
                          phase2.1-assets/, phase3.2-assets/, decentraland-assets/, hints/, …)
  js/                     crypto.js · router.js · md.js · util.js · main.js · views/{home,walkthrough,reference}
  css/                    base.css · components.css · game.css
content/                  phases.js (reference data spine) · matrix.js (genesis grid bits)
ciphertexts/              the raw OpenSSL-encrypted blobs (single source of truth; rendered in full)
```

## Verify it yourself

Every decryption is reproducible. Note the required `-md sha256`:

```bash
openssl enc -aes-256-cbc -d -a -md sha256 -in ciphertexts/phase2.txt \
  -pass pass:$(printf %s causality | sha256sum | cut -d' ' -f1)
```

The walkthrough includes the full `Salted__` base64 of every blob so you can re-run each step with
OpenSSL or [CyberChef](https://gchq.github.io/CyberChef/) — no trust required.

## Credits & license

Puzzle by the GSMG team. This is an independent, not-for-profit community archive — not affiliated with
GSMG. Merged from the [puzzlehunt](https://github.com/puzzlehunt/gsmgio-5btc-puzzle) and
[Naddiseo](https://github.com/Naddiseo/gsmgio-5btc-puzzle) walkthroughs and the creator's public hints.
Released into the public domain (**CC0**).
