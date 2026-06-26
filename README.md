# The Seed Is Planted — GSMG.io 5 BTC Puzzle · the game

An **interactive, beginner-friendly, community-maintained game** built around the unsolved
[GSMG.io](https://gsmg.io) **5 BTC cryptographic puzzle**. Learn cryptography and Bitcoin from
**absolute zero**, open every locked door **live in your browser**, and join the collective effort
to crack the final lock.

Open it here → **https://hosterjackagv.github.io/gsmg-5btc-puzzle/** *(live once GitHub Pages is enabled)*

> The GSMG team has wound down its official site and (per community reports) asked that the puzzle be
> kept alive by the community. This repo is built to keep it openable by anyone, forever.

---

## What it is

A **modular static site** (native ES modules — no build step, no framework, no tracking) that turns the
puzzle into a game with two intertwined layers:

- **A guided learning journey.** A story-driven path through every phase, explained from zero with
  everyday analogies. XP, levels, badges, and a "doors cracked" map track your progress (saved in your
  browser). A total beginner can understand hashes, AES, ciphers, Bitcoin addresses and private keys.
- **A collaborative race.** The open endgame (the two encoded blocks **dbbi** & **faed**, and the final
  **Cosmic Duality** blob) becomes a shared, self-verifying search: a live coverage map of what's been
  ruled out, profiles, comments, and user-vs-user challenges — all re-verified by CI so nothing is taken
  on trust. The first verified Cosmic unlock wins outright.

Every solved door runs the **real OpenSSL-compatible crypto** in your browser (SHA-256 +
`EVP_BytesToKey` + AES-256-CBC) — type an answer and watch the actual encrypted page decrypt.

## Everything here is fact-checked

Every value, hash, salt, address and step in this game was independently re-verified against the
authoritative community walkthroughs and the live blockchain. The full audit — with a ✅/⚠️/❌ status on
every claim and complete step-by-step solutions — lives in **[docs/VERIFIED-SOLUTIONS.md](docs/VERIFIED-SOLUTIONS.md)**.

A few corrections that audit surfaced (and that most write-ups get wrong):

- **The prize wallet is *unclaimed*, not "unspent."** The address `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe`
  has spent outputs — but those are the creators' **scheduled halving moves**, not a solve. No solver has
  ever swept it.
- **The bounty is ~1.25 BTC today**, not 5. It started at 5 BTC (2019) and the team halves it on each
  Bitcoin halving: 5 → 2.5 (2020) → 1.25 (2024). The peeled-off 3.75 BTC sits unspent in
  `17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa`.
- **dbbi → `yellowblueprimes`** and **faed → `yinyang`** are community **guesses**, not decodes — the
  repo's own dead-end ledger contradicts them. The endgame is genuinely **open**.
- Only the creator handle **Jrk** is publicly attested; the 2026 farewell and wind-down are reported via
  a private Discord and are **unverified** (presented as such).

The puzzle is **solved and reproducible through Phase 3.2**; the frontier beyond it is unsolved as of 2026.

## Run it

It's a static site, but the in-browser crypto needs a **secure context**, so serve it over http rather
than opening `index.html` as a `file://`:

```bash
python3 -m http.server      # then open http://localhost:8000
```

On GitHub Pages (HTTPS) it works out of the box. No install, no build, no dependencies.

## Repo structure

```
index.html              app shell (topbar, XP/level widget, router target)
assets/
  css/                  base.css (design tokens) · components.css · game.css
  js/                   crypto.js · store.js (XP/progress/achievements) · router.js · util.js · main.js
    views/              home · phase · workbench · placeholder (more landing incrementally)
content/                phases.js — the game's data spine (story, lessons, steps, doors, refs)
ciphertexts/            the raw OpenSSL-encrypted blobs (the single source of truth; fetched at runtime)
data/                   leaderboard data (machine-written by CI — do not hand-edit)
.github/                workflows + scripts that re-verify submissions and rebuild the board
docs/                   VERIFIED-SOLUTIONS.md (the audit) · verify-findings.json
legacy/                 the original single-file v1 site, preserved for reference
```

## The collaborative leaderboard

Every decrypt attempt you make is logged locally and verified by the real crypto (unlocked vs. fail), and
**deduplicated by an exact fingerprint** of `blob + recipe + prehash`. One click submits your new attempts
as a pre-filled GitHub issue; a GitHub Action **re-runs the decryption on each one in CI** and updates
`data/leaderboard.json` — so a claimed result that isn't reproducible is silently corrected. The first
verified valid decryption of the Cosmic Duality blob is auto-detected and pinned.

Verify any blob yourself with OpenSSL (note the required `-md sha256`):

```bash
openssl enc -aes-256-cbc -d -a -md sha256 -in ciphertexts/phase2.txt \
  -pass pass:eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf
```

To rebuild the board manually: **Actions → GSMG leaderboard → Run workflow**.

## Build status

Live now: the engine, design system, XP/achievement system, the doors map, every phase's story +
step-by-step + live door, and the workbench. Landing incrementally: the full crash course, the profile,
the Hive leaderboard UI, GitHub-Discussions comments, the dead-end ledger, and user challenges (the
data layer and CI they ride on already exist).

## Credits & license

Puzzle by the GSMG team (Jrk and crew). This is an independent, not-for-profit community archive — not
affiliated with GSMG. Cross-checked against the walkthroughs at
[puzzlehunt/gsmgio-5btc-puzzle](https://github.com/puzzlehunt/gsmgio-5btc-puzzle) and
[Naddiseo/gsmgio-5btc-puzzle](https://github.com/Naddiseo/gsmgio-5btc-puzzle).

Released into the public domain (CC0). Made in the spirit of the puzzle: **no guessing, verified findings
only, all negatives documented.**
