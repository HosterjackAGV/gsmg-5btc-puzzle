// views/arcade.js — the Arcade: puzzle-themed mini-games + their own community
// leaderboard (separate from the Hive, which tracks the real puzzle).
//   #/arcade           → the games hub + the arcade board
//   #/arcade/:game     → play one game full-screen
// Skill games are replay-verified by the bot; idle games grant XP locally.

import * as store from '../store.js';
import { GAMES, byId } from '../games/registry.js';
import { esc, qs, ago, toast } from '../util.js';
import { DIVISIONS, nextDivision, weekId, weeklySeed, levelForDivision } from '../games/divisions.js';

const REPO = 'HosterjackAGV/gsmg-5btc-puzzle';
const MAX_INLINE = 30;

export default async function arcadeView({ params, navigate }) {
  const entry = params && params.game ? byId(params.game) : null;
  if (entry) return playView(entry, navigate, params.mode);
  return hubView(navigate);
}

// ---------- play one game (free play, or a ranked tournament round) ----------
function playView(entry, navigate, mode) {
  let challenge = null;
  if (mode === 'tournament' && entry.tournament) {
    const div = store.arcadeDivision();
    const week = weekId(Date.now());
    challenge = { seed: weeklySeed(entry.id, week, div.key), level: levelForDivision(div.key), division: div.key, week, label: `${div.name} · this week · L${levelForDivision(div.key)}` };
  }
  const html = `
  <section class="section"><div class="wrap">
    <div class="arc-playbar">
      <a class="btn ghost sm" href="#/arcade">← All games</a>
      <div class="arc-title"><span class="ico">${entry.icon}</span><b>${esc(entry.title)}</b>
        <span class="badge ${entry.kind}">${entry.kind === 'skill' ? 'ranked' : 'idle'}</span>
        ${challenge ? `<span class="badge skill">🏆 ${esc(challenge.label)}</span>` : ''}</div>
      <div class="faint sm">${challenge ? 'tournament round' : (entry.verifiable ? 'free play' : 'XP & milestones')}</div>
    </div>
    <p class="cnote">${esc(entry.concept)}</p>
    <div class="arc-stage" id="arc-stage"><div class="faint center" style="padding:40px">Loading game…</div></div>
  </div></section>`;

  async function mount(root) {
    const stage = qs('#arc-stage', root);
    try {
      const [mod, hostMod] = await Promise.all([entry.load(), import('../engine/host.js')]);
      const start = mod.start || mod.default;
      stage.innerHTML = '';
      const host = hostMod.createHost({ el: stage, game: entry, navigate, challenge });
      const inst = start(host);
      if (window.__gsmgMountGame) window.__gsmgMountGame(inst);
    } catch (e) {
      console.error(e);
      stage.innerHTML = `<div class="note warn"><h4>Could not load this game</h4><p>${esc(e.message || e)}</p></div>`;
    }
  }
  return { title: challenge ? entry.title + ' · tournament' : entry.title, html, mount };
}

