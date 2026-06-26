// games/sim/spiralcipher.js — "Spiral Cipher": Phase-0's technique, generalized.
// A word's ASCII bits are laid along a counter-clockwise spiral on a grid; you must
// read the spiral, group into bytes, and recover the word. Bigger grids higher up.
// Pure ESM (shared with the verifier). Win condition = the typed word is correct.

import { rngFrom } from '../../engine/rng.js';

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const BANKS = [
  ['seed', 'gold', 'node', 'salt', 'hash'],
  ['matrix', 'cipher', 'duality', 'genesis'],
  ['architect', 'spectrogram', 'innersanctum'],
];
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, BANKS.length - 1); }

function wordToBits(w) { return [...new TextEncoder().encode(w)].map(b => b.toString(2).padStart(8, '0')).join(''); }

/** counter-clockwise spiral peel from the top-left: down the left column, right
 *  along the bottom, up the right column, left along the top, then inward. */
export function spiralCCW(n) {
  const path = []; let top = 0, bottom = n - 1, left = 0, right = n - 1;
  while (top <= bottom && left <= right) {
    for (let r = top; r <= bottom; r++) path.push([r, left]); left++;
    for (let c = left; c <= right; c++) path.push([bottom, c]); bottom--;
    if (left <= right) { for (let r = bottom; r >= top; r--) path.push([r, right]); right--; }
    if (top <= bottom) { for (let c = right; c >= left; c--) path.push([top, c]); top++; }
  }
  return path;
}

export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`spiral|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const bank = BANKS[tier];
  const word = bank[Math.floor(rnd() * bank.length)];

  const bits = wordToBits(word);
  const n = Math.ceil(Math.sqrt(bits.length));
  const path = spiralCCW(n);
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < bits.length; i++) { const [r, c] = path[i]; grid[r][c] = +bits[i]; }
  return { level: lvl, tier, word, n, grid, path, bitLen: bits.length };
}

/** moves: [{ guess }] and optional [{ hint:1 }]. Solved when a guess matches. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  let guesses = 0, hints = 0, solved = false;
  for (const mv of (Array.isArray(moves) ? moves.slice(0, 500) : [])) {
    if (mv && mv.hint) { hints++; continue; }
    if (mv && typeof mv.guess === 'string') { guesses++; if (norm(mv.guess) === norm(p.word)) { solved = true; break; } }
  }
  const score = solved ? 100 * p.level + Math.max(0, 220 - 25 * (guesses - 1) - 30 * hints) : 0;
  return { solved, score, guesses, hints };
}
