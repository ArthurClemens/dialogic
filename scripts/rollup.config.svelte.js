import config from "./rollup.config";
import svelte from "rollup-plugin-svelte";

const production = !process.env.ROLLUP_WATCH;

config.plugins.unshift(
  svelte({
    dev: !production,
    // preprocess: preprocess(opts)
  }),
);

export default config;
