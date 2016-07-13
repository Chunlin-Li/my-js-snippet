'use strict';

var http = require('http');

let socket;

var request = http.request({
    host: '127.0.0.1',
    port: 9999,
    method: 'GET',
    path: '/'
}, function (resp) {
    var body = [];
    resp.on('data', chunk => body.push(chunk));
    resp.on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('response a request');
    });
});
request.on('error', err => console.error('reqError: ', err.stack));
request.on('socket', (s) => socket = s);
request.setTimeout(1000, () => {
    request.abort();
    // request.socket.destroy();
    console.dir(request.socket);
});

request.end();
