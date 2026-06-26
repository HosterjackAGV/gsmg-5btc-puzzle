// games/hashminer.js — "Hash Miner": an idle game that teaches proof-of-work.
// Your rigs search for SHA-256 outputs; rarer outputs (more leading zeros) are
// jackpots. Spend found hashes on faster rigs and overclocks; progress keeps
// accruing while you're away. Not leaderboard-ranked (idle scores can't be
// cryptographically verified) — it grants XP at milestones and feeds the lore.

const SUFFIX = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
function fmt(n) {
  if (!isFinite(n)) return '∞';
  if (n < 1000) return (n < 10 ? n.toFixed(1) : Math.floor(n).toString());
  let i = 0; while (n >= 1000 && i < SUFFIX.length - 1) { n /= 1000; i++; }
  return n.toFixed(2) + SUFFIX[i];
}
function fmtTime(s) { s = Math.floor(s); if (s < 60) return s + 's'; const m = Math.floor(s / 60); if (m < 60) return m + 'm'; const h = Math.floor(m / 60); return h + 'h ' + (m % 60) + 'm'; }
function hex(n) { let s = ''; for (let i = 0; i < n; i++) s += '0123456789abcdef'[(Math.random() * 16) | 0]; return s; }

const CAP_AWAY = 8 * 3600;          // offline progress caps at 8 hours
const RIG_BASE = 12, RIG_GROWTH = 1.18;
const OC_BASE = 800, OC_GROWTH = 4;
const PRESTIGE_AT = 1e6;

