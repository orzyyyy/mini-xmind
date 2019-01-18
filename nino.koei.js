const path = require('path');

module.exports = {
  entry: {
    'lib/canvas': path.join(__dirname + '/src/canvas'),
    'lib/toolbar': path.join(__dirname + '/src/tools/Toolbar'),
  },
  output: {
    path: path.join(__dirname + '/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
};
