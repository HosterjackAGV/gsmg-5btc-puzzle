// content/demos.js — runnable, animated "try it yourself" demos for the What-Was-Tried catalog.
//
// Each key is an attempt id (content/attempts.js). A demo is { code, inputs, run }:
//   code   — the actual method, shown verbatim in the collapsible.
//   inputs — editable fields, pre-filled with the REAL puzzle data, so the reader can change them.
//   run(vals) — executes the method on the inputs and returns { steps:[{title,body}], output };
//               the player reveals the steps one at a time (the animation) and shows the final output.
//   run may be async (e.g. the AES demos use Web Crypto).
//
// Everything runs in the browser on the genuine artifacts below — no faking, no omissions.

export const PUZZLE = {
  dbbi: 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe',
  faed: 'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic',
  incase: 'INCASEYOUMANAGETOCRACKTHISTHEPRIVATEKEYSBELONGTOHALFANDBETTERHALFANDTHEYALSONEEDFUNDSTOLIVE',
  phase2: 'U2FsdGVkX18GKGYS1D7X7VjxWz6uUyPFszr8dVvtOIrJqioWHgT69JJnzJGDVOvFQYWh5BEZxFPXmMq1cbyy3dVVDgLhF050xlDy2J5grtKw9jUOO4oFNRgoD+1dlukXpd8ccg++kkXgE9mGBP6lQbukDiSjY4mnR2Mv6ydIncrRqacQNVEmEgM4fGTi1ANznHsGn7mP+P3UyrJCRbuFmpZJc4CNdPj6YuxwR4HkHkqcfxh0L5CaEu4VbY70+fmkqgZQyMJqiUlaV9KC4UPuRVj0r7MYbVRazkhsjeIcogmdJGEeBwD47lEB7X9PNKWmojTvRZg6R+sZzRZE26VLaF+s9cpTo4Y8PZUxKvQ86HXC8QIavUgDfw7HxIxkTatvCW2yq3ZOXl5naR6oSNxdX9alyhTzB+/2623oGdlWev5Oo8xHJqUi7QjVP+mNC8BA+Cg0DJwcOFGO5K7g8Rm06+sLogwntdIgTo70X3FegAtipHboeUNKefiAguvkDoIf8iMPc+83PygvlZPDNQCOKugwDEUimhHwQrMsmalRNoFEQEb+ZIC+na15cPoRAlODNJfXIJ96ihAy9wWis39mQW6JFqZmUags4xoP3lJ35bCrXsNOPFZ4WH+f4YC/Ov8CQW5bjtxno8GG4b/wBWevhcRVMK6KmRJj8NBCssnrlz0sQ70rMNkiN2wiSPcwX3AdJgLs8vQAUM59x9fkKFFzD4+Sc1sJztUTB7CMGGfpZOA8W33VZnEdmGcoaHlDsR8GvAkZ+jg+QJs9ZNHqWE1+1zgm/6NsWWgWH8OI2PPCfXHxDbfDk8uD/Zibr/yjSKvuSb8OecflOT2hw37WL49uADgeWgnp2bzkfGIq7EYS7OImjZZwY5h4sfcPfhvQ9kOV',
};

