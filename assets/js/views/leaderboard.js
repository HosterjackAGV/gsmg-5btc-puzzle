// views/leaderboard.js — The Hive: the shared, self-verifying search.
// Reads data/leaderboard.json; builds the GitHub-issue submit flow from local attempts.

import * as store from '../store.js';
import { attemptId } from '../crypto.js';
import { esc, qs, on, ago, toast, copy } from '../util.js';
import { mergeOverall, overallTableHTML } from '../leaderboards.js';

const REPO = 'HosterjackAGV/gsmg-5btc-puzzle';
const FRONTIER = ['cosmic', 'salphaseion'];
const MAX_INLINE = 40; // keep the prefilled issue URL under length limits

export default async function leaderboardView() {
  const s = store.state;
  let board = null, arcadeBoard = null;
  try { const r = await fetch('data/leaderboard.json', { cache: 'no-store' }); if (r.ok) board = await r.json(); } catch {}
  try { const r = await fetch('data/arcade-leaderboard.json', { cache: 'no-store' }); if (r.ok) arcadeBoard = await r.json(); } catch {}
  const overall = mergeOverall(board, arcadeBoard);

  const unsub = s.attempts.filter(a => !s.submitted[a.id]);
  const myFrontier = new Set(s.attempts.filter(a => FRONTIER.includes(a.blob)).map(a => a.id)).size;

  const rows = (board && board.rows && board.rows.length)
    ? board.rows.map((r, i) => `<tr><td class="lab">${i + 1}</td><td>${esc(r.handle)}</td>
        <td class="center teal">${r.frontier || 0}</td><td class="center">${r.tries || 0}</td>
        <td class="center gold">${r.novel || 0}</td><td class="faint center">${r.last ? ago(r.last * 1000) : '—'}</td></tr>`).join('')
    : `<tr><td colspan="6" class="faint center">No verified attempts on the board yet — be the first. Log a try on the <a href="#/frontier">frontier</a>, then submit below.</td></tr>`;

  const solved = board && board.solved;

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">THE HIVE</div><h2>Crack it together</h2>
      <p>The endgame is a <b>search problem</b>: somewhere there is a recipe that opens Cosmic Duality. This turns that search into a <b>shared, deduplicated, self-verifying effort</b> — so no two people waste time on the same idea, and a winning attempt is impossible to miss.</p></div>

    ${solved ? `<div class="note gold"><h4>🏆 SOLVED</h4><p>A verified valid decryption of the Cosmic blob has been recorded. Verify the recovered key on-chain before celebrating — but this is the moment.</p></div>` : ''}

    <details class="eli5" open><summary>★ Overall champions — puzzle + arcade combined <span class="chev">+</span></summary>
      <div class="body">
        <p class="cnote" style="margin-top:0">One combined standing: real-puzzle frontier work (weighted heavily) plus <a href="#/arcade">Arcade</a> points, merged by handle. The detailed puzzle board is just below; the Arcade board lives on its own page — this only ranks them together.</p>
        ${overallTableHTML(overall)}
      </div></details>

    <details class="eli5"><summary>How this helps — and why the scores are trustworthy <span class="chev">+</span></summary>
      <div class="body">
        <p>Every passphrase you try runs the <b>real AES decryption</b> and records the true result — <b>unlocked</b> or <b>fail</b>. Because the blobs are public and the maths is deterministic, anyone can reproduce any attempt, and a GitHub robot re-runs every submission before it counts.</p>
        <p>Attempts are <b>deduplicated by an exact fingerprint</b> of (blob + recipe + prehash). Re-testing the same recipe doesn’t inflate scores — only genuinely new ground counts. The board <i>is</i> a live map of what’s been covered.</p>
        <p class="muted"><b>Win condition:</b> the first verified valid decryption of the Cosmic Duality blob effectively solves the puzzle — the page detects it automatically. (The recovered text should be a Bitcoin WIF key starting with 5/K/L.)</p>
      </div></details>

    <div class="grid cols-2" style="margin:18px 0">
      <div class="card"><h3>Your contribution</h3>
        <div class="grid cols-3" style="gap:10px">
          <div class="panel inset center"><div class="teal" style="font-size:24px;font-family:var(--disp);font-weight:700">${myFrontier}</div><div class="faint" style="font-size:11px">frontier tries</div></div>
          <div class="panel inset center"><div style="font-size:24px;font-family:var(--disp);font-weight:700">${s.attempts.length}</div><div class="faint" style="font-size:11px">total tries</div></div>
          <div class="panel inset center"><div class="gold" style="font-size:24px;font-family:var(--disp);font-weight:700">${unsub.length}</div><div class="faint" style="font-size:11px">not yet sent</div></div>
        </div>
        <div class="row" style="margin-top:14px">
          <button class="btn gold sm" id="lb-submit" ${unsub.length ? '' : 'disabled'}>↗ Submit my new attempts</button>
          <button class="btn ghost sm" id="lb-export" ${s.attempts.length ? '' : 'disabled'}>⬇ Export JSON</button>
        </div>
        <p class="cnote">Submitting opens a pre-filled GitHub issue (one click). A robot re-verifies every attempt and updates the board — nothing is taken on trust. Big batches (40+): use Export and attach the file to a new <span class="mono">attempt-batch</span> issue.</p>
      </div>

      <div class="card"><h3>Before you try — has anyone tested it?</h3>
        <p class="muted" style="font-size:13px">Check your local ledger for an exact recipe (the shared check happens at submission time).</p>
        <div class="console"><div class="crow">
          <input class="cin" id="ck-in" placeholder="candidate recipe…" spellcheck="false">
          <button class="btn teal" id="ck-go">Check</button></div>
          <div class="chkrow"><input type="checkbox" id="ck-pre" checked><label for="ck-pre">SHA-256 first (chain mode)</label></div>
          <div class="cout" id="ck-out"></div></div>
      </div>
    </div>

    <h3>The global board</h3>
    <p class="cnote" id="lb-meta">${board ? `${board.rows ? board.rows.length : 0} contributors · ${(board.totals && board.totals.frontier_unique) || 0} verified frontier attempts · updated ${board.updated ? ago(board.updated * 1000) : '—'}` : 'The shared board activates once data/ is committed and a submission has been processed. Your attempts are logged & verified locally in the meantime.'}</p>
    <div style="overflow-x:auto"><table class="ref"><thead><tr><th>#</th><th>handle</th><th class="center">frontier</th><th class="center">total</th><th class="center">novel</th><th class="center">last</th></tr></thead><tbody>${rows}</tbody></table></div>

    <div class="note key" style="margin-top:18px"><h4>◆ Good faith</h4><p>This board coordinates a search, not a vanity number. The most valuable contribution is a <i>systematic sweep</i> of a clearly-defined idea, submitted with a note on what it tests — that’s what retires regions of the problem for everyone.</p></div>
  </div></section>`;

  function mount(root) {
    // check-the-log tool
    const ckGo = qs('#ck-go', root), ckOut = qs('#ck-out', root);
    ckGo.addEventListener('click', async () => {
      const v = qs('#ck-in', root).value.trim();
      const pre = qs('#ck-pre', root).checked;
      if (!v) { ckOut.className = 'cout show bad'; ckOut.textContent = 'Type a recipe.'; return; }
      // check against all frontier blobs
      let hits = [];
      for (const blob of FRONTIER) {
        const id = await attemptId(blob, v, pre);
        if (s.attempts.some(a => a.id === id)) hits.push(blob);
      }
      if (hits.length) { ckOut.className = 'cout show info'; ckOut.textContent = `You’ve already tried this against: ${hits.join(', ')}.`; }
      else { ckOut.className = 'cout show ok'; ckOut.textContent = 'New to your local ledger — worth a try on the frontier.'; }
    });

    // export
    const exp = qs('#lb-export', root);
    if (exp) exp.addEventListener('click', () => {
      const payload = { handle: s.handle || 'anon', attempts: s.attempts.map(a => ({ blob: a.blob, recipe: a.recipe, prehash: a.prehash, result: a.result })) };
      const blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = 'gsmg-attempts.json'; a.click(); URL.revokeObjectURL(url);
      toast({ ico: '⬇', title: 'Exported', desc: 'Attach it to an attempt-batch issue.' });
    });

    // submit -> prefilled GitHub issue
    const sub = qs('#lb-submit', root);
    if (sub) sub.addEventListener('click', () => {
      const batch = unsub.slice(0, MAX_INLINE).map(a => ({ blob: a.blob, recipe: a.recipe, prehash: a.prehash, result: a.result }));
      const json = JSON.stringify({ handle: s.handle || 'anon', attempts: batch });
      const body = '```json gsmg-attempts\n' + json + '\n```\n\n' + (unsub.length > MAX_INLINE ? `_(${unsub.length - MAX_INLINE} more not included — use Export JSON for the full batch.)_\n` : '') + '\n_Submitted from the in-page Hive. A bot re-verifies each attempt._';
      const url = `https://github.com/${REPO}/issues/new?labels=attempt-batch&title=${encodeURIComponent('attempts: ' + (s.handle || 'anon'))}&body=${encodeURIComponent(body)}`;
      window.open(url, '_blank', 'noopener');
      store.markSubmitted(unsub.slice(0, MAX_INLINE).map(a => a.id));
      toast({ ico: '↗', title: 'Issue opened', desc: 'Finish posting it on GitHub to count.', kind: 'gold', ttl: 6000 });
      sub.disabled = true;
    });
  }

  return { title: 'The Hive', html, mount };
}
