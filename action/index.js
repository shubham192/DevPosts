let util = require('./util');
let input = require('./input');
let fs = require('fs').promises;
let core = require('@actions/core');

let updatePosts = async data => {
    let feed = await util.getFeed();
    let posts = input.posts.type === 'table'
        ? util.createTable(feed.items)
        : util.createList(feed.items);
    await util.editFile(posts, data);
    util.commit();
};

fs.readFile(input.posts.file, 'utf8')
    .then(data => updatePosts(data))
    .catch(error => core.setFailed(error));