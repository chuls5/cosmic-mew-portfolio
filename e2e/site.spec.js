import { test, expect } from '@playwright/test';

// Critical-path E2E tests. Run against `vite preview` (production build).
// Two projects (desktop + mobile) defined in playwright.config.js exercise the same
// tests at both viewport sizes — validates the responsive breakpoints.

// Block third-party CDNs (Font Awesome, Google Fonts) and stub the GitHub API.
// The CDN blocks fire 'load' faster (otherwise the loader can hang the page for
// 30s+ behind a slow cdnjs request). The API stubs avoid 60 req/hr rate-limit flakes.
test.beforeEach(async ({ page }) => {
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());

  await page.route('**/api.github.com/users/chuls5/repos**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          name: 'cosmic-mew-portfolio',
          description: 'Test repo from E2E stub',
          stargazers_count: 42,
          forks_count: 7,
          html_url: 'https://github.com/chuls5/cosmic-mew-portfolio',
          language: 'JavaScript',
        },
      ]),
    });
  });
  await page.route('**/api.github.com/repos/**/readme', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<p>Stubbed README.</p>',
    });
  });
});

// Prepares the page for assertions:
//   1. Removes the cosmic loader (otherwise it blocks clicks for ~2s).
//   2. Force-applies `.visible` to every `.reveal` element so opacity-0 cards
//      below the fold are immediately assertable without scrolling.
async function gotoReady(page, path = '/') {
  await page.goto(path);
  await page.evaluate(() => {
    document.getElementById('loader')?.remove();
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  });
}

test.describe('cosmic-mew-portfolio', () => {
  test('renders the hero with the correct title and tagline', async ({ page }) => {
    await gotoReady(page);
    await expect(page).toHaveTitle(/Cody Huls/);
    // h1.glitch contains pseudo-element duplicates ("CODY HULS CODY HULS CODY HULS"
    // in the a11y tree) — locate by element/class instead of accessible name.
    await expect(page.locator('h1.glitch')).toBeVisible();
    await expect(page.locator('h1.glitch')).toHaveAttribute('data-text', 'CODY HULS');
    await expect(page.getByText('Astrophysics-Inspired Full-Stack Engineer')).toBeVisible();
  });

  test('all expected sections are present', async ({ page }) => {
    await gotoReady(page);
    for (const heading of [
      'MISSION BRIEFING',
      'SYSTEMS ONLINE',
      'ACTIVE MISSIONS',
      'TRANSMISSION LOG',
      'ESTABLISH COMMUNICATION',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
  });

  test('theme toggle persists across reload', async ({ page, isMobile }) => {
    await gotoReady(page);

    // On mobile the controls live inside the hamburger drawer — open it first.
    if (isMobile) {
      await page.locator('#hamburger').click();
    }

    const before = await page.evaluate(() =>
      document.body.classList.contains('nebula-mode')
    );

    const selector = isMobile ? '#theme-toggle-mobile' : '#theme-toggle';
    await page.locator(selector).click();

    const after = await page.evaluate(() =>
      document.body.classList.contains('nebula-mode')
    );
    expect(after).toBe(!before);

    await gotoReady(page);
    const persisted = await page.evaluate(() =>
      document.body.classList.contains('nebula-mode')
    );
    expect(persisted).toBe(after);
  });

  test('blog card opens a modal showing the DRAFT badge', async ({ page }) => {
    await gotoReady(page);
    const firstCard = page.locator('.blog-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    const modal = page.locator('#blog-modal');
    await expect(modal).toHaveClass(/open/);
    await expect(page.locator('#blog-modal-draft')).toBeVisible();
    await expect(page.locator('#blog-modal-title')).not.toBeEmpty();

    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/open/);
  });

  test('project card opens the repo modal with stubbed data', async ({ page }) => {
    await gotoReady(page);
    const card = page.locator('.project-card').first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card).toContainText('cosmic-mew-portfolio');

    await card.click();
    const modal = page.locator('#modal');
    await expect(modal).toHaveClass(/open/);
    await expect(page.locator('#modal-title')).toContainText('cosmic-mew-portfolio');
    await expect(page.locator('#modal-readme')).toContainText('Stubbed README', {
      timeout: 5_000,
    });
  });

  test('contact section has real email and no placeholder twitter link', async ({ page }) => {
    await gotoReady(page);
    const mailto = page.locator('a[href^="mailto:"]');
    await expect(mailto).toHaveAttribute('href', 'mailto:coco.nova.llc@gmail.com');
    await expect(page.locator('a[href*="twitter.com"]')).toHaveCount(0);
  });
});

test.describe('mobile-only behaviors', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile viewport only');

  test('hamburger opens nav drawer and closes on link click', async ({ page }) => {
    await gotoReady(page);
    const hamburger = page.locator('#hamburger');
    await expect(hamburger).toBeVisible();

    const navLinks = page.locator('#nav-links');
    await hamburger.click();
    await expect(navLinks).toHaveClass(/open/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await navLinks.locator('a[href="#about"]').click();
    await expect(navLinks).not.toHaveClass(/open/);
  });
});
