// place at : deploy/ghpages.js
// you can see more info at https://github.com/tschaub/gh-pages
const ghpages = require('gh-pages')
const path = require('path')

const options = {
    branch: 'gh-pages',
    repo: 'git@github.com:peiyu0725/f2e-signature.git' // project github repo
};

const callback = err => {
    if (err) console.error(err);
    else console.log('publish success');
};

/**
 * This task pushes to the `master` branch of the configured `repo`.
 */
ghpages.publish(path.resolve(__dirname, './build'), options, callback);