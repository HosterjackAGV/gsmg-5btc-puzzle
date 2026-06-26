// views/home.js — the hub: hero, your progress, and the doors map.

import { PHASES, SOLVED_COUNT, isUnlocked } from '../../../content/phases.js';
import * as store from '../store.js';
import { esc } from '../util.js';

export default async function homeView() {
  const s = store.state;
  const crackedN = Object.keys(s.cracked).length;
  const pct = Math.round((crackedN / PHASES.length) * 100);
  const lvl = store.levelFor(s.xp);

  const doors = PHASES.map(p => {
    const cracked = !!s.cracked[p.id];
    const unlocked = isUnlocked(p.id, s);
    const cls = ['door', cracked ? 'cracked' : '', (!unlocked && !cracked) ? 'locked' : '', p.status !== 'solved' ? 'open-door' : ''].filter(Boolean).join(' ');
    const state = cracked ? '🔓 cracked' : (p.status === 'open' ? '◆ unsolved' : p.status === 'frontier' ? '◐ frontier' : (unlocked ? '🔓 ready' : '🔒 locked'));
    return `<a class="${cls}" data-status="${p.status}" href="#/phase/${p.id}">
      <div class="top"><span class="num">PHASE ${esc(p.num)}</span>
        <span class="difficulty">${[1,2,3,4,5].map(n => `<i class="${n <= p.difficulty ? 'on' : ''}"></i>`).join('')}</span></div>
      <h3>${esc(p.codename)}</h3>
      <p class="tag">${esc(p.tagline)}</p>
      <div class="foot"><span class="state">${state}</span>${p.xp ? `<span class="xpbadge">+${p.xp} XP</span>` : '<span class="xpbadge gold">5 BTC</span>'}</div>
    </a>`;
  }).join('');

  const html = `
  <section class="hero"><div class="wrap">
    <div class="kick">
      <span class="pill gold">⛓ unsolved · 2026</span>
      <span class="pill">5 BTC bounty</span>
      <span class="pill blue">community-maintained</span>
    </div>
    <h1>The <span class="yin">Seed</span> Is <span class="yang">Planted</span></h1>
    <p class="lede">A real, unsolved <b>5 BTC cryptographic puzzle</b> — turned into a game you can actually play. Learn cryptography and Bitcoin from <b>absolute zero</b>, open every locked door <b>live in your browser</b>, and join the collective effort to crack the final lock. No experience required.</p>
    <div class="row" style="gap:12px;margin-bottom:26px">
      <a class="btn primary lg" href="#/learn">▶ Start from zero</a>
      <a class="btn gold lg" href="#/phase/phase-0">Enter the first door</a>
      <a class="btn ghost lg" href="#/frontier">Jump to the frontier</a>
    </div>
    <div class="statbar">
      <div class="s"><div class="k">Prize wallet</div><div class="v sm ok">unclaimed</div></div>
      <div class="s"><div class="k">Bounty now</div><div class="v live">~1.25 BTC<span class="faint" style="font-size:11px"> · was 5</span></div></div>
      <div class="s"><div class="k">Phases solved (globally)</div><div class="v">3.2 / 5</div></div>
      <div class="s"><div class="k">Your level</div><div class="v">Lv ${lvl.level}</div></div>
    </div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">YOUR JOURNEY</div>
      <div class="progwrap">
        <div class="ring" style="--p:${pct}"><b>${crackedN}/${PHASES.length}</b><small>DOORS</small></div>
        <div>
          <h2 style="margin:.1em 0">${crackedN === 0 ? 'Begin your descent' : crackedN >= SOLVED_COUNT ? 'You’ve reached the frontier' : 'Keep going'}</h2>
          <p class="muted" style="max-width:54ch;margin:0">${crackedN === 0
            ? 'Every door teaches you something new, then lets you open the real encrypted page yourself. Start with the crash course or dive straight into Phase 0.'
            : `You’ve opened ${crackedN} door${crackedN > 1 ? 's' : ''} and earned ${s.xp} XP. The solved phases end at the frontier — two encoded blocks that gate the 5 BTC.`}</p>
          <div class="row" style="margin-top:12px">
            <a class="btn sm" href="#/profile">Your profile</a>
            <a class="btn sm ghost" href="#/leaderboard">Leaderboard</a>
            <a class="btn sm ghost" href="#/workbench">Workbench</a>
          </div>
        </div>
      </div>
    </div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">THE DOORS</div><h2>Walk the whole puzzle</h2>
      <p>Eight stages from a hidden image to an unsolved Bitcoin key. Solved doors are fully explained and replayable; the last two are the open frontier where the community is still searching.</p></div>
    <div class="doormap">${doors}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="grid cols-3">
      <div class="card hover"><h3>🎓 Learn from zero</h3><p class="muted">Six bite-size lessons explain hashes, encryption, ciphers, Bitcoin addresses and private keys with everyday analogies — no jargon.</p><a class="btn sm" href="#/learn">Open the crash course</a></div>
      <div class="card hover"><h3>🧰 Solver’s workbench</h3><p class="muted">Hash anything, or throw a candidate passphrase at any of the real encrypted boxes — including the unsolved Cosmic Duality blob.</p><a class="btn sm" href="#/workbench">Open the workbench</a></div>
      <div class="card hover"><h3>🐝 The Hive</h3><p class="muted">A shared, self-verifying search: profiles, a live coverage map, and user-vs-user challenges. The first verified Cosmic unlock wins.</p><a class="btn sm" href="#/leaderboard">See the leaderboard</a></div>
    </div>
  </div></section>`;

  return { title: 'Home', html };
}
