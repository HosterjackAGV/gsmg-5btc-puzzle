// labs/harness.js — shared, real, in-browser crypto + decode engine for the interactive labs.
// Everything runs on the GENUINE puzzle artifacts below (Web Crypto: EVP_BytesToKey + AES-CBC).
// No faking — these are the same bytes the walkthrough decrypts.

export const BLOBS = {
  cosmic:      { label: 'Cosmic Duality (the prize, 1328 B)', salt: '2d3f6fe06dc950e6', b64: 'U2FsdGVkX18tP2/gbclQ5tNZuD4shoV3axuUd8J8aycGCAMoYfhZK0JecHTDpTFedGJh4SJIP66qRtXvo7PTpvsIjwO8prLiC/sNHthxiGMuqIrKoO224rOisFJZgARic7PaJPne4nab8XCFuV3NbfxGX2BUjNkef5hg7nsoadZx08dNyU2b6eiciWiUvu7DSATSFO7IFBiAMz7dDqIETKuGlTAP4EmMQUZrQNtfbJsURATW6V5VSbtZB5RFk0O+IymhstzrQHsU0Bugjv2nndmOEhCxGi/lqK2rLNdOOLutYGnA6RDDbFJUattggELh2SZx+SBpCdbSGjxOap27l9FOyl02r0HU6UxFdcsbfZ1utTqVEyNs91emQxtpgt+6BPZisil74Jv4EmrpRDC3ufnkmWwR8NfqVPIKhUiGDu5QflYjczT6DrA9vLQZu3kok+/ZurtRYnqqsj49UhwEF9GfUfl7uQYm0UunatW43C3Z1tyFRGAzAHQUFS6jRCd+vZGyoTlOsThjXDDCSAwoX2M+yM+oaEQoVvDwVkIqRhfDNuBmEfi+HpXuJLPBS1PbUjrgoG/Uv7o8IeyST4HBv8+5KLx7IKQS8f1kPZ2YUME+8XJx0caFYs+JS2Jdm0ojJm3JJEcYXdKEzOQvRzi4k+6dNlJ05TRZNTJvn0fPG5cM80aQb/ckUHsLsw9a4WzhHsrzBQRTIhog9sTm+k+LkXzIJiFfSzRgf250pbviFGoQaIFl1CTQPT2w29DLP9006bSiliywwnxXOor03Hn+7MJL27YxeaGQn0sFGgP5X0X4jm3vEBkWvtF4PZl0bXWZLvVL/zTn87+2Zi/u7LA6y6b2yt7YVMkpheeOL0japXaiAf3bSPeUPGz/eu8ZX/NnO3259hG1XwoEVcGdDBV0Nh0A4/phPCR0x5BG04U0OeWAT/5Udc/gGM0TT2FrEzs/AJKtmsnj31OSsqWb9wD+CoduYY2JrkzJYihE3ZcgcvqqffZXqxQkaI/83ro6JZ4Pubml0PUnAnkdmnBCpbClbZMzmo3ELZ0EQwsvkJFDMQmiRhda4nBooUW7zXOIb7WxbE9THrt3cdZP5uAgVfgguUNE4fZMN8ATEDhdSsLklJe2GvihKuZVA6uuSkWAsK6uMGo76xpPwYs3eUdLjtANS83a6/F/fhkX1GXs7zbQjh+Inzk8jhEdEogl9jPs/oDjKjbkUpFlsCWwAZGoeKlmX7c4OGuD5c+FEH+2nYHvYl8y1E/K5SDt9Uocio8XuxbDZOzhw7LMSGkD1MZxpDzsCZY1emkSNd88NFj+9U8VssIDDVMYwKMsHKfjc0x5OlzQ1f6ST0xCkwydDHHGRKKxFC4y6H6fV9sgf9OPK/65z94Rx72+mfvTyizShjxYSRplsH9otU4parl8roD0KsVTfXZoYrYXzK6cXBn1BO/OEqWlu++Dd9MiGaUGKd22fXERqNWoRAKlNn2b6EehD2D8WaAoliPURjkB0Lb/FpP9unI93Twg6NxBXAj734nctukRb3kE08RydJV70eJsvEftF5hbED4HacGx9pzisaSz6t9AKiuSoF6uoCtlTIYatyfZkQA4wg50hAJqTynOQ09ArRHEchtB/7uvWZSBGJ7+zlzRGKx99P3oDZD+Y5D8bmUs3PV6FnAp+IRSlnsQ6hChkwBoQUcngcfGSkBRvmGjsGercCetRRwBOfh9fbX2ruw4mzRYrGnz9eBtepkJXDRjD6yvhNfQMCSkm6l9zMWxKvFbv5g2ae2SLrEt/x3MP2/G' },
  salph_inner: { label: 'salph_inner (self-verifying oracle, 80 B)', salt: '3ab585348552415d', b64: 'U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4KUWnWkCvoZSxbRD3wNsGWVHefvdrd9zQvX0t8v3jPB4okpspxebRi6sE1BMl5HI8Rku+KejUqTvdWOX6nQjSpepXwGuN/jJ' },
  p32_trailing:{ label: 'p32_trailing (self-verifying oracle, 80 B)', salt: 'b45a5e3d827593ca', b64: 'U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46zgKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4' },
  phase2:      { label: 'Phase 2 (SOLVED — opens with "causality")', salt: '06286612d43ed7ed', b64: 'U2FsdGVkX18GKGYS1D7X7VjxWz6uUyPFszr8dVvtOIrJqioWHgT69JJnzJGDVOvFQYWh5BEZxFPXmMq1cbyy3dVVDgLhF050xlDy2J5grtKw9jUOO4oFNRgoD+1dlukXpd8ccg++kkXgE9mGBP6lQbukDiSjY4mnR2Mv6ydIncrRqacQNVEmEgM4fGTi1ANznHsGn7mP+P3UyrJCRbuFmpZJc4CNdPj6YuxwR4HkHkqcfxh0L5CaEu4VbY70+fmkqgZQyMJqiUlaV9KC4UPuRVj0r7MYbVRazkhsjeIcogmdJGEeBwD47lEB7X9PNKWmojTvRZg6R+sZzRZE26VLaF+s9cpTo4Y8PZUxKvQ86HXC8QIavUgDfw7HxIxkTatvCW2yq3ZOXl5naR6oSNxdX9alyhTzB+/2623oGdlWev5Oo8xHJqUi7QjVP+mNC8BA+Cg0DJwcOFGO5K7g8Rm06+sLogwntdIgTo70X3FegAtipHboeUNKefiAguvkDoIf8iMPc+83PygvlZPDNQCOKugwDEUimhHwQrMsmalRNoFEQEb+ZIC+na15cPoRAlODNJfXIJ96ihAy9wWis39mQW6JFqZmUags4xoP3lJ35bCrXsNOPFZ4WH+f4YC/Ov8CQW5bjtxno8GG4b/wBWevhcRVMK6KmRJj8NBCssnrlz0sQ70rMNkiN2wiSPcwX3AdJgLs8vQAUM59x9fkKFFzD4+Sc1sJztUTB7CMGGfpZOA8W33VZnEdmGcoaHlDsR8GvAkZ+jg+QJs9ZNHqWE1+1zgm/6NsWWgWH8OI2PPCfXHxDbfDk8uD/Zibr/yjSKvuSb8OecflOT2hw37WL49uADgeWgnp2bzkfGIq7EYS7OImjZZwY5h4sfcPfhvQ9kOV' },
};

