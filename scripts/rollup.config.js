import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

const { env } = process;
const pkg = JSON.parse(fs.readFileSync('./package.json'));

const isModule = !!parseInt(env.MODULE, 10);
const format = isModule ? 'es' : 'umd';
const file = isModule
  ? `${process.env.DEST || pkg.module}`
  : `${process.env.DEST || pkg.main}.js`;
const target = isModule ? 'es2017' : 'es2015';
const ext = path.extname(file);
const filename = path.basename(file, ext);
const dirname = path.dirname(file, ext);

const isTypeScript = !!parseInt(env.TYPESCRIPT, 10);
const input = env.ENTRY || 'src/index.js';

export default {
  input,
  output: {
    name: env.MODULE_NAME,
    format,
    file,
    sourcemap: !isModule,
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
  ].filter(Boolean),
};

export { dirname, filename, isModule, isTypeScript };
