import { BLOG_POSTS } from './posts.js';
import { mdToHtml } from './markdown.js';
import { initBlogVisuals } from './visuals.js';
import { formatDate, escHtml } from '../utils.js';
import { revealObserver } from '../ui/reveal.js';
import { createModal } from '../ui/modal.js';

const modal = createModal('blog-modal', 'blog-modal-close');

export function initBlog() {
  renderBlog();
  // Defer canvas init by one tick so the cards have layout dimensions to read.
  setTimeout(initBlogVisuals, 0);
}

function renderBlog() {
  const grid = document.getElementById('blog-grid');
  grid.innerHTML = BLOG_POSTS.map(
    (post) => `
    <article class="blog-card" data-post="${escHtml(post.id)}" role="button" tabindex="0" aria-label="Read: ${escHtml(post.title)}">
      <canvas class="blog-canvas" data-visual="${escHtml(post.visual)}" aria-hidden="true"></canvas>
      <span class="blog-date">${formatDate(post.date)}</span>${post.draft ? '<span class="draft-badge">DRAFT</span>' : ''}
      <h3>${escHtml(post.title)}</h3>
      <p>${escHtml(post.excerpt)}</p>
      <span class="blog-link">Read Entry →</span>
    </article>
  `
  ).join('');

  grid.querySelectorAll('.blog-card').forEach((card) => {
    card.classList.add('reveal');
    revealObserver.observe(card);
    const open = () => openBlogModal(card.dataset.post, card);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

function openBlogModal(id, triggerEl) {
  const post = BLOG_POSTS.find((p) => p.id === id);
  if (!post) return;
  modal.open(triggerEl, () => {
    document.getElementById('blog-modal-date').textContent = formatDate(post.date);
    document.getElementById('blog-modal-draft').hidden = !post.draft;
    document.getElementById('blog-modal-title').textContent = post.title;
    document.getElementById('blog-modal-content').innerHTML = mdToHtml(post.content);
  });
}
