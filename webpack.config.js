const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './ui/index.jsx',
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/output'),
    //path: './output',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'ui/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: {
      index: '/',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
      },
    },
  },
};
