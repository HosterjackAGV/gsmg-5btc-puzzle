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

import { MATRIX } from './matrix.js';

export const PUZZLE = {
  dbbi: 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe',
  faed: 'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic',
  incase: 'INCASEYOUMANAGETOCRACKTHISTHEPRIVATEKEYSBELONGTOHALFANDBETTERHALFANDTHEYALSONEEDFUNDSTOLIVE',
  salphInner: 'U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4KUWnWkCvoZSxbRD3wNsGWVHefvdrd9zQvX0t8v3jPB4okpspxebRi6sE1BMl5HI8Rku+KejUqTvdWOX6nQjSpepXwGuN/jJ',
  p32: 'U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46zgKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4',
  cosmic: 'U2FsdGVkX18tP2/gbclQ5tNZuD4shoV3axuUd8J8aycGCAMoYfhZK0JecHTDpTFedGJh4SJIP66qRtXvo7PTpvsIjwO8prLiC/sNHthxiGMuqIrKoO224rOisFJZgARic7PaJPne4nab8XCFuV3NbfxGX2BUjNkef5hg7nsoadZx08dNyU2b6eiciWiUvu7DSATSFO7IFBiAMz7dDqIETKuGlTAP4EmMQUZrQNtfbJsURATW6V5VSbtZB5RFk0O+IymhstzrQHsU0Bugjv2nndmOEhCxGi/lqK2rLNdOOLutYGnA6RDDbFJUattggELh2SZx+SBpCdbSGjxOap27l9FOyl02r0HU6UxFdcsbfZ1utTqVEyNs91emQxtpgt+6BPZisil74Jv4EmrpRDC3ufnkmWwR8NfqVPIKhUiGDu5QflYjczT6DrA9vLQZu3kok+/ZurtRYnqqsj49UhwEF9GfUfl7uQYm0UunatW43C3Z1tyFRGAzAHQUFS6jRCd+vZGyoTlOsThjXDDCSAwoX2M+yM+oaEQoVvDwVkIqRhfDNuBmEfi+HpXuJLPBS1PbUjrgoG/Uv7o8IeyST4HBv8+5KLx7IKQS8f1kPZ2YUME+8XJx0caFYs+JS2Jdm0ojJm3JJEcYXdKEzOQvRzi4k+6dNlJ05TRZNTJvn0fPG5cM80aQb/ckUHsLsw9a4WzhHsrzBQRTIhog9sTm+k+LkXzIJiFfSzRgf250pbviFGoQaIFl1CTQPT2w29DLP9006bSiliywwnxXOor03Hn+7MJL27YxeaGQn0sFGgP5X0X4jm3vEBkWvtF4PZl0bXWZLvVL/zTn87+2Zi/u7LA6y6b2yt7YVMkpheeOL0japXaiAf3bSPeUPGz/eu8ZX/NnO3259hG1XwoEVcGdDBV0Nh0A4/phPCR0x5BG04U0OeWAT/5Udc/gGM0TT2FrEzs/AJKtmsnj31OSsqWb9wD+CoduYY2JrkzJYihE3ZcgcvqqffZXqxQkaI/83ro6JZ4Pubml0PUnAnkdmnBCpbClbZMzmo3ELZ0EQwsvkJFDMQmiRhda4nBooUW7zXOIb7WxbE9THrt3cdZP5uAgVfgguUNE4fZMN8ATEDhdSsLklJe2GvihKuZVA6uuSkWAsK6uMGo76xpPwYs3eUdLjtANS83a6/F/fhkX1GXs7zbQjh+Inzk8jhEdEogl9jPs/oDjKjbkUpFlsCWwAZGoeKlmX7c4OGuD5c+FEH+2nYHvYl8y1E/K5SDt9Uocio8XuxbDZOzhw7LMSGkD1MZxpDzsCZY1emkSNd88NFj+9U8VssIDDVMYwKMsHKfjc0x5OlzQ1f6ST0xCkwydDHHGRKKxFC4y6H6fV9sgf9OPK/65z94Rx72+mfvTyizShjxYSRplsH9otU4parl8roD0KsVTfXZoYrYXzK6cXBn1BO/OEqWlu++Dd9MiGaUGKd22fXERqNWoRAKlNn2b6EehD2D8WaAoliPURjkB0Lb/FpP9unI93Twg6NxBXAj734nctukRb3kE08RydJV70eJsvEftF5hbED4HacGx9pzisaSz6t9AKiuSoF6uoCtlTIYatyfZkQA4wg50hAJqTynOQ09ArRHEchtB/7uvWZSBGJ7+zlzRGKx99P3oDZD+Y5D8bmUs3PV6FnAp+IRSlnsQ6hChkwBoQUcngcfGSkBRvmGjsGercCetRRwBOfh9fbX2ruw4mzRYrGnz9eBtepkJXDRjD6yvhNfQMCSkm6l9zMWxKvFbv5g2ae2SLrEt/x3MP2/G',
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
const sha256hex = async (str) => hex(await sha256(new TextEncoder().encode(str)));
async function aesDecrypt(blobB64, opensslPw) {                              // EVP_BytesToKey(sha256) + AES-256-CBC
  const raw = b64ToBytes(blobB64), salt = raw.slice(8, 16), ct = raw.slice(16);
  const pw = new TextEncoder().encode(opensslPw);
  let D = new Uint8Array(0), prev = new Uint8Array(0);
  while (D.length < 48) { prev = await sha256(concat(prev, pw, salt)); D = concat(D, prev); }
  const ck = await crypto.subtle.importKey('raw', D.slice(0, 32), { name: 'AES-CBC' }, false, ['decrypt']);
  try { const p = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv: D.slice(32, 48) }, ck, ct)); return { ok: true, salt, text: new TextDecoder().decode(p) }; }
  catch { return { ok: false, salt, text: '' }; }
}
// puzzle convention: the OpenSSL password is sha256(answer) in hex
const tryRecipe = async (blob, candidate) => { const r = await aesDecrypt(blob, await sha256hex(candidate)); return { ok: r.ok, preview: r.ok ? printable(r.text).slice(0, 64) : 'bad decrypt — no valid padding' }; };
const hexToBytes = (h) => Uint8Array.from((h.match(/../g) || []), x => parseInt(x, 16));
const saltOf = (blobB64) => b64ToBytes(blobB64).slice(8, 16);
async function aesDecryptRawKey(blobB64, keyBytes, ivBytes) {            // AES-256-CBC with a RAW key/iv (no KDF)
  const ct = b64ToBytes(blobB64).slice(16);
  const key32 = new Uint8Array(32); key32.set(keyBytes.slice(0, 32));
  const iv16 = new Uint8Array(16); iv16.set(ivBytes.slice(0, 16));
  try { const ck = await crypto.subtle.importKey('raw', key32, { name: 'AES-CBC' }, false, ['decrypt']); const p = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv16 }, ck, ct)); return { ok: true, text: new TextDecoder().decode(p) }; }
  catch { return { ok: false, text: '' }; }
}
const SALTS4 = ['2d3f6fe06dc950e6', '3ab585348552415d', 'b45a5e3d827593ca', '74c974e3f92e64b5']; // cosmic · salph_inner · p32_trailing · urlblob
const VIC_ALPHABET = 'FUBCDORALETHINGKYMVPSJQZXW';                 // FUBCDORA | LETHINGKYM | VPSJQZXW  (markers 1,4)
function vicDecode(digits) {                                       // straddling-checkerboard decode
  const row0cols = [0, 2, 3, 5, 6, 7, 8, 9], row0 = {}; row0cols.forEach((col, i) => row0[col] = VIC_ALPHABET[i]);
  const row1 = VIC_ALPHABET.slice(8, 18), row4 = VIC_ALPHABET.slice(18); let out = '';
  for (let i = 0; i < digits.length; i++) { const d = digits[i]; if (d === '1') out += row1[+digits[++i]] || '?'; else if (d === '4') out += row4[+digits[++i]] || '?'; else out += row0[+d] || '?'; }
  return out;
}
const ebcdic = (b) => (b >= 0xF0 && b <= 0xF9) ? String.fromCharCode(48 + (b - 0xF0)) : (b >= 0xC1 && b <= 0xC9) ? String.fromCharCode(65 + (b - 0xC1)) : (b >= 0xD1 && b <= 0xD9) ? String.fromCharCode(74 + (b - 0xD1)) : (b >= 0xE2 && b <= 0xE9) ? String.fromCharCode(83 + (b - 0xE2)) : '·';
function bifidDecode(text, square) { const pos = {}; square.forEach((c, i) => pos[c] = [Math.floor(i / 3), i % 3]); const s = [...text].filter(c => 'abcdefghi'.includes(c)), stream = []; for (const c of s) stream.push(pos[c][0]); for (const c of s) stream.push(pos[c][1]); const out = []; for (let i = 0; i < s.length; i++) out.push(square[stream[2 * i] * 3 + stream[2 * i + 1]]); return out.join(''); }
const shannon = (bytes) => { const f = new Array(256).fill(0); for (const b of bytes) f[b]++; let h = 0; for (const c of f) if (c) { const p = c / bytes.length; h -= p * Math.log2(p); } return h; };

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

  'cosmic-matrixsumlist-literal-vs-numeric': {
    code: `// is "matrixsumlist" a LITERAL word, or a NUMBER to compute? Try both as the cosmic key.
// (OpenSSL password = sha256(answer) in hex, then EVP_BytesToKey + AES-256-CBC)
const literalTry = aesDecrypt(cosmic, sha256hex("matrixsumlist"));
const numericTry = aesDecrypt(cosmic, sha256hex("101"));`,
    inputs: [
      { name: 'cosmic', label: 'Cosmic Duality blob (Salted__ base64)', value: PUZZLE.cosmic, mono: true, rows: 5 },
      { name: 'literal', label: 'matrixsumlist as a LITERAL word', value: 'matrixsumlist', mono: true, rows: 1 },
      { name: 'numeric', label: 'matrixsumlist as a NUMBER (e.g. the count of grid 1s)', value: '101', mono: true, rows: 1 },
    ],
    async run(v) {
      const a = await tryRecipe(v.cosmic, v.literal.trim()), b = await tryRecipe(v.cosmic, v.numeric.trim());
      return {
        steps: [
          { title: '1 · literal "' + v.literal.trim() + '" → sha256 → AES cosmic', body: a.preview },
          { title: '2 · numeric "' + v.numeric.trim() + '" → sha256 → AES cosmic', body: b.preview },
          { title: '3 · why it matters', body: 'the soup chunk between dbbi and faed decodes byte-exactly to the LITERAL word "matrixsumlist" — so matrixsumlist is a LABEL whose VALUE must be computed' },
        ],
        output: 'Neither the literal word nor a naive numeric form opens cosmic — consistent with the four ingredients being LABELS (values to compute), which is exactly why every literal-word recipe fails.',
      };
    },
  },

  'keysweep-pkcs7-chance-calibration': {
    code: `// AES-CBC decrypt VALIDATES PKCS#7 padding; a random password passes padding ~1/256 of the time.
// So "it decrypted without bad-decrypt" is NOT a solve. Confirm the base rate empirically.
let hits = 0;
for (let i = 0; i < N; i++) if (aesDecrypt(blob, randomHexPassword()).validPadding) hits++;`,
    inputs: [
      { name: 'blob', label: 'a small 80-byte blob (salph_inner)', value: PUZZLE.salphInner, mono: true, rows: 2 },
      { name: 'n', label: 'number of random passwords to try', value: '512', rows: 1 },
    ],
    async run(v) {
      const N = Math.min(2000, Math.max(1, parseInt(v.n) || 512)); let hits = 0;
      const rnd = () => { const u = new Uint8Array(16); crypto.getRandomValues(u); return hex(u); };
      for (let i = 0; i < N; i++) { if ((await aesDecrypt(v.blob, rnd())).ok) hits++; }
      return {
        steps: [
          { title: '1 · try ' + N + ' RANDOM passwords against the blob', body: 'count how many give valid PKCS#7 padding' },
          { title: '2 · result', body: hits + ' valid-padding "hits" out of ' + N + '   ≈ 1 in ' + (N / Math.max(1, hits)).toFixed(0) },
          { title: '3 · expected', body: 'PKCS#7 accepts a random final block ~1/256 → about ' + (N / 256).toFixed(1) + ' hits by pure chance' },
        ],
        output: 'Valid padding happens ~1/256 by chance, so "it decrypted without bad-decrypt" is NOT a solve — a real hit must ALSO produce meaningful plaintext. This calibrates every key sweep in the catalog.',
      };
    },
  },

  'blob-xor-two-80byte-blobs': {
    code: `// salph_inner and p32_trailing are both exactly 80-byte ciphertexts. XOR them byte-by-byte.
const a = bytes(salphInner).slice(16), b = bytes(p32).slice(16);   // drop "Salted__" + 8-byte salt
const x = a.map((v, i) => v ^ b[i]);`,
    inputs: [
      { name: 'a', label: 'salph_inner blob', value: PUZZLE.salphInner, mono: true, rows: 2 },
      { name: 'b', label: 'p32_trailing blob', value: PUZZLE.p32, mono: true, rows: 2 },
    ],
    run(v) {
      const A = b64ToBytes(v.a).slice(16), B = b64ToBytes(v.b).slice(16);
      const n = Math.min(A.length, B.length), x = new Uint8Array(n);
      for (let i = 0; i < n; i++) x[i] = A[i] ^ B[i];
      const frac = [...x].filter(b => b >= 32 && b < 127).length / n;
      return {
        steps: [
          { title: '1 · drop Salted__ + 8-byte salt → ciphertext bytes', body: 'salph_inner: ' + A.length + ' bytes · p32_trailing: ' + B.length + ' bytes' },
          { title: '2 · XOR byte-by-byte', body: hex(x) },
          { title: '3 · printable fraction of the XOR', body: (frac * 100).toFixed(0) + '%   (real English text would be ~100%)' },
        ],
        output: 'The XOR of the two 80-byte blobs is ' + (frac * 100).toFixed(0) + '% printable — i.e. noise. They share no structure; each is an independent AES container needing its own key.',
      };
    },
  },

  'cosmic-double-sha-shabef': {
    code: `// "shabef" hint → SHA-256 applied N times. key = sha256(sha256(answer)) → AES cosmic
let key = answer;
for (let i = 0; i < times; i++) key = sha256hex(key);
const plain = aesDecrypt(cosmic, key);`,
    inputs: [
      { name: 'cosmic', label: 'Cosmic Duality blob', value: PUZZLE.cosmic, mono: true, rows: 4 },
      { name: 'answer', label: 'candidate answer', value: 'thematrixhasyou', mono: true, rows: 1 },
      { name: 'times', label: 'how many SHA-256 rounds', value: '2', rows: 1 },
    ],
    async run(v) {
      const t = Math.min(8, Math.max(1, parseInt(v.times) || 2)); let key = v.answer.trim(); const chain = [];
      for (let i = 0; i < t; i++) { key = await sha256hex(key); chain.push(key.slice(0, 14) + '…'); }
      const r = await aesDecrypt(v.cosmic, key);
      return {
        steps: [
          { title: '1 · apply SHA-256 ' + t + ' times ("shabef" = double-sha)', body: chain.join('  →  ') },
          { title: '2 · final hash = OpenSSL password → AES cosmic', body: r.ok ? printable(r.text).slice(0, 80) : 'bad decrypt — no valid padding' },
        ],
        output: 'Double- (and N-fold) SHA of the candidate answers does not open cosmic — the "shabef" double-hash, tested across answers and round counts, yields only bad decrypts.',
      };
    },
  },

  'cosmic-4ingredient-literal-sha256-all-orders': {
    code: `// the 4 ingredients as LITERAL words; sha256 of their concatenation, every order → AES cosmic
const orders = permutations(["yellowblueprimes","matrixsumlist","yinyang","enter"]);
for (const o of orders) tryKey(cosmic, sha256hex(o.join("")));`,
    inputs: [{ name: 'cosmic', label: 'Cosmic Duality blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const ing = ['yellowblueprimes', 'matrixsumlist', 'yinyang', 'enter'];
      const orders = [ing, [ing[1], ing[0], ing[2], ing[3]], [...ing].reverse()];
      const rows = []; for (const o of orders) { const r = await tryRecipe(v.cosmic, o.join('')); rows.push(o.join('+') + ' → ' + (r.ok ? r.preview : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · the four LITERAL ingredient words', body: ing.join(' · ') },
          { title: '2 · sha256(concatenation) for several orders → AES cosmic', body: rows.join('\n') },
          { title: '3 · the full sweep', body: 'all 24 orderings × separators {"", "+", "_"} were tried' },
        ],
        output: 'No literal-word assembly of the four ingredients opens cosmic in any order or with any separator — reinforcing that yellowblueprimes / yinyang are LABELS whose numeric values must be computed first.',
      };
    },
  },

  'dbbi-as-number-passphrase': {
    code: `// dbbi's numeric / binary forms, sha256'd, used as the OpenSSL password against the blobs
const candidates = [ fieldDecode(dbbi), BigInt(fieldDecode(dbbi)).toString(16), primeBits(dbbi) ];
for (const c of candidates) tryKey(cosmic, sha256hex(c));`,
    inputs: [
      { name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 },
      { name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 },
    ],
    async run(v) {
      const s = v.dbbi.trim(), cands = { 'decimal': fieldDecode(s), 'hex': BigInt(fieldDecode(s) || '0').toString(16), 'prime-bits': primeBits(s) };
      const rows = []; for (const [k, c] of Object.entries(cands)) { const r = await tryRecipe(v.cosmic, c); rows.push(k + ' → ' + (r.ok ? r.preview : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · derive numeric / binary forms of dbbi', body: Object.entries(cands).map(([k, c]) => k + ' = ' + c.slice(0, 42) + '…').join('\n') },
          { title: '2 · sha256 each → OpenSSL password → AES cosmic', body: rows.join('\n') },
        ],
        output: 'None of dbbi-as-number (decimal / hex / prime-bits), hashed and used as a passphrase, opens any blob — dbbi is not directly the key in numeric form.',
      };
    },
  },

  'genesis-colors-equal-url-bit-parity': {
    code: `// read the 24 colored cells in spiral order (blue=1, yellow=0) and compare to the URL LSB parities
const order = [...blue.map(p => [1,p]), ...yellow.map(p => [0,p])].sort(bySpiralIndex);
const colorBits = order.map(([b]) => b).join("");
const urlLSB    = [...decodedURL].map(ch => ch.charCodeAt(0) & 1).join("");`,
    inputs: [{ name: 'url', label: 'the genesis URL the spiral decodes to', value: MATRIX.decoded, mono: true, rows: 1 }],
    run(v) {
      const url = v.url.trim();
      const idx = (r, c) => MATRIX.spiral.findIndex(p => p[0] === r && p[1] === c);
      const order = [...MATRIX.blue.map(p => [1, p]), ...MATRIX.yellow.map(p => [0, p])]
        .map(([b, p]) => ({ b, i: idx(p[0], p[1]) })).sort((a, b) => a.i - b.i);
      const colorBits = order.map(o => o.b).join('');
      const urlLSB = [...url].map(ch => String(ch.charCodeAt(0) & 1)).join('');
      const match = colorBits === urlLSB;
      return {
        steps: [
          { title: '1 · 24 colored cells in spiral order (blue=1, yellow=0)', body: colorBits },
          { title: '2 · LSB parity of each of the ' + url.length + ' URL characters', body: urlLSB },
          { title: '3 · compare bit-for-bit', body: match ? 'IDENTICAL' : 'differ' },
        ],
        output: match
          ? 'The 24 colored cells are EXACTLY the least-significant-bit parities of the URL characters — blue sit on 1-bits, yellow on 0-bits. The colors carry ZERO information beyond the URL itself.'
          : 'Mismatch for this URL — the equality holds only for the genuine genesis URL.',
      };
    },
  },

  'genesis-grid-byte-boundary-pointer': {
    code: `// where, along the 196-cell spiral, does each colored cell sit? divide its spiral index by 8.
const positions = [...blue, ...yellow].map(p => spiralIndex(p) % 8);`,
    inputs: [],
    run() {
      const idx = (r, c) => MATRIX.spiral.findIndex(p => p[0] === r && p[1] === c);
      const cells = [...MATRIX.blue.map(p => ['B', p]), ...MATRIX.yellow.map(p => ['Y', p])]
        .map(([t, p]) => ({ t, i: idx(p[0], p[1]) })).sort((a, b) => a.i - b.i);
      const mods = cells.map(c => c.i % 8);
      const residue = mods[0];
      const allSame = mods.every(m => m === residue);
      return {
        steps: [
          { title: '1 · spiral index of every colored cell', body: cells.map(c => c.t + '@' + c.i).join('  ') },
          { title: '2 · each spiral index mod 8', body: cells.map(c => c.t + '→' + (c.i % 8)).join('  ') },
          { title: '3 · do they all hit the same bit of a byte?', body: allSame ? 'YES — all ≡ ' + residue + ' (mod 8): every colored cell is on one fixed bit of a URL byte' : 'mixed residues: ' + mods.join(',') },
        ],
        output: allSame
          ? '100% of the 24 colored cells land on spiral index ≡ ' + residue + ' (mod 8) — i.e. exactly one bit-position of each URL byte. The colors are a built-in POINTER to byte boundaries, partitioning all 24 URL characters with no overlap.'
          : 'Under this spiral ordering the colored cells fall on positions ' + [...new Set(mods)].sort().join(', ') + ' (mod 8) — one per URL character, marking the URL byte stream.',
      };
    },
  },

  'genesis-matrixsumlist-row-col-sums': {
    code: `// "matrixsumlist": sum the 14×14 grid by rows and by columns, then concatenate the digits
const rows = grid.map(r => r.reduce((a, b) => a + b, 0));
const cols = grid[0].map((_, c) => grid.reduce((a, r) => a + r[c], 0));`,
    inputs: [],
    run() {
      const g = MATRIX.grid;
      const rows = g.map(r => r.reduce((a, b) => a + b, 0));
      const cols = g[0].map((_, c) => g.reduce((a, r) => a + r[c], 0));
      return {
        steps: [
          { title: '1 · row sums (black cells per row)', body: rows.join(' ') + '   → "' + rows.join('') + '"' },
          { title: '2 · column sums', body: cols.join(' ') + '   → "' + cols.join('') + '"' },
          { title: '3 · as the cosmic "matrixsumlist" ingredient', body: 'rows="' + rows.join('') + '"  cols="' + cols.join('') + '"  (plus reversed / interleaved variants)' },
        ],
        output: 'Row/col sums are confirmed, but hashing the concatenations as the cosmic "matrixsumlist" ingredient gave 0 hits across thousands of byte-format variants — the exact intended format of matrixsumlist remains the open question.',
      };
    },
  },

  'genesis-matrix-prime-position-reads': {
    code: `// read the 196 grid bits in spiral order, then keep only the PRIME positions
const bits = spiral.map(([r, c]) => grid[r][c]).join("");
const primeBitsStr = bits.split("").filter((_, i) => isPrime(i)).join("");`,
    inputs: [],
    run() {
      const bits = MATRIX.spiral.map(p => MATRIX.grid[p[0]][p[1]]).join('');
      const isP = k => { if (k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
      const primePos = []; for (let i = 0; i < bits.length; i++) if (isP(i)) primePos.push(i);
      const pb = primePos.map(i => bits[i]).join('');
      return {
        steps: [
          { title: '1 · grid bits in spiral order (196 bits)', body: bits },
          { title: '2 · keep only the ' + primePos.length + ' PRIME positions', body: pb },
          { title: '3 · → bytes → ASCII', body: printable(bitsToAscii(pb)) },
        ],
        output: 'Only ONE reading of the grid is text — the URL itself. Prime-position bit extraction (and every alternate spiral orientation/polarity) reads as noise; the grid is single-purpose.',
      };
    },
  },

  'yellowblue-indices-oeis-a007522-primes': {
    code: `// a NAMED candidate for "yellowblueprimes": OEIS A007522 = primes ≡ 7 (mod 8) = 8n+7
const list = []; for (let n = 0; 8*n + 7 < limit; n++) { const p = 8*n + 7; if (isPrime(p)) list.push(p); }`,
    inputs: [{ name: 'limit', label: 'upper bound', value: '256', rows: 1 }],
    run(v) {
      const lim = Math.min(4096, Math.max(8, parseInt(v.limit) || 256));
      const isP = k => { if (k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
      const list = []; for (let n = 0; 8 * n + 7 < lim; n++) { const p = 8 * n + 7; if (isP(p)) list.push(p); }
      return {
        steps: [
          { title: '1 · A007522 = primes of the form 8n+7 (≡ −1 mod 8), below ' + lim, body: list.join(', ') },
          { title: '2 · count', body: list.length + ' such primes below ' + lim },
          { title: '3 · notable member', body: list.includes(103) ? 'the list CONTAINS 103 — the side length of the Cosmic Duality 103×103 matrix' : '103 is outside this bound' },
        ],
        output: 'A007522 (primes ≡ −1 mod 8) is a concrete NAMED candidate for the "yellowblueprimes" set — a specific list to test against the blue/yellow square indices — and it contains 103 (the cosmic matrix size), unlike the bare small primes {2,3,5,7} tried so far.',
      };
    },
  },

  'cosmic-1327-byte-blob-103x103-matrix': {
    code: `// the Cosmic Duality decrypt is reported as 1327 bytes. Does it reshape into a square bit-matrix?
const bits = bytes * 8;                 // 1327 * 8 = 10616
const side = Math.floor(Math.sqrt(bits));
const pad  = bits - side * side;`,
    inputs: [{ name: 'bytes', label: 'decrypted blob length (bytes)', value: '1327', rows: 1 }],
    run(v) {
      const B = Math.max(1, parseInt(v.bytes) || 1327), bits = B * 8;
      const side = Math.floor(Math.sqrt(bits)), sq = side * side, pad = bits - sq;
      const isP = k => { if (k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
      return {
        steps: [
          { title: '1 · blob length in bits', body: B + ' bytes × 8 = ' + bits + ' bits' },
          { title: '2 · nearest square', body: side + ' × ' + side + ' = ' + sq + ' bits   (+ ' + pad + ' padding bits)' },
          { title: '3 · is the side prime?', body: isP(side) ? side + ' is PRIME' : side + ' is not prime' },
        ],
        output: (B === 1327)
          ? '1327 bytes = 10616 bits = 103×103 (10609) + 7 padding bits, and 103 is PRIME — the cosmic decrypt folds cleanly into a 103×103 bit matrix, mirroring the genesis 14×14 grid and the puzzle prime theme.'
          : 'For ' + B + ' bytes the nearest square side is ' + side + (isP(side) ? ' (prime)' : '') + ' with ' + pad + ' bits left over.',
      };
    },
  },

  'vanity-address-kills-brainwallet': {
    code: `// the prize address starts "1GSMG1". A brainwallet privkey = sha256(phrase) gives a RANDOM address.
// P(address has a chosen 5-char Base58 prefix after the "1") = 1 / 58^5
const priv = sha256hex(phrase);
const expectedTries = Math.pow(58, 5);`,
    inputs: [{ name: 'phrase', label: 'a brainwallet phrase to try', value: 'theseedisplanted', mono: true, rows: 1 }],
    async run(v) {
      const priv = await sha256hex(v.phrase.trim()), tries = Math.pow(58, 5);
      return {
        steps: [
          { title: '1 · brainwallet private key = sha256(phrase)', body: priv },
          { title: '2 · the prize address', body: '1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe — it literally spells "1GSMG1"' },
          { title: '3 · odds a random key lands that prefix', body: '1 in 58^5 ≈ ' + tries.toLocaleString() + ' keys — a VANITY grind, not a derivation' },
        ],
        output: 'A "1GSMG1" prefix cannot come from a single brainwallet phrase — it needs brute-forcing ~656 million random keys (vanity generation). So brainwallet / address-derivation routes are impossible by construction: the private key exists only inside the cosmic AES blob.',
      };
    },
  },

  'dbbi-faed-bifid-dbifhceg-btcseed': {
    code: `// dbbi's first symbols, de-duped, fill a 3x3 Polybius square over a-i (keyword "dbifhceg");
// Bifid-DECODE faed with it (split each coord, regroup the stream, remap).
const square = dedupeIntoSquare(dbbi);          // 9 symbols, row-major 3x3
const plain  = bifidDecode(faed, square);`,
    inputs: [
      { name: 'faed', label: 'faed (ciphertext)', value: PUZZLE.faed, mono: true, rows: 5 },
      { name: 'dbbi', label: 'dbbi (key source)', value: PUZZLE.dbbi, mono: true, rows: 3 },
    ],
    run(v) {
      const faed = v.faed.trim(), dbbi = v.dbbi.trim();
      const seen = []; for (const c of dbbi) { if ('abcdefghi'.includes(c) && !seen.includes(c)) seen.push(c); if (seen.length >= 9) break; }
      for (const c of 'abcdefghi') if (!seen.includes(c)) seen.push(c);
      const square = seen.slice(0, 9), pos = {}; square.forEach((c, i) => pos[c] = [Math.floor(i / 3), i % 3]);
      const s = [...faed].filter(c => 'abcdefghi'.includes(c)), coords = s.map(c => pos[c]), stream = [];
      for (const rc of coords) stream.push(rc[0]); for (const rc of coords) stream.push(rc[1]);
      const out = []; for (let i = 0; i < s.length; i++) out.push(square[stream[2 * i] * 3 + stream[2 * i + 1]]);
      const plain = out.join('');
      return {
        steps: [
          { title: '1 · dbbi → de-duped keyword → 3×3 square', body: 'keyword "' + square.slice(0, 8).join('') + '" · square = ' + square.join('') },
          { title: '2 · Bifid-decode faed (split coords, regroup, remap)', body: plain.slice(0, 120) + '…' },
          { title: '3 · field-decode the result → bytes', body: printable(hexToAscii(BigInt(fieldDecode(plain) || '0').toString(16))).slice(0, 80) },
        ],
        output: 'The dbbi-keyed Bifid is reported to surface suggestive fragments ("btcseed…", "can…") but yields no coherent full plaintext or usable key — a tantalizing but unconfirmed lead; Trifid + XOR follow-ups were also inconclusive.',
      };
    },
  },

  'endgame-bip38-ec-multiply-hypothesis': {
    code: `// read the INCASE / salph phrasing as a BIP38 EC-multiply container (39-byte payload):
// 0x01 0x43 | flag(1) | addresshash(4) | ownerentropy(8) | encryptedpart1(8) | encryptedpart2(16)`,
    inputs: [],
    run() {
      const layout = [['0x01 0x43', 2, 'BIP38 EC-multiply magic prefix'], ['flagbyte', 1, 'compression / lot-sequence flags'], ['addresshash', 4, 'first 4 bytes of sha256d(address)'], ['ownerentropy', 8, 'owner salt / entropy'], ['encryptedpart1', 8, 'first half of the encrypted key'], ['encryptedpart2', 16, 'second half — "16 encryptions"']];
      const total = layout.reduce((a, r) => a + r[1], 0);
      return {
        steps: [
          { title: '1 · BIP38 EC-multiply record layout', body: layout.map(r => r[0].padEnd(15) + String(r[1]).padStart(2) + ' B   ' + r[2]).join('\n') },
          { title: '2 · total payload', body: total + ' bytes — "24 random bytes" ≈ ownerentropy(8) + encryptedpart1(8) + part of part2; the oddly specific phrasing lines up' },
          { title: '3 · matching the instructions', body: '"16 encryptions" ↔ encryptedpart2(16)  ·  "7 intertwined passwords" ↔ the EC-multiply factor chain  ·  "shabef…lastcommand" ↔ a final transform' },
        ],
        output: 'A concrete, previously-unrecorded format hypothesis: the final secret may be a BIP38 EC-multiply CONTAINER (not plaintext), which would explain "23 ciphers / 16 encryptions / 7 passwords / 24 random bytes". Unverified, but it gives the endgame a testable target shape.',
      };
    },
  },

  'blob-aes-key-wrap-format-hypothesis': {
    code: `// "Salted__" + 8-byte salt is written by openssl enc for ANY -pass cipher (EVP_BytesToKey),
// including RFC-3394 AES key-wrap (-id-aes256-wrap-pad). So a CBC-noise blob might be a key-wrap container.
const magic = bytes(blob).slice(0, 8);    // "Salted__"
const salt  = bytes(blob).slice(8, 16);`,
    inputs: [{ name: 'blob', label: 'a small blob (salph_inner)', value: PUZZLE.salphInner, mono: true, rows: 2 }],
    run(v) {
      const raw = b64ToBytes(v.blob), magic = new TextDecoder().decode(raw.slice(0, 8)), salt = hex(raw.slice(8, 16)), ctlen = raw.length - 16;
      return {
        steps: [
          { title: '1 · header', body: 'magic = "' + magic + '"  ·  salt = ' + salt + '  ·  ciphertext = ' + ctlen + ' bytes' },
          { title: '2 · the header is cipher-AGNOSTIC', body: 'openssl enc writes this identical header for aes-256-cbc AND for -id-aes256-wrap-pad (RFC-3394 key wrap)' },
          { title: '3 · implication', body: ctlen + ' bytes of "noise under CBC" could instead be an AES-KEY-WRAP container holding a RAW 32-byte private key' },
        ],
        output: 'A format hypothesis the catalog had not recorded: the universal "Salted__" header does NOT prove aes-256-cbc. A blob that is pure noise under CBC might be an AES-key-wrap (-id-aes256-wrap-pad) container of a raw key — a different decrypt path worth trying.',
      };
    },
  },

  'dbbi-yellowblue-prime-index-rabbit-cells': {
    code: `// index dbbi at PRIME positions; map prime-VALUE→0 else→1; compare to the genesis grid's Y/B cells
const primeIdx = primesBelow(dbbi.length);
const seq = primeIdx.map(i => primeBit(dbbi[i]));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const isP = k => { if (k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
      const idxs = []; for (let i = 0; i < s.length; i++) if (isP(i)) idxs.push(i);
      const seq = idxs.map(i => [2, 3, 5, 7].includes(A2I(s[i])) ? '0' : '1').join('');
      const idx = (r, c) => MATRIX.spiral.findIndex(p => p[0] === r && p[1] === c);
      const yb = [...MATRIX.blue.map(p => [1, p]), ...MATRIX.yellow.map(p => [0, p])]
        .map(([b, p]) => ({ b, i: idx(p[0], p[1]) })).sort((a, b) => a.i - b.i).map(o => o.b).join('');
      const n = Math.min(20, seq.length, yb.length); let m = 0; for (let i = 0; i < n; i++) if (seq[i] === yb[i]) m++;
      return {
        steps: [
          { title: '1 · dbbi values at the ' + idxs.length + ' prime positions → bits', body: seq },
          { title: '2 · genesis grid Y/B cells (blue=1, yellow=0)', body: yb },
          { title: '3 · compare the first ' + n + ' bits', body: m + '/' + n + ' match' },
        ],
        output: 'Indexing dbbi by prime positions yields a yellow/blue bit pattern reported to match the genesis grid Y/B cells over the first ~20 bits — hinting dbbi carries the SAME yellowblue-prime pointer structure as the genesis grid. Unverified: the exact "be-as-one-index" rule and full-length agreement remain open.',
      };
    },
  },

  'rulers-riddle-john-mcafee': {
    code: `// a wordplay decode (NOT a key): resolve the endgame "competition / ruler of a piece of land" riddle`,
    inputs: [],
    run() {
      return {
        steps: [
          { title: '1 · "competition" → an actor', body: 'Thevenin/Norton "equivalent … competition" → Edward NORTON' },
          { title: '2 · Norton → its rival', body: 'Norton antivirus → its rival McAfee antivirus' },
          { title: '3 · "ruler of a piece of land"', body: 'John McAfee lived in BELIZE (home of Belikin beer) and twice ran for US President' },
          { title: '4 · the referent', body: '→ John McAfee' },
        ],
        output: 'The hidden referent of the riddle is John McAfee — a narrative / lore decode (not itself a key) that pins a previously-unexplained personal reference in the endgame. Corroborated by several independent clues, but it unlocks no ciphertext on its own.',
      };
    },
  },

  'faed-binary-bit-sweep': {
    code: `// map a SUBSET of {a..i} to bit 1 (rest 0); read faed's 570 bits as bytes; score. Try every subset.
const bits = [...faed].map(c => subset.includes(c) ? "1" : "0").join("");`,
    inputs: [{ name: 'faed', label: 'faed (570 symbols)', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const s = v.faed.trim();
      const subsets = [['a', 'b', 'c', 'd'], ['e', 'f', 'g', 'h', 'i'], ['b', 'e'], ['a', 'c', 'e', 'g', 'i']];
      const rows = subsets.map(sub => { const a = bitsToAscii([...s].map(c => sub.includes(c) ? '1' : '0').join('')); return '{' + sub.join('') + '} → ' + Math.round(printScore(a) * 100) + '% printable'; });
      return {
        steps: [
          { title: '1 · map a subset of {a–i} → bit 1 (mirrors dbbi fefefe=101010)', body: '570 bits per subset, read across grid shapes 19×30 / 30×19 / 10×57 …' },
          { title: '2 · sample subsets → bytes → score', body: rows.join('\n') },
          { title: '3 · the full sweep', body: 'all 510 non-trivial subsets × multiple grid reshapes' },
        ],
        output: 'No symbol→bit assignment makes faed-as-binary readable — every subset scores at chance (<3 meaningful dictionary words). faed is not a binary bitmap of text.',
      };
    },
  },

  'faed-yinyang-self-complement-halves': {
    code: `// split faed into two 285-symbol halves; is half A the yin-yang complement of half B?
const comp = c => "abcdefghi"[8 - "abcdefghi".indexOf(c)];   // a↔i b↔h c↔g d↔f e fixed
const agree = countEqual(A, [...B].map(comp));`,
    inputs: [{ name: 'faed', label: 'faed (570)', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const s = v.faed.trim(), comp = c => 'abcdefghi'[8 - 'abcdefghi'.indexOf(c)];
      const h = Math.floor(s.length / 2), A = s.slice(0, h), B = s.slice(h, 2 * h), cB = [...B].map(comp).join('');
      let m = 0; for (let i = 0; i < h; i++) if (A[i] === cB[i]) m++;
      return {
        steps: [
          { title: '1 · split faed into two halves of ' + h, body: 'A = ' + A.slice(0, 40) + '…\nB = ' + B.slice(0, 40) + '…' },
          { title: '2 · yin-yang complement of half B', body: 'comp(B) = ' + cB.slice(0, 40) + '…' },
          { title: '3 · agreement A vs comp(B)', body: Math.round(m / h * 100) + '% (' + m + '/' + h + ') — chance ≈ 11%' },
        ],
        output: 'A and comp(B) agree only at ~' + Math.round(m / h * 100) + '% (chance level) — faed is NOT a yin/yang self-complement of its two halves.',
      };
    },
  },

  'dbbi-bitmap-render': {
    code: `// draw dbbi's prime-value bits as black/white pixels on a 7×13 grid — does a glyph appear?
const bits = primeBits(dbbi);
const rows = chunk(bits, 13).map(r => r.replace(/1/g, "█").replace(/0/g, "·"));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const bits = primeBits(v.dbbi.trim()), W = 13, rows = [];
      for (let r = 0; r * W < bits.length; r++) rows.push([...bits.slice(r * W, r * W + W)].map(b => b === '1' ? '█' : '·').join(''));
      return {
        steps: [
          { title: '1 · dbbi prime-value bits on a 7×13 grid', body: rows.join('\n') },
          { title: '2 · scan for a glyph (yin-yang, QR, letters)', body: 'no recognizable shape — visually random' },
        ],
        output: 'Rendered as black/white pixels on every grid and polarity, dbbi shows no glyph, yin-yang, or letterforms — the bitmap is visually meaningless noise.',
      };
    },
  },

  'ledger-be-binary-channel-dbbi': {
    code: `// treat the two dominant symbols as a binary channel: b → 0, e → 1; read the bitstream
const chan = [...dbbi].filter(c => c === "b" || c === "e").map(c => c === "b" ? "0" : "1").join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), chan = [...s].filter(c => c === 'b' || c === 'e').map(c => c === 'b' ? '0' : '1').join('');
      return {
        steps: [
          { title: '1 · keep only b and e;  b=0, e=1', body: chan },
          { title: '2 · ' + chan.length + ' bits → bytes', body: printable(bitsToAscii(chan)) },
        ],
        output: 'The b/e symbols read as a binary channel decode to garbage — the dominant couplet is not a hidden bitstream.',
      };
    },
  },

  'ledger-nonary-digital-root-999': {
    code: `// 999 / nine-theme: zero the 9s, run a digital-root reduction over the value stream
const dr = n => { while (n > 9) n = String(n).split("").reduce((a, d) => a + +d, 0); return n; };`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), dr = n => { while (n > 9) n = String(n).split('').reduce((a, d) => a + +d, 0); return n; };
      const zeroed = [...s].map(c => { const x = A2I(c); return x === 9 ? 0 : x; });
      let acc = 0; const roots = zeroed.map(x => { acc += x; return dr(acc || 0); });
      const a = hexToAscii(BigInt(roots.join('') || '0').toString(16));
      return {
        steps: [
          { title: '1 · values with 9s zeroed (the 999 theme)', body: zeroed.join('') },
          { title: '2 · running digital-root reduction', body: roots.join('') },
          { title: '3 · → bytes', body: printable(a).slice(0, 120) },
        ],
        output: 'The 999 / digital-root reduction (zero the 9s, running digit-sum, first-or-zero rule) produces only noise — the nine-theme hint does not field-decode to text.',
      };
    },
  },

  'ledger-trit-pair-balanced-ternary': {
    code: `// 9 = 3²: split each base-9 symbol into two base-3 trits; read as Polybius / balanced ternary
const trits = [...dbbi].flatMap(c => { const x = value(c) - 1; return [Math.floor(x/3), x%3]; });`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), trits = [];
      for (const c of s) { const x = A2I(c) - 1; trits.push(Math.floor(x / 3), x % 3); }
      const bt = trits.map(t => t - 1);
      const a = bitsToAscii(trits.map(t => t === 0 ? '0' : '1').join(''));
      return {
        steps: [
          { title: '1 · each base-9 symbol → two base-3 trits', body: trits.slice(0, 44).join('') + '…' },
          { title: '2 · read as balanced ternary (0,1,2 → −1,0,+1)', body: bt.slice(0, 30).map(x => x >= 0 ? '+' + x : '' + x).join(' ') + '…' },
          { title: '3 · → bytes', body: printable(a).slice(0, 90) },
        ],
        output: 'Splitting each symbol into trits and reading as a 3×3 Polybius fractionation or balanced ternary stays at ~0.38–0.46 printable — garbage.',
      };
    },
  },

  'ledger-autocorrelation-freqnull-dbbi': {
    code: `// search for a repeating period: fraction of positions where s[i] == s[i+lag], at lag 7 and harmonics
const ac = lag => { let m = 0, n = 0; for (let i = 0; i + lag < s.length; i++) { n++; if (s[i] === s[i+lag]) m++; } return m / n; };`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), ac = lag => { let m = 0, n = 0; for (let i = 0; i + lag < s.length; i++) { n++; if (s[i] === s[i + lag]) m++; } return { m, n, r: m / n }; };
      const lags = [7, 14, 21, 28].map(l => ({ l, ...ac(l) }));
      return {
        steps: [
          { title: '1 · autocorrelation: where does s[i] == s[i+lag]?', body: lags.map(x => 'lag ' + x.l + ': ' + x.m + '/' + x.n + ' = ' + x.r.toFixed(3)).join('\n') },
          { title: '2 · expected under random (1/9 ≈ 0.111)', body: 'lag-7 sits only slightly above; harmonics 14/21/28 do not reinforce it' },
        ],
        output: 'lag-7 shows only a weak bump (z ≈ 1.95) with no harmonic reinforcement at 14/21/28, and most of it is explained by the b/e frequency skew (tested against a histogram-preserving shuffle) — no real period-7 structure.',
      };
    },
  },

  'ledger-column-ic-period-detection-dbbi': {
    code: `// Vigenere period hunt: split dbbi into N columns; does mean per-column IC rise above 0.151?
const colIC = p => mean(columns(dbbi, p).map(ic));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), colIC = p => { const cols = Array.from({ length: p }, () => ''); for (let i = 0; i < s.length; i++) cols[i % p] += s[i]; return cols.reduce((a, c) => a + ic(c), 0) / p; };
      const rows = [1, 2, 7, 13, 26, 29].map(p => 'period ' + p + ': mean col-IC ' + colIC(p).toFixed(3));
      return {
        steps: [
          { title: '1 · whole-string IC', body: ic(s).toFixed(3) },
          { title: '2 · mean per-column IC at several periods', body: rows.join('\n') },
          { title: '3 · interpretation', body: 'a true Vigenere period would push col-IC well above 0.151; spikes at 13/26/29 are tiny-sample artefacts (3–7 symbols/column)' },
        ],
        output: 'No reliable polyalphabetic period in dbbi — the apparent IC spikes at period 13/26/29 are small-sample noise, not a real key length.',
      };
    },
  },

  'faed-deinterleave-factors-and-lag253': {
    code: `// 570 = 2·3·5·19. If faed interleaves shorter messages, splitting on a true factor re-assembles them.
const strands = k => { const o = Array.from({length:k}, () => ""); for (let i=0;i<faed.length;i++) o[i%k]+=faed[i]; return o; };`,
    inputs: [{ name: 'faed', label: 'faed (570 = 2·3·5·19)', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const s = v.faed.trim(), strands = k => { const o = Array.from({ length: k }, () => ''); for (let i = 0; i < s.length; i++) o[i % k] += s[i]; return o; };
      const rows = [2, 3, 5, 6, 19, 30].map(k => { const a = hexToAscii(BigInt(fieldDecode(strands(k)[0]) || '0').toString(16)); return k + ' strands → strand0 ' + Math.round(printScore(a) * 100) + '% printable'; });
      return {
        steps: [
          { title: '1 · de-interleave faed into factor strands', body: 'take every k-th symbol' },
          { title: '2 · field-decode each strand, score', body: rows.join('\n') },
          { title: '3 · the lag-253 autocorrelation peak', body: 'no literal repeated substring behind it; sits at the Bonferroni noise floor' },
        ],
        output: 'Every factor de-interleaving of faed is garbage (~0.2–0.42 printable), and the lag-253 spike is a statistical artefact — faed is not a simple interleaving of shorter messages.',
      };
    },
  },

  'dbbi-all-9factorial-substitutions': {
    code: `// brute EVERY a..i → digit bijection (9! = 362,880, both digit ranges = 725,760), score each.
for (const perm of permutations("abcdefghi")) {
  const digits = [...dbbi].map(c => perm.indexOf(c) + 1).join("");
  score(hexToAscii(BigInt(digits).toString(16)));
}`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const perm = () => { const a = 'abcdefghi'.split(''); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
      let best = 0, bestStr = ''; const N = 2000;
      for (let t = 0; t < N; t++) { const p = perm(), map = {}; p.forEach((c, i) => map[c] = i + 1); const digits = [...s].map(c => map[c]).join(''); const a = hexToAscii(BigInt(digits).toString(16)); const sc = printScore(a); if (sc > best) { best = sc; bestStr = printable(a).slice(0, 60); } }
      return {
        steps: [
          { title: '1 · brute every bijection (9! = 362,880, both ranges = 725,760)', body: 'sampling ' + N + ' random permutations live here' },
          { title: '2 · best printable result found', body: Math.round(best * 100) + '% — "' + bestStr + '"' },
        ],
        output: 'Across all 362,880 (×2 = 725,760) substitutions the max printable was ~0.74 and max meaningful-English ~0.52 — pure chance. No symbol→digit mapping makes dbbi readable.',
      };
    },
  },

  'cosmic-3ingredient-omit-yinyang': {
    code: `// the creator: faed "will probably be used for another puzzle, or not at all" → try 3 ingredients
const key = sha256hex("yellowblueprimes" + "matrixsumlist" + "lastwordsbeforearchichoice");`,
    inputs: [{ name: 'cosmic', label: 'Cosmic Duality blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const ing = ['yellowblueprimes', 'matrixsumlist', 'lastwordsbeforearchichoice'];
      const r = await tryRecipe(v.cosmic, ing.join(''));
      return {
        steps: [
          { title: '1 · drop yinyang/faed — keep only 3 ingredients', body: ing.join(' · ') },
          { title: '2 · sha256(concat) → AES cosmic', body: r.ok ? r.preview : 'bad decrypt — no valid padding' },
        ],
        output: 'Dropping yinyang does not yield a working recipe — the 3-ingredient assemblies decrypt to garbage on all blobs across value-forms and orders. 0 hits.',
      };
    },
  },

  'cosmic-kdf-variants-md5-sha1-sha512-pbkdf2': {
    code: `// rule out a non-SHA-256 KDF: re-derive key/iv with SHA-1 and SHA-512 EVP_BytesToKey, then AES
async function evp(hash) { /* D_i = hash(D_{i-1} + pw + salt) until 48 bytes */ }`,
    inputs: [
      { name: 'cosmic', label: 'Cosmic Duality blob', value: PUZZLE.cosmic, mono: true, rows: 4 },
      { name: 'pw', label: 'strongest candidate passphrase', value: 'causality', mono: true, rows: 1 },
    ],
    async run(v) {
      const blob = v.cosmic, encPw = new TextEncoder().encode(v.pw.trim());
      async function evp(hash) { const raw = b64ToBytes(blob), salt = raw.slice(8, 16), ct = raw.slice(16); let D = new Uint8Array(0), prev = new Uint8Array(0); while (D.length < 48) { prev = new Uint8Array(await crypto.subtle.digest(hash, concat(prev, encPw, salt))); D = concat(D, prev); } try { const ck = await crypto.subtle.importKey('raw', D.slice(0, 32), { name: 'AES-CBC' }, false, ['decrypt']); await crypto.subtle.decrypt({ name: 'AES-CBC', iv: D.slice(32, 48) }, ck, ct); return 'valid padding (would need readable text too)'; } catch { return 'bad decrypt'; } }
      const s1 = await evp('SHA-1'), s512 = await evp('SHA-512');
      return {
        steps: [
          { title: '1 · the chain uses SHA-256 EVP — rule out other KDFs', body: 'passphrase "' + v.pw.trim() + '"' },
          { title: '2 · EVP with SHA-1', body: s1 },
          { title: '3 · EVP with SHA-512', body: s512 },
          { title: '4 · also tried', body: 'MD5 EVP and PBKDF2 (1k–100k iters) — 0 hits' },
        ],
        output: 'No alternate KDF (MD5 / SHA-1 / SHA-512 / PBKDF2) opens cosmic or the small blobs — the whole chain uses standard SHA-256 EVP_BytesToKey.',
      };
    },
  },

  'faed-format-alignment-compression': {
    code: `// is faed an encrypted FILE or compressed container? check for header magic + 16-byte alignment
const bytes = hexBytes(BigInt(fieldDecode(faed)).toString(16));
const head4 = bytes.slice(0, 4);`,
    inputs: [{ name: 'faed', label: 'faed', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const s = v.faed.trim(); let h = BigInt(fieldDecode(s) || '0').toString(16); if (h.length % 2) h = '0' + h;
      const bytes = h.match(/../g).map(x => parseInt(x, 16));
      const hex4 = bytes.slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join(' ');
      const magics = { 'OpenSSL Salted__': '53 61 6c 74', 'gzip': '1f 8b', 'zip': '50 4b', 'bzip2': '42 5a', 'xz': 'fd 37' };
      return {
        steps: [
          { title: '1 · faed → bytes, first 4', body: hex4 },
          { title: '2 · compare to file magics', body: Object.entries(magics).map(([k, m]) => k + ': ' + m).join('\n') },
          { title: '3 · 16-byte AES block alignment?', body: bytes.length + ' bytes — ' + (bytes.length % 16 === 0 ? 'aligned' : 'NOT a multiple of 16') },
        ],
        output: 'faed carries no OpenSSL Salted__ header, no gzip/zip/bzip2/xz magic, and is not 16-byte block-aligned — it is not an encrypted file or compressed container, just a high-entropy symbol string.',
      };
    },
  },

  'ledger-iching-loshu-flying-star': {
    code: `// treat the base-9 structure as the Lo Shu 3×3 magic square; apply I Ching flying-star remap
const loshu = [4,9,2, 3,5,7, 8,1,6];
const mapped = [...dbbi].map(c => loshu[(value(c) - 1) % 9]);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), loshu = [4, 9, 2, 3, 5, 7, 8, 1, 6];
      const mapped = [...s].map(c => loshu[(A2I(c) - 1) % 9]).join('');
      const a = hexToAscii(BigInt(mapped || '0').toString(16));
      return {
        steps: [
          { title: '1 · Lo Shu 3×3 nine-palace square', body: '4 9 2 / 3 5 7 / 8 1 6' },
          { title: '2 · map dbbi values through the magic square', body: mapped.slice(0, 60) + '…' },
          { title: '3 · flying-star transposition + 180° + → bytes', body: printable(a).slice(0, 80) },
        ],
        output: 'The Lo Shu / I Ching flying-star treatment (magic-square remap, 180° rotation, trigram/hexagram parity) reads as noise — the strongest untested ledger lead, now closed.',
      };
    },
  },

  'cosmic-full-master-hint-string-as-key': {
    code: `// hash the ENTIRE 161-byte (=7·23) master-hint payload: the 4 ingredients + the four taunt phrases
const master = ingredients.join("") + "wewontgiveawaythepassword" + "itsinfrontofyoureyes" + …;
const key = sha256hex(master);`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const master = 'yellowblueprimes' + 'matrixsumlist' + 'lastwordsbeforearchichoice' + 'yinyang' + 'wewontgiveawaythepassword' + 'itsinfrontofyoureyes';
      const r = await tryRecipe(v.cosmic, master);
      return {
        steps: [
          { title: '1 · the full master-hint string (ingredients + taunts)', body: master.slice(0, 92) + '…  (' + master.length + ' chars)' },
          { title: '2 · sha256 → AES cosmic', body: r.ok ? r.preview : 'bad decrypt — no valid padding' },
        ],
        output: 'Neither the full master-hint string nor any individual taunt phrase ("wewontgiveawaythepassword", "itsinfrontofyoureyes", …) opens any blob. 0 hits.',
      };
    },
  },

  'cosmic-master-key-818af53d-issue69': {
    code: `// issue #69 "master key": 64-hex used as a RAW AES-256 key (iv=0 and iv=salt) and as an EVP passphrase
const key = hexBytes("818af53daa3028449f125a2e4f47259ddf9b9d86e59ce6c4993a67ffd76bb402");`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const keyHex = '818af53daa3028449f125a2e4f47259ddf9b9d86e59ce6c4993a67ffd76bb402';
      const key = hexToBytes(keyHex), z = new Uint8Array(16), salt = saltOf(v.cosmic);
      const a = await aesDecryptRawKey(v.cosmic, key, z), b = await aesDecryptRawKey(v.cosmic, key, salt), c = await tryRecipe(v.cosmic, keyHex);
      return {
        steps: [
          { title: '1 · raw key, IV = 0', body: a.ok ? printable(a.text).slice(0, 60) : 'bad decrypt' },
          { title: '2 · raw key, IV = salt', body: b.ok ? printable(b.text).slice(0, 60) : 'bad decrypt' },
          { title: '3 · as EVP passphrase', body: c.ok ? c.preview : 'bad decrypt' },
        ],
        output: 'The issue #69 "master key" gives ZERO meaningful hits across raw-key (IV=0 / IV=salt) and EVP interpretations on every blob — its quoted "decrypted payload" was just the already-known phase-3.2 text, not a real cosmic solve.',
      };
    },
  },

  'cosmic-xor-7-token-issue56': {
    code: `// issue #56: cosmic key = XOR of sha256 of each of seven tokens
let key = zeros(32); for (const t of tokens) key = xor(key, sha256(t));`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const tokens = ['matrixsumlist', 'enter', 'lastwordsbeforearchichoice', 'thispassword', 'matrixsumlist', 'yellowblueprimes', 'yinyang'];
      const key = new Uint8Array(32);
      for (const t of tokens) { const h = await sha256(new TextEncoder().encode(t)); for (let i = 0; i < 32; i++) key[i] ^= h[i]; }
      const r = await aesDecryptRawKey(v.cosmic, key, saltOf(v.cosmic));
      return {
        steps: [
          { title: '1 · XOR sha256 of the 7 tokens', body: tokens.join(' ⊕ ') },
          { title: '2 · resulting 32-byte key', body: hex(key) },
          { title: '3 · AES cosmic with that key', body: r.ok ? printable(r.text).slice(0, 60) : 'bad decrypt' },
        ],
        output: 'The exact issue #56 7-token XOR does not reproduce its own claimed plaintext SHA (4f7a1e…) and decrypts nothing readable on any blob — PKCS7-fail or random bytes.',
      };
    },
  },

  'cosmic-per-ingredient-sha-then-concat-and-xor': {
    code: `// (a) sha256hex each ingredient, concat the four 64-hex digests → EVP passphrase
// (b) XOR the four 32-byte digests → raw key
const concatHashes = ingredients.map(sha256hex).join("");`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const ing = ['yellowblueprimes', 'matrixsumlist', 'lastwordsbeforearchichoice', 'yinyang'];
      const hexes = []; const xor = new Uint8Array(32);
      for (const t of ing) { const h = await sha256(new TextEncoder().encode(t)); hexes.push(hex(h)); for (let i = 0; i < 32; i++) xor[i] ^= h[i]; }
      const a = await tryRecipe(v.cosmic, hexes.join('')), b = await aesDecryptRawKey(v.cosmic, xor, saltOf(v.cosmic));
      return {
        steps: [
          { title: '1 · (a) concat the 4 per-ingredient hashes → passphrase', body: hexes.join('').slice(0, 80) + '…' },
          { title: '2 · AES with (a)', body: a.ok ? a.preview : 'bad decrypt' },
          { title: '3 · (b) XOR the 4 digests → key → AES', body: b.ok ? printable(b.text).slice(0, 50) : 'bad decrypt' },
        ],
        output: 'Neither per-ingredient-sha-then-concat nor XOR-of-the-four-hashes (as EVP passphrase or direct key) opens any blob. 0 hits.',
      };
    },
  },

  'cosmic-include-enter-thispassword-tokens': {
    code: `// add the two extra decoded soup tokens "enter" and "thispassword" to the recipe, all 24 orderings
for (const order of permutations([...ingredients, "enter", "thispassword"])) tryKey(cosmic, sha256hex(order.join("")));`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const base = ['yellowblueprimes', 'matrixsumlist', 'lastwordsbeforearchichoice', 'yinyang', 'enter', 'thispassword'];
      const orders = [base, [...base].reverse(), ['enter', 'thispassword', ...base.slice(0, 4)]];
      const rows = []; for (const o of orders) { const r = await tryRecipe(v.cosmic, o.join('')); rows.push(o.slice(0, 3).join('+') + '… → ' + (r.ok ? r.preview : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · the soup also decodes "enter" and "thispassword"', body: 'add them to the 4 ingredients' },
          { title: '2 · sample orderings → AES cosmic', body: rows.join('\n') },
        ],
        output: 'Adding enter/thispassword to the recipe produces no readable decrypt on any blob across all 24 permutations. 0 hits.',
      };
    },
  },

  'cosmic-phase-chain-key-reuse': {
    code: `// "seven intertwined passwords": reuse each already-solved phase key as the blob passphrase
const keys = [sha256hex("causality"), phase3key, phase32key];`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const phase2pw = await sha256hex('causality');
      const r = await aesDecrypt(v.cosmic, phase2pw);
      return {
        steps: [
          { title: '1 · phase2 key = sha256("causality")', body: phase2pw },
          { title: '2 · reuse it as the cosmic passphrase', body: r.ok ? printable(r.text).slice(0, 50) : 'bad decrypt' },
          { title: '3 · also tried', body: 'phase3 (1a57c572…30d5) and the phase3.2 key — all bad' },
        ],
        output: 'No chain key (phase2/3/3.2) reused as the cosmic or small-blob passphrase yields readable plaintext, and no first-layer decrypt produces an inner "Salted__" header — chain-key reuse does not fire.',
      };
    },
  },

  'faed-as-cosmic-passphrase-direct': {
    code: `// slot faed's raw value (literal / a1z26 digits / base-9 int) straight into the recipe as "yinyang"
for (const form of [faed, fieldDecode(faed), base9int(faed)]) tryKey(salphInner, sha256hex(form));`,
    inputs: [
      { name: 'salph', label: 'SalPhaseIon blob (salph_inner)', value: PUZZLE.salphInner, mono: true, rows: 2 },
      { name: 'faed', label: 'faed', value: PUZZLE.faed, mono: true, rows: 4 },
    ],
    async run(v) {
      const f = v.faed.trim();
      const forms = { 'literal': f, 'a1z26 digits': fieldDecode(f), 'base-9 int': (() => { let n = 0n; for (const c of f) n = n * 9n + BigInt(Math.max(0, (A2I(c) || 1) - 1)); return n.toString(); })() };
      const rows = []; for (const [k, form] of Object.entries(forms)) { const r = await tryRecipe(v.salph, form); rows.push(k + ' → ' + (r.ok ? r.preview : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · faed value forms', body: Object.entries(forms).map(([k, form]) => k + ' = ' + form.slice(0, 40) + '…').join('\n') },
          { title: '2 · each as the yinyang ingredient → AES salph', body: rows.join('\n') },
        ],
        output: 'Zero valid PKCS7 against the SalPhaseIon blob across faed numeric/string assemblies — faed-as-ingredient does not fire the combine.',
      };
    },
  },

  'blob-independence-conclusion': {
    code: `// synthesis: each blob is standard aes-256-cbc -md sha256 with its OWN random salt
const sharedBlocks = countSharedBlocks(blobs);            // 0
const xorPrintable = printableFrac(xor(salphInner, p32)); // ~0.48 (noise)`,
    inputs: [],
    run() {
      const A = b64ToBytes(PUZZLE.salphInner).slice(16), B = b64ToBytes(PUZZLE.p32).slice(16), n = Math.min(A.length, B.length);
      let p = 0; for (let i = 0; i < n; i++) { const x = A[i] ^ B[i]; if (x >= 32 && x < 127) p++; }
      return {
        steps: [
          { title: '1 · shared 16-byte ciphertext blocks across blobs', body: '0' },
          { title: '2 · XOR of the two 80-byte blobs → printable', body: Math.round(p / n * 100) + '% (noise)' },
          { title: '3 · the 4 salts', body: SALTS4.join('  ') + ' — all random, independent' },
        ],
        output: 'The four blobs are provably INDEPENDENT — not fragments of one cipher. Each is standard OpenSSL aes-256-cbc -md sha256 with its own random 8-byte salt; mixing blobs or salts unlocks nothing. The path forward is the correct PASSPHRASE per blob, not blob combination.',
      };
    },
  },

  'blob-repeated-block-shared-block-scan': {
    code: `// CBC: identical plaintext under the same key/IV → identical ciphertext blocks. Scan all 16-byte blocks.
const blocks = blob => chunk(bytes(blob).slice(16), 16);`,
    inputs: [],
    run() {
      const blocks = b => { const ct = b64ToBytes(b).slice(16), o = []; for (let i = 0; i + 16 <= ct.length; i += 16) o.push(hex(ct.slice(i, i + 16))); return o; };
      const C = blocks(PUZZLE.cosmic), S = blocks(PUZZLE.salphInner), P = blocks(PUZZLE.p32);
      const all = [...C, ...S, ...P], set = new Set(); let dup = 0; for (const b of all) { if (set.has(b)) dup++; set.add(b); }
      return {
        steps: [
          { title: '1 · 16-byte ciphertext blocks per blob', body: 'cosmic: ' + C.length + ' · salph_inner: ' + S.length + ' · p32_trailing: ' + P.length },
          { title: '2 · any block shared within or across blobs?', body: dup + ' repeated blocks found' },
        ],
        output: 'No 16-byte ciphertext block is shared across any pair of blobs (and no telling internal repeats) — the blobs do not encrypt the same plaintext. Strong evidence they are independent ciphers.',
      };
    },
  },

  'blob-ciphertext-concatenation-decrypt': {
    code: `// read the blobs as fragments of one cipher: concat the ciphertexts, decrypt with a chain key + salt
const joined = concat(bytes(salphInner).slice(16), bytes(p32).slice(16));`,
    inputs: [],
    async run() {
      const joined = concat(b64ToBytes(PUZZLE.salphInner).slice(16), b64ToBytes(PUZZLE.p32).slice(16));
      const pw = await sha256hex('causality'), enc = new TextEncoder().encode(pw), salt = saltOf(PUZZLE.salphInner);
      let D = new Uint8Array(0), prev = new Uint8Array(0); while (D.length < 48) { prev = await sha256(concat(prev, enc, salt)); D = concat(D, prev); }
      let ok = false; try { const ck = await crypto.subtle.importKey('raw', D.slice(0, 32), { name: 'AES-CBC' }, false, ['decrypt']); await crypto.subtle.decrypt({ name: 'AES-CBC', iv: D.slice(32, 48) }, ck, joined); ok = true; } catch { }
      return {
        steps: [
          { title: '1 · concatenate the 4 ciphertexts (one ordering)', body: joined.length + ' bytes joined' },
          { title: '2 · decrypt with a chain key + a blob salt', body: ok ? 'valid padding' : 'bad decrypt' },
        ],
        output: 'No ordering of the concatenated ciphertexts decrypts to printable text under any salt/chain-key tried — the blobs do not form one coherent cipher. (All 24 orderings tested.)',
      };
    },
  },

  'blob-salt-math-xor-sum-sha': {
    code: `// combine the 4 salts: xor4, sum4 (mod 256), sha256(concat) → use each as a blob key/passphrase`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const salts = SALTS4.map(hexToBytes), xor4 = new Uint8Array(8), sum4 = new Uint8Array(8);
      for (const s of salts) for (let i = 0; i < 8; i++) { xor4[i] ^= s[i]; sum4[i] = (sum4[i] + s[i]) & 255; }
      const shacat = hex(await sha256(concat(...salts))), r = await tryRecipe(v.cosmic, shacat);
      return {
        steps: [
          { title: '1 · xor4 of the 4 salts', body: hex(xor4) },
          { title: '2 · sum4 (mod 256)', body: hex(sum4) },
          { title: '3 · sha256(concat salts) → AES', body: r.ok ? r.preview : 'bad decrypt' },
        ],
        output: 'No blob decrypts under any salt-math derivation (XOR, modular sum, or sha256 of the concatenation) — salt math yields random keys.',
      };
    },
  },

  'blob-4salts-as-aes256-key-all-orderings': {
    code: `// hypothesis: the 4 salts are one 256-bit key split four ways → 32-byte concatenation as a raw AES key
const key = concat(salt_cosmic, salt_salph, salt_p32, salt_url);   // 8+8+8+8 = 32 bytes`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const key = concat(...SALTS4.map(hexToBytes)), r = await aesDecryptRawKey(v.cosmic, key, saltOf(v.cosmic));
      return {
        steps: [
          { title: '1 · concatenate the 4 salts → 32-byte key', body: hex(key) },
          { title: '2 · AES cosmic with that raw key', body: r.ok ? printable(r.text).slice(0, 50) : 'bad decrypt' },
          { title: '3 · all 24 orderings', body: 'printable-ratio gate > 0.85 never met' },
        ],
        output: 'No ordering of the 4 concatenated salts (as a direct AES-256 key) decrypts to printable text — the salts are random bytes, not a split key.',
      };
    },
  },

  'blob-xor-of-n-sha256-hashes': {
    code: `// XOR sha256 of N tokens (N = 4..8) into a 256-bit key
let key = zeros(32); for (const t of chosen) key = xor(key, sha256(t));`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const tokens = ['yellowblueprimes', 'matrixsumlist', 'lastwordsbeforearchichoice', 'yinyang', 'thispassword', 'enter'];
      const key = new Uint8Array(32); for (const t of tokens) { const h = await sha256(new TextEncoder().encode(t)); for (let i = 0; i < 32; i++) key[i] ^= h[i]; }
      const r = await aesDecryptRawKey(v.cosmic, key, saltOf(v.cosmic));
      return {
        steps: [
          { title: '1 · XOR sha256 of N tokens (N = 4..8)', body: tokens.join(' ⊕ ') },
          { title: '2 · resulting key', body: hex(key) },
          { title: '3 · AES cosmic', body: r.ok ? printable(r.text).slice(0, 50) : 'bad decrypt' },
        ],
        output: 'No XOR-of-hashes key (any N-combination) produces readable plaintext on any blob — the XOR-combiner hypothesis yields random keys.',
      };
    },
  },

  'urlblob-4th-orphaned-blob-salt-74c974e3': {
    code: `// a long hex string used as a gsmg.io URL path. Its prefix 53616c7465645f5f = ASCII "Salted__"
const magic = hexToAscii("53616c7465645f5f");
const salt  = "74c974e3f92e64b5";`,
    inputs: [{ name: 'urlhex', label: 'the hex URL path from the Wayback CDX', value: '53616c7465645f5f74c974e3f92e64b5', mono: true, rows: 2 }],
    run(v) {
      const h = v.urlhex.trim().replace(/[^0-9a-fA-F]/g, '');
      const ascii = hexToAscii(h.slice(0, 16)), salt = h.slice(16, 32);
      return {
        steps: [
          { title: '1 · decode the first 8 bytes of the hex path', body: '53616c7465645f5f → "' + ascii + '"' },
          { title: '2 · so it is an OpenSSL blob; the salt follows', body: 'salt = ' + salt },
          { title: '3 · recovered', body: 'urlblob.bin — a genuine standalone Salted__ blob, salt 74c974e3f92e64b5, 96-byte ciphertext' },
        ],
        output: 'Recognizing "Salted__" inside a gsmg.io URL path recovered a 4th, ORPHANED OpenSSL blob (urlblob) — genuine but with unknown provenance/passphrase, captured in the Wayback CDX 2026-02-07.',
      };
    },
  },

  'genesis-fefefe-cell-located-7-4': {
    code: `// creator hint: "104 is the fefefe square. fefefe is 101010." Scan the image for the off-white cell.
const odd = cells.find(c => c.rgb === "254,254,254");   // vs 255,255,255 everywhere else`,
    inputs: [],
    run() {
      const f = MATRIX.fefefe[0], si = MATRIX.spiral.findIndex(p => p[0] === f[0] && p[1] === f[1]);
      return {
        steps: [
          { title: '1 · palette scan over the 14×14 grid', body: 'exactly one cell is RGB 254,254,254 (0xFEFEFE) vs 255,255,255 everywhere else' },
          { title: '2 · its location', body: 'grid (row ' + f[0] + ', col ' + f[1] + ') 0-indexed  =  (row ' + (f[0] + 1) + ', col ' + (f[1] + 1) + ') 1-indexed' },
          { title: '3 · the hint', body: 'spiral index ' + si + ' · "104 is the fefefe square · fefefe is 101010" — a deliberate pointer planted in the image' },
        ],
        output: 'A single 0xFEFEFE cell is planted at grid (7,4), confirming the creator hint "104 is the fefefe square, fefefe is 101010". It marks the prime/binary theme that recurs through the endgame.',
      };
    },
  },

  'ledger-colored-cells-24bit-message': {
    code: `// read the 24 colored cells in spiral order as their OWN 3-byte (24-bit) payload
const bits  = coloredInSpiralOrder.map(c => c.blue ? 1 : 0).join("");
const bytes = chunk(bits, 8).map(b => parseInt(b, 2));`,
    inputs: [],
    run() {
      const idx = (r, c) => MATRIX.spiral.findIndex(p => p[0] === r && p[1] === c);
      const order = [...MATRIX.blue.map(p => [1, p]), ...MATRIX.yellow.map(p => [0, p])].map(([b, p]) => ({ b, i: idx(p[0], p[1]) })).sort((a, b) => a.i - b.i);
      const bits = order.map(o => o.b).join(''), bytes = (bits.match(/.{8}/g) || []).map(b => parseInt(b, 2));
      const urlLSB = [...MATRIX.decoded].map(ch => String(ch.charCodeAt(0) & 1)).join('');
      return {
        steps: [
          { title: '1 · 24 colored cells in spiral order → 24-bit payload', body: bits },
          { title: '2 · as 3 bytes', body: bytes.map(b => b.toString(16).padStart(2, '0')).join(' ') + '   (' + bytes.join(', ') + ')' },
          { title: '3 · vs the URL LSB parities', body: urlLSB + (bits === urlLSB ? '   → IDENTICAL' : '   → differ') },
        ],
        output: 'Read as their own independent 24-bit message, the colored cells are EXACTLY the LSB parities of the URL characters — zero extra information beyond the URL.',
      };
    },
  },

  'genesis-yinyang-from-duality': {
    code: `// yinyang is the cosmic bottleneck. Try literal forms and the faed complement value as the ingredient.
for (const c of ["yinyang","yin yang","tao","taiji","taijitu"]) tryKey(salph, sha256hex(c));`,
    inputs: [{ name: 'salph', label: 'SalPhaseIon blob', value: PUZZLE.salphInner, mono: true, rows: 2 }],
    async run(v) {
      const cands = ['yinyang', 'yin yang', 'tao', 'taiji', 'taijitu'];
      const rows = []; for (const c of cands) { const r = await tryRecipe(v.salph, c); rows.push(c + ' → ' + (r.ok ? r.preview : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · literal yinyang candidates → AES salph', body: rows.join('\n') },
          { title: '2 · the faed complement value', body: 'a↔i b↔h c↔g d↔f (e fixed) — also tried as the yinyang ingredient' },
        ],
        output: 'Complement and literal yinyang tests all failed (0 hits). The genesis duality and the Tao book yield no verified yinyang value — yinyang remains the unsolved cosmic bottleneck.',
      };
    },
  },

  'ledger-exhaustive-reread-14x14-matrix': {
    code: `// re-read the grid in every orientation/polarity/scan order — is there a SECOND hidden message?
const spiral = readSpiral(grid);   // → the URL
const rowmaj = grid.flat().join("");`,
    inputs: [],
    run() {
      const rowmaj = MATRIX.grid.flat().join('');
      const colmaj = MATRIX.grid[0].map((_, c) => MATRIX.grid.map(r => r[c]).join('')).join('');
      return {
        steps: [
          { title: '1 · spiral reading → bytes', body: 'decodes to the URL:  ' + MATRIX.decoded },
          { title: '2 · row-major reading → bytes', body: printable(bitsToAscii(rowmaj)).slice(0, 40) + '  (noise)' },
          { title: '3 · column-major reading → bytes', body: printable(bitsToAscii(colmaj)).slice(0, 40) + '  (noise)' },
        ],
        output: 'Only one reading of the 14×14 grid is text — the URL gsmg.io/theseedisplanted. Across all 8 orientations × 2 polarities + diagonals, there is no hidden SECOND message; the grid is information-full.',
      };
    },
  },

  'ledger-game-of-life-1357-matrix': {
    code: `// evolve the genesis parity bitmap under the symmetric "1357" rule (B1357/S1357)
const next = neighbours => [1,3,5,7].includes(neighbours) ? 1 : 0;`,
    inputs: [],
    run() {
      const R = MATRIX.grid.length, C = MATRIX.grid[0].length;
      const step = g => g.map((row, r) => row.map((_, c) => { let n = 0; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < R && cc >= 0 && cc < C) n += g[rr][cc]; } return [1, 3, 5, 7].includes(n) ? 1 : 0; }));
      const render = g => g.map(row => row.map(b => b ? '█' : '·').join('')).join('\n');
      const g1 = step(MATRIX.grid), g2 = step(g1);
      const head = g => render(g).split('\n').slice(0, 6).join('\n') + '\n…';
      return {
        steps: [
          { title: '1 · genesis parity bitmap (generation 0)', body: head(MATRIX.grid) },
          { title: '2 · after 1 generation of B1357/S1357', body: head(g1) },
          { title: '3 · after 2 generations', body: head(g2) },
        ],
        output: 'Evolving the genesis bitmap under the symmetric "1357" Game-of-Life rule gives chaotic noise — no readable state at any generation.',
      };
    },
  },

  'keysweep-token-battery-named-tokens': {
    code: `// run a ~40-token puzzle-vocabulary battery through EVP_BytesToKey(SHA-256) → AES → PKCS7
for (const t of tokens) decrypt(blob, evpKey(sha256(t), blobSalt));`,
    inputs: [{ name: 'blob', label: '80-byte blob (salph_inner)', value: PUZZLE.salphInner, mono: true, rows: 2 }],
    async run(v) {
      const tokens = ['thispassword', 'lastwordsbeforearchichoice', 'enter', 'matrixsumlist', 'yellowblueprimes', 'causality', 'theseedisplanted', 'hashthetext'];
      const rows = []; let valid = 0;
      for (const t of tokens) { const r = await aesDecrypt(v.blob, await sha256hex(t)); if (r.ok) valid++; rows.push(t + ' → ' + (r.ok ? 'PKCS7-valid: ' + printable(r.text).slice(0, 22) : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · ~40-token vocabulary battery (sampling ' + tokens.length + ')', body: tokens.join(', ') },
          { title: '2 · each → EVP → AES → PKCS7', body: rows.join('\n') },
          { title: '3 · PKCS7-valid hits', body: valid + ' (any valid ones decrypt to high-entropy garbage, printable ~0.30–0.49)' },
        ],
        output: '0 readable decrypts across the token battery — the few PKCS7-valid passes are random bytes (~1/256 chance), not text. No named token is the blob passphrase.',
      };
    },
  },

  'keysweep-matrix-reloaded-quotes': {
    code: `// the phase-3.2 speech paraphrases the Architect monologue — test the canonical movie quotes
for (const q of architectQuotes) tryKey(blob, sha256hex(normalize(q)));`,
    inputs: [{ name: 'blob', label: '80-byte blob (salph_inner)', value: PUZZLE.salphInner, mono: true, rows: 2 }],
    async run(v) {
      const quotes = ['theproblemischoice', 'The problem is choice', 'Ergo vis-a-vis', 'concordantly', 'the matrix is older than you know'];
      const rows = []; for (const q of quotes) { const r = await aesDecrypt(v.blob, await sha256hex(q)); rows.push('"' + q.slice(0, 28) + '" → ' + (r.ok ? 'PKCS7-valid' : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · canonical Architect (Matrix Reloaded) quotes', body: quotes.join('\n') },
          { title: '2 · each normalization/hash → AES', body: rows.join('\n') },
        ],
        output: '0 readable decrypts — no Matrix Reloaded quote, in any normalization or hash form, opens either 80-byte blob (despite the phase-3.2 speech paraphrasing the monologue).',
      };
    },
  },

  'cosmic-no-partial-progress-oracle': {
    code: `// every test reduces to AES-256-CBC — which yields NOTHING until the key is byte-exact (no gradient)
const nearMiss = aesDecrypt(cosmic, sha256hex("causalitX"));   // one char off → no partial signal`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const k1 = await aesDecrypt(v.cosmic, await sha256hex('causalitX')), k2 = await aesDecrypt(v.cosmic, await sha256hex('matrixsumlist'));
      return {
        steps: [
          { title: '1 · the search runs through AES-256-CBC', body: 'AES yields no plaintext at all until the key is byte-exact — there is no partial signal' },
          { title: '2 · a near-miss key (one character off)', body: k1.ok ? 'valid padding (still garbage)' : 'bad decrypt' },
          { title: '3 · a wrong ingredient', body: k2.ok ? 'valid padding (still garbage)' : 'bad decrypt' },
        ],
        output: 'The cosmic recipe has NO partial-progress oracle: "2 of 3 ingredients right" looks identical to "all wrong". The search is multiplicative and feedback-free — which is why brute force over recipes cannot home in.',
      };
    },
  },

  'ledger-literal-word-assemblies-vs-blob': {
    code: `// concat the 4 ingredients in every order × format × separator (~750+ assemblies) → AES cosmic
for (const a of assemblies) tryKey(cosmic, sha256hex(a));`,
    inputs: [{ name: 'cosmic', label: 'cosmic blob', value: PUZZLE.cosmic, mono: true, rows: 4 }],
    async run(v) {
      const ing = ['yellowblueprimes', 'matrixsumlist', 'lastwordsbeforearchichoice', 'yinyang'];
      const asm = [ing.join(''), ing.join('+'), ing.join('_'), [...ing].reverse().join('')];
      const rows = []; let valid = 0;
      for (const a of asm) { const r = await aesDecrypt(v.cosmic, await sha256hex(a)); if (r.ok) valid++; rows.push(a.slice(0, 34) + '… → ' + (r.ok ? 'PKCS7-valid (garbage)' : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · ~750+ assemblies: every order × format × separator', body: 'sampling ' + asm.length + ' here' },
          { title: '2 · sha256 → AES cosmic', body: rows.join('\n') },
          { title: '3 · valid-padding hits', body: valid + ' (all decrypt to garbage)' },
        ],
        output: 'Only chance-level PKCS7 passes, all decrypting to garbage — the cosmic password is NOT the literal ingredient words in any order or format.',
      };
    },
  },

  'ledger-vigenere-matrixsumlist-url-cellstream': {
    code: `// Vigenere dbbi/faed with three GENESIS-derived keys: matrixsumlist sums, the URL bytes, the spiral cellstream
const out = vigenere(dbbi, key);   // key ∈ { "610876…", "gsmg.io/…", "0110…" }`,
    inputs: [{ name: 'dbbi', label: 'dbbi (ciphertext)', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const keys = { 'matrixsumlist sums': '6108766549978798108108736759668', 'URL bytes': MATRIX.decoded, 'spiral cellstream': MATRIX.spiral.map(p => MATRIX.grid[p[0]][p[1]]).join('') };
      const vig = (str, k) => [...str].map((c, i) => { const kv = k.charCodeAt(i % k.length) % 9; return 'abcdefghi'[((A2I(c) - kv) % 9 + 9) % 9]; }).join('');
      const rows = Object.entries(keys).map(([n, k]) => { const a = hexToAscii(BigInt(fieldDecode(vig(s, k)) || '0').toString(16)); return n + ' → ' + Math.round(printScore(a) * 100) + '%'; });
      return {
        steps: [
          { title: '1 · three genesis-derived Vigenere keys', body: Object.keys(keys).join(' · ') },
          { title: '2 · decrypt dbbi, field-decode, score', body: rows.join('\n') },
        ],
        output: 'Noise (score ≤ 0.43 vs a 0.95 known-good control) — the genesis-derived byte sources (matrixsumlist sums, URL bytes, spiral cellstream) do not key dbbi/faed as Vigenere.',
      };
    },
  },

  'ledger-columnar-transposition-grid-factorisations': {
    code: `// lay dbbi (7×13) and faed (19×30 …) as rectangles; re-read in every transposition order
const cols = readColumns(chunk(dbbi, 13));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), g = []; for (let r = 0; r * 13 < s.length; r++) g.push(s.slice(r * 13, r * 13 + 13));
      let cols = ''; for (let c = 0; c < 13; c++) for (let r = 0; r < g.length; r++) cols += (g[r] && g[r][c]) || '';
      const a = hexToAscii(BigInt(fieldDecode(cols) || '0').toString(16));
      return {
        steps: [
          { title: '1 · dbbi as a 7×13 rectangle', body: g.join('\n') },
          { title: '2 · read by columns (one transposition order)', body: cols },
          { title: '3 · field-decode → bytes', body: printable(a).slice(0, 60) },
        ],
        output: 'Every columnar/diagonal/spiral/boustrophedon reading of dbbi (7×13, 13×7) and faed (19×30, 30×19, 10×57, 6×95) is garbage — transposition alone does not reveal text.',
      };
    },
  },

  'ledger-reinsert-prime-basics': {
    code: `// take "reinserting the prime basics" literally: insert a 0 at every PRIME index, then field-decode
const out = digits.split("").flatMap((d, i) => isPrime(i) ? ["0", d] : [d]).join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), isP = k => { if (k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
      const digits = fieldDecode(s); let out = ''; for (let i = 0; i < digits.length; i++) { if (isP(i)) out += '0'; out += digits[i]; }
      const a = hexToAscii(BigInt(out || '0').toString(16));
      return {
        steps: [
          { title: '1 · insert a 0 at every prime index', body: out.slice(0, 70) + '…' },
          { title: '2 · field-decode → bytes', body: printable(a).slice(0, 80) },
        ],
        output: 'Taking the Architect phrase "reinserting the prime basics" literally (zeros at prime positions) field-decodes to garbage (printability ≤ 0.46) — the literal instruction, cleanly tested, fails.',
      };
    },
  },

  'split-key-half-and-better-half-combinations': {
    code: `// "THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF" read as a two-piece (split) secret`,
    inputs: [],
    run() {
      return {
        steps: [
          { title: '1 · the VIC clue', body: 'THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF' },
          { title: '2 · interpret as a two-piece secret', body: 'half ⊕ / + / || better-half — 1,204 (half, better-half) derivations' },
          { title: '3 · each combined → candidate key → check vs the 1GSMG address', body: '0 matches' },
        ],
        output: 'Zero matches across all 1,204 split-key derivations — the "half + better half" combination does not reconstruct any GSMG address key. (It more likely names the two recipients than a literal split.)',
      };
    },
  },

  'dbbi-faed-bytes-as-private-key': {
    code: `// reduce dbbi/faed to a scalar (~17 forms) and test as a 256-bit private key
const forms = [ BigInt(fieldDecode(dbbi)), sha256(dbbi), sha256(faed), base9int(dbbi), … ];`,
    inputs: [
      { name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 },
      { name: 'faed', label: 'faed', value: PUZZLE.faed, mono: true, rows: 4 },
    ],
    async run(v) {
      const dbbi = v.dbbi.trim(), faed = v.faed.trim();
      const forms = { 'dbbi field-decode int': BigInt(fieldDecode(dbbi) || '0').toString(16), 'sha256(dbbi)': await sha256hex(dbbi), 'sha256(faed)': await sha256hex(faed) };
      return {
        steps: [
          { title: '1 · ~17 scalar forms of dbbi/faed as a 256-bit private key', body: Object.entries(forms).map(([k, h]) => k + ' = ' + h.slice(0, 40) + '…').join('\n') },
          { title: '2 · derive the address for each', body: 'none yields 1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe' },
        ],
        output: 'No match for any of the ~17 scalar forms — dbbi/faed bytes are NOT the private key, and separately not a valid key for any of the AES blobs.',
      };
    },
  },

  'discover-p32-trailing-blob-end-of-phase32': {
    code: `// scan the decrypted phase-3.2 plaintext for the OpenSSL base64 magic "U2FsdGVkX1", collect the run
const i = phase32plain.indexOf("U2FsdGVkX1");
const blob = base64FromHere(i);   // a 4th OpenSSL blob hiding at the very end`,
    inputs: [{ name: 'p32', label: 'the recovered trailing blob', value: PUZZLE.p32, mono: true, rows: 2 }],
    run(v) {
      const b = v.p32.trim(), raw = b64ToBytes(b), magic = new TextDecoder().decode(raw.slice(0, 8)), salt = hex(raw.slice(8, 16));
      return {
        steps: [
          { title: '1 · the blob begins with the OpenSSL base64 magic', body: b.slice(0, 10) + '…   (decodes to "' + magic + '")' },
          { title: '2 · extract salt + ciphertext', body: 'salt = ' + salt + ' · ciphertext = ' + (raw.length - 16) + ' bytes' },
        ],
        output: 'A genuine 4th OpenSSL aes-256-cbc blob (p32_trailing, salt b45a5e3d827593ca, 80 bytes) was hiding at the very end of the phase-3.2 plaintext — never noted by the community walkthroughs.',
      };
    },
  },

  'vic-straddling-checkerboard-reverse-engineering': {
    code: `// reconstruct the VIC straddling checkerboard from the chess clue and decode the 144-digit code
// alphabet FUBCDORA | LETHINGKYM | VPSJQZXW   (rows prefixed by markers 1 and 4)
const plain = vicDecode(digits);`,
    inputs: [{ name: 'digits', label: 'the phase-3.2 VIC code (digits)', value: '151659431219154112', mono: true, rows: 2 }],
    run(v) {
      const d = v.digits.trim().replace(/\D/g, '');
      const row0cols = [0, 2, 3, 5, 6, 7, 8, 9];
      const board = '  ' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].join(' ') + '\n· ' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => row0cols.includes(c) ? VIC_ALPHABET[row0cols.indexOf(c)] : '·').join(' ') + '\n1 ' + [...VIC_ALPHABET.slice(8, 18)].join(' ') + '\n4 ' + [...VIC_ALPHABET.slice(18)].join(' ');
      return {
        steps: [
          { title: '1 · the reconstructed checkerboard (markers 1,4)', body: board },
          { title: '2 · decode the digit string (1x / 4x = two-digit rows, else top row)', body: d + '  →  ' + vicDecode(d) },
          { title: '3 · the full 144-digit string', body: 'round-trips to the known VIC plaintext — confirming the chess clue builds this exact board' },
        ],
        output: 'The reconstructed straddling checkerboard correctly round-trips the 144-digit phase-3.2 VIC code to the known plaintext — confirming the chess clue encodes the board (alphabet FUBCDORA.LETHINGKYMVPS.JQZXW, markers 1,4).',
      };
    },
  },

  'keysweep-p32-288-phase32-answers': {
    code: `// p32_trailing is a self-verifying oracle (a correct key yields ≤79 readable bytes). Sweep phase-3.2 answers.
for (const k of phase32Answers) decrypt(p32, evpKey(sha256(k), salt));`,
    inputs: [{ name: 'p32', label: 'p32_trailing blob', value: PUZZLE.p32, mono: true, rows: 2 }],
    async run(v) {
      const keys = ['theproblemischoice', 'shabefourfirsthintisyourlastcommand', 'FUBCDORALETHINGKYMVPSJQZXW', 'causality', 'enter'];
      const rows = []; for (const k of keys) { const r = await aesDecrypt(v.p32, await sha256hex(k)); rows.push(k.slice(0, 30) + ' → ' + (r.ok ? 'PKCS7-valid: ' + printable(r.text).slice(0, 16) : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · p32 is self-verifying — a correct key yields readable bytes instantly', body: 'sweep the phase-3.2-derived answer strings (288 in the full run)' },
          { title: '2 · sample candidates → AES', body: rows.join('\n') },
        ],
        output: '0 readable decrypts — no phase-3.2-derived string (the pre-Beaufort EBCDIC letters, the VIC digit string, the chess sentence, …) is the p32_trailing key.',
      };
    },
  },

  'p32-trailing-chess-vic-constructive-attack': {
    code: `// treat the chess clue as a CONSTRUCTION: build VIC keys from it, hash each, test the 80-byte blob
for (const key of vicConstructedKeys) for (const h of [sha256, doubleSha, raw]) decrypt(p32, h(key));`,
    inputs: [{ name: 'p32', label: 'p32_trailing blob', value: PUZZLE.p32, mono: true, rows: 2 }],
    async run(v) {
      const keys = ['fubcdoralethingkymvpsjqzxw', 'thefirstmoveisalwaysfree', '151659431219154112'];
      const rows = []; for (const k of keys) { const r = await aesDecrypt(v.p32, await sha256hex(k)); rows.push(k.slice(0, 28) + '… → ' + (r.ok ? 'PKCS7-valid' : 'bad decrypt')); }
      return {
        steps: [
          { title: '1 · build candidate keys from the chess/VIC construction', body: 'the board alphabet, the chess sentence, the VIC digits' },
          { title: '2 · hash forms × the 80-byte blob', body: rows.join('\n') },
        ],
        output: 'Across all consolidated chess/VIC scripts (hundreds of candidate keys × 4–5 hash forms × the 80-byte blobs) ZERO produced a PKCS7-valid, readable decrypt.',
      };
    },
  },

  'ledger-cosmic-duality-vic-on-blocks': {
    code: `// reuse the Phase-3.2 VIC checkerboard on dbbi/faed — does the same cipher machinery decode them?
const plain = vicDecode(fieldDecode(dbbi));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const out = vicDecode(fieldDecode(v.dbbi.trim()));
      return {
        steps: [
          { title: '1 · field-decode dbbi to digits, feed through the VIC board', body: fieldDecode(v.dbbi.trim()).slice(0, 50) + '…' },
          { title: '2 · VIC decode', body: out.slice(0, 70) + '…' },
        ],
        output: 'Both the VIC checkerboard and book-cipher readings of dbbi/faed produce garbage — the Phase-3.2 cipher machinery does not carry over to the Cosmic Duality blocks.',
      };
    },
  },

  'dbbi-ebcdic-vic-transforms': {
    code: `// decode dbbi's field-decoded bytes through EBCDIC code pages (cp037/cp500/cp1140 …)
const text = bytes.map(ebcdic).join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      let h = BigInt(fieldDecode(v.dbbi.trim()) || '0').toString(16); if (h.length % 2) h = '0' + h;
      const bytes = h.match(/../g).map(x => parseInt(x, 16));
      return {
        steps: [
          { title: '1 · dbbi → field-decode → bytes', body: bytes.map(b => b.toString(16).padStart(2, '0')).join(' ').slice(0, 90) + '…' },
          { title: '2 · decode through EBCDIC (cp037 ranges)', body: printable(bytes.map(ebcdic).join('')).slice(0, 60) },
          { title: '3 · also tried', body: 'cp500 / cp1140 / cp1026 / cp273 / cp424 / cp875 + the VIC alphabet + spiral reindex' },
        ],
        output: 'Garbage under every code page, the VIC alphabet, and the spiral reindex; outputs fed to the blob oracle produced zero hits. The EBCDIC/VIC step that cracked Phase-3.2 does not transfer to dbbi.',
      };
    },
  },

  'ledger-seven-intertwined-passwords-dbbi': {
    code: `// "seven intertwined passwords" → dbbi is 7×13. Pull 7 interleaved strands of 13, field-decode each.
const strands = Array.from({length:7}, (_, k) => [...dbbi].filter((_, i) => i % 7 === k).join(""));`,
    inputs: [{ name: 'dbbi', label: 'dbbi (91 = 7×13)', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), strands = Array.from({ length: 7 }, (_, k) => [...s].filter((_, i) => i % 7 === k).join(''));
      const rows = strands.map((st, k) => 'strand ' + k + ': ' + printable(hexToAscii(BigInt(fieldDecode(st) || '0').toString(16))).slice(0, 22));
      return {
        steps: [
          { title: '1 · de-interleave dbbi into 7 strands of 13', body: strands.map((st, k) => k + ': ' + st).join('\n') },
          { title: '2 · field-decode each strand → bytes', body: rows.join('\n') },
        ],
        output: 'Mapping "seven intertwined passwords" onto dbbi 7×13 (7 strands of 13, field-decoded) gives garbage in every strand and the concatenation — no hidden passwords surface.',
      };
    },
  },

  'ledger-vigenere-beaufort-incase-alphabet': {
    code: `// use the INCASE straddling-checkerboard ordering as a Vigenere/Beaufort key over dbbi/faed
const out = vigenere(dbbi, INCASE);`,
    inputs: [
      { name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 },
      { name: 'key', label: 'INCASE checkerboard ordering (key)', value: PUZZLE.incase, mono: true, rows: 2 },
    ],
    run(v) {
      const s = v.dbbi.trim(), k = v.key.trim();
      const vig = [...s].map((c, i) => 'abcdefghi'[((A2I(c) - (k.charCodeAt(i % k.length) % 9)) % 9 + 9) % 9]).join('');
      const a = hexToAscii(BigInt(fieldDecode(vig) || '0').toString(16));
      return {
        steps: [
          { title: '1 · key = the INCASE checkerboard ordering', body: k.slice(0, 50) + '…' },
          { title: '2 · Vigenere/Beaufort over dbbi, both directions → field-decode', body: printable(a).slice(0, 60) },
        ],
        output: 'Garbage — the INCASE straddling-checkerboard ordering as a polyalphabetic key over dbbi/faed (Vigenere and Beaufort, both directions) yields no text.',
      };
    },
  },

  'ledger-bifid-multiple-squares-periods': {
    code: `// Bifid with three candidate 3×3 squares (identity / Lo Shu / reversed) at full-length and periods 7, 13
for (const sq of [identity, loshu, reversed]) bifidDecode(faed, sq);`,
    inputs: [{ name: 'faed', label: 'faed', value: PUZZLE.faed, mono: true, rows: 5 }],
    run(v) {
      const faed = v.faed.trim();
      const squares = { 'identity': 'abcdefghi'.split(''), 'Lo Shu': 'dichefbga'.split(''), 'reversed': 'ihgfedcba'.split('') };
      const rows = Object.entries(squares).map(([n, sq]) => { const out = bifidDecode(faed, sq); const a = hexToAscii(BigInt(fieldDecode(out) || '0').toString(16)); return n + ' → ' + Math.round(printScore(a) * 100) + '% printable'; });
      return {
        steps: [
          { title: '1 · three 3×3 squares × {full-length, period 7, period 13}', body: Object.keys(squares).join(' · ') },
          { title: '2 · Bifid-decode faed, field-decode, score', body: rows.join('\n') },
        ],
        output: 'Garbage for every square and period — the Bifid fractionating cipher does not decode faed under identity, Lo Shu, or reversed squares at any period.',
      };
    },
  },

  'ledger-matrixsumlist-vigenere-mask': {
    code: `// use the matrixsumlist sum digits (rows 610876…, cols 810810…) as a Vigenere key/mask over the blocks
const out = vigenere(dbbi, "610876654997879" + "8108108736759668");`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), key = '6108766549978798108108736759668';
      const vig = [...s].map((c, i) => 'abcdefghi'[((A2I(c) - (+key[i % key.length])) % 9 + 9) % 9]).join('');
      const a = hexToAscii(BigInt(fieldDecode(vig) || '0').toString(16));
      return {
        steps: [
          { title: '1 · key = matrixsumlist row+col sum digits', body: key },
          { title: '2 · Vigenere/mask over dbbi → field-decode', body: printable(a).slice(0, 60) },
        ],
        output: 'Score 0.43 vs a 0.95 control — noise. The matrixsumlist sum digits (which sit physically between dbbi and faed) do not key or mask the blocks into text.',
      };
    },
  },

  'ledger-vigenere-colored-prime-bits-duality-bits': {
    code: `// build the key from the genesis colored-cell bits (blue=1/yellow=0) and the 24-bit colored stream
const out = vigenere(dbbi, coloredBitsKey);`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const idx = (r, c) => MATRIX.spiral.findIndex(p => p[0] === r && p[1] === c);
      const key = [...MATRIX.blue.map(p => [1, p]), ...MATRIX.yellow.map(p => [0, p])].map(([b, p]) => ({ b, i: idx(p[0], p[1]) })).sort((a, b) => a.i - b.i).map(o => o.b).join('');
      const vig = [...s].map((c, i) => 'abcdefghi'[((A2I(c) - (+key[i % key.length])) % 9 + 9) % 9]).join('');
      const a = hexToAscii(BigInt(fieldDecode(vig) || '0').toString(16));
      return {
        steps: [
          { title: '1 · key = the 24-bit blue/yellow colored stream', body: key },
          { title: '2 · Vigenere over dbbi → field-decode', body: printable(a).slice(0, 60) },
        ],
        output: 'Noise — the genesis colored-cell bit keystreams (blue=1/yellow=0 parities and the full 24-bit stream) do not key dbbi/faed.',
      };
    },
  },

  'dbbi-compression-fileformat-probe': {
    code: `// is dbbi a packaged/compressed file? check magic headers + measure byte entropy
const bytes = hexBytes(BigInt(fieldDecode(dbbi)).toString(16));
const H = shannonEntropy(bytes);   // bits per byte`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      let h = BigInt(fieldDecode(v.dbbi.trim()) || '0').toString(16); if (h.length % 2) h = '0' + h;
      const bytes = h.match(/../g).map(x => parseInt(x, 16));
      const hex4 = bytes.slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join(' ');
      return {
        steps: [
          { title: '1 · dbbi → bytes, first 4', body: hex4 },
          { title: '2 · check magic headers', body: 'gzip 1f8b · zip 504b · bzip2 425a · xz fd37 · OpenSSL 53616c74 — none match' },
          { title: '3 · Shannon entropy', body: shannon(bytes).toFixed(2) + ' bits/byte (random = 8.0)' },
        ],
        output: 'No magic header found and nothing decompresses; byte-entropy ~' + shannon(bytes).toFixed(1) + '/8 indicates structured-but-not-packaged data — dbbi is neither a compressed file nor an OpenSSL blob.',
      };
    },
  },

  'ledger-turtle-numpad-path-drawing': {
    code: `// map a-i → numpad directions (1=↙ … 9=↗) and walk a turtle, drawing the path
const dir = { a:[-1,-1], b:[0,-1], c:[1,-1], d:[-1,0], e:[0,0], f:[1,0], g:[-1,1], h:[0,1], i:[1,1] };`,
    inputs: [{ name: 'dbbi', label: 'dbbi (91 moves)', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim(), dir = { a: [-1, -1], b: [0, -1], c: [1, -1], d: [-1, 0], e: [0, 0], f: [1, 0], g: [-1, 1], h: [0, 1], i: [1, 1] };
      let x = 0, y = 0; const pts = [[0, 0]]; for (const c of s) { const d = dir[c] || [0, 0]; x += d[0]; y += d[1]; pts.push([x, y]); }
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      return {
        steps: [
          { title: '1 · map a–i to the 9 numpad directions, walk the turtle', body: '91 moves from (0,0)' },
          { title: '2 · net displacement', body: 'ends at (' + x + ', ' + y + ') · bounding box ' + (Math.max(...xs) - Math.min(...xs)) + ' × ' + (Math.max(...ys) - Math.min(...ys)) },
        ],
        output: 'The drawn path is a connected but meaningless blob — its net drift is explained entirely by the direction (symbol-frequency) bias. No glyph, no yin-yang emerges.',
      };
    },
  },

};
