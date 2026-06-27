// md.js — a tiny, dependency-free Markdown → HTML renderer for TRUSTED in-repo docs
// (the verified reference). Supports headings, bold/italic/code, code fences,
// blockquotes, GFM tables, ordered/unordered lists, horizontal rules and links.
// Text is HTML-escaped first, so it's safe for our own documents.

import { esc } from './util.js';

export const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/(^|[^*])\*([^*]+?)\*/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
  // autolink bare URLs (the Sources list) — the boundary class skips URLs already
  // inside an href="..." (preceded by a quote), so markdown links aren't double-wrapped
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
  return s;
}

const cells = (line) => line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
  let html = '', i = 0;

  const flushTable = (start) => {
    let j = start; const rows = [];
    while (j < lines.length && /^\s*\|/.test(lines[j])) { rows.push(lines[j]); j++; }
    const head = cells(rows[0]);
    const body = rows.slice(2); // row[1] is the |---|---| separator
    let t = '<table class="md-table"><thead><tr>' + head.map(h => `<th>${inline(h)}</th>`).join('') + '</tr></thead><tbody>';
    for (const r of body) t += '<tr>' + cells(r).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>';
    t += '</tbody></table>';
    html += t; return j;
  };

  const flushList = (start, ordered) => {
    let j = start; const items = [];
    const re = ordered ? /^\s*\d+\.\s+(.*)/ : /^\s*[-*]\s+(.*)/;
    while (j < lines.length && re.test(lines[j])) { items.push(lines[j].match(re)[1]); j++; }
    html += `<${ordered ? 'ol' : 'ul'}>` + items.map(it => `<li>${inline(it)}</li>`).join('') + `</${ordered ? 'ol' : 'ul'}>`;
    return j;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {                       // fenced code
      let j = i + 1, code = '';
      while (j < lines.length && !/^```/.test(lines[j])) { code += lines[j] + '\n'; j++; }
      html += `<pre class="md-pre"><code>${esc(code.replace(/\n$/, ''))}</code></pre>`;
      i = j + 1; continue;
    }
    if (/^\s*$/.test(line)) { i++; continue; }     // blank
    if (/^#{1,6}\s+/.test(line)) {                 // heading
      const lvl = line.match(/^(#{1,6})/)[1].length;
      const text = line.replace(/^#{1,6}\s+/, '').replace(/\s+#*\s*$/, '');
      html += `<h${lvl} id="${slugify(text)}">${inline(text)}</h${lvl}>`;
      i++; continue;
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { html += '<hr>'; i++; continue; } // hr
    if (/^\s*\|/.test(line)) { i = flushTable(i); continue; }   // table
    if (/^\s*>\s?/.test(line)) {                    // blockquote (consecutive)
      let j = i, q = '';
      while (j < lines.length && /^\s*>\s?/.test(lines[j])) { q += lines[j].replace(/^\s*>\s?/, '') + ' '; j++; }
      html += `<blockquote>${inline(q.trim())}</blockquote>`;
      i = j; continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) { i = flushList(i, true); continue; }  // ol
    if (/^\s*[-*]\s+/.test(line)) { i = flushList(i, false); continue; }  // ul

    // paragraph: gather until blank / block start
    let j = i, para = '';
    const stop = (l) => /^\s*$/.test(l) || /^(#{1,6}\s|```|\s*\||\s*>|\s*[-*]\s|\s*\d+\.\s|\s*(-{3,}|\*{3,}|_{3,})\s*$)/.test(l);
    while (j < lines.length && !stop(lines[j])) { para += (para ? ' ' : '') + lines[j].trim(); j++; }
    html += `<p>${inline(para)}</p>`;
    i = j;
  }
  return html;
}
