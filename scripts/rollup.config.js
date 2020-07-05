import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

const { env } = process;
const pkg = JSON.parse(fs.readFileSync('./package.json'));

const isModule = !!parseInt(env.MODULE, 10);
const format = isModule ? 'es' : 'umd';
const target = isModule ? 'ESNEXT' : undefined;
const file = isModule
  ? `${process.env.DEST || pkg.module}`
  : `${process.env.DEST || pkg.main}.js`;
const isTypeScript = !!parseInt(env.TYPESCRIPT, 10);
const input = env.ENTRY || 'src/index.js';

export default {
  input,
  output: {
    name: env.MODULE_NAME,
    format,
    file,
  },
  plugins: [
    isTypeScript &&
      typescript({
        target,
      }),

    !isModule && terser(),
    cleanup({
      comments: 'none',
    }),
  ],
};
