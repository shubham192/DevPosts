let https = require('https');
let core = require('@actions/core');

module.exports.get = url => {
    core.debug(`Sending HTTP request: ${url}`);
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                core.debug(`Resolved HTTP request: ${url}`);
                resolve(JSON.parse(data));
            })
            response.on('error', error => {
                core.setFailed(`Failed HTTP request: ${error}`);
                reject(Error(error));
            });
        });
    });
};