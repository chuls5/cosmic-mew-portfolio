# 🌌 cosmic-mew-portfolio

A fully static, GitHub Pages–compatible developer portfolio with a deep-space / astrophysics aesthetic. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

---

## Live Demo

> Deploy to GitHub Pages and update this link:  
> `https://chuls5.github.io/cosmic-mew-portfolio`

---

## Features

- **Glitch hero title** with CSS pseudo-element animation
- **Floating Mew** character with pink drop-shadow glow
- **Particle field** via particles.js (pink/purple constellation network)
- **Three.js ringed planet** rendered in a background canvas
- **Active Missions** — three featured/pinned projects
- **GitHub Repos grid** — fetched live from the GitHub API, sorted by stars
  - 1-hour `localStorage` cache to respect rate limits (60 req/hr unauthenticated)
  - Falls back to `repos.json` → hardcoded sample data if offline
- **Scattered card layout** — cards tilt via `nth-child` CSS transforms, straighten on hover
- **Blog / Transmission Log** section with placeholder posts
- **Theme toggle** (Default ↔ Nebula mode) persisted to `localStorage`
- **Mobile hamburger menu** with accessible `aria-expanded` toggle
- **Accessible markup** — `aria-label`, `aria-live`, `rel="noopener noreferrer"` on all external links

---

## Project Structure

```
cosmic-mew-portfolio/
├── index.html          # Single-page app shell
├── styles.css          # All styling (variables, layout, animations, responsive)
├── script.js           # particles.js config, Three.js, GitHub API, theme/nav logic
├── repos.json          # Static fallback repo data (used when API is unavailable)
├── resume.pdf          # Linked from the "Download Log" navbar button
├── assets/
│   └── mew-hero.png    # Transparent PNG of Mew holding Monster Energy
└── .github/
    └── workflows/
        └── update-repos.yml   # (optional) GitHub Action to refresh repos.json nightly
```

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/cosmic-mew-portfolio.git
cd cosmic-mew-portfolio
# Open with VS Code Live Server, or:
open index.html
```

No package manager or build step required.

---

## Configuration

### 1. Set your GitHub username

In `script.js`, line 1:

```js
const GITHUB_USERNAME = "chuls5";
```

### 2. Update social links

In `index.html`, update the `href` values in the contact section and the navbar resume link:

```html
<a href="https://github.com/YOUR_USERNAME" ...>
<a href="https://linkedin.com/in/YOUR_PROFILE" ...>
<a href="mailto:your@email.com" ...>
<a href="https://twitter.com/YOUR_HANDLE" ...>
<a href="resume.pdf" download ...>
```

### 3. Add your hero image

Place a transparent PNG of your Mew character at:

```
assets/mew-hero.png
```

If the file is missing the image is hidden gracefully via `onerror`.

### 4. Update featured projects

Edit the three `.mission-card.featured` blocks in `index.html` with your actual pinned project names, descriptions, and GitHub URLs.

---

## Caching & GitHub API

The GitHub API allows **60 unauthenticated requests per hour** per IP. The site handles this with a layered fallback:

```
GitHub API  →  localStorage cache (1 hr TTL)  →  repos.json  →  hardcoded samples
```

To refresh `repos.json` manually:

```bash
curl "https://api.github.com/users/chuls5/repos?sort=stargazers&per_page=12" \
  > repos.json
```

Or automate it with the included GitHub Actions workflow template (see `.github/workflows/update-repos.yml`).

---

## Deployment (GitHub Pages)

```bash
git add .
git commit -m "init: cosmic-mew-portfolio"
git remote add origin https://github.com/chuls5/cosmic-mew-portfolio.git
git push -u origin main
```

Then in the repo **Settings → Pages**, set the source branch to `main` and directory to `/ (root)`.

> **Note:** GitHub Pages paths are case-sensitive. Keep all asset filenames lowercase.

---

## Customization Notes

| What | Where |
|---|---|
| Color palette | `--pink`, `--purple`, `--deep` in `styles.css :root` |
| Star count / size | `starPositions` array in `initThree()` in `script.js` |
| Planet position / ring | `planet.position.set(...)` in `script.js` |
| Card scatter angle | `.project-card:nth-child(...)` in `styles.css` |
| Blog posts | `BLOG_POSTS` array in `script.js` |
| Cache TTL | `CACHE_TTL` constant in `script.js` |

---

## Roadmap

- [x] Mobile hamburger animation (X transform)
- [x] Project modal with README preview
- [x] Custom cursor with sparkle trail
- [x] Typing animation for tagline
- [x] Project filter by language / topic
- [x] 3D starfield via Three.js `BufferGeometry` (particles.js removed)
- [x] Mini solar system in hero section (pure CSS orbital animation)
- [x] Markdown → HTML blog rendering with modal viewer
- [x] Skills section ("Systems Online")
- [x] Cosmic loading screen
- [x] Scroll-reveal animations (IntersectionObserver)

---

## Tech Stack

| Layer | Library / Approach |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, `backdrop-filter`, CSS animations) |
| Interactivity | Vanilla JavaScript (ES2020+) |
| 3D background | [Three.js r134](https://threejs.org/) |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| Fonts | [Space Grotesk + IBM Plex Mono](https://fonts.google.com/) |
| Hosting | GitHub Pages |

---

## License

MIT — use it, fork it, make it yours.