export function start(host) {
  const el = host.el;
  const S = Object.assign(
    { hashes: 0, rigs: 1, oc: 0, prestige: 0, totalFound: 0, bestZeros: 0, lastSave: Date.now(), milestone: 0 },
    host.loadState() || {}
  );

  const rate = () => S.rigs * Math.pow(2, S.oc) * (1 + 0.25 * S.prestige);
  const rigCost = () => Math.floor(RIG_BASE * Math.pow(RIG_GROWTH, S.rigs - 1));
  const ocCost = () => Math.floor(OC_BASE * Math.pow(OC_GROWTH, S.oc));
  const canPrestige = () => S.totalFound >= PRESTIGE_AT * (S.prestige + 1);

  // ---- offline catch-up ----
  const away = Math.min(CAP_AWAY, Math.max(0, (Date.now() - (S.lastSave || Date.now())) / 1000));
  if (away > 30) {
    const gain = rate() * away; S.hashes += gain; S.totalFound += gain;
    host.toast({ ico: '⛏️', title: 'While you were away', desc: `Your rigs found ${fmt(gain)} hashes in ${fmtTime(away)}.`, kind: 'gold', ttl: 6000 });
  }

  el.innerHTML = `
  <div class="hm">
    <div class="hm-head">
      <div class="hm-bal"><div class="big" id="hm-hashes">0</div><div class="faint">hashes</div></div>
      <div class="hm-stat"><b id="hm-rate">0</b><span>per second</span></div>
      <div class="hm-stat"><b id="hm-rigs">1</b><span>rigs</span></div>
      <div class="hm-stat"><b id="hm-pr">0</b><span>kernels (+25% each)</span></div>
    </div>

    <div class="hm-rig">
      <div class="hm-core" id="hm-core">⛏</div>
      <div class="hm-feed" id="hm-feed"></div>
    </div>

    <div class="hm-shop">
      <button type="button" class="hm-buy" id="hm-rig"><span class="t">＋ Add rig</span><span class="c" id="hm-rigc"></span><span class="d">+1 rig of hashrate</span></button>
      <button type="button" class="hm-buy" id="hm-oc"><span class="t">⚡ Overclock</span><span class="c" id="hm-occ"></span><span class="d">×2 to all rigs</span></button>
      <button type="button" class="hm-buy gold" id="hm-prestige" hidden><span class="t">♻ Recompile kernel</span><span class="c">reset for +25% forever</span><span class="d" id="hm-prd"></span></button>
    </div>

    <div class="hm-note faint">Each scrolling line is a pretend SHA-256 output. Real mining is exactly this: guess inputs, hash them, hope for a rare result with lots of leading zeros. Best rarity found: <b id="hm-best">0</b> leading zeros. <a href="#/learn">What is a hash?</a></div>
  </div>`;

  const $ = (id) => el.querySelector(id);
  const elHashes = $('#hm-hashes'), elRate = $('#hm-rate'), elRigs = $('#hm-rigs'), elPr = $('#hm-pr'),
    elBest = $('#hm-best'), feed = $('#hm-feed'), core = $('#hm-core'),
    bRig = $('#hm-rig'), bOc = $('#hm-oc'), bPr = $('#hm-prestige'), cRig = $('#hm-rigc'), cOc = $('#hm-occ'), prd = $('#hm-prd');

  function pushFeed(zeros) {
    const line = document.createElement('div');
    line.className = 'hm-line' + (zeros >= 4 ? ' gold' : zeros >= 2 ? ' hot' : '');
    line.textContent = '0'.repeat(zeros) + hex(60 - zeros);
    feed.prepend(line);
    while (feed.childElementCount > 9) feed.lastElementChild.remove();
  }

  function buyRig() { const c = rigCost(); if (S.hashes >= c) { S.hashes -= c; S.rigs++; bump(core); } }
  function buyOc() { const c = ocCost(); if (S.hashes >= c) { S.hashes -= c; S.oc++; bump(core); host.toast({ ico: '⚡', title: 'Overclocked', desc: `Rigs now ×${Math.pow(2, S.oc)}.` }); } }
  function prestige() {
    if (!canPrestige()) return;
    S.prestige++; S.hashes = 0; S.rigs = 1; S.oc = 0;
    host.addXp(150); host.confetti(90);
    host.toast({ ico: '♻', title: 'Kernel recompiled', desc: `Permanent +25% hashrate. Now at +${25 * S.prestige}%.`, kind: 'gold', ttl: 6000 });
  }
  function bump(node) { node.classList.remove('bump'); void node.offsetWidth; node.classList.add('bump'); }

  bRig.onclick = buyRig; bOc.onclick = buyOc; bPr.onclick = prestige;

  function milestones() {
    const marks = [1e3, 1e4, 1e5, 1e6, 1e8];
    while (S.milestone < marks.length && S.totalFound >= marks[S.milestone]) {
      S.milestone++; host.addXp(40);
      host.toast({ ico: '🏅', title: 'Milestone', desc: `${fmt(marks[S.milestone - 1])} total hashes mined. +40 XP.` });
    }
  }

  // ---- main loop ----
  let feedAcc = 0, saveAcc = 0, jackAcc = 0;
  const loop = host.loop((dt) => {
    const r = rate();
    S.hashes += r * dt; S.totalFound += r * dt;

    // counters
    elHashes.textContent = fmt(S.hashes);
    elRate.textContent = fmt(r);
    elRigs.textContent = S.rigs;
    elPr.textContent = S.prestige;
    elBest.textContent = S.bestZeros;
    cRig.textContent = fmt(rigCost());
    cOc.textContent = fmt(ocCost());
    bRig.classList.toggle('off', S.hashes < rigCost());
    bOc.classList.toggle('off', S.hashes < ocCost());
    bPr.hidden = !canPrestige();
    if (!bPr.hidden) prd.textContent = `total ${fmt(S.totalFound)}`;

    // a lively feed of "hashes"; rare ones are jackpots
    feedAcc += dt; jackAcc += dt;
    if (feedAcc > 0.12) {
      feedAcc = 0;
      let zeros = 1; const roll = Math.random();
      if (roll > 0.997) zeros = 5; else if (roll > 0.985) zeros = 4; else if (roll > 0.93) zeros = 3; else if (roll > 0.7) zeros = 2;
      pushFeed(zeros);
      if (zeros > S.bestZeros) S.bestZeros = zeros;
      if (zeros >= 4) { const bonus = r * 45 * Math.pow(2, zeros - 3); S.hashes += bonus; S.totalFound += bonus; bump(core); }
    }

    milestones();
    saveAcc += dt; if (saveAcc > 5) { saveAcc = 0; S.lastSave = Date.now(); host.saveState(S); }
  });
  loop.start();

  return { destroy() { loop.stop(); S.lastSave = Date.now(); host.saveState(S); } };
}
