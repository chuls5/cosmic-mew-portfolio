// Navbar behaviors: hamburger toggle, active section highlight on scroll, scrolled-state styling.
export function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    })
  );

  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navAnchors.forEach((a) => {
          const active = a.getAttribute('href') === `#${e.target.id}`;
          a.classList.toggle('active', active);
          a.setAttribute('aria-current', active ? 'page' : 'false');
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach((s) => activeObserver.observe(s));

  const navbar = document.querySelector('.navbar');
  window.addEventListener(
    'scroll',
    () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    },
    { passive: true }
  );
}
