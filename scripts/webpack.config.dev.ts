import path from 'path';

import { config } from './webpack.config';

const baseDir = process.cwd();

export default {
  ...config,
  mode: 'development',
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    contentBase: path.resolve(baseDir, './dist'),
    historyApiFallback: true,
  },
};
