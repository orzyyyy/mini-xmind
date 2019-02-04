const $ = require('dekko');
const chalk = require('chalk');

try {
  $('lib')
    .isDirectory()
    .hasFile('index.js')
    .hasDirectory('canvas')
    .hasDirectory('line')
    .hasDirectory('options')
    .hasDirectory('tools')
    .hasDirectory('utils');
} catch (error) {
  // eslint-disable-next-line
  console.log(chalk.red('✨ ' + error));
}
