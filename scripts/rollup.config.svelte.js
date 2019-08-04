import config from "./rollup.config";
import svelte from "rollup-plugin-svelte";

// import {
//   preprocess,
//   createEnv,
//   readConfigFile
// } from "@pyoner/svelte-ts-preprocess";

// const env = createEnv();
const production = !process.env.ROLLUP_WATCH;

// const compilerOptions = readConfigFile(env);

// const opts = {
//   env,
//   compilerOptions: {
//     ...compilerOptions,
//     allowNonTsExtensions: true
//   }
// };

config.plugins.unshift(
  svelte({
    dev: !production,
    // preprocess: preprocess(opts)
  }),
);

export default config;
