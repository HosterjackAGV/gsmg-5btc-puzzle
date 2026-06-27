// games/sim/freqanalysis.js — "Frequency Analysis": the Index of Coincidence trick.
// A repeating key flattens letter frequencies, hiding the plaintext. But if you slice
// the ciphertext into N columns where N is the key length, each column is back to a
// simple substitution — and its IC jumps from ~0.038 (random) toward ~0.066 (English).
// Find the key length by spotting the IC spike. This is exactly the "column-IC period
// detection" the dead-end ledger ran on dbbi & faed. Pure ESM (shared with verifier).

import { rngFrom } from '../../engine/rng.js';

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const IC_ENGLISH = 0.0667, IC_RANDOM = 0.0385;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const PASSAGES = [
  'IN CRYPTOGRAPHY THE INDEX OF COINCIDENCE MEASURES HOW OFTEN TWO LETTERS DRAWN FROM A TEXT HAPPEN TO MATCH FOR ORDINARY ENGLISH THIS VALUE SITS NEAR ZERO POINT ZERO SIX SIX BUT FOR RANDOM LETTERS IT FALLS TO ZERO POINT ZERO THREE EIGHT AND THAT SIMPLE GAP IS ENOUGH TO BREAK A CIPHER',
  'THE ARCHITECT HID HIS CONFESSION BEHIND LAYERS OF CLASSIC CIPHERS A REPEATING KEY SPREADS THE LETTER FREQUENCIES FLAT SO THAT SIMPLE COUNTING NO LONGER REVEALS THE PLAINTEXT ONLY BY SLICING THE MESSAGE INTO COLUMNS THAT SHARE A SINGLE KEY LETTER DOES THE FAMILIAR SHAPE OF ENGLISH RETURN AGAIN',
  'EVERY DOOR IN THIS PUZZLE REWARDS PATIENCE AND PUNISHES GUESSING THE SEED WAS PLANTED IN A GRID OF BLACK AND WHITE SQUARES AND FROM THAT FIRST IMAGE A LONG CHAIN OF HASHES AND ENVELOPES LEADS TOWARD A FINAL LOCK THAT NO ONE HAS YET OPENED THE INDEX OF COINCIDENCE IS ONE MORE TOOL FOR READING WHAT HIDES IN PLAIN SIGHT',
];
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, PASSAGES.length - 1); }

export const lettersOnly = (s) => String(s).toUpperCase().replace(/[^A-Z]/g, '');
function enc(pt, key) { let ki = 0; return pt.replace(/[A-Z]/g, ch => { const k = key.charCodeAt(ki++ % key.length) - 65; return A[(ch.charCodeAt(0) - 65 + k) % 26]; }); }

/** Average per-column Index of Coincidence if the text is split into `period` columns. */
export function icForPeriod(ciphertext, period) {
  const L = lettersOnly(ciphertext);
  let total = 0, cols = 0;
  for (let i = 0; i < period; i++) {
    let N = 0; const f = {};
    for (let j = i; j < L.length; j += period) { f[L[j]] = (f[L[j]] || 0) + 1; N++; }
    if (N < 2) continue;
    let s = 0; for (const c in f) s += f[c] * (f[c] - 1);
    total += s / (N * (N - 1)); cols++;
  }
  return cols ? total / cols : 0;
}

export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`freq|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const plaintext = PASSAGES[tier];
  const lo = 2 + tier, hi = 3 + tier;                 // key length grows with tier (2..6)
  const keyLen = lo + Math.floor(rnd() * (hi - lo + 1));
  // Of several candidate keys, take the one that flattens the whole-text IC most, so
  // period-1 (no key) is clearly NOT a spike and the true-period spike stands out.
  let key = null, bestIc = Infinity;
  for (let t = 0; t < 12; t++) {
    const k = Array.from({ length: keyLen }, () => A[Math.floor(rnd() * 26)]).join('');
    const ic = icForPeriod(enc(plaintext, k), 1);
    if (ic < bestIc) { bestIc = ic; key = k; }
  }
  const maxPeriod = 10;
  return { level: lvl, tier, plaintext, key, keyLen, ciphertext: enc(plaintext, key), maxPeriod };
}

/** moves: [{ guess: <period> }]. Solved when a guess equals the true key length. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  let guesses = 0, solved = false;
  for (const mv of (Array.isArray(moves) ? moves.slice(0, 200) : [])) {
    if (mv && typeof mv.guess === 'number') { guesses++; if (mv.guess === p.keyLen) { solved = true; break; } }
  }
  const score = solved ? 130 * p.level + Math.max(0, 200 - 40 * (guesses - 1)) : 0;
  return { solved, score, guesses, keyLen: p.keyLen };
}
