// Shared modal behavior: open/close, body scroll lock, `inert` on main, focus management.
// Each feature module (repos, blog) gets its own modal via createModal() and fills in content
// in the populate() callback passed to open().

const registry = new Set();

export function createModal(overlayId, closeBtnId) {
  const overlay = document.getElementById(overlayId);
  const closeBtn = document.getElementById(closeBtnId);
  const main = document.querySelector('main');
  let trigger = null;

  function open(triggerEl, populate) {
    trigger = triggerEl || null;
    if (populate) populate();
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    main.setAttribute('inert', '');
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    main.removeAttribute('inert');
    if (trigger) {
      trigger.focus();
      trigger = null;
    }
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  registry.add(close);
  return { open, close, overlay };
}

// Single global Escape listener closes whichever modal is open.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') registry.forEach((close) => close());
});
