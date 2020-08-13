let core = require('@actions/core');

module.exports = {
    posts: {
        amount: core.getInput('posts_amount'),
        type: core.getInput('posts_type'),
        feed: core.getInput('posts_feed'),
        file: core.getInput('posts_file'),
        locator: core.getInput('posts_locator')
    },
    date: {
        format: core.getInput('date_format')
    },
    commit: {
        username: core.getInput('commit_username'),
        email: core.getInput('commit_email'),
        message: core.getInput('commit_message')
    },
    gitub: {
        repo: process.env.GITHUB_REPOSITORY,
        token: core.getInput('github_token'),
    }
};