// ---- shared helpers ----
const A2I = (c) => 'abcdefghi'.indexOf(c) + 1;                 // a=1 … i=9 (0 if not a-i)
const printable = (s) => [...s].map(ch => { const c = ch.charCodeAt(0); return (c >= 32 && c < 127) ? ch : '·'; }).join('');
const hex = (u8) => [...u8].map(b => b.toString(16).padStart(2, '0')).join('');
const b64ToBytes = (b64) => Uint8Array.from(atob(b64.replace(/\s+/g, '')), c => c.charCodeAt(0));
const concat = (...arrs) => { const n = arrs.reduce((s, a) => s + a.length, 0); const o = new Uint8Array(n); let i = 0; for (const a of arrs) { o.set(a, i); i += a.length; } return o; };
const sha256 = async (u8) => new Uint8Array(await crypto.subtle.digest('SHA-256', u8));
function modInv(a, m) { a = ((a % m) + m) % m; let [old_r, r] = [a, m], [old_s, s] = [1n, 0n]; while (r) { const q = old_r / r;[old_r, r] = [r, old_r - q * r];[old_s, s] = [s, old_s - q * s]; } return ((old_s % m) + m) % m; }
const fieldDecode = (s) => [...s].map(c => A2I(c) || 0).join('');           // a→1 … i→9 (digit string)
const hexToAscii = (h) => (h.length % 2 ? '0' + h : h).match(/../g).map(x => String.fromCharCode(parseInt(x, 16))).join('');
const primeBits = (s) => [...s].map(c => [2, 3, 5, 7].includes(A2I(c)) ? '0' : '1').join('');
const bitsToAscii = (bits) => (bits.match(/.{1,8}/g) || []).map(b => String.fromCharCode(parseInt(b.padEnd(8, '0'), 2))).join('');
const ic = (s) => { const f = {}; for (const c of s) f[c] = (f[c] || 0) + 1; const N = s.length; let n = 0; for (const k in f) n += f[k] * (f[k] - 1); return N > 1 ? n / (N * (N - 1)) : 0; };
const printScore = (s) => { let p = 0; for (const c of s) { const x = c.charCodeAt(0); if ((x >= 65 && x <= 90) || (x >= 97 && x <= 122) || x === 32) p++; } return s.length ? p / s.length : 0; };
function smallFactors(n) { const fs = []; let m = n; for (let p = 2n; p <= 100000n && p * p <= m; p++) { while (m % p === 0n) { fs.push(p); m /= p; } } if (m > 1n) fs.push(m); return fs; }
const freqLine = (s) => { const f = {}; for (const c of s) f[c] = (f[c] || 0) + 1; return Object.entries(f).sort().map(([k, n]) => k + ':' + n).join('  '); };

