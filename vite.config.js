import { defineConfig } from 'vite';

// GitHub Pages serves this site under /cosmic-mew-portfolio/.
// For local dev (`npm run dev`) Vite ignores `base` for the dev URL, so this only affects built asset paths.
export default defineConfig({
  base: '/cosmic-mew-portfolio/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    port: 5173,
    open: true,
  },
});
