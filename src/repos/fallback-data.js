import { GITHUB_USERNAME } from '../config.js';

// Last-resort sample data used only if the GitHub API and repos.json both fail.
// Edit freely — these never ship to a real user unless something has gone very wrong.
export const FALLBACK_REPOS = [
  {
    name: 'cosmic-core',
    description: 'Core utilities for cosmic calculations.',
    stargazers_count: 12,
    forks_count: 4,
    html_url: `https://github.com/${GITHUB_USERNAME}/cosmic-core`,
    language: 'TypeScript',
  },
  {
    name: 'nebula-utils',
    description: 'Core utilities for nebula formations.',
    stargazers_count: 8,
    forks_count: 2,
    html_url: `https://github.com/${GITHUB_USERNAME}/nebula-utils`,
    language: 'JavaScript',
  },
  {
    name: 'astro-nav',
    description: 'Simulates galaxy formations and orbital mechanics.',
    stargazers_count: 21,
    forks_count: 5,
    html_url: `https://github.com/${GITHUB_USERNAME}/astro-nav`,
    language: 'Python',
  },
  {
    name: 'galaxy-sim',
    description: 'Simulates galaxy formation processes.',
    stargazers_count: 9,
    forks_count: 3,
    html_url: `https://github.com/${GITHUB_USERNAME}/galaxy-sim`,
    language: 'JavaScript',
  },
  {
    name: 'pulsar-api',
    description: 'High-performance REST API with cosmic conventions.',
    stargazers_count: 6,
    forks_count: 1,
    html_url: `https://github.com/${GITHUB_USERNAME}/pulsar-api`,
    language: 'Node.js',
  },
  {
    name: 'stardust-ui',
    description: 'React component library with a space aesthetic.',
    stargazers_count: 14,
    forks_count: 3,
    html_url: `https://github.com/${GITHUB_USERNAME}/stardust-ui`,
    language: 'TypeScript',
  },
];
