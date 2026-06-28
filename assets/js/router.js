// router.js — minimal hash router for the single-page game shell.
// Routes are registered as patterns with :params; views are lazy-loaded.

export function createRouter({ outlet, onBefore, onAfter, notFound }) {
  const routes = [];

  function add(pattern, loader) {
    const keys = [];
    const rx = new RegExp('^' + pattern.replace(/\//g, '\\/').replace(/:([^\\/]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
    routes.push({ rx, keys, loader });
    return api;
  }

  function parse() {
    let h = location.hash.replace(/^#/, '');
    if (!h || h === '/') h = '/';
    const [path] = h.split('?');
    return path.startsWith('/') ? path : '/' + path;
  }

  async function resolve() {
    const path = parse();
    let match = null, params = {};
    for (const r of routes) {
      const m = r.rx.exec(path);
      if (m) { match = r; r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1])); break; }
    }
    onBefore && onBefore(path);
    let result;
    try {
      const loader = match ? match.loader : notFound;
      const mod = await loader();
      const view = (mod && mod.default) ? mod.default : mod;
      result = await view({ params, navigate, path });
    } catch (err) {
      console.error('route error', err);
      result = { title: 'Error', html: `<section class="section"><div class="wrap"><div class="note warn"><h4>Something broke loading this view</h4><p>${String(err && err.message || err)}</p></div></div></section>` };
    }
    outlet.innerHTML = (result && result.html) || '';
    outlet.classList.remove('view-enter'); void outlet.offsetWidth; outlet.classList.add('view-enter');
    document.title = (result && result.title ? result.title + ' · ' : '') + 'GSMG.io 5 BTC Puzzle — Walkthrough';
    if (result && result.mount) { try { result.mount(outlet); } catch (e) { console.error(e); } }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    onAfter && onAfter(path, result);
  }

  function navigate(to) { if (location.hash !== '#' + to) location.hash = to; else resolve(); }

  const api = { add, start() { window.addEventListener('hashchange', resolve); resolve(); return api; }, navigate, resolve };
  return api;
}
