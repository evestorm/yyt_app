const TransformPages = require('uni-read-pages');
const tfPages = new TransformPages({
	includes: ['path', 'style', 'meta', 'test3']
})
module.exports = {
	productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
			config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
			config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
				'console.log',
			];
		}

		return {
			plugins: [
				new tfPages.webpack.DefinePlugin({
					ROUTES: JSON.stringify(tfPages.routes),
				}),
			],
		};
	},
};