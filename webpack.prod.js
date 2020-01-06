const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const cssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'css/style.[hash].css',
});

const API_URL_SAVE = JSON.stringify('/broker/save');
const ENV_UTAG = JSON.stringify('prod');
const ENV_MODE = JSON.stringify('production');
const definePlugin = new webpack.DefinePlugin({
  API_URL_SAVE,
  ENV_UTAG,
  ENV_MODE,
});

module.exports = merge(
  {
    mode: 'production',
    output: {
      filename: 'js/bundle.[hash].js',
      publicPath: '/broker',
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            keep_fnames: true,
          },
          cache: true,
          parallel: true,
          sourceMap: true, // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    plugins: [cssExtractPlugin, definePlugin],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|bmp|ico)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[hash].[ext]',
              publicPath: '/broker',
            },
          },
        },
      ],
    },
  },
  common
);
