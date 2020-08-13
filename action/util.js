let input = require('./input');
let xml2js = require('xml2js');
let moment = require('moment');
let fs = require('fs').promises;
let superagent = require('superagent');
let { exec } = require('child_process');
let markdowntable = require('markdown-table');

module.exports = {
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
        let { feed } = input.posts;
        return await superagent.get(feed)
    },

    xmlConvert: async xml => {
        let parser = new xml2js.Parser({ explicitArray: false });
        return await parser.parseStringPromise(xml)
    },

    createTable: posts => {
        let { amount } = input.posts;
        let rows = [['Name', 'Date']];
        if (amount == '0') {
            posts.forEach(p => {
                rows.push([
                    `[${p.title}](${p.link})`, formatDate(p.pubDate)
                ])
            })
        } else {
            for (i = 0; i < amount; i++) {
                rows.push([
                    `[${posts[i].title}](${posts[i].link})`, formatDate(posts[i].pubDate)
                ])
            }
        }
        return markdowntable(rows);
    },

    createList: posts => {
        let { amount } = input.posts;
        let rows = [];
        if (amount == '0') {
            posts.forEach(p => {
                rows.push(`- [${p.title}](${p.link}) - ${formatDate(p.pubDate)}`)
            })
        } else {
            for (i = 0; i < amount; i++) {
                rows.push(
                    `- [${posts[i].title}](${posts[i].link}) - ${formatDate(posts[i].pubDate)}`
                )
            }
        }
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
        let newString = startContent + posts + endContent;
        await fs.writeFile(file, newString, 'utf8');
    }
};