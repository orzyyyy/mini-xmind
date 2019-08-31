const path = require('path');
const cwd = process.cwd();
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'lib/canvas': path.join(cwd + '/src/canvas/core'),
    'lib/toolbar': path.join(cwd + '/src/tools/Toolbar'),
    ninoninoni: path.join(cwd, '/src/go'),
  },
  output: {
    path: path.join(cwd + '/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(cwd, '.circleci/config.yml'),
        to: path.join(cwd, 'dist/.circleci/config.yml'),
      },
      {
        from: path.join(cwd, 'src/favicon.ico'),
        to: path.join(cwd, 'dist/favicon.ico'),
      },
    ]),
  ],
};
