// Theme toggle (Default ↔ Nebula). Persisted to localStorage under key `theme`.
const STORAGE_KEY = 'theme';

export function initTheme() {
  if (localStorage.getItem(STORAGE_KEY) === 'nebula') {
    document.body.classList.add('nebula-mode');
  }

  function toggle() {
    document.body.classList.toggle('nebula-mode');
    localStorage.setItem(
      STORAGE_KEY,
      document.body.classList.contains('nebula-mode') ? 'nebula' : 'default'
    );
  }

  document.getElementById('theme-toggle')?.addEventListener('click', toggle);
  document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggle);
}
