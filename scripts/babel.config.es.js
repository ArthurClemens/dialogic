const plugins = require("./babel.config.base").plugins;

const presets = [
  ["@babel/preset-env",
    {
      "targets": {
        "esmodules": true
      }
    }
  ],
  "@babel/preset-react"
];

module.exports = {
  presets,
  plugins
};
