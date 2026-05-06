module.exports = function (api) {
  // Enable caching for faster rebuilds
  api.cache(true);

  // Define Babel presets
  const presets = ['@babel/preset-env'];

  // Define Babel plugins
  const plugins = ['@babel/plugin-proposal-class-properties'];

  // Return configuration object
  return {
    presets,
    plugins,
  };
};