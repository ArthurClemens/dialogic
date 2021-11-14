import { svelte } from "@sveltejs/vite-plugin-svelte";
import { ModuleFormat } from "rollup";
import filesize from "rollup-plugin-filesize";
import preprocess from "svelte-preprocess";
import { defineConfig } from "vite";

const packageName = process.env.npm_package_name;

export default defineConfig({
  plugins: [svelte({ preprocess: preprocess() }), filesize()],
  build: {
    target: "modules",
    minify: false,
    sourcemap: true,
    lib: {
      entry: "./src/index.js",
      formats: ["es"],
      fileName: (format: ModuleFormat) => {
        switch (format) {
          case "es":
            return `${packageName}.module.js`;
          default:
            return packageName;
        }
      },
    },
  },
});
