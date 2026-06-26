// views/profile.js — your level, XP, badges, cracked doors, and attempt ledger.

import * as store from '../store.js';
import { ACHIEVEMENTS } from '../achievements.js';
import { PHASES } from '../../../content/phases.js';
import { esc, qs, on, ago, toast } from '../util.js';

export default async function profileView() {
  const s = store.state;
  const lvl = store.levelFor(s.xp);
  const crackedN = Object.keys(s.cracked).length;
  const frontier = new Set(s.attempts.filter(a => a.blob === 'cosmic' || a.blob === 'salphaseion').map(a => a.id)).size;
  const gotBadges = ACHIEVEMENTS.filter(a => s.achievements[a.id]).length;

  const badges = ACHIEVEMENTS.map(a => {
    const got = !!s.achievements[a.id];
    return `<div class="ach ${got ? 'got' : 'locked'}"><div class="ico">${esc(a.ico)}</div>
      <div><div class="t">${esc(a.title)}</div><div class="d">${got ? esc(a.desc) : '???'}</div></div></div>`;
  }).join('');

  const cracked = PHASES.map(p => {
    const c = !!s.cracked[p.id];
    return `<a class="pill ${c ? 'teal' : ''}" href="#/phase/${p.id}" style="text-decoration:none">${c ? '🔓' : '🔒'} ${esc(p.codename)}</a>`;
  }).join(' ');

  const recent = [...s.attempts].reverse().slice(0, 60);
  const attemptsRows = recent.length ? recent.map(a => `
    <tr><td class="lab">${esc(a.blob)}</td>
      <td class="val break">${esc((a.recipe || '').slice(0, 60))}${(a.recipe || '').length > 60 ? '…' : ''}</td>
      <td>${a.result === 'unlocked' ? '<span class="teal">✓ unlocked</span>' : '<span class="faint">fail</span>'}</td>
      <td class="faint">${s.submitted[a.id] ? 'submitted' : 'local'}</td>
      <td class="faint">${ago(a.ts)}</td></tr>`).join('')
    : `<tr><td colspan="5" class="faint">No attempts yet — try a recipe on the <a href="#/frontier">frontier</a> or in the <a href="#/workbench">workbench</a>.</td></tr>`;

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">YOUR PROFILE</div><h2>Your descent so far</h2></div>

    <div class="grid cols-2">
      <div class="card">
        <div class="row" style="gap:16px">
          <div class="lvl" style="width:54px;height:54px;border-radius:14px;font-size:22px;display:grid;place-items:center;color:#241a04;background:linear-gradient(150deg,var(--gold),var(--rust));font-family:var(--disp);font-weight:700">${lvl.level}</div>
          <div style="flex:1">
            <div class="spread"><b>Level ${lvl.level}</b><span class="muted mono" style="font-size:12px">${s.xp} XP</span></div>
            <div class="bar" style="height:8px;background:var(--panel2);border-radius:99px;overflow:hidden;margin-top:6px"><i style="display:block;height:100%;width:${lvl.pct}%;background:linear-gradient(90deg,var(--gold),var(--teal))"></i></div>
            <div class="faint mono" style="font-size:11px;margin-top:4px">${lvl.need - lvl.into} XP to level ${lvl.level + 1}</div>
          </div>
        </div>
        <div class="row" style="margin-top:16px">
          <label class="muted" for="pf-handle" style="font-size:13px">Handle:</label>
          <input class="cin" id="pf-handle" style="flex:1;max-width:240px" maxlength="32" placeholder="e.g. satoshi_jr" value="${esc(s.handle)}">
        </div>
        <p class="cnote">Your handle is how you appear on the shared leaderboard. Tip: use your GitHub username so submissions line up.</p>
      </div>

      <div class="card">
        <div class="grid cols-2" style="gap:10px">
          <div class="panel inset center"><div class="gold" style="font-size:26px;font-family:var(--disp);font-weight:700">${crackedN}/${PHASES.length}</div><div class="faint" style="font-size:11px">doors cracked</div></div>
          <div class="panel inset center"><div class="teal" style="font-size:26px;font-family:var(--disp);font-weight:700">${frontier}</div><div class="faint" style="font-size:11px">frontier tries</div></div>
          <div class="panel inset center"><div style="font-size:26px;font-family:var(--disp);font-weight:700">${gotBadges}/${ACHIEVEMENTS.length}</div><div class="faint" style="font-size:11px">badges</div></div>
          <div class="panel inset center"><div style="font-size:26px;font-family:var(--disp);font-weight:700">${s.attempts.length}</div><div class="faint" style="font-size:11px">total attempts</div></div>
        </div>
        <div style="margin-top:14px"><div class="faint mono" style="font-size:11px;letter-spacing:.1em;margin-bottom:8px">DOORS</div>${cracked}</div>
      </div>
    </div>

    <h3 style="margin-top:26px">Badges</h3>
    <div class="ach-grid">${badges}</div>

    <h3 style="margin-top:26px">Your attempt ledger</h3>
    <p class="muted" style="font-size:13.5px">Logged automatically and verified by the real crypto. Submit them on the <a href="#/leaderboard">leaderboard</a> to add them to the shared search.</p>
    <div style="overflow-x:auto"><table class="ref"><thead><tr><th>Blob</th><th>Recipe</th><th>Result</th><th>Status</th><th>When</th></tr></thead><tbody>${attemptsRows}</tbody></table></div>

    <div class="row" style="margin-top:18px">
      <a class="btn ghost sm" href="#/leaderboard">Go to the leaderboard →</a>
      <button class="btn ghost sm" id="pf-reset">Reset my local progress</button>
    </div>
  </div></section>`;

  function mount(root) {
    const h = qs('#pf-handle', root);
    if (h) h.addEventListener('input', () => store.setHandle(h.value));
    const reset = qs('#pf-reset', root);
    if (reset) reset.addEventListener('click', () => {
      if (confirm('Erase your local XP, progress, badges and attempt log? This cannot be undone.')) store.reset();
    });
  }

  return { title: 'Profile', html, mount };
}
