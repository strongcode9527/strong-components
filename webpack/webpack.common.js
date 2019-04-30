const path = require('path')

module.exports = {
  entry: [path.resolve(__dirname, '../examples')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$|[j|t]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
    ],
  },
  devtool: 'inline-source-map',
}