// ---------- hub + board ----------
async function hubView(navigate) {
  let board = null, tourneys = null;
  try { const r = await fetch('data/arcade-leaderboard.json', { cache: 'no-store' }); if (r.ok) board = await r.json(); } catch {}
  try { const r = await fetch('data/tournaments.json', { cache: 'no-store' }); if (r.ok) tourneys = await r.json(); } catch {}
  const s = store.state;
  const unsub = store.arcadeUnsubmitted();

  // ---- weekly tournaments: your division, this week's challenges + standings ----
  const div = store.arcadeDivision();
  const week = weekId(Date.now());
  const nextDiv = nextDivision(div.key);
  const tBoards = (tourneys && tourneys.boards) || [];
  const ladder = DIVISIONS.map(d => `<span class="trn-div${d.key === div.key ? ' on' : ''}" style="--dc:${d.color}">${d.name}<i>${d.min}+</i></span>`).join('');
  const tourneyRows = GAMES.filter(g => g.tournament).map(g => {
    const b = tBoards.find(x => x.game === g.id && x.week === week && x.division === div.key);
    const top = (b && b.players.length) ? b.players.slice(0, 3).map((p, i) => `<span>${i + 1}. ${esc(p.handle)} · <b>${p.score}</b></span>`).join('') : '<span class="faint">no entries yet — be first</span>';
    return `<div class="trn-game">
      <div class="trn-g-h"><span class="ico">${g.icon}</span><b>${esc(g.title)}</b><span class="faint sm">Level ${levelForDivision(div.key)}</span></div>
      <div class="trn-standings">${top}</div>
      <a class="btn gold sm" href="#/arcade/${g.id}/tournament">▶ Play this week</a>
    </div>`;
  }).join('');

  const cards = GAMES.map(g => `
    <a class="arc-card" href="#/arcade/${g.id}">
      <div class="arc-ico">${g.icon}</div>
      <div class="arc-body">
        <div class="arc-h"><b>${esc(g.title)}</b><span class="badge ${g.kind}">${g.kind === 'skill' ? 'ranked' : 'idle'}</span></div>
        <p class="arc-blurb">${esc(g.blurb)}</p>
        <div class="arc-meta"><span class="faint">${esc(g.difficulty)}</span>
          <span class="gold">best ${store.arcadeBest(g.id)}</span></div>
      </div>
    </a>`).join('');

  const rows = (board && board.rows && board.rows.length)
    ? board.rows.map((r, i) => `<tr><td class="lab">${i + 1}</td><td>${esc(r.handle)}</td>
        <td class="center gold">${r.total || 0}</td>
        <td class="center">${Object.keys(r.games || {}).length}</td>
        <td class="faint center">${r.last ? ago(r.last * 1000) : '—'}</td></tr>`).join('')
    : `<tr><td colspan="5" class="faint center">No verified scores yet — play a ranked game and submit your best.</td></tr>`;

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">THE ARCADE</div><h2>Play the puzzle</h2>
      <p>Every game here teaches a real piece of the GSMG puzzle — substitution ciphers, hashing, key derivation — wrapped in something you'll actually want to keep playing. <b>Ranked</b> games are deterministic, so the bot re-plays your moves to verify every score; <b>idle</b> games are for relaxed grinding and grant XP.</p></div>

    <div class="arc-grid">${cards}</div>

    <div class="trn">
      <div class="trn-head">
        <div class="sec-num">WEEKLY TOURNAMENTS</div>
        <h3 style="margin:.1em 0 .3em">Your division: <span class="trn-badge" style="--dc:${div.color}">${div.name}</span></h3>
        <p class="cnote" style="margin-top:0">You’re matched only with players in <b>your division</b>, all on the same weekly puzzle — and it gets harder as you climb. ${nextDiv ? `<b>${Math.max(0, nextDiv.min - store.arcadePoints())}</b> more points to reach <b>${nextDiv.name}</b>.` : 'Top tier — you’re a Master.'} &nbsp;·&nbsp; week ${esc(week)}.</p>
        <div class="trn-ladder">${ladder}</div>
      </div>
      <div class="trn-games">${tourneyRows}</div>
    </div>

    <div class="grid cols-2" style="margin:22px 0">
      <div class="card"><h3>Your arcade</h3>
        <div class="grid cols-3" style="gap:10px">
          <div class="panel inset center"><div class="gold" style="font-size:24px;font-family:var(--disp);font-weight:700">${Object.values(s.arcade.best || {}).reduce((a, b) => a + b, 0)}</div><div class="faint" style="font-size:11px">total points</div></div>
          <div class="panel inset center"><div class="teal" style="font-size:24px;font-family:var(--disp);font-weight:700">${Object.keys(s.arcade.best || {}).length}</div><div class="faint" style="font-size:11px">games played</div></div>
          <div class="panel inset center"><div style="font-size:24px;font-family:var(--disp);font-weight:700">${unsub.length}</div><div class="faint" style="font-size:11px">unsent solves</div></div>
        </div>
        <div class="row" style="margin-top:14px">
          <button class="btn gold sm" id="arc-submit" ${unsub.length ? '' : 'disabled'}>↗ Submit my best</button>
        </div>
        <p class="cnote">Submitting opens a pre-filled GitHub issue. A bot re-simulates each solve from your move-log and updates the board — fabricated scores can't reproduce, so they're dropped.</p>
      </div>
      <div class="card"><h3>How scoring works</h3>
        <p class="muted" style="font-size:13px">Ranked games are pure functions of <span class="mono">(seed, level, your moves)</span>. The same inputs produce the same puzzle for everyone and the same score on the server, so the board reflects real skill — solve cleanly, with few hints and mistakes, at higher levels for more points. Your best score per game is what counts; grinding easy levels won't inflate it.</p>
      </div>
    </div>

    <h3>The arcade board</h3>
    <p class="cnote">${board && board.updated ? `${board.rows.length} players · ${(board.totals && board.totals.scores) || 0} verified scores · updated ${ago(board.updated * 1000)}` : 'The board activates after the first verified submission. Your scores are tracked locally meanwhile.'} &nbsp;·&nbsp; <a href="#/leaderboard">★ See the combined Overall board →</a></p>
    <div style="overflow-x:auto"><table class="ref"><thead><tr><th>#</th><th>player</th><th class="center">points</th><th class="center">games</th><th class="center">last</th></tr></thead><tbody>${rows}</tbody></table></div>
  </div></section>`;

  function mount(root) {
    const sub = qs('#arc-submit', root);
    if (sub) sub.addEventListener('click', () => {
      const batch = unsub.slice(0, MAX_INLINE).map(r => ({ game: r.game, seed: r.seed, level: r.level, moves: r.moves }));
      const json = JSON.stringify({ handle: s.handle || 'anon', scores: batch });
      const body = '```json gsmg-arcade\n' + json + '\n```\n\n_Submitted from the in-page Arcade. A bot re-simulates each score._';
      const url = `https://github.com/${REPO}/issues/new?labels=arcade-score&title=${encodeURIComponent('arcade: ' + (s.handle || 'anon'))}&body=${encodeURIComponent(body)}`;
      window.open(url, '_blank', 'noopener');
      store.markArcadeSubmitted(unsub.slice(0, MAX_INLINE).map(r => r.id));
      toast({ ico: '↗', title: 'Issue opened', desc: 'Finish posting it on GitHub to count.', kind: 'gold', ttl: 6000 });
      sub.disabled = true;
    });
  }

  return { title: 'Arcade', html, mount };
}
