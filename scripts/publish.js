const ghpages = require('gh-pages');

ghpages.publish(
  'dist',
  {
    dotfiles: true,
    repo: 'https://github.com/orzyyyy/memo.git',
    user: {
      name: 'orzyyyy',
      email: 'zy410419243@gmail.com',
    },
  },
  error => {
    console.error(error.message);
  },
);
