// onchain.js — the rate-safe, free, keyless on-chain data engine.
//
// Design goals (so a deployed static page can NEVER realistically hit a rate limit):
//   • cache-first with stale-while-revalidate (localStorage + in-memory), per-resource TTL
//   • in-flight de-duplication (concurrent callers share one request)
//   • provider fallback pools with per-provider cooldown on failure / HTTP 429
//   • visibility-gated polling (only refresh while the tab is visible; auto-stop when the
//     view is detached from the DOM) with conservative intervals + jitter
//   • short per-request timeouts so a slow provider can't pin the UI
// Every endpoint used here is free, requires no API key, and sends `Access-Control-Allow-Origin: *`.

import { ESPLORA, ETH_RPC, BSC_RPC, SOL_RPC, XRP_RPC } from '../../content/donations.js';

const NS = 'gsmg:oc:';                       // localStorage namespace
const mem = new Map();                       // key -> { t, v }
const inflight = new Map();                  // key -> Promise
const cooldown = new Map();                  // provider url -> epoch ms until usable again

const now = () => Date.now();
const jitter = (ms) => ms * (0.85 + Math.random() * 0.3);

// ---------- cache primitives ----------
function readLS(key) {
  try { const s = localStorage.getItem(NS + key); return s ? JSON.parse(s) : null; } catch { return null; }
}
function writeLS(key, rec) { try { localStorage.setItem(NS + key, JSON.stringify(rec)); } catch {} }

/** Last cached value for `key`, ignoring age — for instant paint. */
export function peek(key) {
  const m = mem.get(key); if (m) return m.v;
  const l = readLS(key); if (l) { mem.set(key, l); return l.v; }
  return null;
}

/** Cache-first fetch. Returns fresh if within ttl; otherwise refetches, falling back to
 *  stale on error (stale-while-revalidate). De-dupes concurrent calls. */
export async function cached(key, ttlMs, fetcher) {
  const rec = mem.get(key) || readLS(key);
  if (rec) { mem.set(key, rec); if (now() - rec.t < ttlMs) return rec.v; }
  if (inflight.has(key)) return inflight.get(key);
  const p = (async () => {
    try {
      const v = await fetcher();
      const fresh = { t: now(), v }; mem.set(key, fresh); writeLS(key, fresh);
      return v;
    } catch (e) {
      if (rec) return rec.v;                 // serve stale rather than break the UI
      throw e;
    } finally { inflight.delete(key); }
  })();
  inflight.set(key, p);
  return p;
}

// ---------- low-level HTTP (timeout + abort) ----------
async function http(url, opts = {}, timeoutMs = 12000) {
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ac.signal, cache: 'no-store', mode: 'cors' });
    if (res.status === 429) { cooldown.set(url, now() + 5 * 60000); throw new Error('429 ' + url); }
    if (!res.ok) throw new Error(res.status + ' ' + url);
    return await res.json();
  } finally { clearTimeout(to); }
}
const getJSON  = (url, t) => http(url, {}, t);
const postJSON = (url, body, t) => http(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, t);

/** Try providers in order, skipping any in cooldown, until one succeeds. */
async function viaPool(pool, fn) {
  let lastErr;
  const usable = pool.filter(u => (cooldown.get(u) || 0) < now());
  const order = usable.length ? usable : pool;     // if all cooling down, try anyway
  for (const url of order) {
    try { return await fn(url); }
    catch (e) { lastErr = e; if (!String(e).includes('429')) cooldown.set(url, now() + 60000); }
  }
  throw lastErr || new Error('all providers failed');
}

// ---------- prices (USD) ----------
const PRICE_IDS = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'solana', 'tether'];
const BINANCE = { bitcoin: 'BTCUSDT', ethereum: 'ETHUSDT', binancecoin: 'BNBUSDT', ripple: 'XRPUSDT', solana: 'SOLUSDT' };

