// ── Particles ──
particlesJS("particles", {
  particles: {
    number: { value: 150, density: { enable: true, value_area: 900 } },
    color: { value: ["#ff69b4", "#c026d3", "#7e22ce", "#ffffff"] },
    shape: { type: "circle" },
    opacity: { value: 0.6, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1 } },
    size: { value: 2.5, random: true },
    line_linked: { enable: true, distance: 120, color: "#ff69b4", opacity: 0.12, width: 1 },
    move: { enable: true, speed: 1.1, random: true, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.35 } },
      push: { particles_nb: 3 }
    }
  },
  retina_detect: true
});

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
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  })
);

// ── GitHub Repos ──
const GITHUB_USERNAME = "chuls5";
const CACHE_KEY = "gh_repos_v1";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const FALLBACK_REPOS = [
  { name: "cosmic-core",   description: "Core utilities for cosmic calculations.",            stargazers_count: 1200, forks_count: 89,  html_url: `https://github.com/${GITHUB_USERNAME}/cosmic-core`,   language: "TypeScript"  },
  { name: "nebula-utils",  description: "Core utilities for nebula formations.",              stargazers_count: 128,  forks_count: 34,  html_url: `https://github.com/${GITHUB_USERNAME}/nebula-utils`,  language: "JavaScript" },
  { name: "astro-nav",     description: "Simulates galaxy formations and orbital mechanics.", stargazers_count: 4500, forks_count: 512, html_url: `https://github.com/${GITHUB_USERNAME}/astro-nav`,     language: "Python"      },
  { name: "galaxy-sim",    description: "Simulates galaxy formation processes.",              stargazers_count: 890,  forks_count: 203, html_url: `https://github.com/${GITHUB_USERNAME}/galaxy-sim`,    language: "JavaScript" },
  { name: "pulsar-api",    description: "High-performance REST API with cosmic conventions.", stargazers_count: 340,  forks_count: 67,  html_url: `https://github.com/${GITHUB_USERNAME}/pulsar-api`,    language: "Node.js"     },
  { name: "stardust-ui",   description: "React component library with a space aesthetic.",   stargazers_count: 720,  forks_count: 145, html_url: `https://github.com/${GITHUB_USERNAME}/stardust-ui`,   language: "TypeScript"  },
];

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

function renderRepos(repos) {
  document.getElementById("projects-grid").innerHTML = repos.map(r => `
    <div class="project-card">
      <h3>${r.name}</h3>
      <p>${r.description || "Exploring the digital cosmos."}</p>
      <div class="card-footer">
        <span class="card-stat"><span class="star">★</span> ${fmt(r.stargazers_count)}</span>
        <span class="card-stat"><i class="fas fa-code-branch" style="font-size:.65rem;opacity:.7"></i> ${fmt(r.forks_count)}</span>
        ${r.language ? `<span class="card-lang">${r.language}</span>` : ""}
        <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="card-link">View Mission →</a>
      </div>
    </div>
  `).join("");
}

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
