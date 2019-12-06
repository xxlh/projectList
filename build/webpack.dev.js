//webpack.dev.js
const path = require('path')
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const ip = require('ip');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HotModuleReplacementPlugin = require('Hot Module Replacement');
const distDir = path.join(process.cwd(), "public");

module.exports = merge(common, {
	mode: "development",
	output: {
		filename: "[name].[hash].js"			//打包后输出文件的文件名
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: distDir,	//本地服务器所加载的页面所在的目录
		historyApiFallback: true,	//不跳转
		hot: true,					//热更新
		inline: true,				//实时刷新
		host: ip.address(),
		disableHostCheck: true,		//局域网访问
		open: process.platform=='win32' ? 'chrome' : 'google chrome'
	},
	module: {
		rules: [
			{
				test: /\.(htm|html)$/,
				enforce: 'pre',
				use: [{
					loader: 'webpack-strip-blocks',
					options: {
						blocks: ['production'],
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
						blocks: ['production'],
						start: '/*',
						end: '*/'
					}
				}]
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("[name].[chunkhash].css"),
		new webpack.HotModuleReplacementPlugin() //热更新
		// new webpack.DefinePlugin({
		// 	'process.env': JSON.stringify({NODE_ENV: "development"})
		// })
	]
})