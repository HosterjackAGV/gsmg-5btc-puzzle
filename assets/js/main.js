// main.js — boot the game shell: nav, XP widget, router, achievements, progress bar.

import * as store from './store.js';
import { createRouter } from './router.js';
import { newlyUnlocked, getAchievement } from './achievements.js';
import { qs, qsa, esc, toast } from './util.js';

// ---------- topbar XP / level widget ----------
function renderXp(s) {
  const lvl = store.levelFor(s.xp);
  const el = qs('#xpwidget');
  if (!el) return;
  el.innerHTML = `
    <div class="lvl">${lvl.level}</div>
    <div class="meta">
      <div class="top"><span>LVL ${lvl.level}</span><span>${s.xp} XP</span></div>
      <div class="bar"><i style="width:${lvl.pct}%"></i></div>
    </div>`;
}

// ---------- active nav highlight ----------
function highlightNav(path) {
  qsa('#topbar nav a').forEach(a => {
    const href = a.getAttribute('href').replace(/^#/, '');
    const base = '/' + path.replace(/^\//, '').split('/')[0];
    a.classList.toggle('active', href === path || (href !== '/' && base === href));
  });
}

// ---------- scroll progress bar ----------
function wireScan() {
  const scan = qs('#scan');
  if (!scan) return;
  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    scan.style.width = (p * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---------- achievement hook ----------
store.onChange((s) => {
  for (const a of newlyUnlocked(s)) {
    if (store.unlockAchievement(a.id, a.xp)) {
      toast({ ico: a.ico, title: 'Achievement: ' + a.title, desc: `${a.desc} · +${a.xp} XP`, kind: 'gold', ttl: 6000 });
    }
  }
});

// ---------- boot ----------
store.subscribe(renderXp);

// active mini-game teardown: games register their instance here; the router stops
// all of them (RAF loops, key listeners) before the next view mounts. A single view
// can host several games (e.g. a phase's intro game + its in-door hard mode).
let activeGames = [];
window.__gsmgMountGame = (inst) => { if (inst) activeGames.push(inst); };
function teardownGame() { for (const g of activeGames) { if (g && g.destroy) { try { g.destroy(); } catch (e) {} } } activeGames = []; }

const router = createRouter({
  outlet: qs('#app'),
  onBefore: () => { teardownGame(); },
  onAfter: (path) => { highlightNav(path); },
  notFound: () => import('./views/placeholder.js'),
});

// /frontier → the Cosmic door (the live endgame)
const frontierAlias = async () => ({ default: async ({ navigate }) => { navigate('/phase/cosmic'); return { title: 'Frontier', html: '' }; } });

router
  .add('/', () => import('./views/home.js'))
  .add('/map', () => import('./views/home.js'))
  .add('/phase/:id', () => import('./views/phase.js'))
  .add('/frontier', frontierAlias)
  .add('/workbench', () => import('./views/workbench.js'))
  .add('/arcade', () => import('./views/arcade.js'))
  .add('/arcade/:game', () => import('./views/arcade.js'))
  .add('/arcade/:game/:mode', () => import('./views/arcade.js'))
  .add('/learn', () => import('./views/learn.js'))
  .add('/leaderboard', () => import('./views/leaderboard.js'))
  .add('/profile', () => import('./views/profile.js'))
  .add('/reference', () => import('./views/reference.js'))
  .add('/community', () => import('./views/community.js'))
  .add('/ledger', () => import('./views/ledger.js'));

wireScan();
router.start();

// boot: commit once so the achievement hook runs (unlocks "first steps" etc.)
store.setHandle(store.state.handle);
