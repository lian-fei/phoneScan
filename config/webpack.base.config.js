const { join } = require('path')
const { publicPath, cdn } = require('../config.js')
const targetDir = process.env.npm_config_dir || ''
const { VueLoaderPlugin } = require('vue-loader')

const nodeEnv = process.env.NODE_ENV || 'production'

let assetsPlublicPath = ''

if (nodeEnv === 'production') {
  if (targetDir) {
    assetsPlublicPath = cdn + targetDir + publicPath
  } else {
    assetsPlublicPath = cdn
  }
} else {
  assetsPlublicPath = publicPath
}

const config = {
  mode: nodeEnv,
  target: 'web',
  entry: {
    app: join(__dirname, '../src/', targetDir,'index.js')
  },
  output: {
    path: join(__dirname, '../dist'),
    publicPath: assetsPlublicPath
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre', // 可选 pre 和 post 代表在处理对应类型文件之前和之后
        include: [join(__dirname, '../src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          join(__dirname, '../src')
        ],
        exclude: /(node_modules)/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'imgs/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'medias/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

module.exports = config
