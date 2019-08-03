import fs from "fs";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const pkg = JSON.parse(fs.readFileSync("./package.json"));
const production = !process.env.ROLLUP_WATCH;
const isModule = !!process.env.MODULE;
const format = isModule
  ? "es"
  : "umd";
const file = isModule
  ? `${process.env.DEST || pkg.main}.mjs`
  : `${process.env.DEST || pkg.main}.js`;

export default {
  input: "src/index.ts",
  output: {
    sourcemap: true,
    format,
    name: pkg.name,
    file
  },
  plugins: [

    resolve({ browser: true }),
    commonjs(),
    typescript({
      abortOnError: false
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && !isModule && terser()
  ]
};
