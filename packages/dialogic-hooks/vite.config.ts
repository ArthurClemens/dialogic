import { defineConfig } from "vite";
import filesize from "rollup-plugin-filesize";
export default defineConfig({
  plugins: [filesize()],
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true,
    lib: {
      entry: "./index.ts",
      formats: ["es"],
    },
  },
});
