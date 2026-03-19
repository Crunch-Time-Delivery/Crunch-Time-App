// webpack.config.js
const path = require('path'); //

module.exports = { //
  entry: './src/index.js', // The starting point of your application
  output: {
    filename: 'main.bundle.js', // The name for the generated bundle
    path: path.resolve(__dirname, 'dist'), // The output directory
  },
  // Add other configurations like loaders, plugins, and mode as needed
  mode: 'development', // or 'production' or 'none'
};

