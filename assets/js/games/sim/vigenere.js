// games/sim/vigenere.js — "Vigenère": polyalphabetic key-finding, the family the
// Architect used (Beaufort/Vigenère keyed THEMATRIXHASYOU). Recover the repeating
// key so the ciphertext decrypts to readable text. Longer keys higher up.
// Pure ESM (shared with the verifier).

import { rngFrom } from '../../engine/rng.js';
import { TIERS } from './cryptogram.js';

export const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, TIERS.length - 1); }

function enc(pt, key) { let ki = 0; return pt.replace(/[A-Z]/g, ch => { const k = key.charCodeAt(ki++ % key.length) - 65; return A[(ch.charCodeAt(0) - 65 + k) % 26]; }); }
export function dec(ct, key) { let ki = 0; return ct.replace(/[A-Z]/g, ch => { const k = key.charCodeAt(ki++ % key.length) - 65; return A[(ch.charCodeAt(0) - 65 - k + 26) % 26]; }); }

export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`vigenere|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const plaintext = TIERS[tier][Math.floor(rnd() * TIERS[tier].length)];
  const keyLen = 3 + tier;                                   // 3..5
  const key = Array.from({ length: keyLen }, () => A[Math.floor(rnd() * 26)]).join('');
  return { level: lvl, tier, plaintext, key, keyLen, ciphertext: enc(plaintext, key) };
}

/** moves: { i, g } set key position i to letter g (g==='' clears), or { hint:i }.
 *  Solved when the recovered key equals the real key. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  const key = Array(p.keyLen).fill(null);
  let wrong = 0, hints = 0;
  for (const mv of (Array.isArray(moves) ? moves.slice(0, 1000) : [])) {
    if (mv && typeof mv.hint === 'number') { const i = mv.hint; if (i >= 0 && i < p.keyLen) { key[i] = p.key[i]; hints++; } continue; }
    if (!mv || typeof mv.i !== 'number' || mv.i < 0 || mv.i >= p.keyLen) continue;
    const g = (mv.g || '').toUpperCase();
    if (g === '') { key[mv.i] = null; continue; }
    if (!/^[A-Z]$/.test(g)) continue;
    if (g !== p.key[mv.i]) wrong++;
    key[mv.i] = g;
  }
  const filled = key.filter(Boolean).length;
  const solved = filled === p.keyLen && key.join('') === p.key;
  const score = solved ? 120 * p.level + Math.max(0, 220 - 15 * wrong - 30 * hints) : filled * 8;
  return { solved, score, wrong, hints, filled, keyLen: p.keyLen };
}
