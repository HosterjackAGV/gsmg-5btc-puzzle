# Leaderboard data (machine-written — do not edit by hand)

These files are rebuilt automatically by `.github/workflows/leaderboard.yml`.

- **`attempts.jsonl`** — the append-only, deduplicated global log. One JSON object per line:
  `{ "id", "by", "gh", "blob", "result", "frontier", "ts" }`.
  `id = sha256(blob + "|" + recipe + "|" + (prehash?"1":"0"))` — the exact dedup key.
  Note: only the fingerprint is stored, not the raw recipe (recipes live in the source issues).
- **`leaderboard.json`** — the rendered ranking the page reads:
  `{ "updated", "solved", "rows":[{handle,tries,frontier,novel,last}], "totals":{...} }`.
- **`SOLVED.json`** — written only if a submitted attempt produced a *valid decryption of the Cosmic Duality blob*.

Every attempt is re-verified server-side (in CI) by actually running AES against the public
ciphertexts in `/ciphertexts`, so a claimed result that isn't reproducible is silently corrected.

To rebuild manually: Actions → **GSMG leaderboard** → **Run workflow**.
