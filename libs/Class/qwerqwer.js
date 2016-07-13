'use strict';

var http = require('http');

var server = http.createServer(function (req, res) {
    console.log('receive a request');
    setTimeout(() => {
        res.end('OK');
        console.log('response a request');
    }, 2000);

});

server.listen(9999);
server.on('error', err => console.error('SERVER ERROR: ', err.stack));
server.on('clientError', err => console.error('CLIENT ERROR: ', err.stack));



setInterval(function () {
    console.log(JSON.stringify(process.memoryUsage()));
}, 2000);




