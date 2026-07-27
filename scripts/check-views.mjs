// check_views.mjs — load every route in headless Chrome and fail on ANY console error / page error.
// This is the check that would have caught the /tried crash ("does not provide an export named 'FAMILIES'"):
// node --check only parses one file, it never resolves an import graph.
//
//   node research/harnesses/check_views.mjs           (starts its own server on :8123)
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const PORT = 8123;
const ROUTES = ['/', '/#/', '/#/walkthrough', '/#/reference', '/#/tried', '/#/insights', '/#/lab', '/#/workbench'];

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
                'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                process.env.CHROME_PATH].filter(Boolean).find(p => existsSync(p));
if (!CHROME) { console.error('chrome not found — set CHROME_PATH'); process.exit(2); }

const server = spawn('python', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
const done = (code) => { server.kill(); process.exit(code); };
process.on('SIGINT', () => done(130));

await new Promise(r => setTimeout(r, 1200));

let failed = 0;
for (const route of ROUTES) {
  const url = `http://localhost:${PORT}/${route.replace(/^\//, '')}`;
  // --dump-dom runs the page (incl. modules) and prints the rendered DOM; console errors go to stderr.
  const out = await new Promise((resolve) => {
    const p = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=4000',
                             '--enable-logging=stderr', '--v=0', '--dump-dom', url],
                    { stdio: ['ignore', 'pipe', 'pipe'] });
    let dom = '', err = '';
    p.stdout.on('data', d => dom += d); p.stderr.on('data', d => err += d);
    p.on('close', () => resolve({ dom, err }));
  });
  // Only PAGE-level JS failures count. Chrome logs a lot of browser-internal noise (GCM auth, GPU,
  // bluetooth, DevTools) on every headless start — none of it comes from the site.
  const PAGE_ERR = /Uncaught|does not provide an export|Failed to fetch dynamically imported|Failed to resolve module|SyntaxError|TypeError|ReferenceError|net::ERR_.*localhost/i;
  const NOISE = /google_apis|mcs_client|gcm|registration_request|GPU|gpu_|voice_transcription|DevTools|bluetooth|dbus|Fontconfig/i;
  const errs = out.err.split('\n').filter(l => PAGE_ERR.test(l) && !NOISE.test(l));
  const broke = /Something broke loading this view/i.test(out.dom);
  const ok = errs.length === 0 && !broke;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${route}${broke ? '   [view rendered the error card]' : ''}`);
  for (const e of errs.slice(0, 3)) console.log('      ' + e.trim().slice(0, 200));
}
console.log(failed ? `\n=== ${failed} route(s) FAILED ===` : `\n=== all ${ROUTES.length} routes clean ===`);
done(failed ? 1 : 0);
