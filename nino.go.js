const path = require('path');
const cwd = process.cwd();

module.exports = {
  webpack: {
    entry: path.join(cwd, '/src/go'),
  },
  devServer: {
    open: true,
  },
};
