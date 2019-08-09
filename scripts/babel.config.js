module.exports = function (api) {
  
  api.cache.forever();

  const presets = [
    "@babel/preset-typescript",
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

  return {
    presets,
    plugins,
  };
};