export function getPrices() {
  return cached('prices', 5 * 60000, async () => {
    // primary: one CoinGecko call for everything
    try {
      const d = await getJSON('https://api.coingecko.com/api/v3/simple/price?ids=' + PRICE_IDS.join(',') + '&vs_currencies=usd');
      const out = {}; for (const id of PRICE_IDS) out[id] = d?.[id]?.usd ?? (id === 'tether' ? 1 : 0);
      if (out.bitcoin > 0) return out;
      throw new Error('coingecko empty');
    } catch {
      // fallback: per-symbol Binance tickers (very high limits), tether := 1
      const out = { tether: 1 };
      await Promise.all(Object.entries(BINANCE).map(async ([id, sym]) => {
        try { const d = await getJSON('https://api.binance.com/api/v3/ticker/price?symbol=' + sym); out[id] = parseFloat(d.price) || 0; }
        catch { out[id] = 0; }
      }));
      if (out.bitcoin > 0) return out;
      // last resort: Coinbase spot for BTC/ETH (keeps headline numbers alive)
      try {
        const [b, e] = await Promise.all([
          getJSON('https://api.coinbase.com/v2/prices/BTC-USD/spot'),
          getJSON('https://api.coinbase.com/v2/prices/ETH-USD/spot'),
        ]);
        out.bitcoin = parseFloat(b.data.amount) || 0; out.ethereum = parseFloat(e.data.amount) || 0;
      } catch {}
      return out;
    }
  });
}

// ---------- balance adapters ----------
// Convert a base-unit integer (hex string, decimal string, or BigInt) to a decimal Number,
// scaling in BigInt FIRST so we never push a >2^53 value through Number() before dividing.
function unitsToNumber(raw, decimals, keep = 8) {
  let v; try { v = typeof raw === 'bigint' ? raw : BigInt(raw); } catch { return 0; }
  if (v < 0n) v = -v;
  const k = Math.min(keep, decimals | 0);
  const scale = 10n ** BigInt((decimals | 0) - k);     // drop the dust we won't display
  const scaled = scale > 1n ? v / scale : v;
  return Number(scaled) / 10 ** k;
}

async function balBTC(addr)  { return viaPool(ESPLORA, async base => { const d = await getJSON(`${base}/address/${addr}`); const c = d.chain_stats || {}; return (c.funded_txo_sum - c.spent_txo_sum) / 1e8; }); }
async function balEVM(cfg)   { return viaPool(cfg.rpc, async url => { const d = await postJSON(url, { jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [cfg.address, 'latest'] }); return unitsToNumber(d.result, cfg.decimals); }); }
async function balToken(cfg) { const data = '0x70a08231' + cfg.address.toLowerCase().replace(/^0x/, '').padStart(64, '0'); return viaPool(cfg.rpc, async url => { const d = await postJSON(url, { jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: cfg.token, data }, 'latest'] }); return unitsToNumber(d.result, cfg.decimals); }); }
async function balXRP(cfg)   { return viaPool(cfg.rpc, async url => { const d = await postJSON(url, { method: 'account_info', params: [{ account: cfg.address, ledger_index: 'validated' }] }); const r = d.result || {}; if (r.error === 'actNotFound') return 0; return Number(r.account_data?.Balance || 0) / 1e6; }); }
async function balSOL(cfg)   { return viaPool(cfg.rpc, async url => { const d = await postJSON(url, { jsonrpc: '2.0', id: 1, method: 'getBalance', params: [cfg.address] }); return Number(d.result?.value || 0) / 1e9; }); }

/** Normalized balance for any donation/watched config: { amount, symbol, address }. */
export function getBalance(cfg) {
  return cached('bal:' + cfg.id + ':' + cfg.address, 60000, async () => {
    let amount = 0;
    if (cfg.kind === 'btc') amount = await balBTC(cfg.address);
    else if (cfg.kind === 'evm') amount = await balEVM(cfg);
    else if (cfg.kind === 'evm-token') amount = await balToken(cfg);
    else if (cfg.kind === 'xrp') amount = await balXRP(cfg);
    else if (cfg.kind === 'sol') amount = await balSOL(cfg);
    return { amount, symbol: cfg.symbol, address: cfg.address };
  });
}

