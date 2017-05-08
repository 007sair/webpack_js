/**
 * 项目配置文件
 * ---------------------
 * 项目名称：拼团5.4
 * 创建人：龙潺
 * 创建时间：2017/05/04
 * 描述：压缩拼团5.4项目的js
 */

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var args = require('yargs').argv;  //https://github.com/webpack/webpack/issues/2254
var root = path.resolve(process.cwd(), './');
require('shelljs/global');
var isProd = args.prod;

console.log(isProd)

var oPath = {
    src: {
        index: path.join(process.cwd(), '/src/js/project/groupon5.4/index.js'),
        g_detail: path.join(process.cwd(), '/src/js/project/groupon5.4/g_detail.js')
    },
    dist: 'dist/js/'
};

if (isProd) {
    rm('-rf', oPath.dist + '/*.map')
};

module.exports = {
    cache: true,
    devtool: isProd ? '' : "source-map",
    entry: oPath.src,
    output: {
        path: path.join(process.cwd(), oPath.dist),
        publicPath: "",
        filename: isProd ? '[name].js' : '[name].js',
        chunkFilename: "[name].js"
    },
    resolve: {
        extensions: ['.js', '.json', '.scss'],
        alias: {
            Lib : root + '/src/js/lib/',
            Mods : root + '/src/js/mods/'
        }
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        }),
        new uglifyJsPlugin({
            compress: {warnings: false},
            sourceMap: isProd ? false : true
        })
    ]
};