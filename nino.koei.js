const path = require('path');
const cwd = process.cwd();
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    ninoninoni: path.join(cwd, '/src/go'),
  },
  output: {
    path: path.join(cwd + '/site'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(cwd, 'src/favicon.ico'),
        to: path.join(cwd, 'site/favicon.ico'),
      },
    ]),
  ],
};
