const path = require('path');
const cwd = process.cwd();
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    entry: path.join(cwd, '/src/go'),
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join(cwd, 'src/demo/css'),
          to: path.join(cwd, 'dist/demo/css'),
        },
        {
          from: path.join(cwd, 'src/line/css'),
          to: path.join(cwd, 'dist/line/css'),
        },
        {
          from: path.join(cwd, 'src/tools/css'),
          to: path.join(cwd, 'dist/tools/css'),
        },
      ]),
    ],
  },
};
