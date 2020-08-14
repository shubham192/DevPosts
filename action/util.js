let input = require('./input');
let xml2js = require('xml2js');
let moment = require('moment');
let fs = require('fs').promises;
let Parser = require('rss-parser');
let { exec } = require('child_process');
let markdowntable = require('markdown-table');

let util = {
    commit: () => {
        let { file } = input.posts;
        let { repo, token } = input.github;
        let { username, email, message } = input.commit;
        exec(`git config --global user.email "${email}"`);
        exec(`git config --global user.name "${username}"`);
        exec(`git remote set-url origin https://${token}@github.com/${repo}.git`);
        exec(`git add ${file}`);
        exec(`git commit -m "${message}"`);
        exec('git push');
    },

    formatDate: string => {
        let { format } = input.date;
        return moment(string).format(format);
    },

    getFeed: async () => {
        let parser = new Parser();
        let { feed } = input.posts;
        return await parser.parseURL(feed);
    },

    createTable: posts => {
        let { amount } = input.posts;
        let rows = [['Name', 'Date']];
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
        let { amount } = input.posts;
        let rows = [];
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
        let { file, locator } = input.posts;
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