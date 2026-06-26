// config.js — site + community configuration.
// The community features are GitHub-native. Comments use giscus (GitHub
// Discussions). After you enable Discussions on the repo and install the giscus
// app, fill in repoId + categoryId from https://giscus.app and flip `configured`.
// See docs/COMMUNITY-SETUP.md.

export const CONFIG = {
  repo: 'HosterjackAGV/gsmg-5btc-puzzle',
  branch: 'main',

  giscus: {
    configured: false,          // ← set true once the two IDs below are filled
    repo: 'HosterjackAGV/gsmg-5btc-puzzle',
    repoId: '',                 // from giscus.app
    category: 'Doors',          // a Discussions category you create
    categoryId: '',             // from giscus.app
    theme: 'transparent_dark',
  },
};

export const issueUrl = (label, title, body) =>
  `https://github.com/${CONFIG.repo}/issues/new?labels=${encodeURIComponent(label)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;

export const apiBase = `https://api.github.com/repos/${CONFIG.repo}`;
