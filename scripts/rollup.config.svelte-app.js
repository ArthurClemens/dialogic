import {
  createEnv,
  preprocess,
  readConfigFile,
} from '@pyoner/svelte-ts-preprocess';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import config, {
  dirname,
  filename,
  isTypeScript,
  isModule,
} from './rollup.config';

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

config.plugins = [
  isTypeScript && typescript(),

  svelte({
    preprocess: autoPreprocess(),
    preprocess: preprocess(opts),
  }),

  postcss({
    plugins: [],
    extract: path.resolve(`${dirname}/${filename}-imported.css`),
  }),

  nodeResolve({
    browser: true,
    dedupe,
  }),

  commonjs(),

  !isModule && terser(),

  cleanup({
    comments: 'none',
  }),
].filter(Boolean);

export default config;
