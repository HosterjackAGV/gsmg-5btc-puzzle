# NOTICE — provenance and attribution

This project **merges and vendors** material from other people's work. This file records whose is
whose. It exists because the previous `LICENSE` declared CC0 over the repository as a whole, which
was an overclaim: CC0 can only ever cover *our own* contributions.

Corrected 2026-07-30, after **Naddiseo** — maintainer of one of the upstream repositories — pointed
out that his repository carries **no licence**, and that a repository with no licence is
**all rights reserved**, not free to relicense. He is right, and the correction is his.

---

## Upstream sources vendored here

### 1. `https://github.com/Naddiseo/gsmgio-5btc-puzzle`
**No licence file → all rights reserved by Naddiseo.**

What derives from it:
- the phase-by-phase write-up material merged into [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md)
- the image sets in [assets/walkthrough/](assets/walkthrough/) (79 files), whose folder layout
  mirrors that repository's phase folders — `phase1-assets/`, `phase2-assets/`, `phase2.1-assets/`,
  `phase3-assets/`, `phase3.2-assets/`, `salphaseion-assets/`, `decentraland-assets/`, `hints/`
- specific values and readings attributed to it throughout
  [docs/VERIFIED-SOLUTIONS.md](docs/VERIFIED-SOLUTIONS.md), including the 2023-02-23 reverse-binary
  master-hint decode recorded there as single-source-Naddiseo

### 2. `https://github.com/puzzlehunt/gsmgio-5btc-puzzle`
**No licence file → all rights reserved by its authors.**

What derives from it:
- write-up material merged into [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md)
- issue-thread content summarised in [docs/ATTEMPTS.md](docs/ATTEMPTS.md) (e.g. issues #56, #69)
- README prose readings recorded in [docs/VERIFIED-SOLUTIONS.md](docs/VERIFIED-SOLUTIONS.md)

### 3. The puzzle's creator (GSMG, anonymous)
Puzzle images, published ciphertext blobs, hint posts and the creators' messages. **Copyright their
author.** Reproduced for preservation and study. This project is not affiliated with GSMG.

> Note on ownership, so this file does not overcorrect: the *puzzle artifacts* belong to the puzzle's
> creator, not to the upstream solver repositories. Vendoring an image via an upstream repo does not
> transfer it to that repo's maintainer. Sections 1 and 2 cover those maintainers' **own expression**
> — their write-ups, explanations, selection and arrangement.

---

## What this project contributes, and dedicates to the public domain

- the site (`assets/js/**`, `assets/css/**`, `index.html`)
- the verification harness `.github/scripts/verify.mjs` — re-derives the documented chain from the
  real artifacts, 18 assertions
- the analysis and editorial prose written here, and the corrections, audits and null results
- `content/**` compilations, to the extent they are original expression

These are CC0 1.0. See [LICENSE](LICENSE).

---

## Why vendored rather than forked

Naddiseo's point, recorded because it is the correct criticism: **forking preserves lineage and
attribution; vendoring does not.** This repository restructured and merged several sources into one
document, which is why it copied rather than forked — but that choice put the burden of attribution
on files like this one, and until now that burden was not met.

**If you want the upstream work, go upstream and fork it.** The links are above.

## Requests

Any copyright holder who wants their material removed, attributed differently, or corrected:
open an issue or contact the maintainer, and it will be done promptly.
