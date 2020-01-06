const webpack = require('webpack');
const merge = require('webpack-merge');
const production = require('./webpack.prod.js');

const ENV_UTAG = JSON.stringify('dev');
const ENV_MODE = JSON.stringify('test');

const definePlugin = new webpack.DefinePlugin({
  ENV_UTAG,
  ENV_MODE,
});

module.exports = merge(
  {
    plugins: [definePlugin],
  },
  production
);
