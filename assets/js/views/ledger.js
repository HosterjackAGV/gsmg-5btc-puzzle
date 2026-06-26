// views/ledger.js — the dead-end ledger: every attack already run and ruled out.

import { LEDGER, LEDGER_TARGETS } from '../../../content/ledger.js';
import { esc, qs, qsa, on } from '../util.js';

const TGT_CLASS = { both: 'gold', dbbi: 'blue', faed: 'teal', matrix: 'violet', assembly: 'rust' };

const FILTERS = [
  ['all', 'All'], ['dbbi', 'dbbi'], ['faed', 'faed'], ['both', 'Both blocks'],
  ['assembly', 'Assembly'], ['matrix', 'Matrix / image'],
];

export default async function ledgerView() {
  const rows = LEDGER.map((e, i) => `
    <tr class="lrow" data-target="${esc(e.target)}" data-text="${esc((e.name + ' ' + e.cat + ' ' + e.what + ' ' + e.result).toLowerCase())}">
      <td><span class="pill ${TGT_CLASS[e.target] || ''}" style="font-size:9px">${esc(e.target)}</span></td>
      <td><div style="font-weight:600">${esc(e.name)}</div><div class="faint mono" style="font-size:10.5px;margin-top:3px">${esc(e.cat)}</div></td>
      <td class="muted" style="font-size:13px">${esc(e.what)}</td>
      <td class="faint" style="font-size:13px">${esc(e.result)}</td>
    </tr>`).join('');

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">THE GRAVEYARD</div><h2>The dead-end ledger</h2>
      <p>Every attack already run and ruled out, so you don’t re-walk them. The whole point: skip the thousands of dead ideas and spend your time on genuinely new ones. ${LEDGER.length} negatives, all documented — that’s the ethos.</p></div>

    <div class="row" style="margin-bottom:12px">
      <input class="cin" id="lsearch" placeholder="search — e.g. vigenère, prime, transposition, compression…" style="max-width:420px" spellcheck="false">
    </div>
    <div class="selrow" id="lfilters">${FILTERS.map((f, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-f="${f[0]}">${esc(f[1])}</button>`).join('')}</div>
    <p class="cnote" id="lcount"></p>

    <div style="overflow-x:auto"><table class="ref"><thead><tr><th>Target</th><th>Approach</th><th>What we did</th><th>Result</th></tr></thead>
      <tbody id="lbody">${rows}</tbody></table></div>

    <div class="note key" style="margin-top:18px"><h4>◆ Add to the graveyard</h4><p>Ruled something out? That’s valuable. Log it via the <a href="#/community">community board</a> so it’s recorded forever — a verified negative saves everyone time.</p></div>
  </div></section>`;

  function mount(root) {
    const search = qs('#lsearch', root), body = qs('#lbody', root), count = qs('#lcount', root);
    let filter = 'all';

    const apply = () => {
      const q = (search.value || '').toLowerCase().trim();
      let shown = 0;
      qsa('.lrow', body).forEach(tr => {
        const t = tr.dataset.target;
        const okF = filter === 'all' || t === filter || (filter === 'both' && t === 'both');
        const okQ = !q || tr.dataset.text.includes(q);
        const show = okF && okQ; tr.style.display = show ? '' : 'none'; if (show) shown++;
      });
      count.textContent = `${shown} of ${LEDGER.length} shown`;
    };

    search.addEventListener('input', apply);
    on(root, 'click', '#lfilters .chip', (e, b) => {
      qs('#lfilters .chip.active', root)?.classList.remove('active');
      b.classList.add('active'); filter = b.dataset.f; apply();
    });
    apply();
  }

  return { title: 'Dead-end ledger', html, mount };
}
