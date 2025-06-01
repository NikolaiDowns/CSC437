// packages/app/vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:   "index.html",
        // If you ever need to expose track_progress.html directly, you can re-enable this:
        // track:  "public/track_progress.html",
        login:  "public/login.html",
        signup: "public/signup.html",
      },
    },
  },

  server: {
    port: 5173,
    proxy: {
      //
      // 1) Any “/auth/…” URL (e.g. /auth/login) is rewritten to /api/auth/… on your backend
      //    so that you can still write fetch("/auth/login") in proto if you want.
      //
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, "/api/auth"),
      },

      //
      // 2) Any “/api/auth/…” URL (including /api/auth/me) is forwarded straight to port 3000:
      //
      "/api/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // no rewrite() here—/api/auth/me → http://localhost:3000/api/auth/me
      },

      //
      // 3) If you serve images from your Node server (e.g. fetch("/images/foo.png")),
      //    keep this proxy rule so that Vite will forward /images/* to port 3000:
      //
      "/images": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
