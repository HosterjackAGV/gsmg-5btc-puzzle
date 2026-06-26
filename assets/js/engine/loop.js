// engine/loop.js — a tiny requestAnimationFrame loop with a delta-time step.
// Respects prefers-reduced-motion (callers can skip animation when `reduced`).
// Browser-only; guarded so importing it in Node doesn't throw.

const hasRAF = typeof requestAnimationFrame === 'function';
const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : 0);

export function createLoop(step) {
  let raf = 0, last = 0, running = false;
  const reduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  function frame(t) {
    if (!running) return;
    const dt = Math.min(0.05, ((t - last) / 1000) || 0); // clamp to avoid huge jumps after tab-away
    last = t;
    try { step(dt, t); } catch (e) { console.error('loop step error', e); }
    raf = requestAnimationFrame(frame);
  }

  return {
    start() { if (running || !hasRAF) return; running = true; last = now(); raf = requestAnimationFrame(frame); },
    stop() { running = false; if (hasRAF) cancelAnimationFrame(raf); },
    get running() { return running; },
    reduced,
  };
}
