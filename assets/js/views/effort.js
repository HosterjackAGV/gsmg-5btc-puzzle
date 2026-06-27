// views/effort.js — "Community effort": the hub for cracking the unsolved remainder.
// Brings the frontier studies, trials, and hypotheses together in one place:
// the three OPEN problems (sourced from the audited reference, with honest status),
// the dead-end ledger (trials ruled out), the live tester, and the verified board.

import { LEDGER } from '../../../content/ledger.js';
import { CHALLENGES } from '../../../content/challenges.js';
import { esc } from '../util.js';

const OPEN = [
  {
    target: 'dbbi', title: 'dbbi → “yellowblueprimes”?', meta: '91 symbols (91 = 7×13) · base-9 block',
    body: 'A 91-symbol SalPhaseIon block. The target word is only <b>named</b> by a hint — the literal string <span class="mono">yellowblueprimes</span> is absent from dbbi in every tested base, and all decode attempts produce garbage.',
    status: '⚠️ UNVERIFIED hypothesis', cls: 'gold', go: '#/phase/salphaseion',
  },
  {
    target: 'faed', title: 'faed → “yinyang”?', meta: '570 symbols (570 = 2·3·5·19) · base-9 block',
    body: 'A 570-symbol block whose statistics — index of coincidence ≈ <span class="mono">0.118</span>, near-random — suggest it may not even be enciphered English. Exhaustive sweeps return only noise.',
    status: '⚠️ UNVERIFIED hypothesis', cls: 'gold', go: '#/phase/salphaseion',
  },
  {
    target: 'cosmic', title: 'Cosmic Duality — the final lock', meta: 'AES-256-CBC · salt 2d3f6fe06dc950e6',
    body: 'Even <i>with</i> both tokens, the <b>combine-operation</b> is disputed: concatenate-then-sha256? an XOR of seven token-hashes? something else? <b>No recipe has ever decrypted the blob</b> — every guess fails with AES “invalid padding”.',
    status: '⚠️ OPEN — the prize', cls: 'rust', go: '#/phase/cosmic',
  },
];

export default async function effortView() {
  const openCards = OPEN.map(o => `
    <div class="card hover eff-open">
      <div class="spread"><span class="pill ${o.cls}">🎯 ${esc(o.target)}</span><span class="faint mono" style="font-size:10.5px">${o.status}</span></div>
      <h3 style="margin:10px 0 4px;font-size:16px">${o.title}</h3>
      <div class="faint mono" style="font-size:11px;margin-bottom:8px">${o.meta}</div>
      <p class="muted" style="font-size:13.5px">${o.body}</p>
      <a class="btn gold sm" href="${o.go}">Test recipes →</a>
    </div>`).join('');

  const entries = [
    ['🪦', 'Dead-end ledger', `${LEDGER.length} attacks already run and ruled out — don’t re-walk them.`, '#/ledger'],
    ['🛰️', 'The frontier', 'Test a candidate against the real Cosmic / SalPhaseIon blob — live.', '#/frontier'],
    ['🔧', 'Workbench', 'Hash, derive keys, and try recipes with the in-browser crypto engine.', '#/workbench'],
    ['🐝', 'The Hive', 'The shared, deduplicated, self-verifying board of every tried recipe.', '#/leaderboard'],
    ['🎯', 'Challenges', 'Claim a clearly-scoped sweep so no two people cover the same ground.', '#/community'],
    ['📖', 'Walkthrough', 'The full audited reference for everything solved, with exact values.', '#/walkthrough'],
  ];

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">COMMUNITY EFFORT</div><h2>Crack the remainder, together</h2>
      <p>The puzzle is solid and reproducible through Phase 3.2 — then it goes dark. Three things stand between the community and 5 BTC, and this is where the collective effort to break them lives: the open studies, every trial already ruled out, the live tester, and the verified board. <b>The only proof of a solve is moving the on-chain prize</b> — nothing else counts.</p></div>

    <h3>The open frontier — three unsolved problems</h3>
    <div class="grid cols-3" style="margin-bottom:10px">${openCards}</div>

    <div class="note key">
      <h4>◆ The candidate endgame recipe — <span class="gold">⚠️ unproven hypothesis, not a solution</span></h4>
      <p class="mono" style="font-size:12.5px;color:var(--paper)">privkey = AES-256-CBC-decrypt( cosmic blob,&nbsp; key = sha256("yellowblueprimes" + "matrixsumlist" + "lastwordsbeforearchichoice" + "yinyang") )</p>
      <p>This is <i>structurally</i> consistent with the puzzle’s answer → sha256 → AES pattern, but it has <b>never been shown to work</b>, and two of its four ingredients aren’t even confirmed. A competing theory proposes an XOR of seven token-hashes instead. Treat both as leads to test, not facts. (Sourced from the <a href="#/walkthrough">verified reference</a>, §4.)</p>
    </div>

    <h3 style="margin-top:26px">Where the work happens</h3>
    <div class="eff-grid">
      ${entries.map(([ico, t, d, href]) => `<a class="eff-card" href="${href}"><div class="eff-ico">${ico}</div><div><b>${esc(t)}</b><p>${esc(d)}</p></div></a>`).join('')}
    </div>

    <h3 style="margin-top:26px">Coordinate a sweep</h3>
    <p class="cnote">Each challenge carves the search into a defined region with a measurable “done”, so effort isn’t duplicated. Run it on the frontier; report verified attempts to the Hive.</p>
    <div class="grid cols-3">${CHALLENGES.slice(0, 3).map(c => `
      <div class="card"><div class="spread"><span class="pill gold">🎯 ${esc(c.target)}</span><span class="faint mono" style="font-size:11px">${'★'.repeat(c.difficulty || 1)}${'☆'.repeat(5 - (c.difficulty || 1))}</span></div>
        <h3 style="margin:10px 0 6px;font-size:15px">${esc(c.title)}</h3>
        <p class="muted" style="font-size:13px">${esc(c.desc)}</p>
        <a class="btn ghost sm" href="#/community">All challenges →</a></div>`).join('')}</div>

    <div class="note" style="margin-top:22px"><p class="muted">The ethos throughout: <b>no guessing, verified findings only, all negatives documented.</b> A clean negative is a real contribution — it retires a region of the problem for everyone.</p></div>
  </div></section>`;

  return { title: 'Community effort', html };
}
