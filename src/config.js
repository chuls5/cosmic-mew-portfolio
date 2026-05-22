// Contributor-tunable knobs. Edit here to fork the site for a different user / different feel.

export const GITHUB_USERNAME = 'chuls5';

// How long to trust the localStorage GitHub repo cache before re-fetching.
// GitHub's unauthenticated API allows 60 requests/hour/IP, so keep this generous.
export const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Hero tagline rotates through these phrases.
export const TYPING_PHRASES = [
  'Turning cosmic dust into production code',
  'Powered by Ultra Punk Punch',
  'Exploring the digital cosmos, one commit at a time',
  'Full-Stack Engineer · Astrophysics Nerd',
];
