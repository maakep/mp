var path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: '/client/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname + '/dist/client'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
