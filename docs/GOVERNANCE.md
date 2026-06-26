# Governance & access control

This project is **maintainer-controlled** ([@HosterjackAGV](https://github.com/HosterjackAGV)).
Anyone can play, contribute ideas, and submit verified attempts/scores — but the **community data,
the verification pipeline, and the identity config can only be changed by the maintainer.**

## What is locked down, and how

| Path | Who can change it | Mechanism |
|------|-------------------|-----------|
| `data/**` (puzzle leaderboard, arcade leaderboard, attempts, scores) | Maintainer + the verified Action only | [CODEOWNERS](../.github/CODEOWNERS) + [protect-paths workflow](../.github/workflows/protect-paths.yml) + branch protection |
| `.github/**` (workflows, verifiers, this governance) | Maintainer only | same |
| `content/config.js` (repo + giscus identity) | Maintainer only | same |
| everything else | Maintainer review by default | CODEOWNERS default rule |

**Two layers, defence in depth:**

1. **`protect-paths.yml`** — a status check that *fails any pull request* touching the protected paths
   unless the PR author is the maintainer. This works immediately, with no GitHub settings to toggle.
   It reads only PR metadata and never runs contributor code.
2. **CODEOWNERS + branch protection** — requires the maintainer's review to merge anything (and
   specifically the protected paths), once the one-time settings below are enabled.

The community **never edits these files directly.** Leaderboards update only through the
verified-submission pipeline: a player opens a pre-filled GitHub issue, a GitHub Action *re-runs the
real cryptography / re-simulates the game deterministically*, and only the Action (running as the repo's
own bot) writes to `data/`. A faked score in an issue simply fails verification and is dropped.

## One-time setup the maintainer should click (recommended)

GitHub → **Settings → Branches → Add branch ruleset / protection rule** for `main`:

- ✅ **Require a pull request before merging** → **Require review from Code Owners**
- ✅ **Require status checks to pass** → add **`guard`** (the protect-paths job)
- ✅ **Do not allow bypassing the above settings** — but **allow the `github-actions` bot** (or
  add an explicit bypass for it) so the leaderboard/arcade Actions can still commit verified updates
  to `data/`. The Actions push directly (not via PR), so they are unaffected by the PR review rule;
  the bypass only matters if you also enable "Restrict who can push".

That's it. After this, no one but you (and your own verified automation) can alter the leaderboards,
the verifiers, or the community data.

## Why the Actions are still trusted

The two pipelines ([`leaderboard.yml`](../.github/workflows/leaderboard.yml) for the puzzle and
[`arcade-leaderboard.yml`](../.github/workflows/arcade-leaderboard.yml) for the mini-games) are part of
`.github/`, which is maintainer-owned. A contributor cannot change what the verifier does, so they
cannot make it accept an unverified result. Trust flows from the maintainer-owned code, not from the
submitter.
