import { ModuleFormat } from 'rollup';
import filesize from 'rollup-plugin-filesize';
import { defineConfig } from 'vite';

const packageName = process.env.npm_package_name!;

export default defineConfig({
  plugins: [filesize()],
  build: {
    target: 'modules',
    minify: false,
    sourcemap: true,
    lib: {
      entry: './index.ts',
      name: 'dialogic',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format: ModuleFormat) => {
        switch (format) {
          case 'es':
            return `${packageName}.module.js`;
          case 'umd':
            return `${packageName}.umd.js`;
          case 'cjs':
            return `${packageName}.cjs`;
          default:
            return packageName;
        }
      },
    },
    rollupOptions: {
      external: ['mithril-stream-standalone'],
    },
  },
});
