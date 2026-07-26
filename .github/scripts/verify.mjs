// verify.mjs — `npm run verify:puzzle`
// Re-runs the REAL crypto on every documented value in this repo and asserts it still holds.
// Self-contained (no deps, no network): it reads only ciphertexts/ and content/matrix.js.
// Exits non-zero if any documented claim stops reproducing — so CI catches content drift.
//
// What it proves:
//   · the genesis grid → the URL (spiral regenerated from scratch, colour bits == URL LSBs)
//   · sha256("causality")                        → decrypts phase2.txt
//   · sha256(the seven parts)                    → decrypts phase3.txt
//   · sha256("jacquefresco…principle")           → decrypts phase32.txt
//   · phase-3.2 plaintext → CP1141 → Beaufort("thematrixhasyou") → the Architect monologue
//   · sha256(the 59-char entry string)           == the SalPhaseIon URL hash
//   · the three ENDGAME blobs are intact AND still closed (the believed recipe must fail)
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const sha256hex = s => crypto.createHash('sha256').update(Buffer.isBuffer(s) ? s : Buffer.from(s, 'utf8')).digest('hex');
const b64 = b => Buffer.from(String(b).replace(/\s+/g, ''), 'base64');
let pass = 0, fail = 0;
const ok = (n, c, d = '') => { c ? pass++ : fail++; console.log(`${c ? '✅' : '❌'} ${n}${d ? ' — ' + d : ''}`); };

function evp(pw, salt) { let d = Buffer.alloc(0), o = Buffer.alloc(0); const P = Buffer.from(pw, 'utf8');
  while (o.length < 48) { d = crypto.createHash('sha256').update(Buffer.concat([d, P, salt])).digest(); o = Buffer.concat([o, d]); }
  return { key: o.subarray(0, 32), iv: o.subarray(32, 48) }; }
function blob(n) { const raw = b64(readFileSync(`ciphertexts/${n}.txt`, 'utf8').trim());
  if (raw.subarray(0, 8).toString('latin1') !== 'Salted__') throw new Error('not a Salted__ blob: ' + n);
  return { salt: raw.subarray(8, 16), ct: raw.subarray(16) }; }
function decrypt(n, pw) { const b = blob(n); const { key, iv } = evp(pw, b.salt);
  try { const d = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return { ok: true, pt: Buffer.concat([d.update(b.ct), d.final()]), salt: b.salt.toString('hex'), ctLen: b.ct.length };
  } catch { return { ok: false, pt: null, salt: b.salt.toString('hex'), ctLen: b.ct.length }; } }

console.log('=== GSMG puzzle verification (real crypto, no network) ===\n');

// ---- Phase 0: genesis grid → URL ----
const MATRIX = JSON.parse(readFileSync('content/matrix.js', 'utf8').match(/export const MATRIX\s*=\s*(\{[\s\S]*?\});/)[1]);
const ccw = (n => { const seen = Array.from({ length: n }, () => Array(n).fill(false)), out = [];
  let r = 0, c = 0, dr = 1, dc = 0;
  for (let k = 0; k < n * n; k++) { out.push([r, c]); seen[r][c] = true; let nr = r + dr, nc = c + dc;
    if (!(nr >= 0 && nr < n && nc >= 0 && nc < n && !seen[nr][nc])) { [dr, dc] = [-dc, dr]; nr = r + dr; nc = c + dc; }
    r = nr; c = nc; } return out; })(14);
ok('genesis: CCW spiral regenerates byte-exact', JSON.stringify(ccw) === JSON.stringify(MATRIX.spiral));
const sIdx = new Map(MATRIX.spiral.map((p, i) => [p.join(','), i]));
const col = [...MATRIX.blue, ...MATRIX.yellow].map(p => sIdx.get(p.join(',')));
ok('genesis: 24 coloured cells at spiral idx ≡ 7 (mod 8)', col.length === 24 && col.every(i => i % 8 === 7));
const blue = new Set(MATRIX.blue.map(p => sIdx.get(p.join(','))));
const bits = [...col].sort((a, b) => a - b).map(i => (blue.has(i) ? '1' : '0')).join('');
ok('genesis: colour bits == LSBs of "gsmg.io/theseedisplanted"',
   bits === [...'gsmg.io/theseedisplanted'].map(ch => ch.charCodeAt(0) & 1).join(''), bits);
const rowS = MATRIX.grid.map(r => r.reduce((a, b) => a + b, 0)).join('');
const colS = MATRIX.grid[0].map((_, c) => MATRIX.grid.reduce((a, r) => a + r[c], 0)).join('');
ok('genesis: matrixsumlist row/col sums', rowS === '610876654997879' && colS === '8108108736759668', `${rowS} / ${colS}`);

