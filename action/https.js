let https = require('https');

module.exports.get = url => {
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