// ---------- history adapters (incoming donations only) ----------
async function histBTC(cfg) {
  const txs = await viaPool(ESPLORA, base => getJSON(`${base}/address/${cfg.address}/txs`));
  const out = [];
  for (const tx of (txs || [])) {
    const fromSelf = (tx.vin || []).some(v => v.prevout?.scriptpubkey_address === cfg.address);
    if (fromSelf) continue;                                   // spend / change, not a donation
    let sats = 0; for (const o of (tx.vout || [])) if (o.scriptpubkey_address === cfg.address) sats += o.value;
    if (sats <= 0) continue;
    out.push({ chain: cfg.id, txid: tx.txid, date: tx.status?.block_time || Math.floor(now() / 1000),
      from: tx.vin?.[0]?.prevout?.scriptpubkey_address || 'unknown', amount: sats / 1e8, symbol: 'BTC',
      pending: !tx.status?.confirmed, url: cfg.explorer.replace('/address/', '/tx/') + tx.txid });
  }
  return out;
}
async function histEVMnative(cfg) {
  const d = await getJSON(`${cfg.blockscout}/api/v2/addresses/${cfg.address}/transactions?filter=to`);
  return (d.items || []).filter(i => i.to?.hash?.toLowerCase() === cfg.address.toLowerCase() && i.value && i.value !== '0' && i.result === 'success')
    .map(i => ({ chain: cfg.id, txid: i.hash, date: Math.floor(Date.parse(i.timestamp) / 1000), from: i.from?.hash || 'unknown',
      amount: unitsToNumber(i.value, 18), symbol: 'ETH', url: `https://etherscan.io/tx/${i.hash}` }));
}
async function histEVMtoken(cfg) {
  const d = await getJSON(`${cfg.blockscout}/api/v2/addresses/${cfg.address}/token-transfers?filter=to&type=ERC-20`);
  return (d.items || []).filter(i => i.to?.hash?.toLowerCase() === cfg.address.toLowerCase() && i.total?.value)
    .map(i => ({ chain: cfg.id, txid: i.transaction_hash, date: Math.floor(Date.parse(i.timestamp) / 1000), from: i.from?.hash || 'unknown',
      amount: unitsToNumber(i.total.value, Number(i.total.decimals || cfg.decimals)), symbol: i.token?.symbol || 'TOKEN',
      stable: /^(usdt|usdc|dai|busd|tusd)$/i.test(i.token?.symbol || ''), url: `https://etherscan.io/tx/${i.transaction_hash}` }));
}
async function histXRP(cfg) {
  const d = await viaPool(cfg.rpc, url => postJSON(url, { method: 'account_tx', params: [{ account: cfg.address, limit: 25, ledger_index_min: -1, ledger_index_max: -1 }] }));
  const txs = d.result?.transactions || [];
  const out = [];
  for (const t of txs) {
    const tx = t.tx || t.tx_json || t; const meta = t.meta || t.metaData || {};
    if (tx.TransactionType !== 'Payment' || tx.Destination !== cfg.address) continue;
    if (meta.TransactionResult && meta.TransactionResult !== 'tesSUCCESS') continue;
    const amt = meta.delivered_amount ?? tx.Amount;
    if (typeof amt !== 'string') continue;                    // skip issued-currency payments
    out.push({ chain: cfg.id, txid: tx.hash, date: (tx.date || 0) + 946684800, from: tx.Account || 'unknown',
      amount: Number(amt) / 1e6, symbol: 'XRP', url: cfg.explorer.replace('/account/', '/tx/') + tx.hash });
  }
  return out;
}
async function histSOL(cfg) {
  const sigs = await viaPool(cfg.rpc, url => postJSON(url, { jsonrpc: '2.0', id: 1, method: 'getSignaturesForAddress', params: [cfg.address, { limit: 12 }] }));
  const list = (sigs.result || []).filter(s => !s.err).slice(0, 8);   // bounded: cap getTransaction calls
  const out = [];
  for (const s of list) {
    try {
      const d = await viaPool(cfg.rpc, url => postJSON(url, { jsonrpc: '2.0', id: 1, method: 'getTransaction', params: [s.signature, { maxSupportedTransactionVersion: 0, encoding: 'jsonParsed' }] }));
      const r = d.result; if (!r?.meta) continue;
      const keys = (r.transaction.message.accountKeys || []).map(k => (typeof k === 'string' ? k : k.pubkey));
      const idx = keys.indexOf(cfg.address); if (idx < 0) continue;
      const delta = (r.meta.postBalances[idx] - r.meta.preBalances[idx]) / 1e9;
      if (delta <= 0) continue;                                // only incoming credits
      let sender = 'unknown', drop = 0;
      for (let i = 0; i < keys.length; i++) { const dd = (r.meta.postBalances[i] - r.meta.preBalances[i]) / 1e9; if (dd < drop) { drop = dd; sender = keys[i]; } }
      out.push({ chain: cfg.id, txid: s.signature, date: s.blockTime || Math.floor(now() / 1000), from: sender, amount: delta, symbol: 'SOL', url: cfg.explorer.replace('/account/', '/tx/') + s.signature });
    } catch {}
  }
  return out;
}

