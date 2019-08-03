module.exports = function (api) {
  const presets = [
    "@babel/preset-env",
    "@babel/preset-react"
  ];
  const plugins = [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-proposal-object-rest-spread",
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "jsx"
    }]
  ];

  api.cache(false);

  return {
    presets,
    plugins,
  };
};
