# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An interactive, beginner-friendly **game** built around the unsolved GSMG.io 5 BTC cryptographic puzzle.
It is a **modular static site using native ES modules** — no build step, no framework, no dependencies. It
runs an OpenSSL-compatible crypto engine in the browser (decrypt the puzzle's real blobs live) and layers a
gamified learning journey + a CI-verified collaborative "race" on top. Deployed on GitHub Pages.

The original single-file v1 site is preserved at `legacy/index.html` (it still holds verbatim content not
yet ported: the full Architect speech, the 42-entry dead-end ledger, embedded puzzle images).

## Run / dev

It's static, but the Web Crypto engine needs a **secure context**, so serve over http — don't open
`index.html` as `file://` (ES module imports and `crypto.subtle` both fail there):

- `python3 -m http.server` → open `http://localhost:8000`.
- Syntax-check modules without a browser: copy a file to `*.mjs` and `node --check` it (imports aren't
  resolved by `--check`, so paths don't matter for a parse check).
- Run the CI verifier locally: `node .github/scripts/verify.mjs` (with no `GITHUB_EVENT_PATH` it just
  rebuilds the leaderboard from existing `attempts.jsonl`).

## Architecture

**Native ES modules, hash-routed SPA.** `index.html` is a static shell (topbar nav + `#app` outlet);
`assets/js/main.js` boots it. There is no bundler — browsers load `import` graphs directly, which is why
every import path is relative with a `.js` extension.

- **The data spine: [content/phases.js](content/phases.js).** One entry per "door" carrying story,
  from-zero concepts, complete step-by-step solution, the interactive door config, and canonical reference
  values. **Views render purely from this data** — to add/curate a phase you edit data, not UI. Door types:
  `answer` (local string match), `decrypt` (live AES of a real blob), `open` (unsolved-frontier recipe
  tester that logs verified attempts). Each phase also has a `verified` field (the ✅/⚠️ status string).
- **[assets/js/crypto.js](assets/js/crypto.js)** — the OpenSSL-compatible engine: `sha256Hex`,
  `evpBytesToKey`, `opensslDecrypt`, `decryptBlob`/`tryBlob` (fetch a blob from `/ciphertexts` and decrypt),
  `attemptId` (the dedup fingerprint). Ciphertexts are **fetched at runtime** from `ciphertexts/*.txt`, so
  those files are the single source of truth (no inline copy to keep in sync anymore).
- **[assets/js/store.js](assets/js/store.js)** — game state (XP, level curve, cracked doors, achievements,
  local attempt log, notes) persisted to `localStorage` under the `gsmg.v2.` namespace. `subscribe()` feeds
  UI; `onChange()` feeds cross-cutting hooks (achievement checks in `main.js`). A `commit()` re-entrancy
  guard lets achievement hooks award XP without infinite recursion.
- **[assets/js/router.js](assets/js/router.js)** — minimal hash router; routes lazy-`import()` view modules.
  A view is `async ({params,navigate,path}) => { title, html, mount? }`.
- **[assets/js/achievements.js](assets/js/achievements.js)** — badge catalog; each has `check(state)`.

## The two crypto engines must stay in sync

The OpenSSL-compatible decryption is implemented **twice on purpose** and must behave byte-for-byte
identically: the browser engine in [assets/js/crypto.js](assets/js/crypto.js) and the CI verifier in
[.github/scripts/verify.mjs](.github/scripts/verify.mjs). Both use `EVP_BytesToKey` with **SHA-256** (iterate
`D = SHA256(D ‖ password ‖ salt)` to 48 bytes → 32-byte key + 16-byte IV) and AES-256-CBC; a correct
passphrase is detected by AES padding validating (the decrypt call throwing = fail). Change one, change both.
The five blobs (`phase2`, `phase3`, `phase32`, `salphaseion`, `cosmic`) and the frontier set
(`cosmic` + `salphaseion`) are hard-coded in both `verify.mjs` and the front-end — keep the lists aligned.

## The leaderboard / data pipeline (GitHub-native, no backend)

`data/` is **machine-written — never hand-edit**. Flow: in-page Submit → pre-filled GitHub issue with a
```` ```json gsmg-attempts ```` block → [.github/workflows/leaderboard.yml](.github/workflows/leaderboard.yml)
runs `verify.mjs`, which re-runs the real AES against `/ciphertexts`, appends new attempts (dedup key
`id = sha256(blob|recipe|prehash)`), rebuilds `data/leaderboard.json`, commits, comments, closes the issue.
Community profiles/comments/challenges extend this same pattern (GitHub identity + Discussions + Actions).

## Source of truth for puzzle facts

**[docs/VERIFIED-SOLUTIONS.md](docs/VERIFIED-SOLUTIONS.md)** is the authoritative, independently-audited
reference (every value tagged ✅ confirmed / ⚠️ unverified / ❌ refuted, plus a corrections punch-list).
`docs/verify-findings.json` is its structured backing data. When editing puzzle content, reconcile against
this doc — do not restate community claims from memory. Notably: the prize is **unclaimed, not "unspent"**
(the address has spent outputs from scheduled halvings); the bounty is **~1.25 BTC** now (was 5, halved
twice); and `dbbi→yellowblueprimes` / `faed→yinyang` are **guesses, not decodes**.

## Project ethos (reflected throughout)

"No guessing, verified findings only, all negatives documented." Treat any claimed solution with skepticism
unless it yields a spendable key that moves the prize wallet on-chain. Keep every fact reproducible against
the real artifacts — the project's credibility rests on it.
