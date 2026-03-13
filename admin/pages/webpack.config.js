const path = require('path');

module.exports = {
  entry: './index.js', // Your main JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // The bundled output file
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Regex to match .js files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'development' // or 'production'
};
