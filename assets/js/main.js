// main.js — boot the walkthrough-focused site shell: hash router, nav highlight,
// scroll-progress bar. No game state, no community, no XP — just the authoritative
// walkthrough, the reference sheet, and the home landing.

import { createRouter } from './router.js';
import { qs, qsa } from './util.js';
import { track } from './counter.js';

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
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    scan.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });
}

const notFound = async () => ({ default: async () => ({
  title: 'Not found',
  html: '<section class="section"><div class="wrap"><div class="note warn"><h4>Page not found</h4><p>Head to the <a href="#/walkthrough">complete walkthrough</a> or the <a href="#/reference">reference sheet</a>.</p></div></div></section>',
}) });

const router = createRouter({
  outlet: qs('#app'),
  onAfter: (path) => { highlightNav(path); try { window.scrollTo(0, 0); } catch {} try { track(path, qs('#app')); } catch {} },
  notFound,
});

router
  .add('/', () => import('./views/home.js'))
  .add('/walkthrough', () => import('./views/walkthrough.js'))
  .add('/tried', () => import('./views/tried.js'))
  .add('/tried/:id', () => import('./views/tried.js'))
  .add('/insights', () => import('./views/insights.js'))
  .add('/reference', () => import('./views/reference.js'))
  .add('/donations', () => import('./views/donations.js'))
  .add('/donate', () => import('./views/donations.js'))
  .add('/games', () => import('./views/games.js'))
  .add('/play', () => import('./views/games.js'));

wireScan();
router.start();
