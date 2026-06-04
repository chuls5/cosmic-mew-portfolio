import { GITHUB_USERNAME, CACHE_TTL } from '../config.js';
import { FALLBACK_REPOS } from './fallback-data.js';

// localStorage key for the cached repo list. Bump the suffix if the cached shape ever changes.
const CACHE_KEY = 'gh_repos_v1';

// Pure predicate — exported so unit tests can exercise the TTL boundary
// without mocking Date or localStorage.
export function isCacheFresh(cached, now, ttl) {
  return Boolean(cached) && now - cached.ts < ttl;
}

// 4-tier fallback chain:
//   localStorage cache (1h TTL) → GitHub API → public/repos.json → hardcoded FALLBACK_REPOS
// Returns { repos, status } — does NOT touch the DOM. The caller is responsible for rendering.
// Keep all four tiers working — the unauthenticated GitHub API caps at 60 req/hour/IP.
export async function loadProjects() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (isCacheFresh(cached, Date.now(), CACHE_TTL)) {
      return {
        repos: cached.repos,
        status: `Last synced: ${new Date(cached.ts).toLocaleString()} (cached)`,
      };
    }
  } catch {
    /* parse error — fall through to live fetch */
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
    return { repos, status: `Last synced: ${new Date().toLocaleString()}` };
  } catch (err) {
    console.warn('GitHub API unavailable, using fallback:', err.message);
  }

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}repos.json`);
    if (res.ok) {
      const repos = await res.json();
      return { repos, status: 'Showing static mission cache.' };
    }
  } catch {
    /* fall through to hardcoded fallback */
  }

  return {
    repos: FALLBACK_REPOS,
    status: 'Live sync unavailable — showing sample missions.',
  };
}
