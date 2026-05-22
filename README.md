# 🌌 cosmic-mew-portfolio

A modular, GitHub Pages–deployable developer portfolio with a deep-space / astrophysics aesthetic. Vanilla JS + Three.js, built with Vite.

---

## Live Demo

**[chuls5.github.io/cosmic-mew-portfolio](https://chuls5.github.io/cosmic-mew-portfolio)**

---

## Features

- **Cosmic loading screen** — animated ✦ glyph with gradient progress bar
- **Three.js starfield + ringed planet** — 3,000-point `BufferGeometry`, slow drift rotation
- **Mini CSS solar system** in the hero
- **Glitch hero title** + cycling typing tagline
- **Skills section** ("Systems Online") with glassmorphism cards
- **GitHub Repos grid** — live from the API with a 4-tier fallback chain (cache → API → static JSON → hardcoded)
- **Scattered card layout** that straightens on hover
- **Project & blog modals** with markdown rendering and shared `inert`/focus handling
- **Blog ("Transmission Log")** — minimal markdown parser, 6 canvas thumbnail animations
- **Scroll-reveal** via `IntersectionObserver`
- **Theme toggle** (Default ↔ Nebula) persisted to `localStorage`
- **Custom cursor + sparkle trail** (pointer-fine devices only)
- **Accessible**: skip link, ARIA roles, focus-visible outlines, `prefers-reduced-motion` support

---

## Project Structure

```
cosmic-mew-portfolio/
├── index.html              # Vite entry — references /src/main.js
├── package.json
├── vite.config.js
├── public/                 # Served as-is at the site root
│   ├── assets/
│   └── repos.json          # Static repo fallback
├── src/
│   ├── main.js             # Imports CSS + initializes all features
│   ├── config.js           # Tunable knobs (GitHub username, cache TTL, tagline phrases)
│   ├── scene.js            # Three.js scene (planet + starfield)
│   ├── utils.js            # escHtml, safeUrl, fmt, formatDate
│   ├── ui/
│   │   ├── theme.js        # Theme toggle
│   │   ├── nav.js          # Hamburger, active section, scrolled state
│   │   ├── loader.js
│   │   ├── reveal.js       # Shared IntersectionObserver
│   │   ├── typing.js
│   │   ├── cursor.js
│   │   ├── back-to-top.js
│   │   └── modal.js        # createModal() — open/close/inert/focus helpers
│   ├── repos/
│   │   ├── api.js          # 4-tier fetch fallback chain
│   │   ├── render.js       # Cards, filter, project modal
│   │   └── fallback-data.js
│   ├── blog/
│   │   ├── posts.js        # BLOG_POSTS — edit to add a post
│   │   ├── markdown.js     # Minimal markdown parser
│   │   ├── visuals.js      # Canvas thumbnail animations (galaxy, nebula, …)
│   │   └── render.js
│   └── styles/
│       ├── main.css        # @imports the rest
│       ├── base.css        # Variables, reset, theme, .reveal, reduced motion
│       ├── layout.css      # Navbar, hero, sections, about, contact, footer
│       ├── components.css  # Cards, modals, filters, buttons, blog
│       ├── features.css    # Loader, cursor, mini solar system
│       └── responsive.css  # Mobile @media
└── .github/workflows/
    └── deploy.yml          # Builds + publishes dist/ to GitHub Pages
```

---

## Quick Start

Requires **Node 20+**.

```bash
npm install
npm run dev       # http://localhost:5173 with hot reload
npm run build     # → dist/  (what gets deployed)
npm run preview   # serve dist/ locally to test the prod build
npm run format    # run Prettier
```

---

## Configuration

Edit [`src/config.js`](src/config.js):

```js
export const GITHUB_USERNAME = 'chuls5';
export const CACHE_TTL = 60 * 60 * 1000; // 1 hour
export const TYPING_PHRASES = [...];
```

Other things to update for a fork:
- Social links and featured project cards in [`index.html`](index.html)
- Featured project cards in `index.html` (`.mission-card.featured` blocks)
- Drop your `resume.pdf` in [`public/`](public/) and `mew-hero.png` (or your own) in [`public/assets/`](public/assets/)

---

## Adding Content

**A new blog post** — append an entry to `BLOG_POSTS` in [`src/blog/posts.js`](src/blog/posts.js). Set `visual` to one of `galaxy | nebula | binary | wormhole | pulsar | orbit`. Markdown supports `# ## ###`, `- ` lists, fenced ```code```, `**bold**`, `*em*`, `` `code` ``, `[links](url)`.

**A new canvas visual** — add `animateMyThing(ctx, W, H, reduced)` to [`src/blog/visuals.js`](src/blog/visuals.js), register it in the `VISUALS` map, then set `visual: 'myThing'` on a post.

**A new UI feature** — drop a module under [`src/ui/`](src/ui/) exporting `initFoo()`, then call it from [`src/main.js`](src/main.js).

---

## GitHub API & Caching

The GitHub API allows **60 unauthenticated requests per hour** per IP. The site uses a 4-tier fallback:

```
localStorage cache (1h TTL)  →  GitHub API  →  /repos.json  →  hardcoded FALLBACK_REPOS
```

To refresh the static fallback manually:

```bash
curl "https://api.github.com/users/chuls5/repos?sort=stargazers&per_page=12" \
  > public/repos.json
```

---

## Deployment (GitHub Pages)

The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes on every push to `main`.

**One-time setup**: in GitHub repo **Settings → Pages**, set **Source = "GitHub Actions"**.

The `base` path in [`vite.config.js`](vite.config.js) is `/cosmic-mew-portfolio/` — change this if you fork to a different repo name, or set it to `/` if you're deploying to a custom domain.

> **Note:** Pages is case-sensitive. Keep asset filenames lowercase.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Tooling | [Vite](https://vitejs.dev/) |
| Structure | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, `backdrop-filter`, `@import`) |
| Interactivity | Vanilla JavaScript (ES2020+) modules |
| 3D background | [three](https://www.npmjs.com/package/three) (npm) |
| Icons | [Font Awesome 6](https://fontawesome.com/) (CDN) |
| Fonts | [Space Grotesk + IBM Plex Mono](https://fonts.google.com/) (CDN) |
| Hosting | GitHub Pages via Actions |

---

## License

MIT — use it, fork it, make it yours.