/** Incoming-donation history for a config: { items, degraded }. Cached 10 min (changes rarely). */
export function getHistory(cfg) {
  return cached('hist:' + cfg.id + ':' + cfg.address, 10 * 60000, async () => {
    if (cfg.feedDegraded) return { items: [], degraded: true };
    let items = [];
    try {
      if (cfg.kind === 'btc') items = await histBTC(cfg);
      else if (cfg.kind === 'evm') items = await histEVMnative(cfg);
      else if (cfg.kind === 'evm-token') items = await histEVMtoken(cfg);
      else if (cfg.kind === 'xrp') items = await histXRP(cfg);
      else if (cfg.kind === 'sol') items = await histSOL(cfg);
      return { items, degraded: false };
    } catch (e) { return { items: [], degraded: true, error: String(e) }; }
  });
}

// ---------- status badge (prize / halving wallets) ----------
const utcDay = () => new Date().toISOString().slice(0, 10);
function dailyBaseline(addr, amount) {
  const key = 'base:' + addr + ':' + utcDay();
  const rec = readLS(key);
  if (rec && typeof rec.v === 'number') return rec.v;
  writeLS(key, { t: now(), v: amount });
  return amount;
}
/** available / partly-drained / drained, per the spec. Drain is measured on the on-chain
 *  AMOUNT (price-independent); "drained" is a USD-negligible test (< $100). */
export function statusFor(cfg, amount, usd) {
  const baseline = dailyBaseline(cfg.address, amount);
  let state = 'available';
  // only apply the USD "drained" test when we actually have a positive price; otherwise a
  // fully-degraded price feed (usd === 0) must not flag an intact wallet as drained.
  if (usd != null && usd > 0 && usd < 100) state = 'drained';
  else if (amount < baseline * 0.999999) state = 'partly';
  return { state, baseline };
}

// ---------- visibility-gated polling ----------
/** Run fn() now, then re-run on an interval — but only while the tab is visible AND the
 *  anchor element is still in the DOM (auto-stops when the view is replaced). */
export function poll(fn, intervalMs, anchorEl) {
  let stopped = false, last = 0;
  const tick = async () => {
    if (stopped) return;
    if (anchorEl && !document.body.contains(anchorEl)) { stop(); return; }
    if (document.visibilityState !== 'visible') return;
    last = now();
    try { await fn(); } catch {}
  };
  const id = setInterval(tick, jitter(intervalMs));
  const onVis = () => { if (document.visibilityState === 'visible' && now() - last > intervalMs) tick(); };
  document.addEventListener('visibilitychange', onVis);
  function stop() { stopped = true; clearInterval(id); document.removeEventListener('visibilitychange', onVis); }
  tick();
  return stop;
}

// ---------- formatting helpers ----------
export const fmtUsd = (n) => n == null ? '—' : (n >= 1000 ? '$' + Math.round(n).toLocaleString('en-US') : '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 }));
export const fmtAmt = (n, max = 6) => n == null ? '—' : n.toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: 0 });
export const shortAddr = (a, n = 6) => !a || a.length <= 2 * n + 3 ? (a || '') : a.slice(0, n) + '…' + a.slice(-n);
export function timeAgo(sec) {
  if (!sec) return '';
  const s = Math.max(0, Math.floor(now() / 1000) - sec);
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  const d = Math.floor(s / 86400);
  return d < 30 ? d + 'd ago' : new Date(sec * 1000).toISOString().slice(0, 10);
}
