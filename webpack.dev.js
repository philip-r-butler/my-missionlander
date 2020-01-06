const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const API_URL_SAVE = JSON.stringify(
  '//c9fc2347-35c2-4a1e-a15e-f655dcd4d8f8.mock.pstmn.io/broker/save'
);
const ENV_UTAG = JSON.stringify('dev');
const ENV_MODE = JSON.stringify('development');
const definePlugin = new webpack.DefinePlugin({
  API_URL_SAVE,
  ENV_UTAG,
  ENV_MODE,
});

module.exports = merge(
  {
    mode: 'development',
    output: {
      filename: 'js/bundle.[hash].js',
      publicPath: '/',
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    plugins: [definePlugin],
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|svg|bmp|ico)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[hash].[ext]',
              publicPath: '/',
            },
          },
        },
      ],
    },
  },
  common
);
