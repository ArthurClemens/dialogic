import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import filesize from "rollup-plugin-filesize";
import preprocess from "svelte-preprocess";

export default defineConfig({
  plugins: [svelte({ preprocess: preprocess() }), filesize()],
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
