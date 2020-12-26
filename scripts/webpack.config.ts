/* global process */
import type { Configuration } from 'webpack';

import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackModules from 'webpack-modules';

const baseDir = process.cwd();
const env = process.env; // eslint-disable-line no-undef
const babelConfigFile = env.BABEL_CONFIG
  ? path.resolve(baseDir, env.BABEL_CONFIG)
  : '../../babel.config.js';

const config: Configuration = {
  context: path.resolve(baseDir, './src'),

  entry: {
    index: path.resolve(baseDir, env.ENTRY || './src/index.js'),
  },

  output: {
    path: path.resolve(baseDir, './dist'),
    filename: 'js/[name].js',
  },

  resolve: {
    // Make sure that libs are included only once
    alias: {
      mithril$: path.resolve(baseDir, 'node_modules/mithril/mithril.js'), // Note the exact match
      react: path.resolve(baseDir, 'node_modules/react'),
      'mithril-hooks': path.resolve(baseDir, 'node_modules/mithril-hooks'),
      'react-dom': path.resolve(baseDir, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(
        baseDir,
        'node_modules/react-router-dom',
      ),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: babelConfigFile,
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: babelConfigFile,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    new WebpackModules(),
    new MiniCssExtractPlugin({
      filename: 'css/app.css',
    }),
  ],

  devtool: 'source-map',
};

export default config;
