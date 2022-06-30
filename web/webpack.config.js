const path = require('path')
const WorkboxPlugin = require('workbox-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const config = {
  entry: ['react-hot-loader/patch', './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: '[name].[ext]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.ts(x)?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
      filename: 'index.html',
      minify: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_ORIGIN': JSON.stringify(process.env.API_ORIGIN),
    }),
    new LodashModuleReplacementPlugin(),
    // new WorkboxPlugin.GenerateSW({
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),
  ],
  devServer: {
    historyApiFallback: true,
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
}

module.exports = (env, argv) => {
  if (env.NODE_ENV !== 'production') {
    config.devtool = 'source-map'
  }
  if (argv.hot) {
    // Cannot use 'contenthash' when hot reloading is enabled.
    config.output.filename = '[name].[hash].js'
  }

  return config
}
