// views/donations.js — the Donations section: the maintainer's six addresses (copy / wallet
// deep-link / offline QR / explorer), a live "total held", and an auto-updating Hall of Fame
// of incoming donations across all chains. All data is fetched client-side from free, keyless
// public explorers via the rate-safe engine in onchain.js.

import { esc, qs, qsa, on, copy } from '../util.js';
import { DONATIONS } from '../../../content/donations.js';
import { getPrices, getBalance, getHistory, peek, poll, fmtUsd, fmtAmt, shortAddr, timeAgo } from '../onchain.js';

const PRICE_OF = { BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', XRP: 'ripple', SOL: 'solana', USDT: 'tether', USDC: 'tether', DAI: 'tether', BUSD: 'tether', TUSD: 'tether' };
const usdAmt = (n) => n == null ? null : Math.round(n * 100) / 100;

function qrSvg(text) {
  try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); }
  catch { return ''; }
}

function card(cfg) {
  return `<article class="don-card" data-id="${cfg.id}">
    <header class="don-head">
      <span class="don-sym s-${cfg.id}">${esc(cfg.symbol)}</span>
      <div class="don-meta">
        <div class="don-chain">${esc(cfg.chain)}</div>
        <div class="don-bal" data-bal="${cfg.id}"><span class="faint">checking…</span></div>
      </div>
    </header>
    <div class="don-addr"><code>${esc(cfg.address)}</code><button class="copy" data-copy="${esc(cfg.address)}">copy</button></div>
    ${cfg.note ? `<div class="don-note">${cfg.note}</div>` : ''}
    <div class="don-actions">
      <a class="btn-don" href="${esc(cfg.uri(cfg.address))}" rel="noopener">↗ Open in wallet</a>
      <button class="btn-don ghost" data-qr="${esc(cfg.address)}" type="button">▦ QR</button>
      <a class="btn-don ghost" href="${esc(cfg.explorer + cfg.address)}" target="_blank" rel="noopener">Explorer ↗</a>
    </div>
    <div class="don-qr" hidden></div>
    <div class="don-wallets">${esc(cfg.wallets)}</div>
  </article>`;
}

