const path = require('path');

module.exports = {
  entry: {
    'lib/Canvas/index': path.join(__dirname + '/src/canvas'),
  },
  output: {
    path: path.join(__dirname + '/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
};
