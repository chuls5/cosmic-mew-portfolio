// ── Three.js Ringed Planet ──
(function initThree() {
  const canvas = document.getElementById("three-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Planet
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 64, 64),
    new THREE.MeshPhongMaterial({ color: 0x6b21a8, emissive: 0x3b0764, shininess: 20, specular: 0xff69b4 })
  );
  planet.position.set(5, -3, -6);
  scene.add(planet);

  // Ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.3, 4.8, 80),
    new THREE.MeshBasicMaterial({ color: 0xff69b4, side: THREE.DoubleSide, transparent: true, opacity: 0.2 })
  );
  ring.rotation.x = Math.PI / 3;
  planet.add(ring);

  // Starfield (replaces particles.js)
  const starPositions = new Float32Array(3000 * 3);
  for (let i = 0; i < starPositions.length; i++) starPositions[i] = (Math.random() - 0.5) * 300;
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.35, transparent: true, opacity: 0.7, sizeAttenuation: true,
  }));
  scene.add(stars);

  // Lights
  const pointLight = new THREE.PointLight(0xff69b4, 2.5, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  scene.add(new THREE.AmbientLight(0x442266, 0.8));
  const fillLight = new THREE.PointLight(0xffffff, 1, 50);
  fillLight.position.set(-10, 10, 10);
  scene.add(fillLight);

  camera.position.z = 8;

  (function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.002;
    stars.rotation.y  += 0.00008;
    stars.rotation.x  += 0.00003;
    renderer.render(scene, camera);
  })();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ── Theme Toggle ──
const themeBtn = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "nebula") document.body.classList.add("nebula-mode");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("nebula-mode");
  localStorage.setItem("theme", document.body.classList.contains("nebula-mode") ? "nebula" : "default");
});

// ── Hamburger Menu ──
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  })
);

// ── GitHub Repos ──
const GITHUB_USERNAME = "chuls5";
const CACHE_KEY = "gh_repos_v1";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ── Typing Animation ──
(function initTyping() {
  const el = document.getElementById("typed-text");
  if (!el) return;
  const phrases = [
    "Turning cosmic dust into production code",
    "Powered by Ultra Punk Punch",
    "Exploring the digital cosmos, one commit at a time",
    "Full-Stack Engineer · Astrophysics Nerd",
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 500);
      } else {
        setTimeout(tick, 38);
      }
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 2400);
      } else {
        setTimeout(tick, 68);
      }
    }
  }
  setTimeout(tick, 900);
})();

// ── Custom Cursor + Sparkle Trail ──
(function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const cursor = document.getElementById("cursor");
  const COLORS = ["#ff69b4", "#c026d3", "#a855f7", "#ffffff"];
  let lastSparkle = 0;

  document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
    const now = Date.now();
    if (now - lastSparkle > 55) {
      lastSparkle = now;
      const s = document.createElement("div");
      s.className = "sparkle";
      const size = 3 + Math.random() * 5;
      s.style.cssText = `left:${e.clientX + (Math.random()-0.5)*16}px;top:${e.clientY + (Math.random()-0.5)*16}px;width:${size}px;height:${size}px;background:${COLORS[Math.floor(Math.random()*COLORS.length)]}`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 680);
    }
  });

  document.addEventListener("mouseover", e => {
    if (e.target.closest("a, button, [role='button']")) cursor.classList.add("hovering");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("a, button, [role='button']")) cursor.classList.remove("hovering");
  });
})();

