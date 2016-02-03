'use strict';

var process = require('process');
var cp = require('child_process');
var net = require('net');

var server = net.createServer();

var worker1 = cp.fork('./worker');

var buf = new Buffer(1024);
buf.fill('x');
server._buf = buf;

server.listen(1337, function () {
    worker1.send('haha', server);
});


worker1.on('message', msg => {
    console.log(buf.toString());
});




