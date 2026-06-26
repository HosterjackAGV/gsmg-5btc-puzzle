// views/placeholder.js — tasteful "being built" page for sections not yet live.
// Routed to by main.js for: learn, leaderboard, profile, community, ledger, reference.

import { esc } from '../util.js';

const PAGES = {
  learn:       { ico: '🎓', title: 'Crash course — from absolute zero', blurb: 'Six interactive lessons: what a hash is, how encryption works, ciphers, Bitcoin addresses, private keys, and how this puzzle chains them together — each with everyday analogies and a hands-on demo.', cta: ['#/phase/phase-0', 'Meanwhile, try Phase 0'] },
  leaderboard: { ico: '🐝', title: 'The Hive — collaborative leaderboard', blurb: 'A shared, self-verifying search. Frontier tries, novel recipes, teams, and the live coverage map of what’s been ruled out. Every attempt re-verified by CI. The first verified Cosmic unlock wins outright.', cta: ['#/workbench', 'Start logging attempts in the Workbench'] },
  profile:     { ico: '🪪', title: 'Your profile', blurb: 'Your level, XP, badges, cracked doors, attempt ledger, and submitted contributions — persisted in your browser and (once linked) tied to your GitHub identity on the global board.', cta: ['#/', 'Back to the map'] },
  community:   { ico: '💬', title: 'Community & challenges', blurb: 'Comments per door via GitHub Discussions, user-vs-user challenges (“first to rule out base-9 readings of dbbi”), and a shared idea board — all re-verified, nothing taken on trust.', cta: ['#/leaderboard', 'See the leaderboard'] },
  ledger:      { ico: '🪦', title: 'The dead-end ledger', blurb: 'A searchable record of ideas already ruled out, so no one re-walks thousands of dead paths. Verified negatives are first-class citizens here.', cta: ['#/frontier', 'Go to the frontier'] },
  reference:   { ico: '📑', title: 'Reference sheet', blurb: 'Every canonical value — addresses, passphrases, SHA-256 keys, AES salts, decoded strings — grouped by phase, each copyable.', cta: ['#/', 'Back to the map'] },
};

export default async function placeholderView({ path }) {
  const key = path.replace(/^\//, '').split('/')[0];
  const p = PAGES[key] || { ico: '🛠️', title: 'Coming soon', blurb: 'This section is being built.', cta: ['#/', 'Back to the map'] };
  const html = `
  <section class="section"><div class="wrap" style="max-width:760px">
    <div style="font-size:48px">${esc(p.ico)}</div>
    <h1 style="margin-top:8px">${esc(p.title)}</h1>
    <p class="muted" style="font-size:17px">${esc(p.blurb)}</p>
    <div class="note key"><h4>🚧 Under construction</h4><p>This is part of the new game build. The interactive version lands shortly — the engine, data, and design system it sits on are already in place.</p></div>
    <a class="btn primary" href="${esc(p.cta[0])}">${esc(p.cta[1])}</a>
  </div></section>`;
  return { title: p.title, html };
}
