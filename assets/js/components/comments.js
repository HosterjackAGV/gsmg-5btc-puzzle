// components/comments.js — per-door comments via giscus (GitHub Discussions).
// If giscus isn't configured yet (content/config.js), shows a tidy setup note
// instead of breaking, so the rest of the page works regardless.

import { CONFIG, issueUrl } from '../../../content/config.js';
import { qs } from '../util.js';

export function commentsWidget(term, label = 'Discuss this door') {
  const g = CONFIG.giscus;
  const html = `<div class="note key"><h4>💬 ${label}</h4>
    <div id="giscus-host"></div>
    ${g.configured ? '' : `<p class="muted">Community comments use <b>GitHub Discussions</b> (giscus). The repo owner enables them once — see <a href="https://github.com/${CONFIG.repo}/blob/${CONFIG.branch}/docs/COMMUNITY-SETUP.md" target="_blank" rel="noopener">COMMUNITY-SETUP.md</a>. Until then, drop findings in an <a href="${issueUrl('discussion', 'note: ' + term, 'Re: ' + term + '\\n\\n')}" target="_blank" rel="noopener">issue</a>. Golden rule: <b>verified findings only, all negatives documented.</b></p>`}
  </div>`;

  function mount(root) {
    if (!g.configured || !g.repoId || !g.categoryId) return;
    const host = qs('#giscus-host', root);
    if (!host) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true; s.crossOrigin = 'anonymous';
    s.setAttribute('data-repo', g.repo);
    s.setAttribute('data-repo-id', g.repoId);
    s.setAttribute('data-category', g.category);
    s.setAttribute('data-category-id', g.categoryId);
    s.setAttribute('data-mapping', 'specific');
    s.setAttribute('data-term', term);
    s.setAttribute('data-strict', '1');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', g.theme || 'transparent_dark');
    s.setAttribute('data-lang', 'en');
    host.appendChild(s);
  }

  return { html, mount };
}
