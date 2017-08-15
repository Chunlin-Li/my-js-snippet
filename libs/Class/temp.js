'use strict';

var http = require('http');
var agent = new http.Agent({keepAlive: true, keepAliveMsecs: 1000, maxSockets: 100});
const uv = process.binding('uv');


function doRequest() {
    var req = http.request({
        host: '127.0.0.1',
        port: 9999,
        path: '/',
        method: 'GET',
        agent: agent
    }, function (resp) {
        resp.pipe(process.stdout);
    });

    req.on('error', err => console.log('req error: ', err));
    setTimeout(() => {
        req.end();
        // req.socket.write(new Buffer([uv.UV_ECONNRESET]));
        // req.abort();
        // req.write('jsdfji');
    }, 300);
}
doRequest();

setInterval(doRequest, 1350);
