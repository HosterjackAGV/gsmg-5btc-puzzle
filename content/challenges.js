// challenges.js — seed coordination challenges for the open frontier.
// A challenge is a clearly-scoped sweep so the community covers the search
// space systematically instead of randomly. Users "accept" one, run the
// attempts in the workbench/frontier (auto-verified), and report results.
// Live community challenges are also pulled from GitHub issues labelled
// "challenge" (see views/community.js).

export const CHALLENGES = [
  {
    id: 'ch-dbbi-bases', target: 'dbbi', difficulty: 2,
    title: 'Sweep every base reading of dbbi',
    desc: 'Decode the 91-symbol dbbi block under every plausible base/index mapping (a=0 vs a=1, base-9/10/16, octal) and check each candidate against the Cosmic blob.',
    goal: 'Confirm or kill the “yellowblueprimes” hypothesis for dbbi.',
  },
  {
    id: 'ch-faed-reverse', target: 'faed', difficulty: 3,
    title: 'faed, reversed & transposed',
    desc: 'Read the 570-symbol faed block in reverse, and under simple columnar transpositions, before the standard field-decode. Its statistics look near-random — prove or disprove it carries “yinyang”.',
    goal: 'Find any reading of faed that isn’t garbage.',
  },
  {
    id: 'ch-recipe-order', target: 'cosmic', difficulty: 2,
    title: 'Permute the four-token recipe',
    desc: 'Assuming the four tokens are right, try every ordering and separator of sha256(yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang) against Cosmic Duality.',
    goal: 'Rule out the “just the order is wrong” explanation.',
  },
  {
    id: 'ch-xor-theory', target: 'cosmic', difficulty: 4,
    title: 'Test the XOR-of-hashes theory',
    desc: 'A competing theory (issue #56) proposes XORing the SHA-256 hashes of several tokens to form the key. Systematically test that family against Cosmic.',
    goal: 'Verify or retire the XOR recipe shape.',
  },
  {
    id: 'ch-master-hint', target: 'cosmic', difficulty: 3,
    title: 'Mine the master hint literally',
    desc: 'The 2023 master hint lists eight tokens. Try recipes built from the full eight (not just four), including the taunt phrases, as the passphrase.',
    goal: 'Check whether the “extra” tokens belong in the key.',
  },
];

export const getChallenge = (id) => CHALLENGES.find(c => c.id === id) || null;
