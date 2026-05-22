// Cosmic loading screen — fades out 1.3s after the window load event, then removes from DOM.
export function initLoader() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 750);
    }, 1300);
  });
}
