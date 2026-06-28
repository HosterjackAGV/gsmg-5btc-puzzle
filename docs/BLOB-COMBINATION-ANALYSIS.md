# GSMG — "Combine the loose ends / scattered-AES" Analysis

Hypothesis tested (user-proposed): the 4 AES blobs (and other loose ends) are **pieces of one structure** —
e.g. a single AES key/message scattered across them — and concatenating/mixing loose ends by type, then
across types, might make one unlock another or reveal hidden structure.

**Result: NO connection found.** ~35,000 structured combinations tested; every apparent hit is chance
PKCS7 noise. The four blobs are provably **independent**. Full method + list below.

---

## The 4 AES blobs (the core "pieces")
| blob | salt (8B) | ct bytes | blocks | where found |
|---|---|---|---|---|
| cosmic | `2d3f6fe06dc950e6` | 1328 | 83 | SalPhaseIon page, after "Cosmic Duality" |
| salph_inner | `3ab585348552415d` | 80 | 5 | embedded in the SalPhaseIon soup |
| p32_trailing | `b45a5e3d827593ca` | 80 | 5 | end of phase-3.2 plaintext |
| urlblob | `74c974e3f92e64b5` | 96 | 6 | hex `Salted__` gsmg.io URL path |

## Structural independence (decisive negatives)
- **No shared 16-byte ciphertext blocks** across any pair of blobs → they do not encrypt the same
  plaintext under the same key/IV. (If they were one scattered message they'd likely share structure.)
- **salph_inner ⊕ p32_trailing** (both 80B) = high-entropy garbage (printable 0.48) → no shared keystream/plaintext.
- **4 salts concatenated** (32B) = random bytes; no ASCII/base58/word; not a usable AES-256 key on any blob.
- Each blob is standard OpenSSL `aes-256-cbc -md sha256` with its OWN random salt → each needs its OWN passphrase.

---

## What was tried (the list) — all 0 real hits

### A. Blobs as one structure ("scattered AES")
1. **4 salts → 32-byte AES key**, all 24 orderings, as (a) direct AES-256-CBC key with IV∈{0, salt‖salt, key[:16]},
   (b) EVP passphrase raw, (c) EVP passphrase hex, (d) sha256(key) — on all 4 blobs. (1008 tests)
2. **3-salt and 2-salt** concatenations as key material (same forms).
3. **Salt math**: XOR of all 4 salts, byte-sum mod 256, sha256(concat salts) → key on all blobs.
4. **Cross-blob keying**: each blob's ciphertext (and sha256(ct), ct[:32], base64(ct)) used as the
   passphrase/key for every OTHER blob. (all pairs)
5. **Ciphertext concatenation**: all 24 orderings of the 4 cts joined, decrypted as one blob using each
   blob's salt + the chain keys (eb3efb…, 250f37…, 89727c…) + token keys.
6. **XOR of the two equal-size blobs**; **repeated-block scan** across all blobs.

### B. Loose-end VALUES combined (by type, then across types)
7. **Within-type** 2- and 3-permutations: TOKENS {yellowblueprimes, matrixsumlist, lastwordsbeforearchichoice,
   yinyang, enter, thispassword}; SUMS+SALTS; NUMBERS {11110,140,104,91,570,23,16,7,1141,2357,42}; SALTS.
8. **Cross-type pairs**: every token × every {sum, salt, number, phrase}, both orders, seps ∈ {'', +, _}.
9. **The 4 ingredients + enter/thispassword**: all 24 orders × {∅, enter, thispassword, both}.
10. Each candidate hashed as {sha256hex, literal, raw-sha256, double-sha256} and tested against **all 4 blobs**,
    with explicit detection of any key opening **≥2 blobs** (the "scattered" signature).

### Detection
- A key opening ≥2 blobs would be the "one AES scattered" signature. **4 such multi-blob events occurred —
  ALL chance noise** (printable 0.30–0.49 = random bytes; ~3 expected by chance at this test volume). No
  candidate opened any blob to readable text.

---

## What this rules out / what remains
- **RULED OUT:** the 4 blobs being one scattered AES key/message; salts-as-key; cross-blob keying;
  ciphertext concatenation; simple value-concatenation recipes (within/cross type, 2–6 tuples).
- **STILL OPEN (not a "combination" issue):** each blob's *individual* passphrase. The blobs are independent,
  so the path is still: derive `yellowblueprimes`/`yinyang` (genesis) → open cosmic; OR find the LOCAL key to
  a small blob (salph_inner via "enter/thispassword/first-hint"; p32_trailing via the chess-board construction;
  urlblob via its provenance). Combination logic does not bridge them.

## Honest conclusion
The "there must be a connection between the blobs" intuition is reasonable, but cryptographically the four
blobs are **independent containers**, not fragments of one cipher. The connection in this puzzle is at the
**key-derivation/narrative** layer (the same ingredients/answers feed different blobs), not at the
ciphertext/salt layer. Mixing the blobs or their salts does not unlock anything.
