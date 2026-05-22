// Custom cursor with sparkle particle trail. Disabled on touch devices.
// Under prefers-reduced-motion, the cursor still tracks the mouse but no sparkles spawn
// (sparkles rely on the `sparkle-out` CSS animation, which is neutralized by the reduced-motion
// override — leaving them as static dots that never clean up).
import { prefersReducedMotion } from '../utils.js';

const COLORS = ['#ff69b4', '#c026d3', '#a855f7', '#ffffff'];
const SPARKLE_INTERVAL_MS = 55;

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  const reduced = prefersReducedMotion();
  let lastSparkle = 0;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    if (reduced) return;
    const now = Date.now();
    if (now - lastSparkle > SPARKLE_INTERVAL_MS) {
      lastSparkle = now;
      const s = document.createElement('div');
      s.className = 'sparkle';
      const size = 3 + Math.random() * 5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      s.style.cssText = `left:${e.clientX + (Math.random() - 0.5) * 16}px;top:${
        e.clientY + (Math.random() - 0.5) * 16
      }px;width:${size}px;height:${size}px;background:${color}`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 680);
    }
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest("a, button, [role='button']")) cursor.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest("a, button, [role='button']")) cursor.classList.remove('hovering');
  });
}
