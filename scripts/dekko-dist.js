const $ = require('dekko');
const chalk = require('chalk');

try {
  $('dist/lib')
    .isDirectory()
    .hasDirectory('.circleci')
    .hasFile('canvas.js')
    .hasFile('toolbar.js');
} catch (error) {
  // eslint-disable-next-line
  console.log(chalk.red('✨ ' + error));
}
