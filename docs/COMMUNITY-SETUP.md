# Community setup (one-time)

The game's community layer is **GitHub-native** — no server, no database. It uses:

- **GitHub Issues + Actions** for the leaderboard and challenges (already working).
- **giscus (GitHub Discussions)** for per-door comments (needs the steps below).

Everything degrades gracefully: until comments are configured, the game shows a tidy "set up comments"
note instead of breaking. Challenges already work (they're issues labelled `challenge`).

## Enable comments (giscus)

1. **Enable Discussions** on the repo: *Settings → General → Features → ✅ Discussions*.
2. Create a Discussions **category** to hold door threads — e.g. name it **Doors**, format *Announcement*
   (so only maintainers/giscus can open threads, keeping it tidy).
3. Install the **giscus GitHub App** on this repo: <https://github.com/apps/giscus> → *Install* → select
   this repository.
4. Go to <https://giscus.app>, enter the repo `HosterjackAGV/gsmg-5btc-puzzle`, pick mapping
   **"Discussion title contains a specific term"**, and choose the **Doors** category. The page generates
   a snippet containing `data-repo-id` and `data-category-id`.
5. Open [content/config.js](../content/config.js) and fill them in:
   ```js
   giscus: {
     configured: true,                 // ← flip this on
     repo: 'HosterjackAGV/gsmg-5btc-puzzle',
     repoId: 'R_xxxxxxxxxx',            // ← from giscus.app
     category: 'Doors',
     categoryId: 'DIC_xxxxxxxxxx',      // ← from giscus.app
     theme: 'transparent_dark',
   }
   ```
6. Commit. Every phase page now has its own comment thread (keyed by the phase id), plus a global thread
   on the Community page. Visitors comment by signing in with GitHub.

## How challenges work

- Anyone clicks **"Propose a challenge"** on the Community page → opens a pre-filled issue using
  [.github/ISSUE_TEMPLATE/challenge.yml](../.github/ISSUE_TEMPLATE/challenge.yml) (labelled `challenge`).
- The Community view fetches open `challenge` issues via the public GitHub API and lists them live
  alongside the built-in seed challenges.
- Results are reported as **verified attempts** through the Hive, which the existing leaderboard Action
  re-runs against the real ciphertexts — so a "completed" challenge is backed by reproducible crypto, not
  a claim.

No secrets or tokens are stored in the page; the GitHub App handles auth for comments, and the leaderboard
Action runs with the repo's built-in `GITHUB_TOKEN`.
