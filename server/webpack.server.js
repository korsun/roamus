const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	context: __dirname,
	target: 'node',
	entry: './server',
	output: {
		filename: 'server.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},

	externals: [
		nodeExternals()
	],
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: ['ts-loader']
			}
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'server/src'),
			'@common': path.resolve(__dirname, '../common')
		}
	}
}
