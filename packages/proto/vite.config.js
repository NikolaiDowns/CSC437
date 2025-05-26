import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',

  // Pre-bundle Lit reactive-element for faster builds
  optimizeDeps: {
    include: ['@lit/reactive-element']
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:  path.resolve(__dirname, 'index.html'),
        track: path.resolve(__dirname, 'track_progress.html'),
        login: path.resolve(__dirname, 'login.html'),
        signup: path.resolve(__dirname, 'signup.html')
      }
    }
  }
});