// Entry point. Imports the stylesheet and wires up all feature modules.
import './styles/main.css';

import { initTheme } from './ui/theme.js';
import { initNav } from './ui/nav.js';
import { initLoader } from './ui/loader.js';
import { initReveal } from './ui/reveal.js';
import { initTyping } from './ui/typing.js';
import { initCursor } from './ui/cursor.js';
import { initBackToTop } from './ui/back-to-top.js';
import { loadProjects } from './repos/api.js';
import { renderRepos } from './repos/render.js';
import { initBlog } from './blog/render.js';

initTheme();
initNav();
initLoader();
initReveal();
initTyping();
initCursor();
initBackToTop();
initBlog();

// Lazy-load Three.js scene. Keeps the ~120KB gzipped THREE bundle out of the
// critical path so the loader + hero text render before WebGL parses.
import('./scene.js').then(({ initScene }) => initScene());

// api.js is DOM-free — it returns the data, main.js wires it to the renderer.
loadProjects().then(({ repos, status }) => {
  renderRepos(repos);
  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated) lastUpdated.textContent = status;
});
