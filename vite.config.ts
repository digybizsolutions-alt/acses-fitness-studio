import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // "/" for root-domain hosting; "/<repo>/" for GitHub Pages project sites (set by the deploy workflow).
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep Three.js in its own chunk so it never blocks first render.
        manualChunks: { three: ['three'] },
      },
    },
  },
});
