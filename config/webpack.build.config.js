const webpack = require('webpack')
const { join } = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NotifierPlugin = require('webpack-Notifier')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const baseConfig = require('./webpack.base.config.js')

console.log(`当前环境变量 ======> ${nodeEnv}`)

const config = merge(baseConfig, {
  output: {
    filename: 'script/[name]-[chunkhash:8].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(__dirname, '../index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(nodeEnv)
      }
    }),
    new MiniCssExtractPlugin({
      filename: "style/[name]-[contenthash].css"
    }),
    new OptimizeCssPlugin({
      cssProcessorOptions: {safe: true, map: {inline: false}}
    }),
    new NotifierPlugin({
      title: '编译完成...',
      contentImage: join(__dirname, '../logo.png')
    })
  ]
})

module.exports = config
