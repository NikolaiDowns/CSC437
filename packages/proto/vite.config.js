import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main:  path.resolve(__dirname, "index.html"),
        track: path.resolve(__dirname, "track_progress.html"),
        login:   path.resolve(__dirname, "login.html"),
        signup: path.resolve(__dirname, "signup.html"),
      },
    },
  }
});
