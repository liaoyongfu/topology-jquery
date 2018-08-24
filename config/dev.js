const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = webpackMerge(common, {
    entry: [
        'babel-polyfill',
        './example/index.js'
    ],
    devServer: {
        hot: true,
        contentBase: './dist',
        port: 3000
    },
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './example/index.html'
        })
    ]
});