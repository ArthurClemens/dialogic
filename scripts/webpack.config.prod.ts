/* global process */

import config from './webpack.config';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const env = process.env;

config.mode = 'production';

config.optimization = {
  minimizer: [new TerserPlugin()],
};

config.plugins.push(new CompressionPlugin());

if (env.ANALYSE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

export default config;
