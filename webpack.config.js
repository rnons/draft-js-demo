var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-source-map',
  debug: true,
  entry: './src/main.js',
  output: {
    path: 'dist',
    publicPath: "/dist/",
    filename: 'main.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      }
    })
  ]
}
