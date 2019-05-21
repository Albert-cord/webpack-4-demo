
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
                new ExtractTextPlugin({
            filename: '[name].min.css',
            allChunks: true
        }),
        new UglifyJsPlugin({
            test: /\.js$/
        }),
        new CleanWebpackPlugin(['dist'])
    ]
}