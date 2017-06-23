const path = require('path');

module.exports = {
  entry: {
    app: ['./lib/parse.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
