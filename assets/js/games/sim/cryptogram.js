// games/sim/cryptogram.js — PURE deterministic logic for the Cryptogram game.
//
// This module has NO DOM. It is imported by the browser game (to build/score the
// puzzle the player sees) AND by the CI verifier (.github/scripts/verify-arcade.mjs)
// to RE-SIMULATE a submitted move-log and recompute the authoritative score.
// Because the puzzle is a pure function of (seed, level), the same inputs produce
// the same puzzle everywhere — so a player cannot claim a score their moves didn't
// actually earn. Keep this file dependency-free and deterministic.

import { rngFrom, shuffle } from '../../engine/rng.js';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Puzzle / crypto / GSMG-flavoured quote bank, grouped by difficulty tier.
// Letters only get enciphered; spaces and punctuation stay as separators.
export const TIERS = [
  [ // tier 0 — short, gentle
    'THE SEED IS PLANTED',
    'NO GUESSING ONLY PROOF',
    'TRUST THE MATH',
    'EVERY DOOR HAS A KEY',
    'HASH THEN DECRYPT',
    'SALT MAKES IT UNIQUE',
  ],
  [ // tier 1 — medium
    'A WRONG KEY GIVES YOU NOTHING NOT A HINT',
    'ORDER AND CHAOS ARE THE SAME PATTERN',
    'THE ARCHITECT LEFT CLUES IN PLAIN SIGHT',
    'COSMIC DUALITY GUARDS THE FINAL LOCK',
    'VERIFY EVERYTHING REPRODUCE EVERYTHING',
  ],
  [ // tier 2 — long, spicy
    'WHAT IS HIDDEN IN PLAIN SIGHT IS HARDEST TO SEE WITHOUT THE RIGHT EYES',
    'A CIPHER KEEPS ITS SECRET UNTIL THE EXACT KEY TURNS THEN IT SPEAKS PLAINLY',
    'THE SEED CONTAINS THE TREE AND THE TREE REMEMBERS EVERY SEED IT EVER WAS',
  ],
];

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/** tier index for a 1-based level. */
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, TIERS.length - 1); }

/** Build the puzzle for (seed, level). Deterministic. */
export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`cryptogram|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const bank = TIERS[tier];
  const plaintext = bank[Math.floor(rnd() * bank.length)];

  // random monoalphabetic substitution, avoiding any letter mapping to itself
  let cipherAlpha = shuffle(rnd, ALPHABET.split(''));
  for (let i = 0; i < 26; i++) {
    if (cipherAlpha[i] === ALPHABET[i]) { const j = (i + 1) % 26; [cipherAlpha[i], cipherAlpha[j]] = [cipherAlpha[j], cipherAlpha[i]]; }
  }
  const p2c = {}, c2p = {};
  for (let i = 0; i < 26; i++) { p2c[ALPHABET[i]] = cipherAlpha[i]; c2p[cipherAlpha[i]] = ALPHABET[i]; }

  const ciphertext = plaintext.replace(/[A-Z]/g, ch => p2c[ch]);
  const distinct = [...new Set(ciphertext.replace(/[^A-Z]/g, '').split(''))];

  // free hint budget shrinks as levels rise
  const hintBudget = clamp(4 - tier, 1, 4);
  return { level: lvl, tier, plaintext, ciphertext, p2c, c2p, distinct, hintBudget };
}

/** Re-simulate a move-log against a freshly-built puzzle; return the truth.
 *  moves: array of { c, g } assignments (g==='' clears) and { hint: <cipherChar> }.
 *  Returns { solved, score, wrong, hints, filled, distinct }. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  const map = {};                 // cipherChar -> guessed plainChar
  let wrong = 0, hints = 0;
  const list = Array.isArray(moves) ? moves.slice(0, 2000) : [];

  for (const mv of list) {
    if (mv && typeof mv.hint === 'string') {
      const c = mv.hint.toUpperCase();
      if (p.c2p[c]) { map[c] = p.c2p[c]; hints++; }
      continue;
    }
    if (!mv || typeof mv.c !== 'string') continue;
    const c = mv.c.toUpperCase();
    if (!p.c2p[c]) continue;            // not a cipher letter in this puzzle
    const g = (mv.g || '').toUpperCase();
    if (g === '') { delete map[c]; continue; }
    if (!/^[A-Z]$/.test(g)) continue;
    if (g !== p.c2p[c]) wrong++;        // count mistakes at assignment time
    map[c] = g;
  }

  const filled = p.distinct.filter(c => map[c]).length;
  const solved = p.distinct.length > 0 && p.distinct.every(c => map[c] === p.c2p[c]);

  // Scoring: bounded by level. Solving cleanly (no hints, no mistakes) is best.
  let score;
  if (solved) {
    const base = 100 * p.level;
    const bonus = Math.max(0, 200 - 10 * wrong - 25 * Math.max(0, hints - p.hintBudget) - 8 * Math.min(hints, p.hintBudget));
    score = base + bonus;
  } else {
    score = filled * 5; // partial credit for progress, can't rival a real solve
  }
  return { solved, score, wrong, hints, filled, distinct: p.distinct.length };
}
