const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

if (!fs.existsSync(path.join(process.cwd(), 'dist/.circleci'))) {
  fs.mkdirsSync(path.join(process.cwd(), 'dist/.circleci'));
}
fs.copyFileSync(
  path.join(process.cwd(), '.circleci/config.yml'),
  path.join(process.cwd(), 'dist/.circleci/config.yml'),
);

// eslint-disable-next-line
console.log(chalk.green('✨ copy completed'));
