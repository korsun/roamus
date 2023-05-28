const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	context: __dirname,
	entry: "./src/index",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "inline-source-map",
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		port: 3000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "public", "index.html"),
		}),
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: ['ts-loader']
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							importLoaders: 1
						}
					}
				]
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
}