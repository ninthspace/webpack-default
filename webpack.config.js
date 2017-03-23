// Made with help from 
// - https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.hyxiqhrhk
// - http://webpackcasts.com

const webpack = require('webpack');
const path = require('path');
const inProduction = (process.env.NODE_ENV === 'production');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

// we bring intercooler in here, because of issues with importing
// https://github.com/LeadDyno/intercooler-js/pull/117

module.exports = {
    context: path.resolve(__dirname, './resources'),
    entry: {
        vendor: ['./src/js/vendor.js', './src/bower_components/intercooler-js/src/intercooler.js'],
        app: ['./src/app.js', './src/styles.js'],
    },
    output: {
        path: path.resolve(__dirname, './resources/public'),
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
                test: /\.(ttf|eot|svg|png|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },

    plugins: [
        // in case you want to copy files during building
        // new CopyWebpackPlugin([
        //     {
        //         from: 'somewhere',
        //         to: 'somewhere-else'
        //     }
        // ], {
        //     copyUnmodified: true
        // }),
        new CleanWebpackPlugin(['public'], {
            root: path.resolve(__dirname, './resources'),
            verbose: true,
            dry: false,
            exclude: []
        }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        function () {
            this.plugin('done', function (stats) {
                require('fs').writeFileSync(
                    path.join(__dirname, 'resources/public/manifest.json'),
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