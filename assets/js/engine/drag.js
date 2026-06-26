// engine/drag.js — pointer-based drag helper (mouse + touch + pen, one code path).
// Used to physically drag letter tiles onto slots. Drop targets are found by
// hit-testing document.elementFromPoint, so any element can be a drop zone.

/** Make `el` draggable. Returns a cleanup function.
 *  handlers: { onStart(e), onMove(e,dx,dy), onDrop(e, targetEl), onEnd(e) } */
export function draggable(el, handlers = {}) {
  let active = false, pid = null, sx = 0, sy = 0;

  function down(e) {
    if (e.button != null && e.button !== 0) return;
    active = true; pid = e.pointerId; sx = e.clientX; sy = e.clientY;
    try { el.setPointerCapture(pid); } catch {}
    handlers.onStart && handlers.onStart(e);
  }
  function move(e) {
    if (!active || e.pointerId !== pid) return;
    handlers.onMove && handlers.onMove(e, e.clientX - sx, e.clientY - sy);
  }
  function up(e) {
    if (!active || e.pointerId !== pid) return;
    active = false;
    if (handlers.onDrop) {
      // hide the dragged element so elementFromPoint sees what's beneath it
      const prev = el.style.pointerEvents; el.style.pointerEvents = 'none';
      const target = document.elementFromPoint(e.clientX, e.clientY);
      el.style.pointerEvents = prev;
      handlers.onDrop(e, target);
    }
    try { el.releasePointerCapture(pid); } catch {}
    handlers.onEnd && handlers.onEnd(e);
    pid = null;
  }

  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.style.touchAction = 'none';

  return () => {
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
  };
}
