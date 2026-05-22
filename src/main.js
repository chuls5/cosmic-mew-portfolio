// Entry point. Imports the stylesheet and wires up all feature modules.
import './styles/main.css';

import { initScene } from './scene.js';
import { initTheme } from './ui/theme.js';
import { initNav } from './ui/nav.js';
import { initLoader } from './ui/loader.js';
import { initReveal } from './ui/reveal.js';
import { initTyping } from './ui/typing.js';
import { initCursor } from './ui/cursor.js';
import { initBackToTop } from './ui/back-to-top.js';
import { loadProjects } from './repos/api.js';
import { initBlog } from './blog/render.js';

initScene();
initTheme();
initNav();
initLoader();
initReveal();
initTyping();
initCursor();
initBackToTop();
initBlog();
loadProjects();
