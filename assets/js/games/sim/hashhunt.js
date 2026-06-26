// games/sim/hashhunt.js — "Hash Hunter": the puzzle's central lesson made into a
// game. A secret word was hashed with SHA-256; you can NOT reverse the hash, you
// can only guess inputs and check (exactly how every GSMG door works). Solve the
// riddle, guess the word; the hash confirms only an EXACT match — no partial credit,
// because that's how hashing really behaves. Higher levels = bigger/obscurer pools.
//
// Pure ESM: the win condition is "a guess equals the secret word" (no hashing here),
// so the verifier can replay it deterministically. The browser computes the SHA-256
// only for honest display/confirmation.

import { rngFrom } from '../../engine/rng.js';

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// riddle pools by tier: { w: answer, c: clue }
const POOLS = [
  [
    { w: 'causality', c: 'Cause and effect — the keyword that, hashed, opens Phase 2.' },
    { w: 'hash', c: 'A one-way blender: same input, same scramble; never un-blendable.' },
    { w: 'salt', c: 'Random bytes that make the same password derive a different key.' },
    { w: 'seed', c: '“The ___ is planted.” Where it all begins.' },
    { w: 'spiral', c: 'The counter-clockwise reading order of the genesis grid.' },
  ],
  [
    { w: 'beaufort', c: 'A reciprocal cousin of Vigenère; the Architect keyed it THEMATRIXHASYOU.' },
    { w: 'duality', c: 'Yin and yang; half and better half; the theme of the final lock.' },
    { w: 'genesis', c: 'Satoshi’s first block — and the puzzle’s opening grid.' },
    { w: 'heisenberg', c: 'His uncertainty principle answers a Phase-3 riddle.' },
    { w: 'avalanche', c: 'The effect where one bit flipped changes the whole hash.' },
  ],
  [
    { w: 'yellowblueprimes', c: 'The unconfirmed guess for the dbbi block — colours + primes.' },
    { w: 'lastwordsbeforearchichoice', c: 'A confirmed SalPhaseIon token: spoken before the choice.' },
    { w: 'straddlingcheckerboard', c: 'The Cold-War board behind the VIC cipher layer.' },
    { w: 'matrixsumlist', c: 'Row/column 1-counts of the genesis grid become this token.' },
  ],
];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, POOLS.length - 1); }

/** Deterministic puzzle: the secret answer + its clue + the decoy pool to choose from. */
export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`hashhunt|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const pool = POOLS[tier];
  const idx = Math.floor(rnd() * pool.length);
  const secret = pool[idx];
  return { level: lvl, tier, answer: secret.w, clue: secret.c, poolSize: pool.length, choices: pool.map(p => p.w) };
}

/** moves: array of { guess } strings. Solved when any guess matches the answer.
 *  Fewer guesses = higher score. Deterministic — no hashing required to verify. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  const list = Array.isArray(moves) ? moves.slice(0, 500) : [];
  let guesses = 0, solved = false;
  for (const mv of list) {
    if (!mv || typeof mv.guess !== 'string') continue;
    guesses++;
    if (norm(mv.guess) === norm(p.answer)) { solved = true; break; }
  }
  let score = 0;
  if (solved) {
    const base = 90 * p.level;
    score = base + Math.max(0, 220 - 30 * (guesses - 1));   // first-try = full bonus
  }
  return { solved, score, guesses };
}
