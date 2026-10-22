/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Only files in /public are copied verbatim. /private-material is never referenced.
  publicDir: 'public',
  build: {
    sourcemap: false,
    // All lecture content is bundled on purpose (static site, works offline once loaded, ~215 kB gzip).
    chunkSizeWarningLimit: 900,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
