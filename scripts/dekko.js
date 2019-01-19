const $ = require('dekko');
const chalk = require('chalk');

$('dist')
  .isDirectory()
  .hasFile('antd.css');

$('dist/lib')
  .isDirectory()
  .hasFile('canvas.js')
  .hasFile('toolbar.js');

// eslint-disable-next-line
console.log(chalk.green('✨ `dist` directory is valid.'));
