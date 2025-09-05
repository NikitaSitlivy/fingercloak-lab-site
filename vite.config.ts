import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages + кастомного домена всегда корень
  base: "/",

  server: {
    port: 5173,
    open: true,
    host: true,
  },

  preview: {
    port: 4173,
    open: true,
    host: true,
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    // компактный вывод; без разбивки чанков — Pages обычно ок и так
    rollupOptions: { output: { manualChunks: undefined } },
  },
});
