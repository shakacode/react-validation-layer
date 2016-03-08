import webpack from 'webpack';
import path    from 'path';

export default {

  entry: [
    'webpack-hot-middleware/client',
    './app/assets/styles.scss',
    './app/app',
  ],

  output: {
    path      : path.resolve('public'),
    filename  : 'app.js',
    publicPath: '/assets/',
  },

  devtool: '#cheap-module-eval-source-map',

  resolve: { extensions: ['', '.js', '.jsx'] },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [
      {
        test   : /\.jsx?$/,
        loader : 'babel',
        exclude: /node_modules/,
      },
      {
        test   : /\.css$/,
        loaders: [
          'style',
          'css?modules&importLoaders=0&localIdentName=[name]__[local]__[hash:base64:5]',
        ],
      },
      {
        test   : /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
          'sass',
        ],
      },
    ],
  },

};
