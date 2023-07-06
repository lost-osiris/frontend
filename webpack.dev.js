const { resolve } = require('path')
const webpack = require('webpack')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        runtimeErrors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      stats: {
        chunkModules: false,
        chunks: false,
        colors: true,
        errorDetails: true,
        logging: 'info',
        modules: false,
        timings: true,
        warnings: true,
      },
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8000',
      },
    },
    static: resolve(__dirname, 'src/assets/'),
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshPlugin()],
}
