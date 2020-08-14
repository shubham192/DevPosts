let core = require('@actions/core');
let prod = process.env.NODE_ENV === 'production';

module.exports = {
    posts: {
        amount: prod ? core.getInput('posts_amount') : 0,
        type: prod ? core.getInput('posts_type') : 'table',
        feed: prod ? core.getInput('posts_feed') : 'https://dev.to/feed/andrejarrell',
        file: prod ? core.getInput('posts_file') : 'README.md',
        locator: prod ? core.getInput('posts_locator') : 'devposts'
    },
    date: {
        format: prod ? core.getInput('date_format') : 'MM/DD/YYYY'
    },
    commit: {
        username: prod ? core.getInput('commit_username') : 'workflow',
        email: prod ? core.getInput('commit_email') : 'workflow@github.com',
        message: prod ? core.getInput('commit_message') : 'Updated Dev Posts'
    },
    gitub: {
        repo: prod ? process.env.GITHUB_REPOSITORY : 'https://gitub.com/andrejarrell/andrejarrell',
        token: prod ? core.getInput('github_token') : 'N/A',
    }
};