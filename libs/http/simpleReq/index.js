

var httpHelper = (host, port) => {
    'use strict';
    var http = require('http');
    var func = (method) => {
        return (path, data, callback) => {
            if (!callback && typeof data === 'function'){
                callback = data;
                data = undefined;
            }
            let buffer = data && new Buffer(data);
            let request = http.request({
                host: host,
                port: port,
                path: path,
                method: method,
                //agent: http.keepAliveAgent,
                headers: {
                    'Content-Length': buffer && buffer.length
                }
            }, resp => {
                let body = [];
                resp.on('data', chunk => body.push(chunk));
                resp.on('end', () => {
                    if (body.length) callback(Buffer.concat(body).toString());
                    else callback();
                });
            });
            request.on('error', err => console.log('error ', err, err.stack));
            request.end(buffer);
        }
    };
    return {
        'get': func('GET'),
        'post': func('POST'),
        'put': func('PUT'),
        'delete': func('DELETE'),
        'head': func('HEAD')
    };
};