// views/home.js — clean landing: hero, prize status, and a phase index that links
// into the complete walkthrough. No game, no XP, no community — just the puzzle.

import { PHASES } from '../../../content/phases.js';
import { esc } from '../util.js';

export default async function homeView() {
  const doors = PHASES.map(p => {
    const state = p.status === 'open' ? '◆ unsolved' : p.status === 'frontier' ? '◐ frontier' : '✅ solved';
    const cls = ['door', p.status !== 'solved' ? 'open-door' : 'cracked'].join(' ');
    return `<a class="${cls}" data-status="${p.status}" href="#/walkthrough">
      <div class="top"><span class="num">PHASE ${esc(p.num)}</span>
        <span class="difficulty">${[1,2,3,4,5].map(n => `<i class="${n <= p.difficulty ? 'on' : ''}"></i>`).join('')}</span></div>
      <h3>${esc(p.codename)}</h3>
      <p class="tag">${esc(p.tagline)}</p>
      <div class="foot"><span class="state">${state}</span>${p.status === 'solved' ? '' : '<span class="xpbadge gold">5 BTC</span>'}</div>
    </a>`;
  }).join('');

  const html = `
  <section class="hero"><div class="wrap">
    <div class="kick">
      <span class="pill gold">⛓ unsolved · 2026</span>
      <span class="pill">~1.25 BTC bounty</span>
      <span class="pill blue">the complete walkthrough</span>
    </div>
    <h1>GSMG.io <span class="yin">5&nbsp;BTC</span> <span class="yang">Puzzle</span></h1>
    <p class="lede">The complete, <b>authoritative, source-merged</b> walkthrough of the unsolved <b>GSMG.io 5 BTC cryptographic puzzle</b> — every phase, every exact value, and every image, assembled from all public sources into one reference. Solved and reproducible through <b>Phase 3.2</b>; the final <b>Cosmic Duality</b> lock is still open.</p>
    <div class="row" style="gap:12px;margin-bottom:26px">
      <a class="btn primary lg" href="#/walkthrough">▶ Read the complete walkthrough</a>
      <a class="btn ghost lg" href="#/reference">Reference sheet</a>
    </div>
    <div class="statbar">
      <div class="s"><div class="k">Prize wallet</div><div class="v sm ok">unclaimed</div></div>
      <div class="s"><div class="k">Bounty now</div><div class="v live">~1.25 BTC<span class="faint" style="font-size:11px"> · was 5</span></div></div>
      <div class="s"><div class="k">Solved through</div><div class="v">Phase 3.2 / 5</div></div>
      <div class="s"><div class="k">Endgame</div><div class="v gold">OPEN</div></div>
    </div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">THE PHASES</div><h2>From a hidden image to an unsolved Bitcoin key</h2>
      <p>Eight stages. The first six are fully solved and reproducible — every value recomputed against the real artifacts. The last two are the open frontier where the community is still searching. Click any phase to jump into the full walkthrough.</p></div>
    <div class="doormap">${doors}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="grid cols-3">
      <div class="card hover"><h3>📖 Complete walkthrough</h3><p class="muted">Every phase explained from zero, with the exact inputs, outputs, code, and original images — merged from all public repos and the creator's hint posts.</p><a class="btn sm" href="#/walkthrough">Open the walkthrough</a></div>
      <div class="card hover"><h3>📋 Reference sheet</h3><p class="muted">Every canonical constant — addresses, passphrases, SHA-256 keys, AES salts, decoded strings — each copyable, grouped by phase.</p><a class="btn sm" href="#/reference">Open the reference</a></div>
      <div class="card hover"><h3>🔬 Verify it yourself</h3><p class="muted">The real encrypted blobs are included verbatim. Reproduce every decryption with OpenSSL or CyberChef — no trust required.</p><a class="btn sm" href="#/walkthrough">See the artifacts</a></div>
    </div>
  </div></section>`;

  return { title: 'Home', html };
}
