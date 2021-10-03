import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import filesize from "rollup-plugin-filesize";

export default defineConfig({
  plugins: [svelte(), filesize()],
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true,
    lib: {
      entry: "./src/index.js",
      formats: ["es"],
    },
  },
});
