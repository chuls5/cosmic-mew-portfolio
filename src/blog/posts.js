// Blog content. Add an entry here to publish a new post.
//   `visual`: one of 'galaxy' | 'nebula' | 'binary' | 'wormhole' | 'pulsar' | 'orbit'
//             (canvas animations defined in src/blog/visuals.js)
//   `draft`:  optional — when true, renders a "DRAFT" badge on the card and in the modal
//   `content`: minimal Markdown — see src/blog/markdown.js for supported syntax
//             (headings #/##/###, bullets `- `, fenced ```code```, **bold**, *em*, `code`, [links](url))
export const BLOG_POSTS = [
  {
    id: 'websockets-cms',
    draft: true,
    visual: 'galaxy',
    date: '2026-05-01',
    title: 'Building a Real-Time CMS with WebSockets',
    excerpt: 'How I built Cosmic CMS from scratch using Node.js and live socket connections.',
    content: `## The Problem

Static CMSes are great, but I needed something that pushes edits to **all viewers simultaneously** — no page refresh required.

## Tech Stack

- Node.js + the ws library for WebSocket connections
- Redis pub/sub to fan-out edits across server instances
- contenteditable divs on the frontend for inline editing

## The Key Insight

Treat the document as a **CRDT** (Conflict-free Replicated Data Type). Every edit is an *operation* that can be applied in any order — keeping things conflict-free even with simultaneous editors.

## What I Learned

- Designing for network failure is harder than the happy path
- Presence indicators (seeing other cursors) dramatically improve the collaboration feel
- [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation) is the classic alternative to CRDTs`,
  },
  {
    id: 'threejs-cosmic',
    draft: true,
    visual: 'nebula',
    date: '2026-04-15',
    title: 'Three.js & the Art of Cosmic UIs',
    excerpt: 'Using physics-based animations to create stunning space experiences in the browser.',
    content: `## Why Three.js?

CSS animations are powerful, but they cannot do *real* 3D. Three.js gives full WebGL access without writing raw GLSL shaders.

## What Is in This Portfolio

- **Ringed planet** — SphereGeometry plus RingGeometry child mesh, lit with a pink PointLight
- **Starfield** — THREE.Points with BufferGeometry holding 3,000 star vertices
- **Mini solar system** — pure CSS orbital animations in the hero section

## Performance Tips

- Set pixel ratio to min(devicePixelRatio, 2) to avoid blurry renders on HiDPI screens
- Use **BufferGeometry** for large particle counts — the legacy Geometry class is much slower
- Pause the animation loop when the tab is hidden using the *Page Visibility API*
- Dispose geometries and materials when removing objects to prevent **GPU memory leaks**`,
  },
  {
    id: 'gravity-sim',
    draft: true,
    visual: 'binary',
    date: '2026-03-28',
    title: 'Astrophysics in Code: Simulating Gravity',
    excerpt: 'Translating orbital mechanics equations into interactive JavaScript simulations.',
    content: `## Newton's Law of Gravitation

Everything starts with **F = Gm₁m₂ / r²**. For two bodies we compute the force, update velocity, then update position each animation frame.

## The N-Body Problem

For more than two bodies there is no closed-form solution. We use *Verlet integration* for numerical stability — the same technique used in games, NASA trajectory tools, and every physics engine.

## Try It Yourself

- Start with 3 bodies and observe [chaotic orbits](https://en.wikipedia.org/wiki/Three-body_problem)
- Add a very massive central body to simulate a solar system
- Vary the gravitational constant G to change orbital shapes

## Why This Matters for Software

Think of N-body simulation as **distributed systems**: each node influences all others. You cannot predict emergent behaviour from first principles — you have to *simulate it step by step*.`,
  },
  {
    id: 'career-pivot',
    draft: true,
    visual: 'wormhole',
    date: '2026-03-10',
    title: 'From Telescope to Terminal: My Astrophysics Career Pivot',
    excerpt:
      'How years of observatory data analysis turned out to be the perfect foundation for a software engineering career.',
    content: `## The Unexpected Bridge

When I transitioned from observational astrophysics to software engineering, people assumed it would be a difficult leap. What I discovered instead was that the two fields share a deep structural similarity: both require you to extract meaningful signal from overwhelming amounts of noisy data.

## What Transfers Directly

- **Python & data pipelines** — I was already writing data processing scripts daily
- **Statistical rigor** — years of error analysis translate directly to QA and testing
- **IDL & MatLab** — scripting scientific instruments is just programming with extra steps
- **Debugging mindset** — an anomaly in telescope data trains the same instincts as a production bug

## What I Had to Learn

- Web fundamentals: HTTP, the DOM, async JavaScript
- Version control culture — in science, code is often not shared; in industry, collaboration is everything
- User empathy — telescope operators are a very different audience than end-users

## The Advice I Would Give

If you are a scientist considering software engineering: your background is a *feature*. Quantitative rigor, comfort with ambiguity, and the ability to read dense documentation are exactly what teams are looking for.`,
  },
  {
    id: 'signal-processing',
    draft: true,
    visual: 'pulsar',
    date: '2026-02-20',
    title: 'Taming Signals: From Radio Telescopes to Real-Time Data Streams',
    excerpt:
      'The signal processing intuition I built analyzing pulsar timing data applies surprisingly well to modern event-driven systems.',
    content: `## Pulsars as Natural Clocks

Millisecond pulsars are among the most stable clocks in the universe — more precise than atomic clocks on Earth. Detecting their pulses means pulling a periodic signal out of a sea of thermal noise, interference, and dispersion effects.

## The Core Challenge

The fundamental problem is identical to real-time data engineering:

1. **Ingest** a high-bandwidth stream (telescope receivers or Kafka topic)
2. **Filter** noise without destroying the signal (bandpass filters or schema validation)
3. **Detect** events of interest (pulse arrival or business event)
4. **Aggregate** measurements across time (fold profiles or rolling windows)

## Key Techniques That Carry Over

- **FFT-based periodicity detection** → monitoring cron jobs and scheduled tasks
- **Dispersion measure correction** → normalising timestamps across distributed systems
- **Dedispersion** → compensating for network latency in event ordering
- **Signal-to-noise thresholds** → alert fatigue reduction in observability stacks

## Libraries I Rely On

- NumPy & SciPy for numerical processing
- Matplotlib for rapid signal visualisation
- Python asyncio for non-blocking I/O — the software analogue of a real-time data pipeline`,
  },
  {
    id: 'playwright-azure',
    draft: true,
    visual: 'orbit',
    date: '2026-01-28',
    title: 'End-to-End Testing at Scale: Playwright & Azure DevOps',
    excerpt:
      'How I built a reusable Playwright testing framework with Azure DevOps reporting baked in from day one.',
    content: `## Why Another Testing Template?

Every team I joined started from scratch: copy-pasted Playwright configs, half-finished reporter integrations, and CI pipelines held together with hope. I built [Playwright-template](https://github.com/chuls5/Playwright-template) to solve this once.

## What the Template Includes

- **@alex_neo/azure-reporter** pre-wired to push results directly into Azure Test Plans
- Parallel cross-browser execution (Chromium, Firefox, WebKit)
- Environment-aware config — one command switches between local, staging, and production
- Shared fixture library for authentication, API clients, and page objects
- HTML + JSON reports generated automatically on every run

## The Key Design Decisions

**Page Object Model** over raw selectors — tests read like user stories, not CSS archaeology.

**Data factories** for test data — never rely on a shared DB state that another test can corrupt.

**Soft assertions** for non-critical checks — fail fast on blockers, log warnings on cosmetic issues.

## Running in Azure Pipelines

\`\`\`yaml
- task: NodeTool@0
  inputs:
    versionSpec: '20.x'
- script: npx playwright install --with-deps
- script: npx playwright test --reporter=@alex_neo/azure-reporter
\`\`\`

Results appear in Azure Test Plans within seconds of the pipeline completing.`,
  },
];
