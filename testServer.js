/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const compiler = webpack({
  // configuration
});
const server = new WebpackDevServer(compiler, {
  // webpack-dev-server options

  contentBase: 'dist/',
  // Can also be an array, or: contentBase: 'http://localhost/',

  hot: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a 'webpackHotUpdate' message is sent to the content
  // Use 'webpack/hot/dev-server' as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  historyApiFallback: false,
  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.

  compress: true,
  // Set this if you want to enable gzip compression for assets

  clientLogLevel: 'info',
  // Control the console log messages shown in the browser when using inline mode.
  // Can be `error`, `warning`, `info` or `none`.

  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  lazy: true,
  filename: 'bundle.js',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  inline: true,
  // It's a required option.
  publicPath: '/dist/',
  headers: { 'X-Custom-Header': 'yes' },
  stats: { colors: true },
});

server.listen(8080, 'localhost', () => {
  console.log('server started');
});