export default async function donationsView() {
  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">SUPPORT</div><h2>Donations</h2>
      <p>This is a free, ad-free, open reference — the authoritative, source-merged record of the GSMG.io 5 BTC puzzle. If it helped you, a tip toward its upkeep is welcome and entirely optional. <b>These are the maintainer's own addresses</b>; no third-party or other-repo donation address appears anywhere on this site.</p>
    </div>

    <div class="don-total card">
      <div><div class="dt-label">Total currently held across all donation addresses</div>
        <div class="dt-val" id="don-total-val">…</div></div>
      <div class="dt-live"><span class="live-dot"></span> live · auto-updates</div>
    </div>

    <div class="don-grid">${DONATIONS.map(card).join('')}</div>

    <div class="sec-head" style="margin-top:34px"><div class="sec-num">HALL OF FAME</div><h2>Recent donations</h2>
      <p>Every incoming donation to the addresses above, read straight from public block explorers — by date, sending wallet, and value (≈ USD at the current price). It refreshes automatically while this page is open. Be the first and you'll head the list.</p>
    </div>
    <div id="don-hall" class="card"><div class="don-empty"><span class="faint">Loading the latest donations…</span></div></div>

    <p class="don-disc">Values are approximate, converted at the live market price (a donation's recorded asset and amount are exact). Balances and history are fetched directly in your browser from free, keyless public explorers (blockstream/mempool, publicnode, xrplcluster, Blockscout, CoinGecko) — nothing is tracked, no key is used, and results are cached locally so the page never hammers any API.</p>
  </div></section>`;

  function mount(root) {
    on(root, 'click', '.copy', (e, b) => copy(b.dataset.copy, b));
    on(root, 'click', '[data-qr]', (e, b) => {
      const box = qs('.don-qr', b.closest('.don-card'));
      if (!box) return;
      if (box.hidden) {
        if (!box.dataset.done) { const svg = qrSvg(b.dataset.qr); box.innerHTML = svg || '<span class="faint">QR unavailable</span>'; box.dataset.done = '1'; }
        box.hidden = false; b.classList.add('on');
      } else { box.hidden = true; b.classList.remove('on'); }
    });

    async function refresh() {
      let prices = {};
      try { prices = await getPrices(); } catch { prices = peek('prices') || {}; }
      // a 0 / absent price means "USD unknown" (skip), not a literal $0
      const priceUsd = (id) => { const p = prices[id]; return p > 0 ? p : (id === 'tether' ? 1 : null); };

      // ---- balances + total ----
      let total = 0, haveTotal = false;
      await Promise.all(DONATIONS.map(async cfg => {
        let amount = null;
        try { amount = (await getBalance(cfg)).amount; }
        catch { const c = peek('bal:' + cfg.id + ':' + cfg.address); amount = c ? c.amount : null; }
        const p = priceUsd(cfg.priceId);
        const usd = amount != null && p != null ? amount * p : null;
        if (usd != null) { total += usd; haveTotal = true; }
        const el = qs(`[data-bal="${cfg.id}"]`, root);
        if (el) el.innerHTML = amount == null
          ? '<span class="faint">unavailable</span>'
          : `<b>${esc(fmtAmt(amount, cfg.symbol === 'USDT' ? 2 : 8))}</b> ${esc(cfg.symbol)}${usd != null ? ` <span class="don-usd">≈ ${esc(fmtUsd(usd))}</span>` : ''}`;
      }));
      const tv = qs('#don-total-val', root);
      if (tv) tv.textContent = haveTotal ? '≈ ' + fmtUsd(total) : '—';

      // ---- hall of fame ----
      const items = []; const degraded = [];
      await Promise.all(DONATIONS.map(async cfg => {
        let h; try { h = await getHistory(cfg); } catch { h = { items: [], degraded: true }; }
        if (h.degraded) degraded.push(cfg);
        for (const it of (h.items || [])) {
          const pid = PRICE_OF[(it.symbol || '').toUpperCase()] || null;
          const p = pid ? priceUsd(pid) : null;
          const usd = it.stable ? it.amount : (p != null ? it.amount * p : null);
          items.push({ ...it, usd: usdAmt(usd) });
        }
      }));
      items.sort((a, b) => b.date - a.date);
      renderHall(qs('#don-hall', root), items.slice(0, 60), degraded);
    }

    // refresh now + every ~75s while visible; anchor on an in-view element so it auto-stops
    // when the user navigates away (the persistent #app outlet would never detach)
    poll(refresh, 75000, qs('#don-hall', root) || qs('.don-grid', root));
  }

  return { title: 'Donations', html, mount };
}

function renderHall(host, items, degraded) {
  if (!host) return;
  const note = degraded.length
    ? `<div class="don-note hall-note">Live per-transaction feed isn't available free/keyless for ${degraded.map(c => esc(c.chain)).join(', ')} — those donations still show in the balances above; view them on the chain explorer.</div>` : '';
  if (!items.length) {
    host.innerHTML = `<div class="don-empty">No donations yet — <b>be the first</b> and you'll top this Hall of Fame. 🏆</div>${note}`;
    return;
  }
  const rows = items.map(it => `<tr>
    <td class="dh-when" title="${esc(new Date(it.date * 1000).toISOString().replace('T', ' ').slice(0, 16))} UTC">${esc(timeAgo(it.date))}${it.pending ? ' <span class="dh-pend">pending</span>' : ''}</td>
    <td><span class="chip c-${esc(it.chain)}">${esc(it.symbol)}</span></td>
    <td class="dh-from" title="${esc(it.from)}">${esc(shortAddr(it.from, 7))}</td>
    <td class="dh-amt"><b>${esc(fmtAmt(it.amount, 6))}</b> ${esc(it.symbol)}</td>
    <td class="dh-usd">${it.usd != null ? esc(fmtUsd(it.usd)) : '—'}</td>
    <td class="dh-link"><a href="${esc(it.url)}" target="_blank" rel="noopener" title="View transaction">↗</a></td>
  </tr>`).join('');
  host.innerHTML = `<div class="hall-wrap"><table class="hall"><thead><tr>
      <th>When</th><th>Chain</th><th>From</th><th>Amount</th><th>≈ USD</th><th></th></tr></thead>
    <tbody>${rows}</tbody></table></div>${note}`;
}
