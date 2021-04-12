import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { config } from './webpack.config';

export default {
  ...config,
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  plugins: [...(config.plugins || []), new CompressionPlugin()],
};
