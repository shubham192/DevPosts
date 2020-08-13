let util = require('./util');
let input = require('./input');
let fs = require('fs').promises;
let core = require('@actions/core');

let updatePosts = async data => {
    let res = await util.getFeed();
    let xml = Buffer.from(res.body).toString();
    let json = await util.xmlConvert(xml);
    let posts = json.rss.channel.item;
    let md = util.formatPosts(posts)
    await util.editFile(md, data);
    util.commit();
};

fs.readFile(input.posts.file, 'utf8')
    .then(data => updatePosts(data))
    .catch(error => core.setFailed(error));