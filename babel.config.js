module.exports = function (api) {
  const presets = [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ];
  const plugins = [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-object-assign"
  ];

  api.cache(false);

  return {
    presets,
    plugins,
  };
};
