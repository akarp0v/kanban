const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const StylelintPlugin = require('stylelint-webpack-plugin');
const liveReloadPlugin = require('webpack-livereload-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js',
  },
  devServer: {
    contentBase: path.join(__dirname, '../src'),
    watchContentBase: true,
    inline: true,
    hot: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new liveReloadPlugin(),
    new StylelintPlugin({
      files: path.join('src', '**/*.s?(a|c)ss'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader?sourceMap=true', 'postcss-loader', 'sass-loader'],
      },
    ],
  }
});
