// content/site.js — site-wide service configuration.
//
// commentsUrl — the anonymous per-attempt comments endpoint. It's the SAME free Cloudflare Worker
// that powers the Snake scoreboard (worker/scoreboard-worker.js), at its `/comments` path. Comments
// are PERSISTED ON GITHUB (in a second file `comments.json` in the same Gist) so they're identical
// for every visitor — and the GitHub token lives ONLY on the Worker, never in the page, so no login
// is required and people can post under any name. Deploy the Worker once and paste <workerUrl>/comments
// here. Leave it empty to turn comments off (the form then shows "not connected yet").

export const SITE = {
  commentsUrl: 'https://scoreboard-worker.hosterjack.workers.dev/comments',
};
