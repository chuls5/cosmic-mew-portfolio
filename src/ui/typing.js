import { TYPING_PHRASES } from '../config.js';
import { prefersReducedMotion } from '../utils.js';

// Typewriter animation for the hero tagline. Cycles through TYPING_PHRASES forever.
// Under prefers-reduced-motion, shows the first phrase statically.
export function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  if (prefersReducedMotion()) {
    el.textContent = TYPING_PHRASES[0];
    return;
  }

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const phrase = TYPING_PHRASES[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % TYPING_PHRASES.length;
        setTimeout(tick, 500);
      } else {
        setTimeout(tick, 38);
      }
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 2400);
      } else {
        setTimeout(tick, 68);
      }
    }
  }
  setTimeout(tick, 900);
}
