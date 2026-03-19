
const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.js', // your main JS file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // output directory
  },
  resolve: {
    extensions: ['.js', '.jsx'], // support jsx if used
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // match both js and jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // include react preset if using JSX
          },
        },
      },
    ],
  },
};