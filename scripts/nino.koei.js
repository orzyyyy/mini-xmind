const path = require('path');
const cwd = process.cwd();
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'lib/canvas': path.join(cwd + '/src/canvas'),
    'lib/toolbar': path.join(cwd + '/src/tools'),
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
        from: path.join(process.cwd(), '.circleci/config.yml'),
        to: path.join(process.cwd(), 'dist/.circleci/config.yml'),
      },
    ]),
  ],
};
