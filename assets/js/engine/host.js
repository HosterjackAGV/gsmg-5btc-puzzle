// engine/host.js — the bridge between a mini-game and the rest of the app.
// The Arcade view builds a host, then calls game.start(host). Games stay
// self-contained: they render into host.el and report results back through here.

import * as store from '../store.js';
import { createLoop } from './loop.js';
import { rngFrom } from './rng.js';
import { toast, confetti } from '../util.js';

export function createHost({ el, game, navigate }) {
  return {
    el,                       // the DOM container the game renders into
    game,                     // the game's meta object
    navigate,
    toast,
    confetti,

    /** seeded RNG factory for deterministic play */
    rng: rngFrom,
    /** a delta-time RAF loop (for idle/animated games) */
    loop: (step) => createLoop(step),

    /** persist arbitrary state for an idle game (e.g. offline progress) */
    saveState: (obj) => store.setIdleState(game.id, obj),
    loadState: () => store.getIdleState(game.id),

    /** the player's best verified score for this game */
    bestScore: () => store.arcadeBest(game.id),

    /** skill games call this when a round ends. Records it locally (dedup +
     *  personal best + XP) and returns the stored record. The competitive board
     *  only counts results that the CI verifier can re-simulate. */
    reportResult({ seed, level, moves, score, solved }) {
      return store.logArcadeResult({ game: game.id, seed, level, moves: moves || [], score, solved: !!solved });
    },

    addXp: (n) => store.addXp(n),
  };
}
