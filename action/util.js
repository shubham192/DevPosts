let moment = require('moment');
let fs = require('fs').promises;
let Parser = require('rss-parser');
let core = require('@actions/core');
let { exec } = require('child_process');
let markdowntable = require('markdown-table');

let util = {
    commit: () => {
        let file = core.getInput('posts_file');
        let repo = process.env.GITHUB_REPOSITORY;
        let token = core.getInput('github_token');
        let email = core.getInput('commit_email');
        let message = core.getInput('commit_message');
        let username = core.getInput('commit_username');
        exec(`git config --global user.email "${email}"`);
        exec(`git config --global user.name "${username}"`);
        exec(`git remote set-url origin https://${token}@github.com/${repo}.git`);
        exec(`git add ${file}`);
        exec(`git commit -m "${message}"`);
        exec('git push');
    },

    formatDate: string => {
        let format = core.getInput('date_format');
        return moment(string).format(format);
    },

    getFeed: async () => {
        let parser = new Parser();
        let feed = core.getInput('posts_feed');
        return await parser.parseURL(feed);
    },

    createTable: posts => {
        let rows = [['Name', 'Date']];
        let amount = core.getInput('posts_amount');
        if (amount == '0') {
            posts.forEach(p => {
                rows.push([
                    `[${p.title}](${p.link})`, util.formatDate(p.pubDate)
                ]);
            });
        } else {
            amount = posts.length < amount ? posts.length : amount;
            for (i = 0; i < amount; i++) {
                rows.push([
                    `[${posts[i].title}](${posts[i].link})`, util.formatDate(posts[i].pubDate)
                ]);
            };
        };
        return markdowntable(rows);
    },

    createList: posts => {
        let rows = [];
        let amount = core.getInput('posts_amount');
        if (amount == '0') {
            posts.forEach(p => {
                rows.push(`- [${p.title}](${p.link}) - ${util.formatDate(p.pubDate)}`);
            });
        } else {
            amount = posts.length < amount ? posts.length : amount;
            for (i = 0; i < amount; i++) {
                rows.push(
                    `- [${posts[i].title}](${posts[i].link}) - ${util.formatDate(posts[i].pubDate)}`
                );
            };
        };
        return rows.join('\n');
    },

    editFile: async (posts, string) => {
        let file = core.getInput('posts_file');
        let locator = core.getInput('posts_locator');
        let start = `<!-- ${locator}:start -->`;
        let end = `<!-- ${locator}:end -->`;
        let startIndex = string.search(start) + start.length;
        let endIndex = string.search(end);
        let startContent = string.substr(0, startIndex);
        let endContent = string.substr(endIndex, string.length);
        let newString = `${startContent}\n${posts}\n${endContent}`;
        await fs.writeFile(file, newString, 'utf8');
    }
};

module.exports = util;