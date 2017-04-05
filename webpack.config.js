// https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.hyxiqhrhk

var webpack = require('webpack');
var path = require('path');
var inProduction = (process.env.NODE_ENV === 'production');

var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './resources/assets'),
    entry: {
        vendor: ['./js/vendor.js'],
        app: ['./js/app.js', './stylus/styles.js'],
    },
    output: {
        path: path.resolve(__dirname, './public/assets'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'stylus-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash].[ext]'
                        }
                    },
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[hash].[ext]'
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },

    plugins: [
        // new CopyWebpackPlugin([
        //     {
        //         from: 'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
        //         to: 'js'
        //     }
        // ], {
        //     copyUnmodified: true
        // }),
        new CleanWebpackPlugin(['public/assets'], {
            root: path.resolve(__dirname),
            verbose: true,
            dry: false
        }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        function () {
            this.plugin('done', function (stats) {
                require('fs').writeFileSync(
                    path.join(__dirname, 'public/assets/manifest.json'),
                    JSON.stringify(stats.toJson().assetsByChunkName, null, '\t')
                );
            });
        }
    ],
}

if (inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments: {removeAll: true}},
            canPrint: true
        })
    );
}