/* global process */
const path = require('path');
const config = require('./webpack.config.js');

const baseDir = process.cwd();

config.mode = 'development';

config.devServer = {
  contentBase: path.resolve(baseDir, './dist'),
  publicPath: '/dist',
  compress: true,
  port: 3000,
  historyApiFallback: true,
};

config.watchOptions = {
  ignored: /node_modules/,
};

config.output.publicPath = 'http://localhost:3000/';

module.exports = config;
