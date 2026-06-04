import { defineConfig, devices } from '@playwright/test';

// E2E test config. Runs against the built site via `vite preview`.
// Two projects (desktop + mobile) validate the responsive breakpoints we added.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Cap workers — WebGL + canvas animations + Vite preview thrash a single
  // dev machine if too many browsers run in parallel.
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173/cosmic-mew-portfolio/',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    // Vite preview requires a build first. Chain both so the test suite is self-contained.
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/cosmic-mew-portfolio/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
