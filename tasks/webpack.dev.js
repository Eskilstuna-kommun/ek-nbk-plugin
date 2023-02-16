const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
  output: {
    path: `${__dirname}/../../EK-extern/plugins`,
    publicPath: '/build/js',
    filename: 'origonbketuna.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Origonbketuna'
  },
  mode: 'development',
  module: {},
  devServer: {
    static: './',
    port: 9008,
    devMiddleware: {
      writeToDisk: true
    }
  }
});
