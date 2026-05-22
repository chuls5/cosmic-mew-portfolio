import { GITHUB_USERNAME } from '../config.js';
import { escHtml, safeUrl, fmt } from '../utils.js';
import { revealObserver } from '../ui/reveal.js';
import { createModal } from '../ui/modal.js';

// Module-level state: the current full list of repos, used by the filter.
let allRepos = [];
const modal = createModal('modal', 'modal-close');

export function renderRepos(repos) {
  allRepos = repos;
  setupFilter(repos);
  applyFilter('all');
}

function setupFilter(repos) {
  const bar = document.getElementById('filter-bar');
  const langs = ['all', ...new Set(repos.map((r) => r.language).filter(Boolean))];
  bar.innerHTML = langs
    .map(
      (lang) =>
        `<button class="filter-btn${lang === 'all' ? ' active' : ''}" data-lang="${escHtml(
          lang
        )}">${lang === 'all' ? 'All' : escHtml(lang)}</button>`
    )
    .join('');

  bar.querySelectorAll('.filter-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      bar.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      applyFilter(btn.dataset.lang);
    })
  );

  // Arrow-key roving tabindex for toolbar pattern (WAI-ARIA).
  bar.addEventListener('keydown', (e) => {
    const btns = [...bar.querySelectorAll('.filter-btn')];
    const idx = btns.indexOf(document.activeElement);
    if (idx === -1) return;
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % btns.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + btns.length) % btns.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = btns.length - 1;
    if (next !== -1) {
      e.preventDefault();
      btns[next].focus();
      btns[next].click();
    }
  });
}

function applyFilter(lang) {
  const filtered = lang === 'all' ? allRepos : allRepos.filter((r) => r.language === lang);
  const grid = document.getElementById('projects-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `<p class="no-results">No missions found for <span style="color:var(--pink)">${escHtml(lang)}</span>.</p>`;
    return;
  }
  grid.innerHTML = filtered
    .map(
      (r) => `
    <div class="project-card" data-repo="${escHtml(r.name)}" role="button" tabindex="0" aria-label="Open ${escHtml(r.name)} details">
      <h3>${escHtml(r.name)}</h3>
      <p>${escHtml(r.description || 'Exploring the digital cosmos.')}</p>
      <div class="card-footer">
        <span class="card-stat"><span class="star">★</span> ${fmt(r.stargazers_count)}</span>
        <span class="card-stat"><i class="fas fa-code-branch" style="font-size:.65rem;opacity:.7"></i> ${fmt(r.forks_count)}</span>
        ${r.language ? `<span class="card-lang">${escHtml(r.language)}</span>` : ''}
        <a href="${safeUrl(r.html_url)}" target="_blank" rel="noopener noreferrer" class="card-link"
           onclick="event.stopPropagation()">View Mission →</a>
      </div>
    </div>
  `
    )
    .join('');

  grid.querySelectorAll('.project-card').forEach((card) => {
    card.classList.add('reveal');
    revealObserver.observe(card);
    const open = () => openRepoModal(card.dataset.repo, card);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

function openRepoModal(repoName, triggerEl) {
  const repo = allRepos.find((r) => r.name === repoName);
  if (!repo) return;

  modal.open(triggerEl, () => {
    document.getElementById('modal-title').textContent = repo.name;
    document.getElementById('modal-desc').textContent =
      repo.description || 'Exploring the digital cosmos.';
    document.getElementById('modal-stats').innerHTML = `
      <span><span class="star">★</span> ${fmt(repo.stargazers_count)} stars</span>
      <span><i class="fas fa-code-branch"></i> ${fmt(repo.forks_count)} forks</span>
      ${repo.language ? `<span>${escHtml(repo.language)}</span>` : ''}
    `;
    document.getElementById('modal-github-link').href = safeUrl(repo.html_url);
    document.getElementById('modal-readme').innerHTML = `
      <div class="modal-readme-loading">
        <div class="loading-spinner"></div>
        <span>Fetching mission briefing…</span>
      </div>`;
  });

  // README fetch is fire-and-forget; runs after the modal is already open.
  fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
    headers: { Accept: 'application/vnd.github.html+json' },
  })
    .then((res) => {
      if (!res.ok) throw new Error('No README');
      return res.text();
    })
    .then((html) => {
      // GitHub returns sanitized HTML via the html+json media type, safe to inject.
      document.getElementById('modal-readme').innerHTML = html;
    })
    .catch(() => {
      document.getElementById('modal-readme').innerHTML = `<p style="color:var(--text-dim);text-align:center;padding:2rem">No mission briefing available for this repo.</p>`;
    });
}
