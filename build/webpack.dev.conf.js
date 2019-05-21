
const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, '..', 'dist'),
        // publicPath: path.resolve(__dirname, 'dist'),
        // contentBase: '/dist/',
        port: 8888,
        compress: true,
        hot: true,
        overlay: true,
        proxy: {
            '/comments': {
                target: 'https://m.weibo.cn',
                changeOrigin: true,
                logLevel: 'debug',
                headers: {
                    Cookie: ''
                }
            }
        },
        historyApiFallback: {
        rewrites: [{from: /.*/, to: './index.html'}]
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}