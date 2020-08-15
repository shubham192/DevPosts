let https = require('https');
let core = require('@actions/core');

module.exports.get = url => {
    core.debug(url);
    return new Promise((resolve, reject) => {
        console.log(url);
        https.get(url, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(JSON.parse(data));
            })
            response.on('error', error => {
                reject(Error(error))
            });
        });
    });
};