import filesize from "rollup-plugin-filesize";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [filesize()],
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true,
    lib: {
      entry: "./index.ts",
      name: "dialogicMithril",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["mithril", "mithril-hooks"],
    },
  },
});
