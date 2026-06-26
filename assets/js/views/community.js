// views/community.js — challenges + comments, all GitHub-native.
// Seed challenges (content/challenges.js) + live ones pulled from GitHub issues
// labelled "challenge". Comments via giscus (components/comments.js).

import { CHALLENGES } from '../../../content/challenges.js';
import { CONFIG, issueUrl, apiBase } from '../../../content/config.js';
import { commentsWidget } from '../components/comments.js';
import { esc, qs, ago } from '../util.js';

const TARGET_PILL = { dbbi: 'gold', faed: 'gold', cosmic: 'rust', salphaseion: 'gold' };

function challengeCard(c, live) {
  const stars = '★'.repeat(c.difficulty || 1) + '☆'.repeat(5 - (c.difficulty || 1));
  return `<div class="card hover">
    <div class="spread"><span class="pill ${TARGET_PILL[c.target] || ''}">🎯 ${esc(c.target)}</span>
      <span class="faint mono" style="font-size:11px">${stars}</span></div>
    <h3 style="margin:10px 0 6px;font-size:16px">${esc(c.title)}${live ? ' <span class="pill blue" style="font-size:9px">live</span>' : ''}</h3>
    <p class="muted" style="font-size:13.5px">${esc(c.desc)}</p>
    ${c.goal ? `<p class="mono" style="font-size:12px;color:var(--teal)">🏁 ${esc(c.goal)}</p>` : ''}
    <div class="row" style="margin-top:10px">
      ${live ? `<a class="btn ghost sm" href="${esc(c.url)}" target="_blank" rel="noopener">View on GitHub →</a>`
              : `<a class="btn sm gold" href="#/frontier">Accept → frontier</a>
                 <a class="btn ghost sm" href="#/workbench">Workbench</a>`}
    </div>
  </div>`;
}

export default async function communityView() {
  const newChallengeBody = `**Target:** (dbbi / faed / cosmic)\n**The sweep:** describe exactly what region you’re proposing to cover.\n**Done when:** the measurable goal.\n\n_Accepted challenges coordinate the search. Report results as verified attempts via the Hive._`;

  const seed = CHALLENGES.map(c => challengeCard(c, false)).join('');
  const comments = commentsWidget('community-general', 'Community board');

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">COMMUNITY</div><h2>Challenges &amp; discussion</h2>
      <p>The fastest way to crack an unsolved puzzle is to <b>not duplicate work</b>. Challenges carve the search into clearly-scoped sweeps anyone can claim — and every result is auto-verified by the real crypto, so progress is real, not vibes.</p></div>

    <div class="grid cols-3" style="margin-bottom:8px">
      <div class="card"><h3>1 · Pick a challenge</h3><p class="muted" style="font-size:13px">Each one is a defined region of the search space with a measurable “done”.</p></div>
      <div class="card"><h3>2 · Run it</h3><p class="muted" style="font-size:13px">Test candidates in the <a href="#/workbench">workbench</a> / <a href="#/frontier">frontier</a>. Every try is logged & verified.</p></div>
      <div class="card"><h3>3 · Report</h3><p class="muted" style="font-size:13px">Submit your verified attempts on the <a href="#/leaderboard">Hive</a>. CI re-checks everything.</p></div>
    </div>

    <div class="spread" style="margin:26px 0 12px"><h3 style="margin:0">Open challenges</h3>
      <a class="btn gold sm" href="${issueUrl('challenge', 'challenge: ', newChallengeBody)}" target="_blank" rel="noopener">+ Propose a challenge</a></div>
    <div id="ch-live"></div>
    <div class="grid cols-3">${seed}</div>

    <h3 style="margin:30px 0 8px">Discussion</h3>
    ${comments.html}
  </div></section>`;

  function mount(root) {
    comments.mount(root);
    // pull live challenge issues from GitHub (unauthenticated; rate-limited but fine for display)
    fetch(`${apiBase}/issues?labels=challenge&state=open&per_page=20`, { headers: { Accept: 'application/vnd.github+json' } })
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        const live = (items || []).filter(i => !i.pull_request).map(i => ({
          target: (i.title.match(/dbbi|faed|cosmic|salphaseion/i) || ['cosmic'])[0].toLowerCase(),
          title: i.title.replace(/^challenge:\s*/i, '') || ('#' + i.number),
          desc: (i.body || '').slice(0, 200).replace(/\s+/g, ' ') + ((i.body || '').length > 200 ? '…' : ''),
          difficulty: 3, url: i.html_url,
        }));
        if (live.length) {
          const host = qs('#ch-live', root);
          host.innerHTML = `<div class="grid cols-3" style="margin-bottom:16px">${live.map(c => challengeCard(c, true)).join('')}</div>`;
        }
      })
      .catch(() => {});
  }

  return { title: 'Community', html, mount };
}
