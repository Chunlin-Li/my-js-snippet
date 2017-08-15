'use strict';

var http = require('http');
var net = require('net');


var server = http.createServer(function(req, resp) {
    if (/^\/get/.test(req.url)) {
        console.dir(req, {depth:8});
        // console.log(req.connection instanceof net.Socket);
        req.connection.setTimeout(2000, () => {req.connection.end()});
        setTimeout(() => resp.end('OK GET'), 1000);
    } else {

    }
});

server.listen(5151);
