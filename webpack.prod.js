const TerserJSPlugin = require('terser-webpack-plugin')

const chunksTest = (module, packages) => {
  for (const i of packages) {
    if (module.resource && module.resource.includes(i)) {
      return true
    }
  }

  return false
}

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          ie8: false,
          output: {
            comments: false,
          },
          warnings: false,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: (module) =>
            chunksTest(module, ['node_modules', 'react', 'react-dom']),
        },
      },
      chunks: 'all',
    },
  },
}