const FALLBACK_REPOS = [
  { name: "cosmic-core",   description: "Core utilities for cosmic calculations.",            stargazers_count: 1200, forks_count: 89,  html_url: `https://github.com/${GITHUB_USERNAME}/cosmic-core`,   language: "TypeScript"  },
  { name: "nebula-utils",  description: "Core utilities for nebula formations.",              stargazers_count: 128,  forks_count: 34,  html_url: `https://github.com/${GITHUB_USERNAME}/nebula-utils`,  language: "JavaScript" },
  { name: "astro-nav",     description: "Simulates galaxy formations and orbital mechanics.", stargazers_count: 4500, forks_count: 512, html_url: `https://github.com/${GITHUB_USERNAME}/astro-nav`,     language: "Python"      },
  { name: "galaxy-sim",    description: "Simulates galaxy formation processes.",              stargazers_count: 890,  forks_count: 203, html_url: `https://github.com/${GITHUB_USERNAME}/galaxy-sim`,    language: "JavaScript" },
  { name: "pulsar-api",    description: "High-performance REST API with cosmic conventions.", stargazers_count: 340,  forks_count: 67,  html_url: `https://github.com/${GITHUB_USERNAME}/pulsar-api`,    language: "Node.js"     },
  { name: "stardust-ui",   description: "React component library with a space aesthetic.",   stargazers_count: 720,  forks_count: 145, html_url: `https://github.com/${GITHUB_USERNAME}/stardust-ui`,   language: "TypeScript"  },
];

let allRepos = [];

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

// ── Filter ──
function setupFilter(repos) {
  const bar = document.getElementById("filter-bar");
  const langs = ["all", ...new Set(repos.map(r => r.language).filter(Boolean))];
  bar.innerHTML = langs.map(lang =>
    `<button class="filter-btn${lang === "all" ? " active" : ""}" data-lang="${lang}">${lang === "all" ? "All" : lang}</button>`
  ).join("");
  bar.querySelectorAll(".filter-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      bar.querySelector(".active").classList.remove("active");
      btn.classList.add("active");
      applyFilter(btn.dataset.lang);
    })
  );
}

function applyFilter(lang) {
  const filtered = lang === "all" ? allRepos : allRepos.filter(r => r.language === lang);
  const grid = document.getElementById("projects-grid");
  if (filtered.length === 0) {
    grid.innerHTML = `<p class="no-results">No missions found for <span style="color:var(--pink)">${lang}</span>.</p>`;
    return;
  }
  grid.innerHTML = filtered.map(r => `
    <div class="project-card" data-repo="${r.name}" role="button" tabindex="0" aria-label="Open ${r.name} details">
      <h3>${r.name}</h3>
      <p>${r.description || "Exploring the digital cosmos."}</p>
      <div class="card-footer">
        <span class="card-stat"><span class="star">★</span> ${fmt(r.stargazers_count)}</span>
        <span class="card-stat"><i class="fas fa-code-branch" style="font-size:.65rem;opacity:.7"></i> ${fmt(r.forks_count)}</span>
        ${r.language ? `<span class="card-lang">${r.language}</span>` : ""}
        <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="card-link"
           onclick="event.stopPropagation()">View Mission →</a>
      </div>
    </div>
  `).join("");
  grid.querySelectorAll(".project-card").forEach(card => {
    const open = () => openModal(card.dataset.repo);
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}

function renderRepos(repos) {
  allRepos = repos;
  setupFilter(repos);
  applyFilter("all");
}

// ── Modal ──
const modal      = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");

function openModal(repoName) {
  const repo = allRepos.find(r => r.name === repoName);
  if (!repo) return;

  document.getElementById("modal-title").textContent = repo.name;
  document.getElementById("modal-desc").textContent  = repo.description || "Exploring the digital cosmos.";
  document.getElementById("modal-stats").innerHTML = `
    <span><span class="star">★</span> ${fmt(repo.stargazers_count)} stars</span>
    <span><i class="fas fa-code-branch"></i> ${fmt(repo.forks_count)} forks</span>
    ${repo.language ? `<span>${repo.language}</span>` : ""}
  `;
  document.getElementById("modal-github-link").href = repo.html_url;
  document.getElementById("modal-readme").innerHTML = `
    <div class="modal-readme-loading">
      <div class="loading-spinner"></div>
      <span>Fetching mission briefing…</span>
    </div>`;

  modal.classList.add("open");
  modal.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  modalClose.focus();

  fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
    headers: { Accept: "application/vnd.github.html+json" }
  })
    .then(res => { if (!res.ok) throw new Error("No README"); return res.text(); })
    .then(html => { document.getElementById("modal-readme").innerHTML = html; })
    .catch(() => {
      document.getElementById("modal-readme").innerHTML =
        `<p style="color:var(--text-dim);text-align:center;padding:2rem">No mission briefing available for this repo.</p>`;
    });
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeBlogModal(); } });