export const PUZZLE = {
  dbbi: 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe',
  faed: 'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic',
  incase: 'INCASEYOUMANAGETOCRACKTHISTHEPRIVATEKEYSBELONGTOHALFANDBETTERHALFANDTHEYALSONEEDFUNDSTOLIVE',
  matrixsumlist: '6108766549978798108108736759668',
  lastwords: 'lastwordsbeforearchichoice',
};

// ---- primitives ----
export const b64ToBytes = (b) => Uint8Array.from(atob(String(b).replace(/\s+/g, '')), c => c.charCodeAt(0));
export const concat = (...a) => { const n = a.reduce((s, x) => s + x.length, 0), o = new Uint8Array(n); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
export const hex = (u) => [...u].map(b => b.toString(16).padStart(2, '0')).join('');
export const enc = (s) => new TextEncoder().encode(s);
export const dig = async (algo, u) => new Uint8Array(await crypto.subtle.digest(algo, u));      // algo: SHA-256/SHA-1/SHA-512
export const sha256hex = async (s) => hex(await dig('SHA-256', enc(s)));
export const printable = (s) => [...s].map(ch => { const c = ch.charCodeAt(0); return (c >= 32 && c < 127) ? ch : '·'; }).join('');
export const printScore = (s) => { if (!s.length) return 0; let p = 0; for (const c of s) { const x = c.charCodeAt(0); if ((x >= 32 && x < 127) || x === 10) p++; } return p / s.length; };
export const isWIF = (s) => /(^|[^A-HJ-NP-Za-km-z1-9])[5KL][1-9A-HJ-NP-Za-km-z]{50,51}([^A-HJ-NP-Za-km-z1-9]|$)/.test(s);
export const A2I = (c) => 'abcdefghi'.indexOf(c) + 1;
export const ic = (s) => { const f = {}; for (const c of s) f[c] = (f[c] || 0) + 1; const N = s.length; let n = 0; for (const k in f) n += f[k] * (f[k] - 1); return N > 1 ? n / (N * (N - 1)) : 0; };
export const hexToAscii = (h) => (h.length % 2 ? '0' + h : h).match(/../g).map(x => String.fromCharCode(parseInt(x, 16))).join('');

// EVP_BytesToKey(digest) — the OpenSSL KDF — then AES-CBC decrypt. digest defaults to SHA-256, keyBits to 256.
export async function aesDecrypt(blobB64, opensslPw, opts = {}) {
  const algo = opts.digest || 'SHA-256', keyLen = (opts.keyBits || 256) / 8, ivLen = 16;
  const raw = b64ToBytes(blobB64), salt = raw.slice(8, 16), ct = raw.slice(16), pw = enc(opensslPw);
  let D = new Uint8Array(0), prev = new Uint8Array(0);
  while (D.length < keyLen + ivLen) { prev = await dig(algo, concat(prev, pw, salt)); D = concat(D, prev); }
  const name = { 128: 'AES-CBC', 192: 'AES-CBC', 256: 'AES-CBC' }[opts.keyBits || 256];
  try {
    const key = await crypto.subtle.importKey('raw', D.slice(0, keyLen), { name }, false, ['decrypt']);
    const pt = new Uint8Array(await crypto.subtle.decrypt({ name, iv: D.slice(keyLen, keyLen + ivLen) }, key, ct));
    return { ok: true, bytes: pt, text: new TextDecoder().decode(pt) };
  } catch { return { ok: false, bytes: null, text: '' }; }
}

// derive the OpenSSL password from an answer, by the puzzle's conventions
export async function pwForm(answer, form) {
  if (form === 'raw') return answer;
  if (form === 'sha256hex') return await sha256hex(answer);                 // the puzzle convention
  if (form === 'double') return await sha256hex(await sha256hex(answer));
  return answer;
}
