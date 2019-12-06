//webpack.dev.js
const path = require('path')
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const srcDir = path.join(process.cwd(),"app");
const distDir = path.join(process.cwd(),"public");

module.exports = merge(common, {
	mode: "production",
	// entry: {
	// 	common:["react", "react-dom"]
	// },
	// devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.(htm|html)$/,
				enforce: 'pre',
				use: [{
					loader: 'webpack-strip-blocks',
					options: {
						blocks: ['debug'],
						start: '<!--',
						end: '-->'
					}
				}]
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: [{
					loader: 'webpack-strip-blocks',
					options: {
						blocks: ['debug'],
						start: '/*',
						end: '*/'
					}
				}]
			}
		]
	},
	plugins: [
		// JS压缩
		// Deprecated
		// new webpack.optimize.UglifyJsPlugin({
		// 	// sourceMap: true,
		// 	output: {
		// 		comments: false,  // remove all comments
		// 	},
		// 	compress: {
		// 		warnings: false,
		// 		drop_debugger: true,  
        //   		drop_console: true

		// 	}
		// }),
		// CSS提取
		new ExtractTextPlugin("[name].[chunkhash].css"),
		// 共同模块
		new webpack.optimize.SplitChunksPlugin({
			chunks: "all",
			minSize: 5000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			name: true,
			cacheGroups: {
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
				commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
					priority: -10
                }
			}
		}),
		// Deprecated
        // new CommonsChunkPlugin({
        //     name: ["chunk", "common"],//对应于上面的entry的key
        //     minChunks:2
		// }),
		new CleanWebpackPlugin(
		    //匹配删除的文件
		    [
		        distDir + '/*.css',
		        distDir + '/*.js',
		        distDir + '/*.map'
		    ],
		    {
		        root: process.cwd(),       　　　　　　　　　　//根目录
		        verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
		        dry:      false        　　　　　　　　　　//启用删除文件
		    }
		)
		// Deprecated
		// new webpack.DefinePlugin({
		// 	'process.env': JSON.stringify({NODE_ENV: "production"})
		// })
	]
})