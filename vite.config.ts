import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ВАЖНО: для кастомного домена (root) путь должен быть "/"
  // (если бы деплоили в под-папку, был бы "/<repo-name>/")
  base: "/",

  server: {
    port: 5173,
    open: true,
    strictPort: true,
  },

  // Просмотр собранного билда: http://localhost:5173
  preview: {
    port: 5173,
    open: true,
    strictPort: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2019",
    sourcemap: false,
  },
});
