const { resolve } = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ESLintPlugin = require('eslint-webpack-plugin')
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const prodConfig = require('./webpack.prod.js')
const devConfig = require('./webpack.dev.js')

const devMode = process.env.NODE_ENV !== 'production'
const publicPath = '/'

const commonConfig = {
  context: resolve(__dirname, 'src/'),
  devtool: devMode ? 'eval-source-map' : 'source-map',
  entry: resolve(__dirname, 'src/App.jsx'),
  mode: devMode ? 'development' : 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js|\.jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: resolve(__dirname, 'babel.config.js'),
              plugins: devMode ? [require.resolve('react-refresh/babel')] : [],
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
              publicPath: '/',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: "@import 'variables.scss';",
              implementation: require('node-sass'),
              sassOptions: {
                includePaths: [resolve(__dirname, './src/styles')],
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          // {
          //   loader: 'style-loader',
          // },
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     esModule: true,
          //     publicPath: '/',
          //   },
          // },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
        ],
      },
      {
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
        test: /\.(ttf|eot|svg|woff|woff2|png|ico|svg|jpg|jpeg)(\?v=\d+\.\d+\.\d+)?$/,
      },
    ],
  },
  output: {
    chunkFilename: '[name].[id].[fullhash].js',
    filename: '[name].[fullhash].js',
    path: resolve(__dirname, 'build/'),
    publicPath: publicPath,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({ BASE_PATH: publicPath }),
    }),
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/,
      resourceRegExp: /^\.\/locale$/,
    }),
    new ESLintPlugin({
      context: resolve(__dirname, 'src'),
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      overrideConfigFile: resolve(__dirname, '.eslintrc.js'),
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[fullhash].css',
      filename: '[name].[fullhash].css',
    }),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      // favicon: '../assets/img/favicon.ico',
      publicPath: publicPath,
      template: resolve(__dirname, 'src/index.html'),
      title: 'ModForge',
    }),
    // new FaviconsWebpackPlugin({
    //   logo: '../assets/img/favicon.png',
    //   inject: true,
    // }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'disabled',
    //   generateStatsFile: true,
    // }),
  ],
  resolve: {
    alias: {
      '!': resolve(__dirname, 'assets'),
      libs: resolve(__dirname, 'libs'),
      '~': resolve(__dirname, 'src'),
    },
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    modules: [resolve(__dirname, 'node_modules/')],
  },
}

module.exports = devMode
  ? merge(commonConfig, devConfig)
  : merge(commonConfig, prodConfig)
