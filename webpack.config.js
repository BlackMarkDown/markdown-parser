const path = require('path');

module.exports = {
  entry: {
    app: ['./lib/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'markdown-parser.js',
    libraryTarget: 'var',
    library: 'MarkdownParser',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
