import config, { filename, dirname } from './rollup.config';
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import autoPreprocess from 'svelte-preprocess';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import {
  preprocess,
  createEnv,
  readConfigFile,
} from '@pyoner/svelte-ts-preprocess';

const env = createEnv();
const compilerOptions = readConfigFile(env);
const opts = {
  env,
  compilerOptions: {
    ...compilerOptions,
    allowNonTsExtensions: true,
  },
};
const production = !process.env.ROLLUP_WATCH;

// https://github.com/sveltejs/svelte/issues/3165
const dedupe = importee =>
  importee === 'svelte' || importee.startsWith('svelte/');

config.plugins.unshift(commonjs());

config.plugins.unshift(
  resolve({
    browser: true,
    dedupe,
  }),
);

config.plugins.unshift(
  postcss({
    plugins: [],
    extract: path.resolve(`${dirname}/${filename}-imported.css`),
  }),
);

config.plugins.unshift(
  svelte({
    compilerOptions: {
      // enable run-time checks when not in production
      dev: !production,
    },
    preprocess: autoPreprocess(),
    preprocess: preprocess(opts),
  }),
);

export default config;
