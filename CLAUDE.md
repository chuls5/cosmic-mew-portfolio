# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

Static, single-page developer portfolio. Vanilla JS modules + Three.js, built with **Vite**. Deployed to GitHub Pages via Actions.

- [index.html](index.html) — Vite entry; references `/src/main.js`
- [src/main.js](src/main.js) — imports the stylesheet and wires up all `initFoo()` features
- [src/](src/) — JS organized by feature: `ui/` (theme, nav, cursor, modal, …), `repos/` (api + render), `blog/` (posts, markdown, visuals, render), plus `scene.js`, `config.js`, `utils.js`
- [src/styles/](src/styles/) — CSS split into `base / layout / components / features / responsive` and combined by `main.css` via `@import`

## Run

Requires Node 20+.

```bash
npm install
npm run dev       # http://localhost:5173 with HMR
npm run build     # → dist/
npm run preview   # serve dist/ locally
npm run format    # prettier
```

No tests.

## Architecture notes worth knowing before editing

**The single config knob is [src/config.js](src/config.js).** `GITHUB_USERNAME`, cache TTL, and the hero typing phrases all live there. Most other modules import from it. Resist adding things to this file unless they're genuinely fork-tunable.

**`base: '/cosmic-mew-portfolio/'` in [vite.config.js](vite.config.js) is load-bearing.** GH Pages serves under that subpath. Vite auto-prepends it to bundled `<script>`/`<link>` tags, but **NOT** to:
- Asset paths in HTML attributes (use `%BASE_URL%foo.png`, not `/foo.png`)
- `fetch()` calls in JS (use `` `${import.meta.env.BASE_URL}repos.json` ``)

If you add a new public-asset reference, follow those patterns or it will 404 in production while working in dev.

**Repo loading is a 4-tier fallback chain** ([src/repos/api.js](src/repos/api.js)). localStorage cache (key `gh_repos_v1`, 1h TTL) → GitHub API → `/public/repos.json` → hardcoded `FALLBACK_REPOS`. The GitHub API is unauthenticated (60 req/hr/IP), which is why caching is mandatory. Bump `CACHE_KEY` if the cached shape changes.

**Two modals share one helper.** [src/ui/modal.js](src/ui/modal.js) exports `createModal(overlayId, closeBtnId)` returning `{ open, close, overlay }`. It handles `inert` on `<main>`, body scroll lock, focus restoration to trigger, click-outside-to-close, and registers itself with a single global Escape listener. New modals should use this helper rather than re-implementing.

**The shared `revealObserver`** from [src/ui/reveal.js](src/ui/reveal.js) is the IntersectionObserver that drives `.reveal → .visible` fade-ups. Renderers that build cards dynamically (repos, blog) import it and call `.observe(card)` on new elements — keep that pattern, don't create a parallel observer.

**Blog posts are data + a visual key.** Add an entry to `BLOG_POSTS` in [src/blog/posts.js](src/blog/posts.js) with `visual: 'galaxy' | 'nebula' | 'binary' | 'wormhole' | 'pulsar' | 'orbit'`. Adding a new visual: write `animateFoo(ctx, W, H, reduced)`, register it in the `VISUALS` map in [src/blog/visuals.js](src/blog/visuals.js), wrap your draw loop with `runCanvasAnimation()` so it respects viewport visibility and `prefers-reduced-motion`.

**The markdown parser is intentionally minimal** ([src/blog/markdown.js](src/blog/markdown.js)): `# ## ###`, `-` lists, fenced ```code```, `**bold**`, `*em*`, `` `code` ``, `[link](url)`. No tables, blockquotes, images, nested lists. Anything else renders as a plain `<p>`.

**Animations respect `prefers-reduced-motion`** (canvas animations draw one static frame) and pause via `IntersectionObserver` when off-screen / Page Visibility API when the tab is hidden. Preserve this when adding new animations — `runCanvasAnimation` in visuals.js and the visibilitychange listener in [src/scene.js](src/scene.js) do it for you.

**XSS guards:** any string from the GitHub API or user-derived data must go through `escHtml` and `safeUrl` ([src/utils.js](src/utils.js)) before being interpolated into `innerHTML`. The README HTML from `api.github.com/repos/.../readme` is fetched with the `application/vnd.github.html+json` media type — GitHub pre-sanitizes it, so injecting it raw is safe.

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` on push to `main`. First-time setup requires **Settings → Pages → Source = "GitHub Actions"**. Asset filenames stay lowercase — Pages is case-sensitive.

## localStorage keys in use

- `theme` — `"nebula"` or `"default"`
- `gh_repos_v1` — `{ repos, ts }` GitHub API cache
