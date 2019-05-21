
const path = require('path');
const PurifyCss = require('purifycss-webpack');
const glob = require('glob-all');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

let spritesConfig = {
    spritePath: "./dist/static"
  };

let purifyCss = new PurifyCss({
    paths: glob.sync([
        path.resolve(__dirname, './*.html'),
        path.resolve(__dirname, './*.js'),
        path.resolve(__dirname, './pages/*.js')
    ])
});

module.exports = {
    entry: {
        app: './app.js',
        pageA: './pages/pageA.js',
        pageB: './pages/pageB.js',
    },
    output: {
        publicPath: __dirname + '/dist/',
        // publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        alias: {
            jQuery_Alias: path.resolve(__dirname, 'vendor/jquery.min.js')
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    priority: 0,
                    minSize: 1,
                    chunks: "async"
                },
                vendors: {
                    name: "vendors",
                    priority: 10,
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all"
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         // {
            //         //     loader: 'style-loader/url'
            //         // },
            //         // {
            //         //     loader: 'file-loader'
            //         // }

            //         {
            //             loader: 'style-loader',
            //             options: {
            //                 singleton: true,
            //                 transform: './base.transform.js'
            //             }
            //         },
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 minisize: true
            //             }
            //         }
            //         // {
            //         //     loader: 'style-loader/useable'
            //         // },
            //         // {
            //         //     loader: 'css-loader'
            //         //     // loader: 'file-loader'
            //         // }
            //     ]
            // },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         {
            //             loader: 'style-loader'
            //         },
            //         {
            //             loader: 'css-loader'
            //         },
            //         {
            //             loader: 'sass-loader'
            //         }
            //     ]
            // },
            {
                test: /\.(css)$/,
                use:   ExtractTextPlugin.extract({
                        fallback: {
                            loader: 'style-loader',
                            options: {
                                singleton: true
                            }
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minisize: true
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins:[require('postcss-sprites')(spritesConfig)]
                                }
                            }
                        ]
                    })
                
            },
            {
                test: /\.(scss)$/,
                use:   ExtractTextPlugin.extract({
                        fallback: {
                            loader: 'style-loader'
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minisize: true
                                }
                            },
                            {
                                loader: 'sass-loader'
                            }
                        ]
                    })
                
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src']
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use:[
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 20000,
                            publicPath: 'static/',
                            outputPath: 'static/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-pngquant')({
                                    quality: '80'
                                }),
                                require('imagemin-mozjpeg')({
                                    quality: '50'
                                })
                            ]
                        }
                    }
                ]                
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000,
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    mode: 'development',
    // mode: 'production',
    devtool: 'source-map',
    // devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
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
        rewrites: [{from: /.*/, to: './dist/index.html'}]
        }
    },
    plugins: [

        new ExtractTextPlugin({
            filename: '[name].min.css',
            allChunks: true
        }),
        purifyCss,
        new UglifyJsPlugin({
            test: /\.js$/
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['app', 'pageA', 'pageB'],
            minify: {
                collapseWhitespace: true
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQueryAlias: 'jQuery_Alias'
        }),
        new CleanWebpackPlugin(['dist'])
    ]
}