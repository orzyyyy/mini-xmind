const path = require('path');
const cwd = process.cwd();

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'lib/canvas': path.join(cwd + '/src/canvas'),
    'lib/toolbar': path.join(cwd + '/src/tools/Toolbar'),
  },
  output: {
    path: path.join(cwd + '/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
};
