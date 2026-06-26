// games/sim/binarydecode.js — "Binary Decoder": the SalPhaseIon a/b chunks
// (e.g. the 'enter' and 'matrixsumlist' tokens were two-symbol binary → 8-bit
// ASCII). Assign each symbol a bit so it decodes to a real word. Standard a=0,b=1
// at first; flipped higher up so you must deduce it. Pure ESM (shared w/ verifier).

import { rngFrom } from '../../engine/rng.js';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const BANKS = [
  ['enter', 'seed', 'salt', 'node'],
  ['matrix', 'cipher', 'duality', 'genesis'],
  ['matrixsumlist', 'lastwords', 'architect'],
];
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, BANKS.length - 1); }

function wordToBits(w) { return [...new TextEncoder().encode(w)].map(b => b.toString(2).padStart(8, '0')).join(''); }

export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`binary|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const word = BANKS[tier][Math.floor(rnd() * BANKS[tier].length)];
  const bits = wordToBits(word);
  const flipped = lvl >= 4;                         // b=0,a=1 — must be deduced
  const bit2sym = flipped ? { '0': 'b', '1': 'a' } : { '0': 'a', '1': 'b' };
  const sym2bit = flipped ? { b: 0, a: 1 } : { a: 0, b: 1 };
  const symbolString = [...bits].map(b => bit2sym[b]).join('');
  return { level: lvl, tier, word, bits, symbolString, flipped, sym2bit, distinct: ['a', 'b'] };
}

/** moves: { s, b } assign symbol s to bit b (b: 0|1, ''=clear), or { hint:s }. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  const map = {};                  // symbol -> bit
  let wrong = 0, hints = 0;
  for (const mv of (Array.isArray(moves) ? moves.slice(0, 1000) : [])) {
    if (mv && typeof mv.hint === 'string') { if (p.sym2bit[mv.hint] != null) { map[mv.hint] = p.sym2bit[mv.hint]; hints++; } continue; }
    if (!mv || (mv.s !== 'a' && mv.s !== 'b')) continue;
    if (mv.b === '' || mv.b == null) { delete map[mv.s]; continue; }
    const b = +mv.b; if (b !== 0 && b !== 1) continue;
    if (b !== p.sym2bit[mv.s]) wrong++;
    map[mv.s] = b;
  }
  const filled = p.distinct.filter(s => map[s] != null).length;
  let solved = false;
  if (filled === 2) {
    const bits = [...p.symbolString].map(s => map[s]).join('');
    let out = '';
    for (let i = 0; i + 8 <= bits.length; i += 8) out += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2));
    solved = out === p.word;
  }
  const score = solved ? 90 * p.level + Math.max(0, 160 - 20 * wrong - 30 * hints) : filled * 10;
  return { solved, score, wrong, hints, filled };
}
