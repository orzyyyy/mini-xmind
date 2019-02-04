const $ = require('dekko');
const chalk = require('chalk');

$('lib')
  .isDirectory()
  .hasFile('index.js')
  .hasDirectory('canvas')
  .hasDirectory('line')
  .hasDirectory('options')
  .hasDirectory('tools')
  .hasDirectory('utils');

// eslint-disable-next-line
console.log(chalk.green('✨ `lib` directory is valid.'));
