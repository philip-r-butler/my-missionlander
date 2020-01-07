const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const APP_VERSION = JSON.stringify(process.env.npm_package_version);
const APP_SOURCE = JSON.stringify(process.env.npm_package_name);

const cleanPlugin = new CleanWebpackPlugin(['dist']);
const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html',
});
const cssPlugin = new MiniCssExtractPlugin({
    filename: 'css/style.[hash].css',
});
const definePlugin = new webpack.DefinePlugin({
    APP_VERSION,
    APP_SOURCE,
});
const copyAssetsPlugin = new CopyWebpackPlugin([
    {from: './src/assets', to: 'assets'},
])

module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
    },
    resolve: {extensions: ['.js', '.jsx', '.mjs']},
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(sa|sc)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader', // Loads a sass / scss file and compiles it to CSS
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[hash].[ext]',
                            publicPath: '../',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [htmlPlugin, cssPlugin, cleanPlugin, definePlugin, copyAssetsPlugin],
};
