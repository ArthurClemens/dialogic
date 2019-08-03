module.exports = api => {
  const presets = []; // set in specific configs for es and umd
  const plugins = [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-proposal-object-rest-spread"
  ];

  api.cache(false);

  return {
    presets,
    plugins,
  };
};
