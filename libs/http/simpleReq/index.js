/**
 * return a http request helper object.
 * @param {string} host
 * @param {number} port
 * @returns {object} helper Object
 */
var createHttpHelper = (host, port) => {
    'use strict';
    let agent = undefined; // set your agent or leave it default.
    let http = require('http');
    let func = (method) => {
        /**
         * @param {string} path
         * @param {string|buffer} data
         * @param {function} callback  (responseBody, statusCode, statusMessage)
         */
        return (path, data, callback) => {
            if (!callback && typeof data === 'function'){
                callback = data;
                data = undefined;
            }
            let buffer = data instanceof Buffer ? data : (data && new Buffer(data));
            let request = http.request({
                host: host,
                port: port,
                path: path,
                method: method,
                agent: agent,
                headers: buffer && {
                    'Content-Length': buffer.length
                }
            }, resp => {
                let body = [];
                resp.on('data', chunk => body.push(chunk));
                resp.on('end', () => {
                    let responseBody = body.length > 1 ? Buffer.concat(body).toString() : (body.length ? body[0].toString() : undefined);
                    callback && callback(responseBody, resp.statusCode, resp.statusMessage);
                });
            });
            request.on('error', err => console.log('error ', err, err.stack));
            request.end(buffer);
        }
    };

    return http.METHODS.reduce((obj, method) => {
        obj[method.toLowerCase()] = func(method);
        return obj;
    }, {});
};