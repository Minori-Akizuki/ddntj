const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'index': './www/js/ddntj.js'
  },
  output: {
    path: __dirname,
    filename: '../dist/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: [
      '.js', '.css', '.vue', '.html'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './www/index.html',
      filename: path.join(__dirname, '../dist/' ,'index.html'),
      inject: true,
      excludeChunks: ['main']
    }),
    new CopyWebpackPlugin([{
      from: './www/css',
      to: '../dist/css'
    }])
  ]
};