async function loadProjects() {
  // Serve from cache if fresh
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      renderRepos(cached.repos);
      document.getElementById("last-updated").textContent =
        `Last synced: ${new Date(cached.ts).toLocaleString()} (cached)`;
      return;
    }
  } catch (_) { /* ignore parse errors */ }

  // Fetch from GitHub API
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stargazers&per_page=12`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const repos = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ repos, ts: Date.now() }));
    renderRepos(repos);
    document.getElementById("last-updated").textContent =
      `Last synced: ${new Date().toLocaleString()}`;
  } catch (err) {
    console.warn("GitHub API unavailable, using fallback:", err.message);
    // Try repos.json static cache
    try {
      const res = await fetch("repos.json");
      if (res.ok) {
        const repos = await res.json();
        renderRepos(repos);
        document.getElementById("last-updated").textContent = "Showing static mission cache.";
        return;
      }
    } catch (_) { /* fall through */ }
    renderRepos(FALLBACK_REPOS);
    document.getElementById("last-updated").textContent = "Live sync unavailable — showing sample missions.";
  }
}

loadProjects();

// ── Blog Posts ──
const BLOG_POSTS = [
  {
    id: 'websockets-cms',
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
];

// ── Markdown → HTML ──
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(s) {
  return s
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
}

function mdToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let inCode = false, inList = false;
  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) { out.push('</code></pre>'); inCode = false; }
      else { if (inList) { out.push('</ul>'); inList = false; } out.push('<pre><code>'); inCode = true; }
      continue;
    }
    if (inCode)                        { out.push(escHtml(line)); continue; }
    if (!line.startsWith('- ') && inList) { out.push('</ul>'); inList = false; }
    if      (line.startsWith('### ')) { out.push(`<h3>${inlineMd(line.slice(4))}</h3>`); }
    else if (line.startsWith('## '))  { out.push(`<h2>${inlineMd(line.slice(3))}</h2>`); }
    else if (line.startsWith('# '))   { out.push(`<h1>${inlineMd(line.slice(2))}</h1>`); }
    else if (line.startsWith('- '))   {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inlineMd(line.slice(2))}</li>`);
    }
    else if (line.trim() === '') { out.push(''); }
    else { out.push(`<p>${inlineMd(line)}</p>`); }
  }
  if (inList) out.push('</ul>');
  if (inCode) out.push('</code></pre>');
  return out.join('\n');
}

// ── Blog Render ──
function renderBlog() {
  const grid = document.getElementById('blog-grid');
  grid.innerHTML = BLOG_POSTS.map(post => `
    <article class="blog-card" data-post="${post.id}" role="button" tabindex="0" aria-label="Read: ${post.title}">
      <span class="blog-date">${post.date}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <span class="blog-link">Read Entry →</span>
    </article>
  `).join('');
  grid.querySelectorAll('.blog-card').forEach(card => {
    const open = () => openBlogModal(card.dataset.post);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}
renderBlog();

// ── Blog Modal ──
const blogModal      = document.getElementById('blog-modal');
const blogModalClose = document.getElementById('blog-modal-close');

function openBlogModal(id) {
  const post = BLOG_POSTS.find(p => p.id === id);
  if (!post) return;
  document.getElementById('blog-modal-date').textContent  = post.date;
  document.getElementById('blog-modal-title').textContent = post.title;
  document.getElementById('blog-modal-content').innerHTML = mdToHtml(post.content);
  blogModal.classList.add('open');
  blogModal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  blogModalClose.focus();
}

function closeBlogModal() {
  blogModal.classList.remove('open');
  blogModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

blogModalClose.addEventListener('click', closeBlogModal);
blogModal.addEventListener('click', e => { if (e.target === blogModal) closeBlogModal(); });
