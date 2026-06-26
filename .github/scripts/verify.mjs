// Re-verifies submitted GSMG decrypt attempts by ACTUALLY running the crypto,
// then rebuilds data/attempts.jsonl + data/leaderboard.json.
// Trust nothing: a claimed "unlocked" only counts if AES padding truly validates here.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder(), dec = new TextDecoder();
const BLOBS = ['phase2','phase3','phase32','salphaseion','cosmic'];
const FRONTIER = new Set(['cosmic','salphaseion']);
const MAX_ATTEMPTS = 5000, MAX_RECIPE = 4096;

function concat(...a){let n=0;a.forEach(x=>n+=x.length);const o=new Uint8Array(n);let i=0;a.forEach(x=>{o.set(x,i);i+=x.length;});return o;}
function b64(b){return new Uint8Array(Buffer.from(b.replace(/\s+/g,''),'base64'));}
async function sha256(buf){return new Uint8Array(await subtle.digest('SHA-256',buf));}
async function sha256hex(s){return [...await sha256(enc.encode(s))].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function kdf(pw,salt){let d=new Uint8Array(0),o=new Uint8Array(0);while(o.length<48){d=await sha256(concat(d,pw,salt));o=concat(o,d);}return{key:o.slice(0,32),iv:o.slice(32,48)};}
async function tryDecrypt(blob,pass){
  const raw=b64(readFileSync('ciphertexts/'+blob+'.txt','utf8'));
  if(dec.decode(raw.slice(0,8))!=='Salted__')throw new Error('bad blob');
  const salt=raw.slice(8,16),ct=raw.slice(16);const {key,iv}=await kdf(enc.encode(pass),salt);
  const k=await subtle.importKey('raw',key,{name:'AES-CBC'},false,['decrypt']);
  await subtle.decrypt({name:'AES-CBC',iv},k,ct); return true; // throws on invalid padding
}
function readJSONL(p){ if(!existsSync(p))return []; return readFileSync(p,'utf8').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{try{return JSON.parse(l);}catch(e){return null;}}).filter(Boolean); }

function rebuild(solved){
  const all=readJSONL('data/attempts.jsonl');
  const byH=new Map();
  for(const a of all){const h=a.by||'anon';if(!byH.has(h))byH.set(h,{handle:h,tries:0,frontier:0,novel:0,last:0});const r=byH.get(h);r.tries++;if(a.frontier)r.frontier++;r.novel++;r.last=Math.max(r.last,a.ts||0);}
  const rows=[...byH.values()].sort((x,y)=>(y.frontier-x.frontier)||(y.novel-x.novel)||(y.tries-x.tries));
  const lb={updated:Math.floor(Date.now()/1000),solved:!!solved,rows,totals:{attempts:all.length,unique:all.length,frontier_unique:all.filter(a=>a.frontier).length,solvers:rows.length}};
  writeFileSync('data/leaderboard.json', JSON.stringify(lb,null,1));
  return lb;
}

let ev={}; try{ if(existsSync(process.env.GITHUB_EVENT_PATH||'')){ const t=readFileSync(process.env.GITHUB_EVENT_PATH,'utf8').trim(); if(t) ev=JSON.parse(t); } }catch(e){ ev={}; }
const issue = ev.issue||{}; const ghUser=(issue.user&&issue.user.login)||'unknown'; const body=issue.body||'';
const m = body.match(/```json\s*gsmg-attempts\s*([\s\S]*?)```/i) || body.match(/```json\s*([\s\S]*?)```/i);

let summary='', solved=false;
if(m){
  let parsed=null; try{parsed=JSON.parse(m[1].trim());}catch(e){}
  if(parsed){
    const handle=(String(parsed.handle||ghUser).slice(0,32).replace(/[^\w .\-]/g,''))||ghUser;
    const inA=Array.isArray(parsed.attempts)?parsed.attempts.slice(0,MAX_ATTEMPTS):[];
    const existing=readJSONL('data/attempts.jsonl'); const seen=new Set(existing.map(a=>a.id));
    let ok=0,dup=0,bad=0,unlocked=[]; const add=[];
    for(const a of inA){
      const blob=String(a.blob||''),recipe=String(a.recipe||'').slice(0,MAX_RECIPE),prehash=!!a.prehash;
      if(!BLOBS.includes(blob)||!recipe){bad++;continue;}
      const id=await sha256hex(blob+'|'+recipe+'|'+(prehash?'1':'0'));
      let result='fail'; try{const pass=prehash?await sha256hex(recipe):recipe; if(await tryDecrypt(blob,pass))result='unlocked';}catch(e){}
      if(result==='unlocked'){unlocked.push({blob,recipe});if(blob==='cosmic')solved=true;}
      if(seen.has(id)){dup++;continue;}
      seen.add(id); add.push({id,by:handle,gh:ghUser,blob,result,frontier:FRONTIER.has(blob),ts:Math.floor(Date.now()/1000)}); ok++;
    }
    if(add.length) writeFileSync('data/attempts.jsonl', existing.concat(add).map(o=>JSON.stringify(o)).join('\n')+'\n');
    summary=`**Verified ${ok} new attempt(s)** from \`${handle}\` (GitHub: @${ghUser}).\n\n- new & counted: **${ok}**\n- duplicates already logged: ${dup}\n- invalid/skipped: ${bad}\n`+
      (unlocked.length?`\n\u26a0\ufe0f **${unlocked.length} attempt(s) produced a VALID decryption.** If any are on \`cosmic\`, this is likely a SOLVE \u2014 a maintainer should confirm the recovered key.\n`:'');
    if(solved) writeFileSync('data/SOLVED.json', JSON.stringify({solved:true,when:Date.now(),by:handle,gh:ghUser,unlocked},null,1));
  } else summary='Could not parse the JSON block.';
} else summary='No `json gsmg-attempts` block found.';

const lb=rebuild(solved);
summary+=`\nLeaderboard rebuilt: ${lb.rows.length} contributors, ${lb.totals.frontier_unique} verified frontier attempts.`;
writeFileSync('verify-summary.txt', summary); console.log(summary);
