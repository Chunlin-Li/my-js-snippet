'use strict';

var http = require('http');
const uv = process.binding('uv');

var data = 'synchronous Process Creation#The child_process.spawn(), child_process.fork(), child_process.exec(), and child_process.execFile() methods all follow';

var server = http.createServer(function (req, res) {
    // res.shouldKeepAlive = false;
    req.socket.removeListener('error', onError);
    req.socket.addListener('error', onError);

    // res.setHeader('Keep-Alive', 'timeout=30');
    // res.flushHeaders();

    setTimeout(() => {
        res.end(data);
    }, 1000);
});


server.listen(9999);
server.setTimeout(10000);
// console.log('server connection:', server._connections);



server.on('error', err => console.error('SERVER ERROR: ', err.stack));
server.on('clientError', err => console.error('CLIENT ERROR: ', err.stack));


function onError(err) {
    console.error('req socket ERROR', err.stack);
}
