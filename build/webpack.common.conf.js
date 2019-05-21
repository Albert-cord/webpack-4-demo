
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCss = require('purifycss-webpack');
const glob = require('glob-all');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let spritesConfig = {
    spritePath: "./dist/static"
  };

let purifyCss = new PurifyCss({
    paths: glob.sync([
        path.resolve(__dirname, '../*.html'),
        path.resolve(__dirname, '../*.js'),
        path.resolve(__dirname, '../pages/*.js')
    ])
});

const merge = require("webpack-merge");

const productionConfig = require("./webpack.prod.conf");
const developmentConfig = require("./webpack.dev.conf");

const getCommonConfig = (env) => {

    let cssLoaderUse = [
        {
            loader: 'css-loader',
            options: {
                minisize: true,
                sourceMap: env == 'production' ? false : true
            }
        }
    ];
    cssLoaderUse = env == 'development' ? (cssLoaderUse.unshift(
        {
            loader: 'style-loader/url'
        }
    ), cssLoaderUse) : cssLoaderUse;

    let styleLoaderUse = env == 'production' ? ExtractTextPlugin.extract({
        fallback: {
            loader: 'style-loader',
            options: {
                singleton: true
            }
        },
        use: [
            ...cssLoaderUse,
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins:[require('postcss-sprites')(spritesConfig)]
                }
            }
        ]
    }) : [
        ...cssLoaderUse,
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins:[require('postcss-sprites')(spritesConfig)]
            }
        }
    ];

    let sassLoaderUse = env == 'production' ? ExtractTextPlugin.extract({
        fallback: {
            loader: 'style-loader'
        },
        use: [
            ...cssLoaderUse,
            {
                loader: 'sass-loader'
            }
        ]
    }) : [
        ...cssLoaderUse,
        {
            loader: 'sass-loader'
        }
    ];

    return {
        entry: {
            app: './app.js',
            pageA: './pages/pageA.js',
            pageB: './pages/pageB.js',
        },
        output: {
            publicPath: env == 'production' ? path.resolve(__dirname, "..", "dist") : '/',
            // publicPath: '/dist/',
            path: path.resolve(__dirname, "..", "dist"),
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js'
        },
        resolve: {
            alias: {
                jQuery_Alias: path.resolve(__dirname, '../vendor/jquery.min.js')
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
                {
                    test: /\.(css)$/,
                    use:   styleLoaderUse
                },
                {
                    test: /\.(scss)$/,
                    use: sassLoaderUse   
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
        plugins: [

            purifyCss,
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './index.html',
                chunks: ['app', 'pageA', 'pageB'],
                minify: {
                    collapseWhitespace: true
                }
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQueryAlias: 'jQuery_Alias'
            }),
        ]
    }
}; 

module.exports = env => {
  let config = env === "production" ? productionConfig : developmentConfig;
  return merge(getCommonConfig(env), config); // 合并 公共配置 和 环境配置

};
