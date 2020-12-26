import config from './rollup.config';
import svelte from 'rollup-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

config.plugins.unshift(
  svelte({
    dev: !production,
    preprocess: autoPreprocess(),
  }),
);

export default config;
