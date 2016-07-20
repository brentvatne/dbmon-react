var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..')));
var relative = isInNodeModules ? '../..' : '.';

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index.js',
    'webpack-dev-server/client?http://localhost:3000'
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: path.join(__dirname, relative, 'build'),
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    preLoaders: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint',
      //   include: path.resolve(__dirname, relative, 'src'),
      // }
    ],
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, relative, 'src'),
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'es2016', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, relative, 'src'),
        loader: 'style!css!postcss'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url?limit=10000'
      }
    ]
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, relative, 'index.html'),
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })
  ]
};
