// Shared IntersectionObserver that adds `.visible` to `.reveal` elements as they enter the viewport.
// Other modules (repos, blog renderers) import this same observer and call `.observe(el)` on new cards.
export const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08 }
);

export function initReveal() {
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}