// ---- Phase 2 ----
const k2 = sha256hex('causality');
ok('phase2: sha256("causality") == eb3efb51…', k2 === 'eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf');
const p2 = decrypt('phase2', k2);
ok('phase2: decrypts (valid padding)', p2.ok, p2.ok ? `"${p2.pt.toString('utf8').slice(0, 48).replace(/\n/g, ' ')}…"` : '');

// ---- Phase 3 (seven parts) ----
const revHex = '0x' + Buffer.from([...'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'].reverse().join(''), 'latin1').toString('hex').toUpperCase();
const FEN = 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1';
const k3 = sha256hex('causality' + 'Safenet' + 'Luna' + 'HSM' + '11110' + revHex + FEN);
ok('phase3: sha256(seven parts) == 1a57c572…', k3 === '1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5');
const p3 = decrypt('phase3', k3);
ok('phase3: decrypts (valid padding)', p3.ok, p3.ok ? `"${p3.pt.toString('utf8').slice(0, 48).replace(/\n/g, ' ')}…"` : '');

// ---- Phase 3.2 + the Architect speech ----
const k32 = sha256hex('jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple');
ok('phase3.2: sha256(three answers) == 250f3772…', k32 === '250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c');
const p32 = decrypt('phase32', k32);
ok('phase3.2: decrypts (valid padding)', p32.ok, p32.ok ? `${p32.pt.length} B` : '');
if (p32.ok) {
  const hx = s => { const t = new Uint8Array(256); for (let i = 0; i < 256; i++) t[i] = parseInt(s.substr(i * 2, 2), 16); return t; };
  const CP1141 = hx('00010203372d2e2f1605250b0c0d0e0f101112133c3d322618193f271c1d1e1f404f7f7b5b6c507d4d5d5c4e6b604b61f0f1f2f3f4f5f6f7f8f97a5e4c7e6e6fb5c1c2c3c4c5c6c7c8c9d1d2d3d4d5d6d7d8d9e2e3e4e5e6e7e8e963ecfc5f6d79818283848586878889919293949596979899a2a3a4a5a6a7a8a943bbdc5907202122232415061728292a2b2c090a1b30311a333435360838393a3b04143eff41aab0b100b2cc7cbdb49a8abacaafbc908feafabea0b6b39dda9b8bb7b8b9ab646562664a679e687471727378757677ac69edeeebefe0bf80fdfefb5aadaea144454246c0479c4854515253585556578c49cdcecbcf6ae170dddedbd08d8edf');
  const txt = Buffer.from([...p32.pt].map(b => CP1141[b])).toString('latin1');
  let best = { s: -1, len: 0 }, m, re = /[a-z]{200,}/g;
  while ((m = re.exec(txt))) if (m[0].length > best.len) best = { s: m.index, len: m[0].length };
  ok('phase3.2: CP1141 view exposes the speech region', best.s === 447 && best.len === 1539, `offset=${best.s} len=${best.len}`);
  const K = [...'thematrixhasyou'].map(c => c.charCodeAt(0) - 97);
  const plain = [...txt.slice(best.s, best.s + best.len)]
    .map((ch, i) => String.fromCharCode(97 + (((K[i % K.length] - (ch.charCodeAt(0) - 97)) % 26 + 26) % 26))).join('');
  ok('phase3.2: Beaufort("thematrixhasyou") → the Architect monologue',
     plain.startsWith('yourlifeisthesum') && plain.endsWith('ciaobellao'), `"${plain.slice(0, 30)}…${plain.slice(-10)}"`);
}

// ---- SalPhaseIon entry + inner blob ----
ok('entry: sha256(59-char entry string) == the SalPhaseIon URL hash',
   sha256hex('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe') === '89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32');
ok('salphaseion.txt is byte-identical to salph_inner.txt',
   readFileSync('ciphertexts/salphaseion.txt', 'utf8').trim().replace(/\s+/g, '') ===
   readFileSync('ciphertexts/salph_inner.txt', 'utf8').trim().replace(/\s+/g, ''));

// ---- the endgame blobs: intact, and still OPEN ----
for (const [n, salt, len] of [['cosmic', '2d3f6fe06dc950e6', 1328], ['salph_inner', '3ab585348552415d', 80], ['p32_trailing', 'b45a5e3d827593ca', 80]]) {
  const b = blob(n);
  ok(`endgame: ${n} intact (salt ${salt}, ${len} B)`, b.salt.toString('hex') === salt && b.ct.length === len,
     `salt=${b.salt.toString('hex')} ct=${b.ct.length}B`);
}
const believed = sha256hex('yellowblueprimes' + 'matrixsumlist' + 'lastwordsbeforearchichoice' + 'yinyang');
ok('endgame: the believed 4-token recipe does NOT open cosmic (still unsolved)', !decrypt('cosmic', believed).ok);

console.log(`\n=== ${pass} passed · ${fail} failed ===`);
process.exit(fail ? 1 : 0);
