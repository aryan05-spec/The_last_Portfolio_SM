import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tailwind runs through its Vite plugin. An inline (empty) PostCSS config
  // stops Vite from walking up the directory tree and picking up unrelated
  // postcss.config files outside this project.
  css: { postcss: {} },
});
