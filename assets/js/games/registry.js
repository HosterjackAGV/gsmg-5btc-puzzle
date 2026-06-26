// games/registry.js — the catalog of mini-games. Display metadata + a lazy
// loader per game. Adding a game = add an entry here + a module that exports
// start(host) (+ a sim under games/sim/ if it should be leaderboard-verifiable).
//
// kind:  'skill' → deterministic, replay-verified, ranks on the arcade board.
//        'idle'  → relaxed/idle play, grants XP + personal milestones (not ranked,
//                  because idle scores can't be cryptographically verified).
// Each entry's `concept` ties the game to a real piece of the puzzle.

export const GAMES = [
  {
    id: 'cryptogram', title: 'Substitution', kind: 'skill', icon: '🔡',
    verifiable: true, difficulty: 'scales 1–8',
    concept: 'Monoalphabetic substitution — the exact attack family run against the dbbi & faed blocks.',
    blurb: 'Drag letters to break a secret code. Each cipher letter always stands for the same real letter — find the whole mapping. Longer quotes and fewer hints as you level up.',
    load: () => import('./cryptogram.js'),
  },
  {
    id: 'hashminer', title: 'Hash Miner', kind: 'idle', icon: '⛏️',
    verifiable: false, difficulty: 'endless',
    concept: 'SHA-256 proof-of-work — why "mining" means guessing trillions of inputs to hit a rare output.',
    blurb: 'Run a hash rig that searches for ever-rarer SHA-256 outputs. Spend the hashes you find on faster rigs and watch it snowball — even while you are away.',
    load: () => import('./hashminer.js'),
  },
];

export const byId = (id) => GAMES.find(g => g.id === id) || null;
