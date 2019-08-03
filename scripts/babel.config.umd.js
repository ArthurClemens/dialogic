const plugins = require("./babel.config.base").plugins;

const presets = [
  "@babel/preset-env",
  "@babel/preset-react"
];

module.exports = {
  presets,
  plugins
};