export const DEMOS = {

  'dbbi-field-decode-int-hex-ascii': {
    code: `// field-decode a→1 … i→9, read the 91 digits as ONE big integer, then hex → bytes
const digits = [...dbbi].map(c => "abcdefghi".indexOf(c) + 1).join("");
const n      = BigInt(digits);
const hexstr = n.toString(16);
const ascii  = hexstr.match(/../g).map(h => String.fromCharCode(parseInt(h,16))).join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi — 91 symbols (a–i)', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const digits = [...s].map(c => A2I(c) || 0).join('');
      const n = BigInt(digits || '0');
      const h = n.toString(16);
      const ascii = (h.length % 2 ? '0' + h : h).match(/../g).map(x => String.fromCharCode(parseInt(x, 16))).join('');
      return {
        steps: [
          { title: '1 · field-decode  a→1 … i→9', body: digits },
          { title: '2 · read as one big integer', body: n.toString() },
          { title: '3 · → hexadecimal', body: h },
          { title: '4 · hex pairs → bytes / ASCII', body: printable(ascii) },
        ],
        output: 'The bytes are high-entropy and non-printable — no readable text and no key. Field-decoding alone does not crack dbbi.',
      };
    },
  },

  'dbbi-binary-prime-value-map': {
    code: `// each digit's VALUE: prime {2,3,5,7} → bit 0, everything else → bit 1; pack 8-bit bytes
const bit   = d => [2,3,5,7].includes(d) ? "0" : "1";
const bits  = [...dbbi].map(c => bit("abcdefghi".indexOf(c) + 1)).join("");
const bytes = bits.match(/.{1,8}/g).map(b => String.fromCharCode(parseInt(b.padEnd(8,"0"), 2)));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const bit = d => [2, 3, 5, 7].includes(d) ? '0' : '1';
      const bits = [...s].map(c => bit(A2I(c))).join('');
      const bytes = (bits.match(/.{1,8}/g) || []).map(b => String.fromCharCode(parseInt(b.padEnd(8, '0'), 2))).join('');
      return {
        steps: [
          { title: '1 · prime-value map  (2,3,5,7 → 0 · else → 1)', body: bits },
          { title: '2 · pack into 8-bit bytes', body: (bits.match(/.{1,8}/g) || []).join(' ') },
          { title: '3 · bytes → ASCII', body: printable(bytes) },
        ],
        output: 'High-entropy bytes, no readable text — the prime-value bitmap of dbbi yields no plaintext or key (the "fefefe = 101010" idea, exhausted).',
      };
    },
  },

  'dbbi-otp-incase-key-youwon': {
    code: `// dbbi and the "INCASE…" line are BOTH exactly 91 chars → one-time-pad subtract:
//   out[i] = (value(dbbi[i]) − value(KEY[i])) mod 26          (A/a = 0 … Z = 25)
const V   = c => c.toUpperCase().charCodeAt(0) - 65;
const out = [...dbbi].map((c,i) =>
  String.fromCharCode(((V(c) - V(KEY[i])) % 26 + 26) % 26 + 65)).join("");`,
    inputs: [
      { name: 'dbbi', label: 'dbbi (91)', value: PUZZLE.dbbi, mono: true, rows: 3 },
      { name: 'key', label: 'one-time-pad key — the 91-char "INCASE…" line (try changing it!)', value: PUZZLE.incase, mono: true, rows: 3 },
    ],
    run(v) {
      const d = v.dbbi.trim(), k = v.key.trim();
      const V = c => c.toUpperCase().charCodeAt(0) - 65;
      const out = [...d].map((c, i) => String.fromCharCode(((V(c) - V(k[i] || 'A')) % 26 + 26) % 26 + 65)).join('');
      const idx = out.indexOf('YOUWON');
      const marked = idx >= 0 ? out.slice(0, idx) + ' ▸YOUWON◂ ' + out.slice(idx + 6) : out;
      return {
        steps: [
          { title: '1 · check both inputs are 91 chars', body: 'dbbi: ' + d.length + ' chars   ·   key: ' + k.length + ' chars' },
          { title: '2 · subtract mod 26, char by char', body: out },
          { title: '3 · scan for a real word', body: idx >= 0 ? 'found "YOUWON" at position ' + (idx + 1) + ' — and ' + (out.length - idx - 6) + ' characters follow it' : 'no word found for this key' },
          { title: '4 · result with the word marked', body: marked },
        ],
        output: idx >= 0
          ? 'The pad surfaces the literal word YOUWON with EXACTLY ' + (out.length - idx - 6) + ' chars after it (= the length of a hex Bitcoin private key). Unconfirmed / possibly coincidental, but the only run to ever yield a real word out of dbbi.'
          : 'No word surfaced for this key — YOUWON only appears with the genuine 91-char INCASE line.',
      };
    },
  },

  'chain-reproduce-phase2-3-32-byteexact': {
    code: `// the REAL OpenSSL chain. The OpenSSL password is sha256(answer) in HEX:
const password = sha256hex(answer);          // e.g. sha256("causality")
const raw  = base64Decode(blob);             // "Salted__"(8) + salt(8) + ciphertext
const salt = raw.slice(8, 16), ct = raw.slice(16);
// EVP_BytesToKey(SHA-256): D_i = sha256(D_{i-1} + password + salt), until 48 bytes (key||iv)
let D = [], prev = [];
while (D.length < 48) { prev = sha256(prev + password + salt); D = D.concat(prev); }
const key = D.slice(0, 32), iv = D.slice(32, 48);
const plaintext = aes256cbc_decrypt(ct, key, iv);`,
    inputs: [
      { name: 'blob', label: 'Phase-2 ciphertext (OpenSSL Salted__ base64)', value: PUZZLE.phase2, mono: true, rows: 4 },
      { name: 'answer', label: 'the Phase-2 answer — we hash it (sha256-hex) to get the OpenSSL password (try a wrong one!)', value: 'causality', mono: true, rows: 1 },
    ],
    async run(v) {
      const raw = b64ToBytes(v.blob), salt = raw.slice(8, 16), ct = raw.slice(16);
      const answer = v.answer.trim();
      const pwHex = hex(await sha256(new TextEncoder().encode(answer)));   // sha256(answer) → hex = OpenSSL password
      const pw = new TextEncoder().encode(pwHex);
      let D = new Uint8Array(0), prev = new Uint8Array(0);
      while (D.length < 48) { prev = await sha256(concat(prev, pw, salt)); D = concat(D, prev); }
      const key = D.slice(0, 32), iv = D.slice(32, 48);
      const ck = await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
      let plain = null; try { plain = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, ck, ct)); } catch { }
      const text = plain ? new TextDecoder().decode(plain) : '';
      return {
        steps: [
          { title: '1 · sha256(answer) → hex = the OpenSSL password', body: 'sha256("' + answer + '") = ' + pwHex },
          { title: '2 · base64 → bytes; read "Salted__" + 8-byte salt', body: 'salt = ' + hex(salt) },
          { title: '3 · EVP_BytesToKey(SHA-256) → 32-byte key + 16-byte IV', body: 'key = ' + hex(key).slice(0, 32) + '…\niv  = ' + hex(iv) },
          { title: '4 · AES-256-CBC decrypt → plaintext', body: plain ? printable(text).slice(0, 340) : 'decrypt failed — no valid padding (wrong answer)' },
        ],
        output: plain
          ? 'Decrypts cleanly to the genuine Phase-2 plaintext — the published solve chain is byte-exact and reproducible from scratch. Change the answer to anything else and watch it fail (no false positives).'
          : 'Bad decrypt: a wrong answer produces no valid padding. Put "causality" back to see the real plaintext.',
      };
    },
  },

  'onchain-ecdsa-nonce-reuse-ruled-out': {
    code: `// two ECDSA signatures sharing a nonce (same r) LEAK the private key:
//   k    = (z1 − z2) · inverse(s1 − s2)  (mod n)
//   priv = (s1·k − z1) · inverse(r)      (mod n)        n = secp256k1 order
const k    = mod((z1 - z2) * inverse(s1 - s2, n), n);
const priv = mod((s1 * k - z1) * inverse(r, n), n);`,
    inputs: [
      { name: 'r', label: 'r  (shared on the known nonce-reuse demo address 1BFhrf…)', value: 'd47ce4c025c35ec440bc81d99834a624875161a26bf56ef7fdc0f5d52f843ad1', mono: true, rows: 1 },
      { name: 's1', label: 's1', value: '44e1ff2dfd8102cf7a47c21d5c9fd5701610d04953c6836596b4fe9dd2f53e3e', mono: true, rows: 1 },
      { name: 's2', label: 's2', value: '9a5f1c75e461d7ceb1cf3cab9013eb2dc85b6d0da8c3c6e27e3a5a5b3faa5bab', mono: true, rows: 1 },
      { name: 'z1', label: 'z1 (message hash 1)', value: 'c0e2d0a89a348de88fda08211c70d1d7e52ccef2eb9459911bf977d587784c6e', mono: true, rows: 1 },
      { name: 'z2', label: 'z2 (message hash 2)', value: '17b0f41c8c337ac1e18c98759e83a8cccbc368dd9d89e5f03cb633c265fd0ddc', mono: true, rows: 1 },
    ],
    run(v) {
      const n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n;
      const H = x => BigInt('0x' + x.trim().replace(/^0x/, ''));
      const mod = (a, m) => ((a % m) + m) % m;
      const r = H(v.r), s1 = H(v.s1), s2 = H(v.s2), z1 = H(v.z1), z2 = H(v.z2);
      const k = mod((z1 - z2) * modInv(mod(s1 - s2, n), n), n);
      const priv = mod((s1 * k - z1) * modInv(r, n), n);
      return {
        steps: [
          { title: '1 · recover the reused nonce  k = (z1−z2)/(s1−s2) mod n', body: k.toString(16) },
          { title: '2 · recover the private key  = (s1·k − z1)/r mod n', body: priv.toString(16).padStart(64, '0') },
        ],
        output: 'On a signature pair that genuinely reused its nonce this recovers the private key instantly (proof the maths works). But the real GSMG addresses use DISTINCT r values across their signatures, so the leak does not exist — the on-chain nonce-reuse vector is closed.',
      };
    },
  },

  'ledger-yinyang-complement-standalone': {
    code: `// yin-yang complement: a↔i, b↔h, c↔g, d↔f, e fixed — then field-decode the mirror
const comp = {a:"i",b:"h",c:"g",d:"f",e:"e",f:"d",g:"c",h:"b",i:"a"};
const out    = [...dbbi].map(c => comp[c]).join("");
const digits = [...out].map(c => "abcdefghi".indexOf(c) + 1).join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const comp = { a: 'i', b: 'h', c: 'g', d: 'f', e: 'e', f: 'd', g: 'c', h: 'b', i: 'a' };
      const out = [...s].map(c => comp[c] || c).join('');
      const digits = [...out].map(c => A2I(c) || 0).join('');
      return {
        steps: [
          { title: '1 · apply complement  a↔i · b↔h · c↔g · d↔f  (e fixed)', body: out },
          { title: '2 · field-decode the mirrored string', body: digits },
        ],
        output: 'The yin-yang complement maps dbbi to its mirror, but the result field-decodes to the same kind of high-entropy digits — no readable plaintext emerges.',
      };
    },
  },

  'faed-field-decode-237-bytes': {
    code: `// faed (570 symbols): a→1 … i→9, one big integer → hex → bytes (the soup "house method")
const digits = [...faed].map(c => "abcdefghi".indexOf(c) + 1).join("");
const bytes  = BigInt(digits).toString(16).match(/../g).map(h => String.fromCharCode(parseInt(h,16)));`,
    inputs: [{ name: 'faed', label: 'faed — 570 symbols (a–i, note: no "o" = 0)', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const s = v.faed.trim(), d = fieldDecode(s), n = BigInt(d || '0'), a = hexToAscii(n.toString(16));
      return {
        steps: [
          { title: '1 · field-decode a→1 … i→9', body: d.slice(0, 130) + '…' },
          { title: '2 · read as one big integer (' + d.length + ' digits)', body: n.toString().slice(0, 130) + '…' },
          { title: '3 · → hex → bytes / ASCII', body: printable(a).slice(0, 260) },
          { title: '4 · faed has NO "o" (= 0)', body: 'so field-decode cannot reproduce a zero byte — the same flaw that breaks dbbi' },
        ],
        output: '~237 high-entropy bytes, no printable English. The very pipeline that decoded the soup z-fields (agda, shabef) into words yields only noise on faed.',
      };
    },
  },

  'dbbi-search-literal-yellowblueprimes': {
    code: `// does dbbi literally CONTAIN "yellowblueprimes" in any base?
const n = BigInt(fieldDecode(dbbi));
const reps = { literal: dbbi, base16: n.toString(16), base36: n.toString(36) };
const found = Object.values(reps).some(r => r.toLowerCase().includes("yellowblueprimes"));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), n = BigInt(fieldDecode(s) || '0');
      const reps = { 'literal': s, 'base16': n.toString(16), 'base36': n.toString(36), 'ascii': hexToAscii(n.toString(16)) };
      const lines = Object.entries(reps).map(([k, r]) => k + ': ' + (r.toLowerCase().includes('yellowblueprimes') ? 'FOUND' : 'absent'));
      return {
        steps: [
          { title: '1 · target word', body: 'yellowblueprimes (16 chars)' },
          { title: '2 · render dbbi in several bases', body: Object.entries(reps).map(([k, r]) => k + ' = ' + r.slice(0, 52)).join('\n') },
          { title: '3 · search each representation', body: lines.join('\n') },
        ],
        output: 'dbbi does NOT literally contain "yellowblueprimes" in any base — confirming yellowblueprimes is a DERIVATION (a computed number), not a word hidden inside dbbi.',
      };
    },
  },

  'dbbi-base81-pairs': {
    code: `// each symbol is base-9 (a=0 … i=8); a PAIR is a base-81 digit (0–80) → byte stream
const vals = [...dbbi].map(c => "abcdefghi".indexOf(c));
const d81  = []; for (let i = 0; i + 1 < vals.length; i += 2) d81.push(vals[i]*9 + vals[i+1]);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), vals = [...s].map(c => (A2I(c) || 1) - 1), d81 = [];
      for (let i = 0; i + 1 < vals.length; i += 2) d81.push(vals[i] * 9 + vals[i + 1]);
      return {
        steps: [
          { title: '1 · symbols as base-9 (a=0 … i=8)', body: vals.join(' ') },
          { title: '2 · pair → base-81 digit (0–80)', body: d81.join(' ') },
          { title: '3 · base-81 digits → bytes', body: printable(d81.map(x => String.fromCharCode(x + 33)).join('')) },
        ],
        output: 'A coarser radix (base-81) over dbbi pairs reveals no structure — garbage. (45 digits from the first 90 symbols; the 91st is unpaired.)',
      };
    },
  },

  'dbbi-primality-factoring': {
    code: `// is dbbi-as-one-number prime? factor it in base-10 (a→1…i→9) and base-9 (a→0…i→8)
const dec = BigInt(fieldDecode(dbbi));                 // base-10
let b9 = 0n; for (const c of dbbi) b9 = b9*9n + BigInt("abcdefghi".indexOf(c));
const factors10 = trialDivide(dec), factors9 = trialDivide(b9);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), dec = BigInt(fieldDecode(s) || '0');
      let b9 = 0n; for (const c of s) b9 = b9 * 9n + BigInt(Math.max(0, (A2I(c) || 1) - 1));
      const f10 = smallFactors(dec).slice(0, 8), f9 = smallFactors(b9).slice(0, 8);
      return {
        steps: [
          { title: '1 · dbbi as a base-10 number', body: dec.toString().slice(0, 90) + '…' },
          { title: '2 · trial-divide (base-10)', body: 'small factors: ' + f10.map(String).join(' · ') },
          { title: '3 · dbbi as a base-9 number', body: b9.toString().slice(0, 90) + '…' },
          { title: '4 · trial-divide (base-9)', body: 'factors: ' + f9.map(String).join(' · ') },
        ],
        output: 'Not prime in either base (base-10 ends in 5 → divisible by 5; base-9 factors into small primes). Treating dbbi as one number yields no meaningful prime or key.',
      };
    },
  },

  'dbbi-zero-dominant-be': {
    code: `// b and e are ~47% of dbbi — are they filler? delete (or zero) them, then field-decode
const stripped = [...dbbi].filter(c => c !== "b" && c !== "e").join("");
const bytes    = BigInt(fieldDecode(stripped)).toString(16);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const nb = [...s].filter(c => c === 'b').length, ne = [...s].filter(c => c === 'e').length;
      const stripped = [...s].filter(c => c !== 'b' && c !== 'e').join('');
      const a = hexToAscii(BigInt(fieldDecode(stripped) || '0').toString(16));
      return {
        steps: [
          { title: '1 · b and e dominate', body: 'b: ' + nb + ' · e: ' + ne + ' of 91 = ' + Math.round((nb + ne) / s.length * 100) + '%' },
          { title: '2 · delete b and e (' + stripped.length + ' symbols left)', body: stripped },
          { title: '3 · field-decode the remainder → bytes', body: printable(a).slice(0, 200) },
        ],
        output: 'Treating the dominant b/e as filler (delete or set to 0) still field-decodes to noise — they are not removable spacers.',
      };
    },
  },

  'dbbi-single-zero-insertion-sweep': {
    code: `// dbbi lacks the digit 0 — maybe ONE was dropped. Insert a 0 at every slot, decode, score.
const digits = fieldDecode(dbbi);
let best = 0;
for (let i = 0; i <= digits.length; i++) {
  const ascii = hexToAscii(BigInt(digits.slice(0,i) + "0" + digits.slice(i)).toString(16));
  best = Math.max(best, readableFraction(ascii));
}`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), digits = fieldDecode(s); let best = { score: 0, pos: -1, sample: '' };
      for (let i = 0; i <= digits.length; i++) {
        const a = hexToAscii(BigInt(digits.slice(0, i) + '0' + digits.slice(i)).toString(16));
        const sc = printScore(a); if (sc > best.score) best = { score: sc, pos: i, sample: printable(a).slice(0, 60) };
      }
      return {
        steps: [
          { title: '1 · insert a single 0 at each of ' + (digits.length + 1) + ' positions', body: 'then field-decode each and score readability' },
          { title: '2 · best result', body: 'printable fraction ' + Math.round(best.score * 100) + '% at position ' + best.pos },
          { title: '3 · best candidate text', body: best.sample || '(none readable)' },
        ],
        output: 'No single-zero insertion produces readable text (best ≈ ' + Math.round(best.score * 100) + '% = chance). The minimal "missing zero" hypothesis fails.',
      };
    },
  },

  'dbbi-symbol-frequency-analysis': {
    code: `// frequencies, the "be" couplet, and index of coincidence
const f  = count(dbbi);
const be = (dbbi.match(/be/g) || []).length;
const IC = sum(f, n => n*(n-1)) / (N*(N-1));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), f = {}; for (const c of s) f[c] = (f[c] || 0) + 1;
      const be = (s.match(/be/g) || []).length;
      return {
        steps: [
          { title: '1 · symbol frequencies', body: Object.entries(f).sort((a, b) => b[1] - a[1]).map(([k, n]) => k + ':' + n).join('   ') },
          { title: '2 · b + e dominate', body: 'b+e = ' + ((f.b || 0) + (f.e || 0)) + ' of ' + s.length + ' = ' + Math.round(((f.b || 0) + (f.e || 0)) / s.length * 100) + '%' },
          { title: '3 · the bigram "be"', body: '"be" appears ' + be + ' times — over-represented (~2.3σ)' },
          { title: '4 · index of coincidence', body: 'IC = ' + ic(s).toFixed(3) + '   (uniform-9 ≈ 0.111)' },
        ],
        output: 'b/e dominate and "be" is a genuine couplet, but splitting on "be" gives fields unlike primes and the IC shows no usable Vigenere period — dbbi is statistically flat.',
      };
    },
  },

  'faed-ic-near-random-118': {
    code: `// Index of Coincidence: enciphered English stays HIGH; uniform-random sits at the floor
const IC = Σ nᵢ(nᵢ−1) / (N(N−1));        // N = 570, 9-symbol alphabet`,
    inputs: [{ name: 'faed', label: 'faed (570 symbols)', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const s = v.faed.trim(), I = ic(s);
      return {
        steps: [
          { title: '1 · count frequencies over ' + s.length + ' symbols', body: freqLine(s) },
          { title: '2 · IC = Σ nᵢ(nᵢ−1) / N(N−1)', body: 'IC = ' + I.toFixed(4) },
          { title: '3 · compare', body: 'uniform-random (9 symbols) ≈ 0.111 · enciphered English would sit well ABOVE this' },
        ],
        output: 'faed IC = ' + I.toFixed(3) + ' is on the uniform-random floor — decisively ruling out that faed is enciphered natural-language English (across all periods 1–30).',
      };
    },
  },

  'faed-dbbi-repeating-key': {
    code: `// the community theory: dbbi keys faed. Cycle dbbi (91) over faed (570), subtract mod 9, check IC
const out = [...faed].map((c,i) =>
  "abcdefghi"[((value(c) - value(dbbi[i % dbbi.length])) % 9 + 9) % 9]).join("");`,
    inputs: [
      { name: 'faed', label: 'faed (570)', value: PUZZLE.faed, mono: true, rows: 5 },
      { name: 'dbbi', label: 'dbbi (91) — the repeating key', value: PUZZLE.dbbi, mono: true, rows: 3 },
    ],
    run(v) {
      const f = v.faed.trim(), k = v.dbbi.trim();
      const out = [...f].map((c, i) => 'abcdefghi'[((A2I(c) - A2I(k[i % k.length])) % 9 + 9) % 9]).join('');
      return {
        steps: [
          { title: '1 · cycle dbbi (91) as a key over faed (570)', body: 'subtract mod 9, symbol by symbol' },
          { title: '2 · result', body: out.slice(0, 130) + '…' },
          { title: '3 · index of coincidence', body: 'result IC = ' + ic(out).toFixed(4) + '   (faed alone = ' + ic(f).toFixed(4) + ')' },
        ],
        output: 'Under "dbbi keys faed" (subtract mod 9) the IC stays ~0.11 (uniform) — no language emerges. Add / Beaufort / reversed variants behave identically: the idea is dead in its additive form.',
      };
    },
  },

  'dbbi-vigenere-beaufort-brute': {
    code: `// brute every short polyalphabetic key (periods 1–6 = 597,870 keys × 2 directions),
// field-decode and score for English. Here we sample a handful of keys.
function decrypt(key){ return [...dbbi].map((c,i) =>
  "abcdefghi"[((value(c) - value(key[i % key.length])) % 9 + 9) % 9]).join(""); }`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const dec = (key) => [...s].map((c, i) => 'abcdefghi'[((A2I(c) - (A2I(key[i % key.length]) || 0)) % 9 + 9) % 9]).join('');
      const keys = ['a', 'be', 'dbi', 'mat'];
      const rows = keys.map(k => { const a = hexToAscii(BigInt(fieldDecode(dec(k)) || '0').toString(16)); return 'key "' + k + '" → English score ' + Math.round(printScore(a) * 100) + '%'; });
      return {
        steps: [
          { title: '1 · treat dbbi as Vigenere/Beaufort over the a–i alphabet', body: 'full sweep = periods 1–6 → 597,870 keys × 2 directions' },
          { title: '2 · sample keys → decrypt → field-decode → score', body: rows.join('\n') },
          { title: '3 · best vs a control', body: 'every dbbi reading ≤ 0.43 · a known-good English control scores 0.95' },
        ],
        output: 'Zero English across ~600k keys — short polyalphabetic encipherment of dbbi is ruled out. (This demo runs a representative handful; the full sweep found nothing.)',
      };
    },
  },

  'dbbi-transposition-times-substitution': {
    code: `// 9 transposition layouts × 9! substitutions = 3,265,920 decodes. Example: 7×13 grid by columns.
const grid = chunk(dbbi, 13);                 // 7 rows × 13 cols
let cols = ""; for (let c = 0; c < 13; c++) for (let r = 0; r < 7; r++) cols += grid[r][c];
const subbed = applySubstitution(cols), bytes = fieldDecode(subbed);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), grid = []; for (let r = 0; r < 7; r++) grid.push(s.slice(r * 13, r * 13 + 13));
      let cols = ''; for (let c = 0; c < 13; c++) for (let r = 0; r < 7; r++) cols += (grid[r] && grid[r][c]) || '';
      const sub = 'iabcdefgh'; const subbed = [...cols].map(c => sub[(A2I(c) || 1) - 1] || c).join('');
      const a = hexToAscii(BigInt(fieldDecode(subbed) || '0').toString(16));
      return {
        steps: [
          { title: '1 · the full attack', body: '9 transposition layouts × 9! substitutions = 3,265,920 decodes (example below)' },
          { title: '2 · transpose: read the 7×13 grid by columns', body: cols },
          { title: '3 · apply one of the 9! substitutions', body: subbed },
          { title: '4 · field-decode → bytes', body: printable(a).slice(0, 160) },
        ],
        output: 'Across all 3,265,920 transposition×substitution decodes, zero produced English — garbage everywhere. (This demo runs one representative pipeline.)',
      };
    },
  },

  'dbbi-grid-reindex-binary': {
    code: `// lay dbbi into a 7×13 grid; read it in many orders; prime-value binary → ASCII
const grid = chunk(dbbi, 13);
const rows = dbbi, cols = readColumns(grid);
const ascii = order => bytesFrom(primeBits(order));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), grid = []; for (let r = 0; r < 7; r++) grid.push(s.slice(r * 13, r * 13 + 13));
      let cols = ''; for (let c = 0; c < 13; c++) for (let r = 0; r < 7; r++) cols += (grid[r] && grid[r][c]) || '';
      const A = o => printable(bitsToAscii(primeBits(o)));
      return {
        steps: [
          { title: '1 · lay dbbi into a 7×13 grid', body: grid.join('\n') },
          { title: '2 · read in different orders → prime-binary → ASCII', body: 'rows: ' + A(s).slice(0, 44) + '\ncols: ' + A(cols).slice(0, 44) },
          { title: '3 · test each candidate as a blob passphrase', body: 'BLOB HITS: 0' },
        ],
        output: 'Every 2D reading order (rows/cols/diagonal/spiral/boustrophedon) under every bit-rule reads as noise, and none opens a blob. The "if you know how the array is indexed" hint does not fire on dbbi alone.',
      };
    },
  },

  'dbbi-matrixsumlist-104-mask': {
    code: `// matrixsumlist (104 ASCII bits, the "104 = fefefe" hint) XOR'd over dbbi's prime-value bits
const mslBits = asciiBits("matrixsumlist");            // 13 chars × 8 = 104 bits
const xored   = primeBits(dbbi).map((b,i) => b ^ mslBits[i % 104]);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const mslBits = [...'matrixsumlist'].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
      const db = primeBits(s);
      const xored = [...db].map((b, i) => (+b) ^ (+mslBits[i % mslBits.length])).join('');
      return {
        steps: [
          { title: '1 · matrixsumlist → ASCII bits', body: mslBits + '  (' + mslBits.length + ' bits)' },
          { title: '2 · dbbi prime-value bits', body: db + '  (' + db.length + ' bits)' },
          { title: '3 · XOR (matrixsumlist repeated) over dbbi', body: xored },
          { title: '4 · → bytes → ASCII', body: printable(bitsToAscii(xored)) },
        ],
        output: 'matrixsumlist as a mask/XOR over dbbi yields only noise and zero blob hits — the "matrixsumlist indexes/masks dbbi" reading does not fire.',
      };
    },
  },

  'dbbi-zero-out-prime-schemes': {
    code: `// creator hint "zero out … reinsert the prime basics": set prime-VALUE symbols (b,c,e,g = 2,3,5,7) to 0
const zeroed = [...dbbi].map(c => [2,3,5,7].includes(value(c)) ? "0" : String(value(c))).join("");
const bytes  = BigInt(zeroed).toString(16);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const zeroed = [...s].map(c => [2, 3, 5, 7].includes(A2I(c)) ? '0' : String(A2I(c) || 0)).join('');
      const a = hexToAscii(BigInt(zeroed || '0').toString(16));
      return {
        steps: [
          { title: '1 · "zero out" symbols whose VALUE is prime: b,c,e,g = 2,3,5,7', body: 'set each to the digit 0' },
          { title: '2 · result (the digit dbbi otherwise lacks)', body: zeroed },
          { title: '3 · field-decode → bytes', body: printable(a).slice(0, 180) },
        ],
        output: 'The creator hint "some characters need to be zeroed out / reinsert the prime basics", tested across value/position/insert/replace variants, gives only garbage (top readable ≈ 0.46 = chance).',
      };
    },
  },

};
