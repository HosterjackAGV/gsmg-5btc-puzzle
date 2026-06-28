// content/analytics.js — view-counter + analytics configuration.
//
// WHAT WORKS WITH ZERO SETUP (already on): a free, keyless, privacy-compliant view counter
// (Abacus, with CounterAPI as fallback). It stores only a number per section — no cookies, no
// personal data — so it needs no consent banner and is GDPR/CCPA-safe.
//
// TWO OPTIONAL UPGRADES (fill a value to enable; leave '' to keep off):
//   • goatcounterCode — your OWN private traffic dashboard (views per section, referrers,
//     countries, over time). Free + GDPR-friendly. Sign up at https://www.goatcounter.com
//     (~2 min), then put your site code here (the "<code>" in <code>.goatcounter.com).
//   • firebaseDbUrl — LIVE concurrent-viewer counts. Needs a free Firebase Realtime Database
//     (https://console.firebase.google.com → create project → Realtime Database). Paste its URL
//     (https://<project>-default-rtdb.firebaseio.com) and set its rules to allow read/write on
//     "presence". See docs/ANALYTICS.md for the 3 steps. Leave '' and the live dot simply won't show.

export const ANALYTICS = {
  showCounts: true,
  keylessNamespace: 'gsmg5btc-hjagv-v1',   // unique key-space for this site's public counters
  goatcounterCode: 'hosterjack',            // → https://hosterjack.goatcounter.com (per-section, SPA-aware)
  firebaseDbUrl: '',                        // e.g. 'https://gsmg-xxxx-default-rtdb.firebaseio.com'
};

export const SECTION_LABELS = {
  home: 'Home', walkthrough: 'Walkthrough', tried: 'What was tried',
  insights: 'Insights', reference: 'Reference', donations: 'Donations',
};
export const SECTION_ORDER = ['home', 'walkthrough', 'tried', 'insights', 'reference', 'donations'];

// Map a router path to a stable section key (collapses /tried/:id, /donate, etc.)
export function sectionKey(path) {
  const p = String(path || '/').toLowerCase();
  if (p === '/' || p === '') return 'home';
  const seg = p.replace(/^\//, '').split('/')[0];
  if (seg === 'tried') return 'tried';
  if (seg === 'donate' || seg === 'donations') return 'donations';
  if (['walkthrough', 'insights', 'reference'].includes(seg)) return seg;
  return 'home';
}
