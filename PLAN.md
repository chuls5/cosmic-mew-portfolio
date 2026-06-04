# PLAN.md

Living brainstorm doc for what comes next on cosmic-mew-portfolio. Not a roadmap — a menu. Edit freely; we work through it together.

**Goal of the site:** show recruiters / hiring managers / collaborators who Cody is (astrophysics → software), what he can build (the code that ships *this site* is exhibit A), and how to reach him.

**Legend:** effort `S` (under an hour) · `M` (an afternoon) · `L` (a day or more). Impact `★` (nice) · `★★` (worth doing) · `★★★` (move the needle).

---

## 1. Real content — biggest gap right now

The site is solid scaffolding with placeholder copy and DRAFT badges. Recruiters notice. This is the highest-ROI work on the board.

| Item | Effort | Impact | Notes |
|---|---|---|---|
| Write 1 real blog post end-to-end | M | ★★★ | Pick the one you're most proud of (signal processing? Playwright template?). Removes the strongest "this is a template" smell. |
| Replace the other 5 blog drafts with shorter "Coming soon" stubs or delete | S | ★★ | Better to ship 1 real post than 6 fake ones. |
| Drop a real `public/resume.pdf` | S | ★★★ | "Download Log" button currently 404s. |
| Add `public/assets/mew-hero.png` | S | ★★ | Hero image is hidden by `onerror` until you do. Optional but the floating-mew is the visual signature. |
| Replace the 6 hardcoded `FALLBACK_REPOS` in [src/repos/fallback-data.js](src/repos/fallback-data.js) with your actual repos | S | ★★ | Only shown if API + repos.json both fail, but they read as fake when surfaced. |
| Real "Active Missions" cards | S | ★★ | The two in [index.html](index.html) already are real — confirm they're what you most want to feature. |

---

## 2. Project case studies — show *why*, not just *what*

The repos grid is a list. A case study is a story. Two or three deep ones beat 20 shallow cards.

| Item | Effort | Impact | Notes |
|---|---|---|---|
| One ~600-word case study for the Playwright Template | M | ★★★ | You built this for real teams. Talk about the pain it solved. |
| Decide: case studies as blog posts, or a separate "/case-studies" route? | S (decision) | — | Routing is non-trivial in a single-page site. Blog-as-case-study is simpler. |
| Embed a small demo (gif or live) in a case study | M | ★★ | Visual proof beats prose. |

---

## 3. E2E tests with Playwright — eat your own dog food

You have a [Playwright-template](https://github.com/chuls5/Playwright-template) repo. Use it on this site. The implementation itself becomes a demo of your QA skills.

| Item | Effort | Impact | Notes |
|---|---|---|---|
| Add Playwright + 3–5 critical-path tests (loader, repo modal opens, blog modal renders, theme persists) | M | ★★★ | Wires into existing CI. |
| Visual regression snapshots (1–2 key views) | M | ★★ | Catches accidental design drift. |
| Run on multiple viewports (desktop + mobile) | S | ★★ | Validates the responsive work we just did. |

---

## 4. Polish — first-impression wins

| Item | Effort | Impact | Notes |
|---|---|---|---|
| Custom favicon (replace the emoji SVG) | S | ★ | The 🐱 favicon is cute but everyone uses emoji favicons. A custom one stands out. |
| Self-host Google Fonts + Font Awesome | M | ★★ | Privacy (no IP logged to Google) + perf (no extra DNS). One-time. |
| Lighthouse CI in the deploy workflow with score budget | M | ★★ | Gates regressions in perf/a11y/SEO automatically. |
| Bundle-size budget in CI (fail if > 30 KB initial) | S | ★★ | The lazy-load work we just did could regress; budget locks it in. |
| `<picture>` + AVIF/WebP for hero + OG image | M | ★ | Only matters once a real hero image exists. |

---

## 5. SEO + findability

| Item | Effort | Impact | Notes |
|---|---|---|---|
| `BlogPosting` JSON-LD on blog posts (in modal-open handler) | S | ★★ | Once posts are real, gives them rich-result eligibility. |
| Update the LinkedIn `sameAs` link if you have a custom handle | S | ★ | The current vanity URL works. |
| GitHub profile README backlink → portfolio | S | ★★ | One of the highest-ranking referrers for a developer site. |
| `lastmod` updates on sitemap.xml when posts ship | S | ★ | Tiny detail. Can script it during build. |

---

## 6. Engagement — measuring what works

| Item | Effort | Impact | Notes |
|---|---|---|---|
| Plausible or Umami analytics (privacy-friendly, no banner needed) | S | ★★ | See which sections actually get read. ~$9/mo Plausible, free if self-hosted. |
| Track "Download Log" clicks specifically | S | ★ | The recruiter-conversion event. |
| Deep-link blog posts (`#blog/threejs-cosmic` opens that modal) | M | ★★ | Lets you share specific posts. Requires routing inside the modal layer. |

---

## 7. Resume integration

The site already has an About section and skills cards. Could go deeper.

| Item | Effort | Impact | Notes |
|---|---|---|---|
| Inline experience timeline (jobs, dates, achievements) | M | ★★ | Recruiters prefer reading on-page to downloading a PDF. |
| Auto-generate resume.pdf from page data via Playwright print | L | ★ | Cool but maybe over-engineering. |
| `@media print` styles so right-click → print works | S | ★ | Cheap win. |

---

## 8. Architecture / hardening (continued)

| Item | Effort | Impact | Notes |
|---|---|---|---|
| Test the loadProjects fallback chain end-to-end (mock fetch) | M | ★★ | Currently only `isCacheFresh` is unit-tested. The chain itself is the more important behavior. |
| Web Components for `<repo-card>` / `<blog-card>` | L | ★ | Cleaner than template strings, but the current code works. Refactor when the template strings get painful. |
| Move BLOG_POSTS content into `.md` files, parse at build | M | ★ | Better authoring experience than escaped backticks in JS. |
| Add ESLint with a minimal config | S | ★ | Catches `let` vs `const`, unused vars. Prettier alone doesn't lint. |

---

## 9. Bigger ideas (no commitment)

Things to consider as the portfolio evolves into a personal site:

- **A "now" page** ([nownownow.com](https://nownownow.com/) style) — what you're currently working on, learning, reading
- **An interactive demo** that uses your astrophysics background — a tiny N-body sim with the existing canvas visuals? Recruiters remember it.
- **A `/uses` page** — tools, hardware, dotfiles. Developer culture page.
- **RSS feed for blog** — niche but the right audience cares
- **Webmentions + IndieWeb integration** — same audience as RSS

---

## Open questions for Cody

1. Which 1–2 items from sections 1–3 should we tackle first?
2. Is there real writing already drafted somewhere (Notion, docs folder) we could adapt as the first real blog post?
3. Do you want analytics now or after content is real (so the metrics actually mean something)?
4. Is a dedicated `/case-studies` route something you want, or are blog posts enough?
5. What's the most important missing **content** — case studies, blog posts, or just better project descriptions on the cards?

---

*Last updated: 2026-06-04*
