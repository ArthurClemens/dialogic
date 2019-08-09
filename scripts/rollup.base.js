/* global process */
import fs from "fs";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pathmodify from "rollup-plugin-pathmodify";
import typescript from "rollup-plugin-typescript2";

const env = process.env;
export const pkg = JSON.parse(fs.readFileSync("./package.json"));
const external = Object.keys(pkg.devDependencies || {});
const name = env.MODULE_NAME;
const isTypeScript = !!process.env.TYPESCRIPT;

const globals = {};
external.forEach(ext => {
  switch (ext) {
  case "mithril":
    globals["mithril"] = "m";
    break;
  case "react":
      globals["react"] = "React";
      break;
  case "react-dom":
    globals["react-dom"] = "ReactDOM";
    break;
  default:
    globals[ext] = ext;
  }
});

export const createConfig = () => {
  const config = {
    input: env.ENTRY || "src/index.ts",
    external,
    output: {
      name,
      globals,
    },
    plugins: [
      pathmodify({
        aliases: [
          {
            id: "mithril/stream",
            resolveTo: "node_modules/mithril/stream/stream.js"
          },
          {
            id: "mithril",
            resolveTo: "node_modules/mithril/mithril.js"
          },
        ]
      }),
      
      resolve({ browser: true }),

      commonjs({
        namedExports: {
          "node_modules/react/index.js": ["Children", "Component", "PropTypes", "createElement", "createFactory"],
          "node_modules/react-dom/index.js": ["render"]
        }
      }),

      isTypeScript && typescript({
        abortOnError: false
      }),

      !isTypeScript && babel({
        exclude: "node_modules/**",
        configFile: "./babel.config.js"
      })

    ]
  };
  
  return config;
};
