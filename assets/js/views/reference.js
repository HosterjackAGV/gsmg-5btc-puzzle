// views/reference.js — every canonical value in one place, copyable, grouped by phase.

import { PHASES } from '../../../content/phases.js';
import { esc, on, qs, copy, refTable } from '../util.js';

const ADDRESSES = [
  { label: 'Prize (main, unclaimed)', value: '1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe' },
  { label: 'Prize balance now', value: '~1.25634510 BTC (was 5 BTC, halved twice)' },
  { label: 'Split-off (halvings, unspent)', value: '17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa' },
];

export default async function referenceView() {
  const blocks = PHASES.map(p => `
    <div class="card" style="margin-bottom:16px">
      <div class="spread"><h3 style="margin:0">${esc(p.num)} · ${esc(p.codename)}</h3>
        <a class="pill ${p.status === 'solved' ? 'teal' : 'gold'}" href="#/walkthrough?p=${encodeURIComponent(p.codename)}" style="text-decoration:none">open in walkthrough →</a></div>
      ${p.verified ? `<p class="mono faint" style="font-size:11.5px;margin:.4em 0 0">${esc(p.verified)}</p>` : ''}
      <div style="margin-top:10px;overflow-x:auto">${refTable(p.reference)}</div>
    </div>`).join('');

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">REFERENCE</div><h2>Every value, in one place</h2>
      <p>All the canonical constants — addresses, passphrases, SHA-256 keys, AES salts, decoded strings — each copyable. Cross-checked against the <a href="https://github.com/HosterjackAGV/gsmg-5btc-puzzle/blob/main/docs/VERIFIED-SOLUTIONS.md" target="_blank" rel="noopener">verification audit</a>; every "open in walkthrough →" jumps to that phase in the <a href="#/walkthrough">full walkthrough</a>. For the creator's own rules and hints, see <a href="#/intel">The Three Books</a>.</p></div>

    <div class="row" style="margin-bottom:18px">
      <input class="cin" id="ref-search" placeholder="filter values…" style="max-width:320px" spellcheck="false">
    </div>

    <div class="card" style="margin-bottom:16px"><h3 style="margin:0 0 10px">Addresses</h3><div style="overflow-x:auto">${refTable(ADDRESSES)}</div></div>
    <div id="ref-blocks">${blocks}</div>
  </div></section>`;

  function mount(root) {
    on(root, 'click', '.copy', (e, b) => copy(b.dataset.copy, b));
    const search = qs('#ref-search', root);
    if (search) search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      qs('#ref-blocks', root).querySelectorAll('tr').forEach(tr => {
        tr.style.display = !q || tr.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  return { title: 'Reference', html, mount };
}
