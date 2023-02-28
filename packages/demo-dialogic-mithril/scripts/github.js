const shell = require('shelljs');

const githubPath = '../../../gh-pages/mithril';

shell.rm('-rf', `${githubPath}/*`);
shell.cp('-R', 'dist/*', githubPath);
