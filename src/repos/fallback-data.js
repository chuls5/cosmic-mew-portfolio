import { GITHUB_USERNAME } from '../config.js';

// Last-resort sample data used only if the GitHub API and repos.json both fail.
// Mirrors the real chuls5 public repos as of 2026-06-04. Refresh occasionally
// (or after publishing a new repo) so the offline experience stays accurate:
//   curl "https://api.github.com/users/chuls5/repos?sort=stargazers&per_page=8"
export const FALLBACK_REPOS = [
  {
    name: 'cosmic-mew-portfolio',
    description:
      'Astrophysics-inspired portfolio — particles, Three.js, GitHub API, pink glitter Mew',
    stargazers_count: 0,
    forks_count: 0,
    html_url: `https://github.com/${GITHUB_USERNAME}/cosmic-mew-portfolio`,
    language: 'JavaScript',
  },
  {
    name: 'Playwright-template',
    description:
      'Comprehensive Playwright testing framework template with Azure DevOps integration via @alex_neo/azure-reporter — accelerates test automation rollout for dev teams.',
    stargazers_count: 0,
    forks_count: 0,
    html_url: `https://github.com/${GITHUB_USERNAME}/Playwright-template`,
    language: 'JavaScript',
  },
  {
    name: 'chuls5',
    description: 'GitHub profile README',
    stargazers_count: 0,
    forks_count: 0,
    html_url: `https://github.com/${GITHUB_USERNAME}/chuls5`,
    language: null,
  },
];
