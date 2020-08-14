let util = require('./util');
let fs = require('fs').promises;
let core = require('@actions/core');

let updatePosts = async data => {
    let feed = await util.getFeed();
    let type = core.getInput('posts_type');
    let posts = type === 'table'
        ? util.createTable(feed.items)
        : util.createList(feed.items);
    await util.editFile(posts, data);
    util.commit();
};

let file = core.getInput('posts_file');
fs.readFile(file, 'utf8')
    .then(data => updatePosts(data))
    .catch(error => core.setFailed(error));