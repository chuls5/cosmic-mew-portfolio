import { defineConfig } from 'vitest/config';

// Restrict vitest to src/. Otherwise it picks up e2e/*.spec.js
// (Playwright tests) and crashes on `test.beforeEach` it doesn't recognize.
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,ts,mts}'],
  },
});
