import { GITHUB_USERNAME, CACHE_TTL } from '../config.js';
import { FALLBACK_REPOS } from './fallback-data.js';
import { renderRepos } from './render.js';

// localStorage key for the cached repo list. Bump the suffix if the cached shape ever changes.
const CACHE_KEY = 'gh_repos_v1';

// 4-tier fallback chain:
//   localStorage cache (1h TTL) → GitHub API → public/repos.json → hardcoded FALLBACK_REPOS
// Keep all four working — the API has a 60 req/hour/IP unauthenticated limit.
export async function loadProjects() {
  const lastUpdated = document.getElementById('last-updated');

  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      renderRepos(cached.repos);
      lastUpdated.textContent = `Last synced: ${new Date(cached.ts).toLocaleString()} (cached)`;
      return;
    }
  } catch {
    /* ignore parse errors */
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stargazers&per_page=12`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const repos = await res.json();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ repos, ts: Date.now() }));
    } catch {
      /* storage full / private browsing — render anyway */
    }
    renderRepos(repos);
    lastUpdated.textContent = `Last synced: ${new Date().toLocaleString()}`;
  } catch (err) {
    console.warn('GitHub API unavailable, using fallback:', err.message);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}repos.json`);
      if (res.ok) {
        const repos = await res.json();
        renderRepos(repos);
        lastUpdated.textContent = 'Showing static mission cache.';
        return;
      }
    } catch {
      /* fall through to hardcoded fallback */
    }
    renderRepos(FALLBACK_REPOS);
    lastUpdated.textContent = 'Live sync unavailable — showing sample missions.';
  }
}
